# Auto-roll Prototype Design

這份文件整理 auto-roll 目標設定、matcher、機率計算與各種方塊 workflow 的 prototype 方向。它是獨立功能規格，不直接併入 `refactor.md`，避免核心重構文件被 auto-roll 細節淹沒。

## 結論摘要

Auto-roll 不應先從 ECM preset 頁面開始做。Preset、tag、常用目標都只是 UX 輸入層；真正核心應該先定義：

1. 使用者設定的停止條件如何編譯成 target。
2. 手動 roll 與 auto-roll 如何共用同一套 roll output / matcher。
3. matcher 與 probability engine 如何使用同一個 compiled target，避免「UI 顯示機率」和「實際停止條件」不一致。
4. direct、restore + 固定、combine、hexa 這些方塊特色如何各自提供 roll context。

目前方向：

- Target 核心採 hybrid model，不單押 preset、potentialId count 或 field + value。
- UX 可以提供 tag / preset / quick target，但它們都要編譯成同一種內部 target。
- 自訂精準目標可以用「每排選實際潛能」建立 `potentialCounts`。
- 常見數值目標應支援 metric threshold，例如 `attR >= 21`，才能處理低 tier 高等級附加潛能比高 tier 小雙更好的 corner case。
- 機率必須用 DFS / DP 類枚舉計算，處理 prime / non-prime、line rank、不可能組合與 hexa 6 選 3。

## Target Model

外部 UI 不應直接等於 domain target。UI 可以有 preset、tag filter、自訂三排、metric 條件；儲存 / 執行時統一編譯成 `CompiledAutoRollTarget`。

```ts
type CompiledAutoRollTarget = {
  clauses: AutoRollClause[]; // OR
};

type AutoRollClause = {
  linePools?: AutoRollLinePool[]; // AND, non-position-sensitive coverage
  potentialCounts?: Record<string, number>; // exact potential id count requirements
  metrics?: AutoRollMetricThreshold[]; // AND summary thresholds
  tier?: AutoRollTierConstraint;
};

type AutoRollLinePool = {
  acceptedPotentialIds: string[];
};

type AutoRollMetricThreshold = {
  metric: string;
  minValue: number;
};

type AutoRollTierConstraint = {
  mode: "exact" | "atLeast";
  tier: "rare" | "epic" | "unique" | "legendary";
};
```

語意：

- `clauses` 之間是 OR：任一 clause 成立就停止。
- 同一 clause 內的 `linePools`、`potentialCounts`、`metrics`、`tier` 都是 AND。
- `linePools` 非位置敏感：三排 UI 只是方便設定，不要求第 1 個 pool 一定 match 第 1 排。
- `potentialCounts` 適合自訂精準模式：例如使用者三排各選一個實際潛能，最後轉成 `{ [potentialId]: count }`。
- `metrics` 適合 value-based 目標：例如 `attR >= 21`、`bossDamage >= 70`、`mainStatEffective >= 30`。

這個模型保留三種需要：

1. Preset / tag UX 可以快速產生常用 target。
2. 精準使用者可以指定實際潛能。
3. Corner case 可以用 field / metric threshold 表達，不必枚舉爆量潛能組合。

## Matcher

Matcher 輸入應該吃 roll output，而不是 UI preset。

```ts
type PotentialLines = {
  tier: EquipmentRank;
  potentialIds: string[];
};

type AutoRollMatchResult = {
  matched: boolean;
  clauseIndex?: number;
  matchedIndices?: number[];
};

function matchAutoRollTarget(
  target: CompiledAutoRollTarget,
  lines: PotentialLines,
): AutoRollMatchResult;
```

Matcher 規則：

- 一般 direct / restore cube 的 `potentialIds.length` 是 3。
- Hexa cube 的 `potentialIds.length` 可以是 6，matcher 必須找出任意 3 排是否能覆蓋 target，並回傳 `matchedIndices` 讓 UI 預選。
- Combine cube 最終 match 的 input 仍應是完整三排 `PotentialLines`；combine 的「抽到哪一排、重洗哪一排」屬於 workflow adapter。
- `metrics` 由 potential summary parser 解析 `potentialIds` 後生成 summary，再做 threshold 比對。
- `limit` 不應由 matcher 修正；roll generator / probability engine 要先保證不產生不可能結果。

