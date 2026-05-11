# Refactor Discussion

這份文件整理目前已確認的重構結論，目的是取代先前已過時或已被新架構推翻的問答。

原則：

- 只保留對目前程式碼仍然成立的結論
- 若實作已經更新，就直接改掉舊問答，不保留歷史包袱
- 以目前 session / reducer / navigator 架構為準

---

## App / Store / Session

### Q：Store 應該存什麼？

回答：

Store 只存 plain serializable app-domain data，例如：

- `EquipmentInstance`
- `MoeInstance`
- `statistics`
- active item id

不要把以下內容放進 Zustand：

- class instance
- RNG instance
- session object
- React workflow state

### Q：Dialog working copy 應該放哪？

回答：

應該放在 session，不放在 store。

目前 equipment enhancement dialog 的 working copy 來自：

```ts
base: structuredClone(baseInstance)
working: structuredClone(baseInstance)
```

session 是 dialog runtime state，不是 store state。

### Q：還需要 `localData` 嗎？

回答：

不需要。

這是已經落地的新結論。equipment enhancement 主流程已不再依賴：

- `localData`
- `setLocalData`
- `EnhancingContext`

現在改成：

```text
dialog request
-> navigator
-> session
```

### Q：dialog 關閉並 sync 回 store 應該由誰負責？

回答：

應該由 UI-facing controller / hook action 層負責，不是 reducer。

例如：

```ts
function commitAndClose() {
  useEquipmentStore.getState().syncInstance(session.working);
  closeModal();
}
```

原因：

- reducer 應保持 pure-ish
- `syncInstance()` 是 app integration，不是 domain logic
- `closeModal()` 更是 UI 行為

---

## Equipment Enhancement Dialog

### Q：現在 dialog 是怎麼開的？

回答：

現在不是靠 `selectedItemId` state 控制，而是 event-driven request。

流程：

```text
PotentialTab item click
-> openDialog(equipment, itemId)
-> request { equipmentId, itemId }
-> EquipEnhancingDialog
-> navigator
-> session controller
```

`PotentialTab` 不再持有：

- selected item state
- dialog request state

### Q：`PotentialTab` 現在的責任是什麼？

回答：

它現在只是 feature launcher。

負責：

- render `PotentialArea`
- render 當前 feature 的 enhancement item list
- 把 item click 往上送

不負責：

- 決定 dialog 開關
- 保存 `selectedItemId`
- 做 workflow state machine

### Q：dialog 的 source of truth 是什麼？

回答：

是 active request：

```ts
type EquipmentEnhancingDialogRequest = {
  equipmentId: string;
  itemId: EquipmentEnhancementItemId;
} | null;
```

只要 request 存在，且能從 store 取到 `baseInstance` 並建立 navigator，dialog 就開啟。

---

## Navigator / Context

### Q：為什麼需要單一 navigator result？

回答：

因為目前同一個 equipment enhancement dialog，在同一時間只會有一種 controller：

- cube controller
- soul controller

所以應該收成 discriminated union，而不是把 `cubeSession` / `soulSession` 都丟給 UI 自己猜。

目前 shape：

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

這樣的好處：

- `Enhancer.tsx` 直接 `switch (navigator.kind)`
- `EquipFooter.tsx`、`RankUpMultiplier.tsx` 直接讀 navigator
- 不需要再回頭追哪個 session 有值

### Q：現在還需要 `EnhancingContext` 嗎？

回答：

不需要。

equipment enhancement 主流程已改成：

- `useEquipmentEnhancingDialog`
- `useEquipmentEnhancementNavigator`
- `EquipmentEnhancementSessionContext`

舊的 `EnhancingContext` 已退出主流程。

---

## Cube Domain

### Q：cube metadata 應該長怎樣？

回答：

應該用 plain TypeScript metadata + policy key，不用 class hierarchy。

目前核心欄位：

