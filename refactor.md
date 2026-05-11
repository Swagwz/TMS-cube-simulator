# TMS Cube Simulator 重構現況

本文件記錄目前已落地的重構方向、已完成項目、以及接下來的重構順序。

目前以 `main` 上的 session / reducer / pure feature 架構為準；若舊的 class / proxy / enhancer 實驗與本文衝突，以本文為準。

---

## 目標架構

```text
Zustand Store
-> Dialog Request / Session Controller
-> Session Reducer / Action Layer
-> Pure Feature Layer
-> RNG
```

核心原則：

- Store 只存 plain serializable data
- Dialog / Session 持有高頻 working copy
- Domain roll logic 盡量保持 pure
- Randomness 必須可注入
- UI 只負責觸發 action 與 render state，不直接實作規則

---

## 目前已完成

### 1. RNG domain 已落地

目前已經有可注入 RNG：

- `RNG`
- `CryptoRNG`
- `FixedRNG`
- `SeededRNG`
- `productionRng`

`rollWeightedIndex(weights, rng)` 也已改成顯式接收 `rng`。

這代表：

- unit test 可以 deterministic
- roll logic 可 replay / simulation
- domain 不再直接依賴 `Math.random()`

### 2. cube domain 已拆成 metadata / registry / roll / session

目前 cube 相關已拆為：

- `cube.config.ts`
  - 靜態 cube / companion item metadata
- `cube.registry.ts`
  - cube lookup、適用性、companion lookup、probability helper
- `cubeRoll.feature.ts`
  - pure roll logic
- `cubeSession.type.ts`
  - session / command / output type
- `cubeSession.reducer.ts`
  - session reducer

`CubeManager` 舊 facade 已移除，不再作為 equipment workflow 的正式邊界。

### 3. cube workflow 已全部進 session / reducer

目前已支援的 workflow：

- `direct`
- `restore`
- `hexa`
- `combine`

目前 cube metadata policy：

```ts
type CubeWorkflow = "direct" | "restore" | "hexa" | "combine";
type CubeRankUpType = "standard" | "accumulate" | "none";
type CubeValidationType = "standard" | "none";
type CubeLineEffect =
  | { type: "none" }
  | { type: "mirror"; probability: number; fromIndex: 0; toIndex: 1 };
```

特殊行為已收斂到 metadata / feature policy：

- `mirrorCube`
  - `workflow: "direct"`
  - `validationType: "none"`
  - `lineEffect: "mirror"`
- `shinyAdditionalCube`
  - `workflow: "direct"`
  - `rankUpType: "accumulate"`
- `restore*`
  - `workflow: "restore"`
- `hexaCube`
  - `workflow: "hexa"`
- `combine*`
  - `workflow: "combine"`

### 4. equipment cube UI 已全部走 session controller

equipment cube dialog 已不再走舊 per-cube enhancer + `CubeManager.rollPots()` 路徑。

目前 workflow UI：

- `DirectCubeWorkflow`
- `RestoreCubeWorkflow`
- `HexaCubeWorkflow`
- `CombineCubeWorkflow`

對應 controller API 集中在：

- `useEquipmentCubeSession.ts`
- `useEquipmentEnhancementSessionContext.tsx`

### 5. soul 已完成 session 化

目前 soul 也已改成：

- `soulRoll.feature.ts`
- `soulSession.type.ts`
- `soulSession.reducer.ts`
- `useEquipmentSoulSession.ts`

不再使用舊的 `SoulManager.rollPot()` 直接驅動 UI。

### 6. equipment dialog 已改成 event-driven

這是最近的重要結論，也是之前文件最容易過時的地方。

現在不是：

```text
PotentialTab selectedItemId
-> dialog local state
-> enhancer
```

而是：

```text
PotentialTab item click
-> openDialog(equipment, itemId)
-> dialog request { equipmentId, itemId }
-> navigator
-> create session
```

目前關鍵邊界：

- `useEquipmentEnhancingDialog.ts`
  - 管理 `request`
  - `openDialog`
  - `closeDialog`
- `useEquipmentEnhancementNavigator.ts`
  - 根據 `request + baseInstance` 分流 cube / soul controller
- `EquipEnhancingDialog.tsx`
  - 根據 request 從 store 取 `baseInstance`
  - 建立 navigator
  - 提供單一 session context

### 7. dialog 內不再依賴 `localData` / `EnhancingContext`

舊的 `localData + setLocalData + EnhancingContext` 已退出 equipment enhancement 主流程。

目前 source of truth：

- request：`{ equipmentId, itemId }`
- base instance：由 store `instanceMap` 取出
- session：
  - `base: structuredClone(baseInstance)`
  - `working: structuredClone(baseInstance)`

### 8. 單一 navigator result 已成立

目前 dialog 內使用單一 discriminated union：

```ts
type EquipmentEnhancementNavigatorResult =
  | {
      kind: "cube";
      workflow: CubeDefinition["workflow"];
      controller: EquipmentCubeSessionController;
    }
  | {
      kind: "soul";
      controller: EquipmentSoulSessionController;
    }
  | null;
```

這代表：

- 同一時間只會有一種 enhancement controller
- `Enhancer.tsx`、`EquipFooter.tsx`、`RankUpMultiplier.tsx` 都只需看 navigator
- 不需要回頭追 `cubeSession` / `soulSession` 哪個有值

