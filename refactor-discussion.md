# 重構討論

這份文件用來先收集產品與架構共識。等問題回答完，再把穩定決策整理回 `refactor.md` / `AGENTS.md`。

## 已確認方向

1. 這個 app 仍然是「強化模擬器」，不是完整角色傷害 / 戰力計算器。

   回答：已確認。完整傷害計算會受到角色本身屬性、技能、其他系統影響，單靠裝備無法準確計算提升量，所以這方向先排除。

2. Nexon API 匯入是一次性 fetch 流程。

   回答：已確認。Fetch 後顯示所有裝備，讓使用者選擇要匯入哪些裝備，再寫入 Zustand persist。

3. 匯入後的裝備仍然可以由使用者修改。

   回答：已確認，但 `locked` 或 `hidden` 的 feature 除外。

4. Auto-roll 要同時支援目標機率顯示，以及實際一直骰到達標。

   回答：已確認。機率 UI 需要支援極小機率。

5. Serverless API 只負責用 API key 轉發 Nexon API 請求。

   回答：已確認。資料轉換應該留在前端，避免 serverless code 和前端 domain code 重複維護。

6. 不需要持久化 Nexon raw payload。

   回答：已確認。只保存 app 內部 store 資料。

7. Nexon potential string mapping 是未來重要議題。

   回答：已確認。Nexon API 可能回傳像 `STR +10%` 這類字串，但目前 app 內部存的是 potential id。未知或特殊潛能需要明確模型處理。

8. API key 策略。

   回答：目前使用專案共用 API key。使用者自備 API key 是可能方向，但不是目前優先事項，因為安全儲存會讓專案複雜化。

9. 角色匯入範圍。

   回答：一次匯入一個角色。使用者之後可以再匯入其他角色。

10. Auto-roll 最小可用行為。

    回答：選裝備、選強化道具、設定目標、一直骰到達標、顯示次數與成本。結合、恢復 + 固定精華需要額外設定。

11. Auto-roll 執行方式。

    回答：使用可視化批次執行，例如每個 `requestAnimationFrame` 跑 50 次，讓使用者看得到進度，而不是只有 spinner。

## 待討論問題

### Auto-roll 目標與策略

12. 你對目前 `src/domains/autoRoll` 的 target matcher 滿意嗎？還是希望改成更通用的目標 predicate 系統？

    例子：
    - 總屬性 >= X
    - 至少 N 排符合條件
    - 指定 index 的某一排必須符合
    - 任一排符合某組可接受潛能

    回答：採用「Selection Pool (池覆蓋)」邏輯。
    - **非位置敏感**：系統會自動嘗試所有排列組合（使用回溯演算法），確保嚴格的目標集合不會被寬鬆的集合搶佔。
    - **支援 0~3 個目標池**：使用者定義池的數量即代表「達標行數」，未設定的池視為萬用字元（接受任何潛能）。
    - **支援多選一（如閃炫）**：從 6 條結果中尋找能滿足所有目標池的組合，解決手動安排位置的問題。

13. Auto-roll 的目標只需要判斷「最終結果」嗎？還是使用者也需要設定「中間策略」？

    例子：如果某個 workflow 支援保留部分結果，出現 2 排好潛就先保留，接著只繼續洗剩下一排。

    回答：只判斷最終結果

14. Restore cube auto-roll 的預設策略應該是什麼？

    可考慮：
    - 只有新結果直接達標才套用
    - 新結果比舊結果更接近目標就套用
    - 支援兩套條件：「保留條件」與「最終達標條件」

    回答：只有新結果直接達標才套用

15. Combine cube auto-roll 要結合哪一排，應該是固定 index，還是策略式選擇？

    例子：
    - 永遠結合第 1 排
    - 結合最差的一排
    - 結合由 target predicate 選出的某一排

    回答：會由使用者決定 要結合哪一排， 所以結合與恢復方塊+固定精華 會多出一個設定結合/固定的index

