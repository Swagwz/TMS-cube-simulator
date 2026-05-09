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
3. 逐步把 equipment cube enhancer 接到 `reduceCubeSession`：
   - direct
   - restore
   - hexa
   - combine
4. UI migration 完成後再縮小或移除 `CubeManager`。
5. 手動 cube workflow 穩定後，再開始 auto-roll target / matcher / probability / runner。