### 9. statistics count 更新已收斂

equipment statistics 更新已統一走：

- `incrementStatisticsCount(working, feature, id, delta = 1)`

目前 cube / soul reducer 都直接更新 `working.statistics.counts`，不再各自手寫 nested immutable update。

count 規則：

- count 增加發生在成功 `roll`
- `apply` 不再重複加一次

### 10. metadata / detail read-model 已清理

近期已完成：

- `cube.config.ts`
- `soul.config.ts`
- `equipment.config.ts`
- `EquipmentDetail.tsx`

的中文可讀性清理。

另外：

- `EquipmentDetail` 不再直接綁 raw `CUBE_LIST` / `SOUL_LIST`
- `equipmentStatisticsRows.ts` 改透過 registry / manager 組 detail rows
- cube companion item metadata 已回到 `cube.config.ts` 的單一來源

---

## 目前 session shape

### Cube

```ts
type CubeSession<TEquipment> = {
  system: "cube";
  cubeId: CubeId;
  base: TEquipment;
  working: TEquipment;
  rng: RNG;
  pendingRoll: CubeRollOutput | null;
};
```

```ts
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

### Soul

```ts
type SoulSession<TEquipment> = {
  system: "soul";
  soulId: SoulId;
  base: TEquipment;
  working: TEquipment;
  rng: RNG;
  pendingRoll: SoulRollOutput | null;
};
```

---

## workflow 結論

### Direct

domain 維持：

```text
roll -> pendingRoll -> apply
```

但 UI action 可以包成：

```text
rollDirectAndApply
```

也就是使用者點一次，controller 內部做兩個 reducer dispatch。

### Restore

restore 是明確的 A / B decision flow：

```text
roll -> pending before/after -> apply(before|after)
```

`fixedIndex` 規則：

- `-1` 代表不固定
- `0..2` 代表固定指定那一排
- `restoreAdditionalCube` 不提供 fixed companion

### Hexa

hexa roll 後：

- `working[cube.apply].tier` 立即更新
- `potentialIds` 仍待使用者選 3 條後才寫入

也就是：

```text
roll -> pending 6 candidates + working tier updated -> apply(selectedIndices)
```

### Combine

combine 採 completed-result model：

```text
roll -> pending selected line + hidden rolled replacement -> apply/discard
```

但 target mode 已有新結論：

- `targetIndex < 0`
  - 維持一般 pending 流程
- `targetIndex >= 0`
  - 使用者按下 CTA 時直接走 `roll + apply`
  - 不再要求先 `roll/reroll` 再手動 `apply`

也就是 combine target mode 已經是快速洗鍊流程。

---

## 目前 UI / hook 邊界

### Dialog owner

`EquipEnhancement.tsx` 現在是 equipment enhancement dialog owner。

它負責：

- render feature tabs
- 接收 item click event
- 呼叫 `openDialog(equipment, itemId)`
- render 一個 `EquipEnhancingDialog`

### Feature launcher

`PotentialTab.tsx` 現在只負責：

- render `PotentialArea`
- render 當前 feature 對應的 enhancement item list
- 把 item click 往上丟給 dialog owner

它不再負責：

- `selectedItemId` state
- dialog request state
- selected item summary

### Item read-model

`equipmentEnhancementItems.ts` 是 UI 層 read-model helper。

目前負責：

- feature filter
- applicability
- statistics count 組裝
- 統一輸出 cube / soul launcher item shape

---

## 測試現況

目前已補的重點測試：

- RNG deterministic behavior
- cube reducer
- soul reducer
- enhancement navigator resolver
- dialog request helper
- combine target mode `roll + apply`
- equipment enhancement item read-model

現況代表：

- domain 行為已有基本回歸保護
- dialog / session / combine target mode 也已有輕量邊界測試

---

## 已淘汰或不再採用的方向

目前明確不採用：

- cube class hierarchy
- equipment subclass hierarchy
- Valtio / proxy-based global store
- generic FSM engine
- UI 直接呼叫低階 random roll helper
- `localData + setLocalData` 作為 enhancement 主邊界
- `selectedItemId` 作為 dialog 開關 source of truth

---

## 接下來的重構順序

### 第一優先：auto-roll

手動 workflow 已經收斂完成，下一步合理主題是 auto-roll。

建議順序：

1. 先做 equipment cube auto-roll runner
2. runner 直接操作 session / reducer
3. 再做 workflow-specific decision adapter
4. 最後才接 matcher / probability / UI panel

### 第二優先：持續清理 equipment enhancement read-model / UI 命名

目前 event-driven dialog 與 item read-model 已成形，但 UI 命名還可繼續整理，例如：

- item grid / launcher 命名
- feature tab 結構
- combine CTA 命名與文案一致性

### 第三優先：再考慮 moe session 化

如果目標是讓所有 enhancement system 架構一致，下一個大主題就是：

- moe session
- moe reducer
- moe pure roll feature

但這件事應排在 cube auto-roll 之後。

---

## 現階段結論

目前 equipment 這條主線已從：

```text
config
-> manager
-> per-cube enhancer
-> localData mutation
```

收斂成：

```text
event-driven dialog request
-> navigator
-> session controller
-> reducer
-> pure feature
-> RNG
```

這條線已經足夠穩，可以開始往 auto-roll 前進。
