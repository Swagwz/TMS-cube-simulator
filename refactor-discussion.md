# Refactor Discussion

本文件保留目前仍有價值的架構決策與後續工作。舊的逐題問答已精簡為決議紀錄；若與 `refactor.md` 或目前程式碼衝突，以目前程式碼與本文件的「目前決議」為準。

## 目前決議

### App 邊界

- 專案定位仍是 TMS 強化模擬器，不做完整角色傷害或戰力計算。
- Store 維持 plain serializable app-domain model，不為了 Nexon API 改成 Nexon 欄位命名。
- Nexon API 匯入是一次性 fetch / normalize 流程；不持久化 raw payload。
- API key 不進前端 store；未來需要 serverless proxy 時，由 serverless 層處理。
- 匯入後的裝備仍可由使用者修改，因此匯入資料要轉成 app instance，而不是保留外部 API shape。

### Store 與 Session

- Zustand store 保存長期狀態：equipment / moe instance、statistics、active item。
- Dialog / enhancement workflow 使用 session working copy，避免 UI 高頻操作直接污染 store。
- Session 不是通用 FSM engine；每個 enhancement 只保留自己的最小共用狀態。
- Session action 採 reducer 風格：

```ts
const result = reduceCubeSession(session, command);
```

- `working.statistics` 繼續留在 `working` instance 上，不拆成獨立 session statistics。
- count 更新發生在成功 `roll`，不是 `apply`。

### 命名

- equipment / moe / cube session 內的潛能 id 陣列統一使用 `potentialIds`。
- `PotentialFeature` 已 rename 為 `EquipmentPotentialSlot`。
- `fixed potential` 已改成 cube companion item，不再當作 cube relation 或獨立 apply item。

## Cube 架構現況

### Metadata

- `cube.config.ts` 只放靜態 cube / companion item metadata。
- `cube.registry.ts` 負責 cube 查詢、map、適用性與 companion 查詢。
- `cube.type.ts` 使用資料欄位描述 workflow policy，不引入 cube class hierarchy。

目前 cube metadata policy：

```ts
type CubeWorkflow = "direct" | "restore" | "hexa" | "combine";
type CubeRankUpType = "standard" | "accumulate" | "none";
type CubeValidationType = "standard" | "none";
type CubeLineEffect =
  | { type: "none" }
  | { type: "mirror"; probability: number; fromIndex: 0; toIndex: 1 };
```

- `mirrorCube` 是 direct workflow，使用 `lineEffect: "mirror"` 與 `validationType: "none"`。
- `shinyAdditionalCube` 是 direct workflow，使用 `rankUpType: "accumulate"`。
- `restore*` 使用 restore workflow。
- `hexaCube` 使用 hexa workflow。
- `combine*` 使用 combine workflow。

### Pure Roll Layer

`cubeRoll.feature.ts` 是 pure roll behavior 層，所有隨機行為都要吃 injected RNG。

已實作：

- `rollDirectCube`
- `rollRestoreCube`
- `rollHexaCube`
- `rollCombineCube`
- `rollRankUpByType`
- `applyLineEffect`
- `validatePotentialLinesByType`

保留相容：

- `CubeManager` 暫時保留給舊 UI callsite。
- UI 全部遷移到 session reducer 前，不刪 `CubeManager`。

### Session Type

```ts
type PotentialLines = {
  tier: EquipmentRank;
  potentialIds: string[];
};

type CubeSession<TEquipment> = {
  system: "cube";
  cubeId: CubeId;
  base: TEquipment;
  working: TEquipment;
  rng: RNG;
  pendingRoll: CubeRollOutput | null;
};

type CubeRollOutput =
  | { flow: "direct"; rolled: PotentialLines }
  | {
      flow: "restore";
      before: PotentialLines;
      after: PotentialLines;
      fixedIndex: number;
    }
  | { flow: "hexa"; candidates: PotentialLines }
  | {
      flow: "combine";
      step: "rolledLine";
      selectedIndex: number;
      rolledPotentialId: string;
    };
```

說明：

- `pendingRoll` 是 roll action output，不是 dialog layout state。
- Dialog layout 不應依賴 `pendingRoll` 才決定 UI；應依 cube workflow / cubeId 決定。
- `restore.before` 是 roll 當下 snapshot，不從目前 working 推斷。
- `hexa.candidates.potentialIds` 預期長度為 6。
- `combine` 不保留 `selectedLine` pending state；roll 時已選 line 並 roll 出隱藏 replacement line，apply 只寫入或丟棄。