## UI / UX

Auto-roll setting 不應一開始就暴露 raw field 或完整組合列表。

建議 UI 結構：

1. Dialog 內提供 Auto panel，避免切離目前裝備 / 方塊 context。
2. 第一層是 tag filter / 常用目標 chips，例如 `物攻`、`BOSS`、`主屬`、`掉寶`。
3. 使用者可以多選目標，多選代表 OR。
4. 每個目標顯示：
   - label / tag
   - 單次命中機率
   - 90% 信心預估顆數
   - 90% 信心預估秒數
5. 進階自訂提供：
   - 每排選實際潛能，編譯為 `potentialCounts`
   - metric + minValue，例如 `物攻% >= 21`
6. 達標後停在 preview / session 狀態，由使用者決定 apply。

Preset 的定位：

- Preset 是建立 target 的捷徑，不是 target engine 本身。
- 不建議先做大量 ECM `potentialCounts` preset，容易因組合爆炸與跳框 corner case 變成維護負擔。
- ECM 若要支援 preset，應該輸出能編譯成 `AutoRollClause` 的資料，而不是只輸出窮舉組合。

## Workflow Adapters

Auto-roll runner 不應假設所有方塊都是「roll 一次得到 3 排」。每種方塊提供 adapter，把自己的 workflow 轉成 matcher / probability 可理解的 context。

### Direct Cube

- 每次 roll 直接得到 3 排 `PotentialLines`。
- match 成功就停止在 pendingRoll preview。
- 不成功就繼續下一次。

### Restore Cube + 固定精華

- Auto-roll setting 需要固定 index。
- 每次 roll 得到新結果；只 match 新結果。
- 沒 match 不套用，繼續 roll。
- match 後停在 preview，讓使用者決定是否套用新結果。

### Hexa Cube

- 每次 roll 得到 6 排 candidate。
- matcher 從 6 排找可覆蓋 target 的 3 排。
- match 後回傳 matched indices，UI 預選該 3 排。

### Combine Cube

- Auto-roll setting 需要使用者指定要重洗哪一排。
- Workflow 可能先抽 line index。
- 如果抽到的 index 不是指定 index，runner 繼續下一次流程。
- 抽到指定 index 後進行該排重洗，再把完整三排組成 `PotentialLines` 交給 matcher。
- Probability 需要乘上「抽中指定排」的機率，除非實際規則不是等機率抽排。

## Probability Engine

機率計算應該和 matcher 共用 `CompiledAutoRollTarget`，不能另寫一套語意近似算法。

輸出：

```ts
type AutoRollProbabilityResult = {
  singleAttemptProbability: number;
  attempts50: number;
  attempts90: number;
  attempts95?: number;
  seconds90: number;
};
```

顆數公式：

```ts
attemptsForConfidence = Math.ceil(
  Math.log(1 - confidence) / Math.log(1 - singleAttemptProbability),
);
```

90% 信心：

```ts
attempts90 = Math.ceil(Math.log(0.1) / Math.log(1 - p));
```

如果 `p` 很小，可用近似：

```ts
attempts90 ~= 2.302585093 / p;
```

秒數：

```ts
seconds90 = attempts90 / (batchSizePerFrame * effectiveFps);
```

第一版先用：

- `batchSizePerFrame = 50`
- `effectiveFps = 60` 作預估

實際執行中可量測最近一段時間的 frame rate，再更新 ETA。

DFS / DP 要求：

- 依方塊的 prime / non-prime line rank 機率產生候選。
- 每條潛能要保留 weight / probability。
- 要處理 `limit`，不可把不可能同時出現的組合算入成功或總樣本。
- 需要避免非位置敏感 coverage 的重複計算。
- Hexa 需要計算 6 排中任意 3 排可 match 的機率。
- Restore 的 probability 和 direct 類似，但固定 index 會改變可變 line。
- Combine 的 probability 需要納入抽中指定 line 的 workflow 機率。

## 細部討論整理

這一節承接 `refactor-discussion.md` 原本的「Auto-roll Prototype」細部討論。原先的 preset-first 假設已被修正：preset 仍可作為 UX 捷徑，但不再是 target model 的核心。

### A. Auto-roll UI 放在哪裡？

結論：