16. Hexa cube auto-roll 是否要自動從 6 排中選出最好的 3 排？

    如果要，「最好」應該怎麼評分？

    回答：請見 #12 的回答

17. Auto-roll 是否要同時支援「停止並保留目前結果」和「停止並還原原始裝備」？

    回答：只有停止並保留目前結果，使用者在autoroll期間有停止按鈕。停止並還原原始裝備可以用"歷史紀錄"還原，"歷史紀錄"是未來會加入的系統。

18. Auto-roll 達標後，應該直接 commit 到 store，還是停在 preview / session 狀態，讓使用者手動套用？

    回答：停在 preview / session 狀態

### 機率與精度

19. 極小機率顯示時，UI 應該優先使用固定小數百分比，還是科學記號？

    背景：JavaScript `number` 是 IEEE 754 double precision，約有 15-17 位十進位有效數字，所以顯示小數點後 8 位本身沒問題。真正的問題通常是機率演算法能不能精確算出那麼小的值。

    例子：
    - `0.00000001%`
    - `1e-10`

    回答：給使用者選擇，在設定中決定，預設是固定小數百分比

20. 機率計算應該優先使用精確枚舉 / 動態規劃，還是某些 workflow 可以接受 Monte Carlo 估算？

    備註：如果 UI 承諾顯示到小數點後 8 位，Monte Carlo 通常不適合極低機率事件。

    回答：我會根據#12的計劃，會根據選擇的集合，找出組合，再把每種組合的機率算出來加總。ex:1.{str+10%, str+13%} 2.{str+10%} 3.{不設定(都可以)}, 這樣會有 2 _ 1 _ n種組合，並且因為非位置敏感 所以要小心組合數不要計算錯 導致重複計算。

21. 如果某些 workflow 短期內太複雜，無法精確計算機率，UI 應該隱藏機率、顯示估算值，還是標示為暫不支援？

    回答：不會有workflow問題， 一次只會有單一方塊、單一裝備去autoroll想要的a\*b\*c種組合(因為有3排可以設定，各可以設定n種想要的潛能，所以是a\*b\*c)

### Session 設計