```ts
type CubeWorkflow = "direct" | "restore" | "hexa" | "combine";
type CubeRankUpType = "standard" | "accumulate" | "none";
type CubeValidationType = "standard" | "none";
type CubeLineEffect =
  | { type: "none" }
  | { type: "mirror"; probability: number; fromIndex: 0; toIndex: 1 };
```

### Q：為什麼不要 cube class hierarchy？

回答：

因為目前 cube 差異已能用 metadata + pure function policy 表達：

- workflow
- rank-up type
- validation type
- line effect
- apply slot
- line rank table

還沒有任何 cube 需要獨立 runtime state，因此沒有理由引入 subclass。

### Q：mirror / shinyAdditional / combine 這些特殊 cube 怎麼處理？

回答：

不是做成不同 class，而是交給 metadata policy 與 reducer / feature function。

例子：

- `mirrorCube`
  - `workflow: "direct"`
  - `validationType: "none"`
  - `lineEffect: "mirror"`
- `shinyAdditionalCube`
  - `workflow: "direct"`
  - `rankUpType: "accumulate"`
- `combineCube`
  - `workflow: "combine"`

---

## Session / Reducer

### Q：CubeSession 的邊界是什麼？

回答：

CubeSession 可以知道最小的 equipment-like shape，但不能 import Zustand store implementation type 來耦合 store。

目前最小需求是：

- `subcategory`
- `level`
- `mainPot`
- `additionalPot`
- `statistics.counts.mainPot`
- `statistics.counts.additionalPot`

這也是 `CubeSessionEquipment` 的存在理由。

### Q：SoulSession 也需要嗎？

回答：

需要，而且已經完成。

目前 soul 也已收成：

- `SoulSession`
- `reduceSoulSession`
- `rollSoulPotential`
- `useEquipmentSoulSession`

所以 equipment enhancement 現在不再是 cube-only session 架構。

### Q：statistics count 應該在哪裡更新？

回答：

應該在 reducer 的成功 `roll` 路徑更新，不在 UI，也不在 `apply`。

這是目前已落地的規則。

原因：

- count 是 workflow side effect
- 它跟 roll 是否真的發生綁定
- `apply` 只是決定是否採用 pending result，不代表一次新 roll

### Q：為什麼不直接用 Immer 更新 nested object？

回答：

因為 domain reducer 目前傾向維持 plain immutable update。

但 nested count update 不能散落各處，所以目前已收斂成：

```ts
incrementStatisticsCount(working, feature, id, delta = 1)
```

這樣：

- 不依賴 Immer runtime
- reducer 邏輯仍能保持可讀
- 不會每個 reducer 都手寫一份 nested immutable update

---

## Workflow 結論

### Q：direct workflow 應該怎麼看待？

回答：

domain 上仍然是：

```text
roll -> pendingRoll -> apply
```

但 UI 上可以包成單次 action：

```text
rollDirectAndApply
```

這樣可以讓 reducer 保持一致，也能保留 direct UX。

### Q：restore workflow 的 fixed line 怎麼定義？

回答：

- `fixedIndex = -1`
  - 不固定
- `fixedIndex = 0..2`
  - 固定指定那一排

`restoreAdditionalCube` 沒有 fixed companion，因此 UI 不提供 lock line。

### Q：hexa reroll 為什麼要先更新 tier？

回答：

因為 hexa 的 reroll 本質只是讓使用者不用先選 3 條再繼續洗。

如果 roll 出來時實際 tier 已經改變，那 `working[cube.apply].tier` 就應立即更新，否則下一次 reroll 的起點會不對。

目前結論：

- roll 後先更新 `working tier`
- `potentialIds` 仍等 confirm 選 3 條後才寫入

### Q：combine target mode 應該怎麼處理？

回答：

這是最近新增的重要結論。

目前分成兩種：

#### 1. `targetIndex < 0`

維持一般 combine pending flow：

```text
roll -> pending rolled line -> apply/discard
```

#### 2. `targetIndex >= 0`

因為使用者已經指定要洗哪一排，而且 combine 一定會 loop 到目標排，所以不應再多按一次 apply。