### Roll Input / Apply Decision

```ts
type CubeRollInput =
  | { flow: "direct"; rankUpMultiplier?: number; accumulateCount?: number }
  | { flow: "restore"; rankUpMultiplier?: number; fixedIndex?: number }
  | { flow: "hexa"; rankUpMultiplier?: number }
  | { flow: "combine"; targetIndex: number };

type CubeApplyDecision =
  | { flow: "direct" }
  | { flow: "restore"; side: "before" | "after" }
  | { flow: "hexa"; selectedIndices: [number, number, number] }
  | { flow: "combine"; applyRolledLine: boolean };
```

說明：

- `restore.fixedIndex` 省略時等同 `-1`。
- `combine.targetIndex` 必填；`-1` 代表沒選 target，`0..2` 代表 target mode。
- combine target mode 會累計每次 slot-roll attempt，直到 selected line 命中 target。
- 已實作 cube workflow 的 `apply` 都不 consume RNG。

## Auto-roll 暫定方向

Auto-roll 暫時不做，等手動 cube workflow 完整接上 session model 後再開始。

已收斂方向：

- Auto-roll 應重用 cube session / reducer / pure roll function，不另建一套 cube workflow。
- Runner 狀態與 session 分離：
  - running / paused / completed
  - attempt count
  - stop reason
  - target
  - strategy
- Strategy 負責提供 roll input 與 apply decision。
- Matcher 可以讀 `pendingRoll`，但 UI layout 不該依賴 matcher 或 pending state。
- Probability / matcher 應盡量共用 compiled target model。

仍待設計：

- target model 是否以 `potentialId` count、metric threshold、line pool 或混合模型表示。
- imported unknown potential 是否能用 raw text / inferred field-value 參與 matching。
- probability engine 對不同 workflow 要用精確枚舉、DP，還是允許 Monte Carlo fallback。
- 極小機率顯示格式與 90% confidence attempt / time estimate。
- hexa auto-roll 如何從 6 條候選選出最佳 3 條。
- restore + fixed companion 的 auto-roll 策略預設。
- combine auto-roll 是否固定 targetIndex，或由 strategy 選 line。

## UI Session Hook / Action Migration 問答

### Q：目前 equipment dialog 的主要問題是什麼？

回答：

目前 `EquipEnhancingDialog` 仍以 `localData + setLocalData` 當作 dialog working copy，並透過 `EnhancingContext` 傳給所有 enhancer。

這個模式可以保留「dialog 關閉才 sync 回 Zustand」的行為，但 cube workflow 已經有 `CubeSession` / `reduceCubeSession`，如果 UI 繼續在各 enhancer 內直接呼叫 `CubeManager.rollRankUp()`、`CubeManager.rollPots()`、`produce()` 改 working，就會變成兩套 cube 邏輯並存。

結論：

- dialog 可以繼續持有 working copy。
- cube UI 不應再直接改 `localData`。
- cube UI 應透過 session action dispatch 到 `reduceCubeSession`。
- 關閉 dialog 並 sync 回 Zustand 的責任仍放在 dialog / hook action layer，不放進 domain reducer。

### Q：關掉 dialog 並 sync 回 Zustand 要放在哪？

回答：

放在 UI-facing hook / action layer。

原因：

- `reduceCubeSession` 是 domain reducer，只知道 `session.working`，不應知道 Zustand。
- `syncInstance()` 是 store action，屬於 app integration。
- 使用者已決定切換裝備必須關掉 dialog，因此 open dialog 期間不需要 `replaceWorking`。

建議責任分配：

```ts
function commitAndClose() {
  useEquipmentStore.getState().syncInstance(session.working);
  closeModal();
}
```

`commitAndClose` 可以由 cube session hook 回傳，或由 dialog 擁有後傳給 workflow component。重點是 enhancer component 不直接碰 `useEquipmentStore`。

### Q：`EquipEnhancingDialog` 要直接改成只放 `CubeSession` 嗎？

回答：

不要一次改掉全部。

目前同一個 dialog 還服務：

- cube
- soul / `wuGongJewel`

因此第一階段建議採混合過渡：