22. Equipment enhancement session 需要先決定哪些邊界？

    背景：
    - moe 不放在這裡討論；這裡只討論 equipment 的 cube、soul，以及未來 starforce、starflame、scroll。
    - Store 繼續保存 plain `EquipmentInstance`。
    - Dialog 開啟時建立 `base` / `working` / `rng`。
    - `working.statistics` 目前先保留在 equipment instance 上，不急著拆出 session 統計。

    這題真正要回答的是下面幾個決策。

    22.A. Session 是否只保存 equipment workflow 的最小共用狀態？

    建議形狀：

    ```ts
    type BaseEquipmentSession = {
      base: EquipmentInstance;
      working: EquipmentInstance;
      rng: RNG;
    };

    type EquipmentEnhancementSession =
      | CubeEnhancementSession
      | SoulEnhancementSession
      | StarforceEnhancementSession
      | StarflameEnhancementSession
      | ScrollEnhancementSession;
    ```

    回答：是，應該說是 每個 enhancement個別的最小共用狀態， 目前建議的type就可以

    22.B. Cube session 是否使用 `pending` 保存 roll action output？

    建議形狀：

    ```ts
    type CubeEnhancementSession = BaseEquipmentSession & {
      kind: "cube";
      enhancementId: CubeId;
      pending: CubeRollResult | null;
    };
    ```

    `pending` 只代表「roll 後尚未套用的 domain result」。它不是 dialog layout 狀態，也不是所有 UI decision 的容器。

    回答：是，也為了方便autoroll 調用, autoroll可以從pending中去確認有沒有match到目標潛能，ex. CubeAutoRollMatcher.match(target, session.pending?.result)

    22.C. Cube roll result 是否先採用這個 union？

    ```ts
    type CubeRollResult =
      | { kind: "direct"; result: PotentialGroup }
      | { kind: "restore"; result: PotentialGroup }
      | { kind: "hexa"; result: PotentialGroup }
      | CombineCubeRollResult;

    type CombineCubeRollResult =
      | { kind: "combine"; step: "selectedLine"; lineIndex: number }
      | { kind: "combine"; step: "rolledLine"; result: PotentialGroup };
    ```

    備註：
    - `PotentialGroup` 是 `{ tier: EquipmentRank; potIds: string[] }`。
    - hexa 的 `result.potIds` 可以是 6 排候選；使用者選哪 3 排是 apply action 的參數。
    - combine 是兩階段：先隨機抽中 line index，再由使用者決定是否重設該排。

    回答：是， 目前這union很不錯，

    22.D. Roll action input / roll 後 decision 要放哪裡？

    建議邊界：
    - Roll action input：例如固定精華固定哪幾排、combine auto-roll 要處理哪一排。手動 UI 可存在 component local state；auto-roll 可存在 runner strategy；呼叫 action 時傳入。
    - Roll 後 decision：例如 restore 保留舊結果或套用新結果、hexa 選哪 3 排、combine 是否重設抽中的排。手動 UI 可在 apply/confirm 時傳入；auto-roll 由 strategy 決定。
    - 只有需要跨 component、跨步驟持久存在，或 runner 必須讀寫的 decision，才提升到 session 或 runner strategy。

    回答：照你說的建議，我是覺得roll後有result, 如何決定要哪用哪個潛能就給local state自己管就好, restore可以有 selectSide:'before'|'after'|null, hexa則是 selectedIds: string[];

    22.E. Cube dialog UI 是否由 cube metadata 決定，而不是由 `pending` 決定？

    建議方向：

    ```ts
    type CubeDefinition = {
      id: CubeId;
      uiType: "direct" | "restore" | "combine" | "hexa" | "accumulate";
    };
    ```

    原因：
    - Dialog 在 roll 前就需要知道 layout、header、footer、display height。
    - hexa 需要一開始就預留較高的 6 選 3 UI，避免 roll 後畫面抖動。
    - restore / combine 的 UI 本來就不同，即使 result 都可能包含 `PotentialGroup`。
    - shiny additional cube 需要顯示累積顆數，可能是 `uiType: "accumulate"`，或 `uiType: "direct"` 加 `headerAddon: "pityCounter"`。

    回答：我覺得可以在Dialog->CubeDialog->CubeDialogContent 在這時候做switch去分就好，ex.switch(cubeId){case 'restoreCube': return <RestoreCube />;}

    22.F. Auto-roll 是否共用 session/action model，但額外持有 runner state？

    建議方向：
    - Auto-roll 可以重用 `CubeEnhancementSession` 和 cube actions。
    - Runner 額外保存 `running / paused / completed`、batch count、stop reason、target、strategy。
    - Strategy 提供 roll input 和 roll 後 decision，例如 combine 是否重設、hexa 如何選 3 排、restore 何時套用新結果。

    回答：照你建議，不過roll後decision可以不用，我是打算符合目標潛能就停下，給使用者自己決定，所以strategy不需要，甚至"固定精華"的fixedIndex是由restoreCube.roll(multiplier,fixedIndex)傳入

23. 是否需要另外保存「本次 session / 本次 auto-roll run」的暫時計數？

    #22 已確認 `working.statistics` 目前先保留在 equipment instance 上，不急著拆出 session 統計。

    這題只問短期是否需要額外的 run-level stats：
    - 手動 dialog：本次開啟 dialog 後用了幾顆、花多少、升階幾次。
    - Auto-roll：本次 run 跑了幾次、花多少、停止原因。
    - 若不需要，所有統計都先直接更新 `working.statistics`。

    回答：不需要session statistics, 直接更新在working.statistics.

24. Session action 應該直接 mutate session，還是使用 reducer 風格？

    Mutable style：

    ```ts
    roll(session);
    apply(session);
    ```

    Reducer style：

    ```ts
    next = reduce(session, { type: "roll" });
    ```

    回答：reducer風格.

### Nexon Import 資料模型