- Auto-roll 控制放在 cube dialog 內，因為 target、可用 pool、固定 index、結合 index、機率都依賴目前裝備與方塊 context。
- UI 以 Auto panel 呈現，不要塞進手動 roll/apply 的主要控制列。
- 手動 roll UI 和 auto-roll setting 可以共用 dialog，但 auto panel 需要穩定高度，避免展開設定後造成 roll output 區塊跳動。
- Auto panel 第一層提供 tag / preset / quick target，但這些只負責建立 compiled target。
- 使用者可多選目標，多選代表 OR。
- 達標後停在 preview / session 狀態，顯示達標結果、使用顆數、花費、單次機率、90% 信心顆數與 90% 預估秒數。

執行中行為：

- Auto-roll running 時，手動 roll / apply / close dialog 應 disabled。
- 使用者仍需要 stop 按鈕。
- stop 後保留目前 pendingRoll / working 狀態，不自動還原；未來由歷史紀錄系統處理還原。

### B. Auto-roll Runner 狀態

Runner state 應獨立於 `CubeSession`。Session 保存裝備工作副本與 pendingRoll output；runner 保存本次 auto-roll 執行狀態。

```ts
type AutoRollRunnerState = {
  status: "idle" | "running" | "paused" | "completed" | "stopped";
  attempts: number;
  cost: number;
  stopReason: "matched" | "manualStop" | "limitReached" | null;
  batchSizePerFrame: number;
  effectiveFps: number;
};
```

結論：

- 第一版每個 `requestAnimationFrame` 跑 50 次，可先寫成常數，之後再考慮設定化。
- `working.statistics` 目前可以即時更新在 working instance 上，不另拆 session statistics。
- 若未來效能或 re-render 成本過高，再改成 runner 內累積、停止時一次 sync。
- Max attempts / max cost / max duration 不是第一版必要，但 runner state 保留 `limitReached`，方便未來加安全上限。

### C. Target Model 與 Matcher

早期草案曾考慮第一版 target 只用 preset：

```ts
type CubeAutoRollTarget = {
  mode: "preset";
  presetIds: string[];
};
```

這個方向已修正。新的結論是：preset 是 target builder，不是 matcher input。

正式 matcher input 應是：

```ts
type CompiledAutoRollTarget = {
  clauses: AutoRollClause[];
};
```

Target builder 可以來自：

- tag / preset quick target
- 自訂三排潛能 select，編譯成 `potentialCounts`
- metric threshold，例如 `attR >= 21`
- line pool coverage，例如 `2 BOSS + 1 攻%`

常見 target 可編譯成：

```ts
const boss2Attack1: AutoRollClause = {
  linePools: [
    { acceptedPotentialIds: ["boss40", "boss35", "boss30"] },
    { acceptedPotentialIds: ["boss40", "boss35", "boss30"] },
    { acceptedPotentialIds: ["atk13", "atk12", "atk10", "atk9"] },
  ],
};
```

`BDR 70%+` 這種門檻條件不要只靠 pool，還需要 metric：

```ts
const bdr70: AutoRollClause = {
  linePools: [
    { acceptedPotentialIds: ["boss40", "boss35", "boss30"] },
    { acceptedPotentialIds: ["boss40", "boss35", "boss30"] },
  ],
  metrics: [{ metric: "bossDamage", minValue: 70 }],
};
```

Matcher 結論：

- Matcher 統一吃 `PotentialLines` 和 `CompiledAutoRollTarget`。
- Matcher 不直接吃 preset id。
- Matcher 需要回傳 `matchedIndices`，因為 hexa 達標後要預選 6 選 3 的三排。
- Unknown imported potential 是否能參與 matcher，取決於 metric parser 是否能把 unknown line 轉成可用 summary；只用 `potentialId` 的 clause 無法支援 unknown。
- 組合 card 第一版只做預覽 / 檢查，不做主要設定，也不做逐組 exclude。

### D. Workflow-specific Auto-roll 行為

Direct cube：

- 每次 roll 直接得到 `PotentialLines`。
- 使用 compiled target match。
- match 就停在 preview / session 狀態。
- 不 match 就繼續。

Restore cube：

- Auto setting 帶入固定精華的 `fixedIndex`。
- 每次 roll 得到新結果。
- 只 match 新結果；不 match 就不套用並繼續。
- match 後停在 preview，由使用者決定是否 apply。