- selected item 是 cube：建立 `CubeSession<EquipmentInstance>`，cube workflow component 只讀寫 session。
- selected item 是 soul：暫時保留既有 `localData / useEquipEnhancer` 路徑。

等 cube UI 全部遷完，再決定 soul 是否也抽成自己的 session。

### Q：建議新增哪一層 hook？

回答：

新增 cube 專用 UI-facing hook，例如：

```ts
type EquipmentCubeSessionController = {
  session: CubeSession<EquipmentInstance>;
  cube: CubeDefinition;
  slot: EquipmentPotentialSlot;
  working: EquipmentInstance;
  pendingRoll: CubeRollOutput | null;
  displayLines: CubeSessionPotentialGroup;

  dispatch: (command: CubeSessionCommand) => CubeSessionReduceResult<EquipmentInstance>;
  rollDirectAndApply: (input?: Omit<Extract<CubeRollInput, { flow: "direct" }>, "flow">) => void;
  roll: (input?: CubeRollInput) => void;
  apply: (decision?: CubeApplyDecision) => void;
  discardPendingRoll: () => void;
  commitAndClose: () => void;
};
```

可能檔案位置：

- `src/hooks/useEquipmentCubeSession.ts`
- 或 `src/features/enhancingDialog/equipment/hooks/useEquipmentCubeSession.ts`

若只服務 equipment enhancing dialog，放在 feature folder 會比較貼近 UI migration；若未來 auto-roll / workflow panel 也會共用，再移到 `src/hooks`。

### Q：direct cube UI 要不要真的顯示 pendingRoll？

回答：

不用。

Direct workflow 的本質是「按下去立即套用」。雖然 reducer 的 domain 流程是：

```ts
roll -> pendingRoll -> apply
```

但 UI action 可以包成一次動作：

```ts
function rollDirectAndApply(input) {
  setSession((current) => {
    const rolled = reduceCubeSession(current, {
      type: "roll",
      input: { flow: "direct", ...input },
    });

    return reduceCubeSession(rolled.session, {
      type: "apply",
      decision: { flow: "direct" },
    }).session;
  });
}
```

這樣可以同時滿足：

- domain reducer 保持一致模型。
- direct UI 保持舊行為，一次 click 直接改 working。
- statistics 只在 `roll` 增加，不會因 `apply` 再加一次。
- mirror / abs / equal / standard direct 都走同一條 direct action。

### Q：`Enhancer` navigator 應該怎麼改？

回答：

目前 `Enhancer.tsx` 是依 `selectedItemId` 分派到每顆 cube 的 component，導致每顆 cube 都重複 display / roll / statistics / close 行為。

遷移方向應改成：

```ts
if (selectedItemId === "wuGongJewel") {
  return <SoulEnhancer />;
}

const cube = getCubeDefinition(selectedItemId);

switch (cube.workflow) {
  case "direct":
    return <DirectCubeWorkflow />;
  case "restore":
    return <RestoreCubeWorkflow />;
  case "hexa":
    return <HexaCubeWorkflow />;
  case "combine":
    return <CombineCubeWorkflow />;
}
```

這裡的 workflow component 是 UI workflow，不是 domain cube class。

特殊 cube 差異不應回到「每顆 cube 一個 enhancer」：

- `mirrorCube`：已由 `lineEffect` 處理。
- `absAdditionalCube`：已由 `rankUpType: "none"` 與 `lineRank` 處理。
- `equalCube`：已由 `lineRank` 處理。
- `shinyAdditionalCube`：仍是 direct workflow，但 UI 可額外顯示 pity 資訊。
- `craftsmanCube` legendary 不可用：應由 applicable list 擋掉；若仍進到 dialog，Direct UI 可顯示 disabled / null guard。

### Q：direct UI 的畫面資料要從哪裡讀？

回答：

讀 `session.working[cube.apply]`。

不要再讀舊的 `localData.mainPot` / `localData.additionalPot` 後自行判斷。Direct workflow component 可以用共用 display component：

```ts
const lines = session.working[cube.apply];
```

因此 direct UI 只需要知道：

- cube metadata
- apply slot
- working potential lines
- `rollDirectAndApply`
- `commitAndClose`

### Q：`poolData` 還需要由 dialog 算好傳給 cube UI 嗎？

回答：

cube session reducer 已經會根據：

```ts
session.working.subcategory
session.working.level
session.cubeId
```

自行取得 cube potential pools。

因此 cube UI 不需要 `poolData`。