25. `EquipmentInstance` 的欄位命名應該維持 app domain 命名，還是靠近 Nexon API 欄位名稱來減少轉換工作？

    例子：
    - app style：`subcategory`、`mainPot`、`additionalPot`
    - Nexon style：`item_equipment_part`、`potential_option_1`

    回答：維持app style, 因為貿然重新命名可能有疏漏導致bug.

26. 未知的匯入潛能是否應該使用 discriminated model？

    可能形狀：

    ```ts
    type PotentialLine =
      | { kind: "known"; potentialId: string }
      | { kind: "unknown"; rawText: string };
    ```

    回答：對, 不過不只有rawText, 還要有infer, infer:{template:string, value:number, field:string, potentialName:string}, ex.{ kind: "unknown"; rawText: "爆擊機率 +8%", infer:{template:"爆擊機率 +{x}%", value:8, field:"crit", potentialName:"爆擊機率%"} }。 kind:"known" 就照你的建議, 在pool中比對不上的才有infer, infer會根據template做模糊對比, 找出最符合的template, 這樣可以找出value、field、potentialName, 如果有lib可以做模糊對比並且有分數排序可以告訴我。

27. Unknown potential raw string 是否應該參與 target matching？

    例子：如果 Nexon 回傳未知的 `STR +10%`，auto-roll 目標設定為 `STR +10%` 時，是否可以用 raw text match？

    回答：首先auto-roll的potential pool是從當前cube、裝備、等級、tier filter出來的，所以未知的潛能就代表不存在於pool中，目前若matcher打算採用potId比對 那就不支援，若用field & value就支援。

28. 匯入裝備的 capabilities 應該根據 Nexon 裝備部位 / 等級推導，還是匯入時先給較寬鬆的 capabilities，再讓使用者自行修正？

    回答：我有 hydrated_equipments.json、 slot_default_capabilities.json,先去看hydrated_equipments.json是否存在，有 -> 套用該capabilities, 無 -> 根據slot去slot_default_capabilities.json 找對應的slot capabilities.

29. 如果同一角色 / 同一件裝備再次匯入，app 應該建立新的 instance，還是更新既有 instance？

    回答：在匯入的介面會給使用者選擇, 不過匯入介面會把每個item JSON.stringify(item)存入到Set 再顯示, 這樣就能給使用者顯示不重複的裝備了。

### 優先順序與遷移順序

30. 是否同意先暫緩 Nexon potential transformer 的細節，只先確保資料模型有 `unknown rawText` 這個出口？

    回答：先暫緩, 不過我在#26有先給出我的想法了，transformer細節之後再討論，畢竟跟目前系統沒有耦合，transformer建好->instance也會建好->存入zustand store就可以在專案上使用了。

31. 建議遷移順序：
    1. 加入 RNG 與可注入的 weighted roll。
    2. 定義 equipment session、cube pending result、cube action input / apply decision 的邊界。
    3. 實作 direct cube pure actions。
    4. 實作 restore / combine / hexa 的手動 session actions。
    5. 實作重用相同 session/action model 的 auto-roll runner。
    6. 實作 Nexon import normalize。

    這個順序正確嗎？還是 auto-roll 應該更早？

    回答：auto-roll我認為先要討論, 包括ui在dialog中放在哪、auto-roll要如何設計，先給出auto-roll prototype吧，上面討論到的auto-roll我覺得不夠細節。

## 整理後結論

### 目前已收斂的架構方向

1. App 定位仍是強化模擬器，不做完整角色傷害 / 戰力計算。

2. Store 繼續保存 plain app-domain model，不為了 Nexon API 改成 Nexon 欄位命名。

3. Dialog 開啟時建立 enhancement session：

   ```ts
   type BaseEquipmentSession = {
     base: EquipmentInstance;
     working: EquipmentInstance;
     rng: RNG;
   };
   ```

4. Session 不是萬能 workflow engine。每個 enhancement 只保留自己的最小共用狀態。

5. Cube session 使用 `pending` 保存 roll action output：

   ```ts
   type CubeEnhancementSession = BaseEquipmentSession & {
     kind: "cube";
     enhancementId: CubeId;
     pending: CubeRollResult | null;
   };
   ```