Hexa cube：

- 每次 roll 得到 6 排候選。
- matcher 從 6 排中找能滿足 compiled target 的 3 排。
- match 後回傳 matched indices，UI 預選那 3 排。

Combine cube：

- Auto setting 帶入使用者指定要重洗的 index。
- 如果 workflow 先抽 line index，抽不到指定 index 就繼續下一輪。
- 抽到指定 index 後自動進入該排重洗，得到完整三排結果後再 match。
- Probability 需要納入「抽到指定 index」的機率。

### E. Reducer Action API

Session action 採 reducer 風格。Auto-roll runner 不應直接改 store，而是重用 cube session reducer / action layer。

建議命令：

```ts
type CubeSessionCommand =
  | { type: "roll"; input?: CubeRollInput }
  | { type: "apply"; decision?: CubeApplyDecision }
  | { type: "discardPendingRoll" }
  | { type: "replaceWorking"; working: EquipmentInstance };
```

結論：

- Auto-roll runner 呼叫高階 action；高階 action 內部可使用 reducer。
- Reducer 可以回傳 next session；是否回傳 event / effect 可在實作時依需要決定。
- RNG 不應隱藏在 domain function 內。可以由 session 持有 rng，或由 action layer 傳入 reducer input；重點是 roll feature 不直接呼叫 `Math.random()`。
- `working.statistics` 短期可由 reducer/action 更新，因為目前已決定不拆 session statistics。

可能回傳形狀：

```ts
type CubeSessionReduceResult = {
  session: CubeSession;
  event?: CubeSessionEvent;
};
```

### F. Probability Prototype

結論：

- Probability input 必須是 compiled target，不是 UI preset。
- 第一版可先處理 direct / restore 的 3 排結果，但架構要避免阻擋 hexa / combine。
- Hexa 6 選 3 的 probability 最終需要和 matcher 一起支援。
- Combine probability 需要包含抽中指定 line 的 workflow 機率；如果規則是三排等機率，才可簡化成 `1 / 3 * 該排 roll 達標機率`。
- 顯示格式預設固定小數百分比，設定中可支援科學記號。

Probability result 第一版至少輸出：

- 單次成功率
- 90% 信心顆數
- 90% 預估秒數
- 預估成本

可選輸出：

- 50% 信心顆數
- 95% 信心顆數
- 期望顆數
- 期望成本

## Implementation Order

建議不要先做 ECM preset 頁面。順序應該是：

1. 定義 `CompiledAutoRollTarget`、`AutoRollClause`、`AutoRollMatchResult`。
2. 實作 matcher，先支援 direct 3 排與 hexa 6 選 3。
3. 實作 potential summary parser / metric summary。
4. 實作 probability engine prototype，先跑 direct / restore 的 3 排。
5. 加入 `limit` pruning 與非位置敏感 coverage 去重。
6. 加入 hexa probability。
7. 加入 combine adapter 與 probability。
8. 最後再做 Auto panel UX、tag / preset / custom target builder。

## 時程估計

這是獨立功能，不是小 UI 調整。

- MVP 可用版：5-8 個工作天。
  - 支援 direct / restore 基本 auto-roll。
  - 支援 compiled target、基本機率、90% ETA。
  - 特殊方塊覆蓋不完整。

- 認真完整版：12-18 個工作天。
  - 支援 direct、restore + 固定、combine、hexa。
  - 機率 DFS 處理 limit、不可能組合、非位置敏感去重。
  - UI 支援 tag / preset / 自訂 / 機率 / ETA。

- 穩定可維護版：3-4 週。
  - 包含測試、校正、ECM 接入策略、各 workflow 的 acceptance cases。

## 尚未完全定案

1. Preset / ECM 最終資料格式。
2. Metric 名稱與可用 metric 列表，例如 `attR`、`mainStatEffective`、`bossDamage`。
3. `mainStatEffective` 是否要把平屬、每 9 等、全屬%、主屬% 做等效換算；如果要，需要明確公式與裝備 context。
4. Combine cube 的實際 probability 是否能簡化成指定排機率乘上該排成功率，需依實際規則確認。
5. Probability 第一版是否必須支援所有 cube，或允許部分 workflow 顯示「暫不支援精確機率」。