過渡期可以保留 `poolData` 給 soul 使用；cube session hook 不依賴它。

### Q：rank-up multiplier 與 shiny accumulate count 放哪？

回答：

它們是 UI / account setting input，不是 cube metadata，也不應由 domain reducer 直接讀 store。

建議：

- `rankUpMultiplier` 由 hook/action layer 從 `useAccountStore` 讀出後放進 roll input。
- `shinyAdditionalCube` 的 `accumulateCount` 由 hook/action layer 從 `shinyPity[currentTier]` 讀出後放進 direct roll input。
- pity counter 的 increment / reset 仍由 hook/action layer 根據 roll result 更新，不放進 reducer。

Direct action 可以在 roll 後比較：

```ts
const beforeTier = current.working[cube.apply].tier;
const afterTier = rolled.event.output.rolled.tier;
```

如果 cube 是 `shinyAdditionalCube`：

- `afterTier !== beforeTier`：reset pity。
- `afterTier === beforeTier`：increment pity。

### Q：statistics count 由誰處理？

回答：

cube 使用次數仍由 `reduceCubeSession` 在 successful `roll` 更新 `session.working.statistics.counts`。

UI 不再手動：

```ts
draft.statistics.counts.mainPot.craftsmanCube += 1;
```

這是 direct UI migration 的重要收益：UI 不再知道 cube count path。

### Q：舊的各種 `*CubeEnhancer.tsx` 什麼時候刪？

回答：

不要先刪。

建議順序：

1. 新增 cube session hook / action layer。
2. 新增 workflow-level components：
   - `DirectCubeWorkflow`
   - `RestoreCubeWorkflow`
   - `HexaCubeWorkflow`
   - `CombineCubeWorkflow`
3. 先讓 `Enhancer.tsx` 對 direct workflow 改走 `DirectCubeWorkflow`。
4. 驗證 direct cubes：
   - craftsman
   - masterCraftsman
   - equal
   - mirror
   - additional
   - shinyAdditional
   - absAdditional
5. direct 穩定後刪除 direct 類舊 enhancer。
6. 再依序遷 restore、hexa、combine。

這樣每一步都可以用目前 reducer tests 作為 domain 保護，不會把 UI rewrite 和 domain behavior 改動混在一起。

### Q：第一個 direct UI PR 的最小 scope 是什麼？

回答：

最小 scope：

- `EquipEnhancingDialog` 在 cube selected 時建立 cube session。
- 新增 cube session controller hook。
- `Enhancer.tsx` 對 `cube.workflow === "direct"` 回傳 `DirectCubeWorkflow`。
- `DirectCubeWorkflow` 使用 session working 顯示潛能。
- click roll 時呼叫 `rollDirectAndApply()`。
- close 時 sync `session.working` 回 Zustand。
- soul / restore / hexa / combine 先走舊 component。

這個 scope 完成後，direct cube 的 UI 就不再依賴：

- `CubeManager.rollRankUp`
- `CubeManager.rollPots`
- component 內手動 statistics mutation
- 每顆 direct cube 一個 enhancer component

## Nexon Import 待決議

- 匯入資料應 normalize 成 app-domain `EquipmentInstance`，不直接保存 Nexon raw shape。
- unknown potential 需要有出口，避免匯入資料因找不到 app potential id 而丟失。
- 可能模型：

```ts
type PotentialLine =
  | { kind: "known"; potentialId: string }
  | {
      kind: "unknown";
      rawText: string;
      infer?: {
        template: string;
        value: number;
        field: string;
        potentialName: string;
      };
    };
```

仍待決議：

- unknown line 是否可以被 auto-roll target matcher 使用。
- capabilities 要由 Nexon 裝備部位 / 等級推導，還是匯入時給較寬鬆預設再讓使用者修正。
- 同一角色 / 同一件裝備再次匯入時，要新增 instance 還是更新既有 instance。

## 下一步

1. 先 commit 目前 cube domain / session / naming refactor。
2. 新增 UI-facing cube session hook / action boundary。
3. 先接 direct cube UI 到 `reduceCubeSession`，並保留 restore / hexa / combine 舊路徑。
4. direct 穩定後，再依序遷 restore、hexa、combine。
5. UI migration 完成後再縮小或移除 `CubeManager`。
6. 手動 cube workflow 穩定後，再開始 auto-roll target / matcher / probability / runner。