現在正確流程是：

```text
roll + apply
```

也就是：

- button 直接觸發 `rollCombineAndApply(targetIndex)`
- target mode 下不顯示 `Apply`
- 這是快速洗鍊 UX，不是一般 pending review UX

---

## Equipment Detail / Metadata

### Q：為什麼 `EquipmentDetail` 不應直接讀 raw config array？

回答：

因為那會讓展示層直接依賴 metadata 原始資料來源，容易破壞邊界。

目前正確方向是：

- cube：走 cube registry / helper
- soul：走 `SoulManager`
- detail rows：由 read-model helper 組裝

目前 `EquipmentDetail` 已改成透過：

- `getEquipmentStatisticsRows(instance)`

來 render statistics。

### Q：companion item 為什麼不能再手寫一份？

回答：

因為 companion metadata 的單一來源已經在 `cube.config.ts`。

後來的修正結論是：

- `equipmentStatisticsRows.ts` 不應再自建一份 companion constant
- companion lookup 應走 `cube.registry.ts`

目前已補：

- `getCubeCompanionItem(id)`
- `isCubeCompanionItemId(id)`

所以 detail read-model 已回到 SSoT。

---

## 測試策略

### Q：為什麼這次沒有直接上 React component test？

回答：

因為目前 repo 沒有現成的 `jsdom` / Testing Library setup，而這次真正高風險的是：

- dialog request 建立條件
- navigator 分流
- combine target mode `roll + apply`

這些都可以透過 pure helper 或 controller-adjacent 測試覆蓋，不需要先引入完整 React test infra。

### Q：目前已補哪些邊界測試？

回答：

目前已補：

- `createEquipmentEnhancingDialogRequest(...)`
- `resolveEquipmentEnhancementNavigator(...)`
- `runCombineRollAndApply(...)`
- `equipmentEnhancementItems` read-model
- cube / soul reducer
- `incrementStatisticsCount(...)`

這代表目前 session / dialog / combine target mode 已有基本回歸保護。

### Q：`vi.spyOn(...).mockReturnValue(true)` 在測試裡是在做什麼？

回答：

它是在攔截內部 dependency，讓較高層的 helper / reducer 在執行時拿到固定結果。

例如：

```ts
vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
```

意思不是「我在下面直接呼叫 spy」，而是：

- 當 `runCombineRollAndApply(...)`
- 或它內部呼叫到的 reducer / feature
- 執行 `PotManager.validateLineRules(...)`

時，一律回傳 `true`。

用途是把 validation 規則排除掉，讓測試聚焦在 combine target mode flow，而不是潛能驗證本身。

---

## Auto-roll

### Q：現在可以開始 auto-roll 了嗎？

回答：

可以。

目前前置條件都已具備：

- cube workflow 都已進 session / reducer
- direct / restore / hexa / combine command model 已固定
- RNG 可注入
- dialog / navigator / controller 邊界已形成
- combine target mode 特例也已有穩定 action

### Q：下一步應該從哪裡開始？

回答：

先做 equipment cube auto-roll runner，不先碰 UI。

建議順序：

1. runner 直接操作 session / reducer
2. 再做 workflow-specific decision adapter
3. 最後才做 matcher / probability / auto-roll panel

不要反過來先做 UI 或 DSL，否則 runner shape 會被 UI 反綁。

---

## 現在仍然不做的事

目前仍不應優先做：

- generic FSM engine
- cube / equipment class hierarchy
- 把 metadata 全移去 JSON
- 為 auto-roll 提前做一個過度 generic 的 engine
- 把 UI component 自己變成 domain rule owner

---

## 總結

目前架構已經從舊的：

```text
selected item state
-> localData
-> enhancer
-> manager
```

收斂成：

```text
item click event
-> dialog request
-> navigator
-> session controller
-> reducer
-> pure feature
-> RNG
```

這也是接下來 auto-roll 應該建立的邊界。