6. Cube roll result 暫定：

   ```ts
   type CubeRollResult =
     | { kind: "direct"; result: PotentialGroup }
     | { kind: "restore"; result: PotentialGroup }
     | { kind: "hexa"; result: PotentialGroup }
     | CombineCubeRollResult;

   type CombineCubeRollResult =
     | { kind: "combine"; step: "selectedLine"; lineIndex: number }
     | { kind: "combine"; step: "rolledLine"; result: PotentialGroup };
   ```

7. `PotentialGroup` 暫定是：

   ```ts
   type PotentialGroup = {
     tier: EquipmentRank;
     potIds: string[];
   };
   ```

   `potIds.length` 依 workflow 而定。一般 cube 是 3，hexa 可以是 6。

8. Roll action input 不放進 session config：
   - 固定精華 `fixedIndex` 由 `restoreCube.roll(multiplier, fixedIndex)` 或對應 action input 傳入。
   - Combine 需要處理哪一排，由 UI local state 或 auto-roll input 傳入。
   - Hexa 選哪 3 排，由 UI local state 在 apply 時傳入。

9. Roll 後 decision 由 UI local state 管理，不進 pending：
   - Restore：`selectSide: "before" | "after" | null`
   - Hexa：`selectedIds: string[]`
   - Combine：是否重設抽中的排

10. Session action 採 reducer 風格。

11. `working.statistics` 繼續跟在 `working` instance 上，不拆出 session statistics。

12. Cube dialog UI 不由 `pending` 決定。短期可在 `Dialog -> CubeDialog -> CubeDialogContent` 依 `cubeId` switch 出不同 component。

13. Auto-roll 要先做 prototype，再進入 migration implementation。

### 需要重新注意的風險

1. `pending` 是 action output，不是 layout state。Auto-roll 可以讀 `pending` 做 matcher，但 dialog layout 不能依賴 `pending`。

2. Restore 的 `CubeRollResult` 目前只有 `result: PotentialGroup`，代表 before 可以從 `working` 取得；如果未來 UI 需要保存 roll 當下的 before snapshot，再重新討論是否加回 `before`。

3. Combine 是兩階段 pending，這會影響 auto-roll runner：runner 不能只假設每次 roll 都直接得到 `PotentialGroup`。

4. Hexa 的 matcher 需要支援從 6 排候選中找出能覆蓋 target pools 的 3 排。

5. Unknown imported potential 是否能參與 matcher，取決於 matcher 是只看 `potId`，還是未來支援 `field/value`。

## 下一輪細部討論：Auto-roll Prototype

接下來不要再討論泛用 session。下一輪先把 auto-roll prototype 設計清楚。

### A. Auto-roll UI 放在哪裡？

1. Auto-roll 控制應該放在 cube dialog 內，還是 dialog 外的 workbench enhancement area？

2. 如果放在 dialog 內，是放在：
   - footer 附近，和 roll / apply 按鈕同層？
   - 右側或下方獨立 panel？
   - 由一個「Auto」切換開關展開設定？

3. Auto-roll 設定區是否要跟手動 roll UI 共用同一個 dialog display height？

4. Auto-roll 執行中，手動 roll / apply / close dialog 要不要 disabled？

5. 達標後停在 preview / session 狀態時，UI 應該顯示：
   - 達標結果
   - 使用顆數
   - 花費
   - 機率
   - 期望顆數 / 期望成本

   哪些是第一版必須？

   回答：1.dialog內，但dialog外的"設定"使用者也要可以設定"常用 auto-roll組合"，這樣就可以再dialog內一鍵引入常用組合,

### B. Auto-roll Runner 狀態

1. Runner state 是否需要獨立於 `CubeEnhancementSession`？

   可能形狀：

   ```ts
   type AutoRollRunnerState = {
     status: "idle" | "running" | "paused" | "completed" | "stopped";
     attempts: number;
     cost: number;
     stopReason: "matched" | "manualStop" | "limitReached" | null;
   };
   ```

2. 是否需要 max attempts / max cost / max duration？

3. `requestAnimationFrame` 每 frame 50 次是否固定，還是做成 setting？

4. Auto-roll stop 後是否保留最後一次 `pending` / `working`，並由使用者決定 apply？

5. Auto-roll 執行中是否即時更新 `working.statistics`，還是 runner 內先累積，停止時一次寫入？

   回答：

### C. Target Model 與 Matcher

1. Target pool model 是否可以定義成：

   ```ts
   type PotentialTargetPool = {
     acceptedPotIds: string[];
   };

   type CubeAutoRollTarget = {
     pools: PotentialTargetPool[]; // 0~3 個
   };
   ```

2. 未設定的 pool 是否視為 wildcard？

3. Matcher 是否統一吃 `PotentialGroup`？

   ```ts
   matchCubeTarget(target, result: PotentialGroup): MatchResult
   ```

4. `MatchResult` 是否需要回傳 matched indices？

   Hexa 需要從 6 排中找出可套用的 3 排；如果 matcher 回傳 indices，達標後 UI 可以預選那 3 排。

5. Matcher 第一版是否只支援 `potId`，先不支援 unknown potential 的 `field/value`？

6. Target pool 的組合機率計算是否要和 matcher 共用同一套「非位置敏感覆蓋」邏輯，避免 matcher 和 probability 算法結果不一致？

   回答：

### D. Workflow-specific Auto-roll 行為

1. Direct cube：
   - 每次 roll 直接得到 `PotentialGroup`。
   - match 就停。
   - 不 match 就繼續。

2. Restore cube：
   - 每次 roll 得到 `result: PotentialGroup`。
   - match 新結果才停。
   - 不 match 不套用，繼續 roll。
   - 固定精華 `fixedIndex` 由 auto-roll setting 傳入 action。

3. Hexa cube：
   - 每次 roll 得到 6 排 `PotentialGroup`。
   - matcher 從 6 排中找能滿足 target pools 的 3 排。
   - match 就停，UI 預選 matched indices。

4. Combine cube：
   - 第一步隨機抽 line index，pending 變成 `selectedLine`。
   - 如果抽到的 line index 不是使用者指定 index，是否直接 cancel 並重抽？
   - 如果抽到指定 index，是否自動 confirm roll 該排？
   - roll 後得到 `rolledLine` result，再 match。

   回答：

### E. Reducer Action API

1. Cube reducer command 是否長這樣？

   ```ts
   type CubeSessionCommand =
     | { type: "roll"; input?: CubeRollInput }
     | { type: "apply"; decision?: CubeApplyDecision }
     | { type: "clearPending" }
     | { type: "syncWorking"; working: EquipmentInstance };
   ```

2. Auto-roll runner 是否直接呼叫 reducer，還是呼叫更高階 action？

3. Reducer 是否允許直接更新 `working.statistics`？

4. Reducer 回傳是否需要包含 effect / event？

   例子：

   ```ts
   type CubeSessionReduceResult = {
     session: CubeEnhancementSession;
     event?: CubeSessionEvent;
   };
   ```

5. 若 reducer 是 pure function，RNG 要怎麼傳入？
   - session 持有 seeded / crypto rng object
   - reducer input 傳 `rng`
   - action layer 包一層處理 rng side effect

   回答：

### F. Probability Prototype

1. 第一版 probability 是否只處理 direct / restore 的 3 排結果？

2. Hexa 6 選 3 的 probability 是否和 matcher 一起支援？

3. Combine 的 probability 是否先不算，還是可由「抽中指定 line 的 1/3 \* 該 line roll 達標機率」推導？

4. 顯示格式預設固定小數百分比，設定中支援科學記號。第一版設定放在哪？

5. Probability result 是否需要輸出：
   - 單次成功率
   - 期望次數
   - 期望成本
   - 分位數，例如 50% / 90% / 95% 達標所需顆數

   第一版要哪些？

   回答：
