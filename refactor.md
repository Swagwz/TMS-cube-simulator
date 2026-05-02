# TMS Cube Simulator 裝備系統重構方向（實務落地版）

---

## 🎯 重構目標

建立一個：

- 可擴展（支援 cube / 星力 / 卷軸 / 星火）
- 可維護（規則集中、資料與邏輯分離）
- 可測試（deterministic + 可 replay）
- 高效能（避免 UI 不必要 re-render）

的裝備強化模擬系統。

---

## 🧠 核心設計原則

### 1. 資料與邏輯分離（Data-driven）

- JSON = 唯一資料來源（source of truth）
- Feature（cube / starforce / scroll）負責邏輯
- 不在 JSON 中寫 formula / 行為

---

### 2. Mutation 邊界單一化

- ❗只有「Sandbox（dialog）」可以 mutate
- Feature 必須是 pure function（不直接改 global state）

---

### 3. 隨機來源可控（RNG abstraction）

- 不使用 `Math.random()`
- 所有隨機行為必須從 `rng.next()` 取得

---

### 4. UI 與 Domain 解耦

- UI 不直接呼叫 cube / starforce 邏輯
- UI → 呼叫 action / manager → 呼叫 feature

---

## 🧩 系統分層

```text
Zustand Store（全域狀態）
↓
Sandbox（dialog working copy）
↓
Manager / Action Layer（流程控制）
↓
Feature Layer（cube / starforce / scroll）
↓
RNG（隨機來源）
```

---

## 🟢 1. Zustand Store（全域狀態）

```ts
type Store = {
  equipments: Record<string, EquipmentData>;

  selectedId: string | null;

  dialog: {
    isOpen: boolean;
    session: Session | null;
  };
};
```

👉 職責：

- 管理裝備列表
- 管理 UI 狀態（選取 / dialog）

👉 限制：

- ❌ 不放 class instance
- ❌ 不放 proxy（Valtio）
- ✔ 只放 plain object

---

## 🟡 2. EquipmentData（純資料）

```ts
type EquipmentData = {
  id: string;
  item_part: string;
  level: number;

  potentials: PotentialLine[];

  features: {
    cube: "active" | "locked";
    starforce: "active" | "locked";
  };
};
```

👉 職責：

- 表達裝備狀態
- 可序列化 / 可存檔

👉 限制：

- ❌ 不包含方法
- ❌ 不包含公式資訊

---

## 🔵 3. Sandbox Session（Dialog 核心）

```ts
type Session = {
  base: EquipmentData;
  working: EquipmentData;

  step: "idle" | "rolled" | "selecting";

  context: {
    rng: RNG;
    tempResult?: any;
    selectedIndices?: number[];
  };
};
```

---

### Session Flow

```ts
openDialog → clone(base)
           → working mutate（高頻）
           → closeDialog → commit or discard
```

---

👉 職責：

- 隔離高頻操作
- 防止全域 re-render
- 支援 rollback / commit

---

## 🔴 4. Feature Layer（核心邏輯）

---

### Cube（範例）

```ts
function rollCube(
  eq: EquipmentData,
  rng: RNG,
): {
  newPotentials: PotentialLine[];
  rankUp?: boolean;
} {
  const r = rng.next();

  return {
    newPotentials: generatePotentials(eq, rng),
    rankUp: r < 0.06,
  };
}
```

---

👉 原則：

- ✔ pure function
- ✔ 不修改輸入
- ✔ 回傳結果

---

### ❌ 不要做

```ts
eq.potentials = ... // ❌
Math.random()       // ❌
```

---

## 🟣 5. Manager / Action Layer（流程控制）

👉 負責處理「多階段 interaction」

---

### 範例：6選3 cube

```ts
function roll(session: Session) {
  const result = rollCube(session.working, session.context.rng);

  session.context.tempResult = result;
  session.step = "rolled";
}
```

---

```ts
function selectOption(session: Session, index: number) {
  session.context.selectedIndices ??= [];
  session.context.selectedIndices.push(index);
}
```

---

```ts
function apply(session: Session) {
  const result = session.context.tempResult;

  session.working = {
    ...session.working,
    potentials: pickSelected(result, session.context.selectedIndices),
  };

  session.step = "idle";
}
```

---

👉 職責：

- 管理流程（roll → select → apply）
- 管理 UI step
- bridge UI 與 feature

---

## 🎲 6. RNG 設計

---

### 介面

```ts
interface RNG {
  next(): number;
}
```

---

### Production（真隨機）

```ts
class CryptoRNG implements RNG {
  next() {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] / 0xffffffff;
  }
}
```

---

### Debug / Simulation（可重現）

```ts
class SeedRNG implements RNG {
  constructor(private seed: number) {}

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}
```

---

👉 使用方式：

- dialog open → 建立 RNG instance
- 所有 roll → 使用同一 RNG

---

## 🧠 UI 設計原則

---

### ❌ 不要

```ts
cube.roll(); // UI 直接呼叫 domain
```

---

### ✔ 應該

```ts
<button onClick={() => roll(session)} />
```

---

👉 UI 只做：

- 觸發 action
- 顯示 session.working
- 根據 step 顯示不同 UI

---

## 🧩 Interaction Pattern（你目前支援的）

---

### 1. 單步

```
roll → apply
```

---

### 2. 多步選擇

```
roll → select → apply
```

---

### 3. 分支

```
roll → choose A/B → apply
```

---

### 4. 累積

```
roll → counter++ → UI更新 → repeat
```

---

👉 全部由：

- session.step
- manager function

控制（不需要 FSM / engine）

---

## 🚫 本階段刻意不做的事

- ❌ class-based domain model
- ❌ FSM / workflow engine
- ❌ generic UI framework
- ❌ Valtio 當 global store
- ❌ 把公式寫進 JSON

---

## ✅ 重構優先順序

---

### Step 1

- 統一 cube 為 pure function
- 移除 `Math.random`

---

### Step 2

- 建立 Session（sandbox）
- dialog 改為 working copy

---

### Step 3

- 建立 manager（roll / select / apply）
- 統一 interaction flow

---

### Step 4

- 導入 RNG abstraction

---

### Step 5

- 加入其他 feature（starforce / scroll）

---

## 🧠 最終一句話

> 這個系統的核心不是 class，也不是 UI
> 而是：
>
> 👉 「Sandbox + Pure Feature + Controlled RNG」

---

## Main 分支現況檢視（依本文件目標）

> 檢視基準：從 `main` 直接讀取目前架構，不以 `refactor` branch 的 class / Valtio 實驗為基準。

### 已符合方向

#### 1. Store 目前仍是 plain object

`main` 的 `useEquipmentStore` 與 `useMoeStore` 使用 Zustand + Immer，儲存的是可序列化資料：

```ts
type EquipmentInstance = {
  id: string;
  entity: "equipment";
  subcategory: EquipmentSubcategory;
  level: number;
  mainPot: PotentialGroup;
  additionalPot: PotentialGroup;
  soul: string | null;
  _origin: EquipmentStatus;
  statistics: { counts: ... };
};
```

這點符合「Store 不放 class instance、不放 Valtio proxy」的方向。

結論：

- 不需要把裝備改成 class。
- 不需要導入 Valtio 作為全域 mutable state。
- `main` 的 store 結構可以保留，後續只需要調整命名與 action 邊界。

#### 2. Dialog 已經有 sandbox 雛形

`EquipEnhancingDialog` 開啟時會：

```ts
setLocalData(structuredClone(storeItem));
```

關閉時才：

```ts
syncInstance(localData);
```

這已經是 working copy / commit 的雛形。

結論：

- 不需要重做整個 dialog 架構。
- 應該把目前散在 enhancer component 裡的流程狀態，逐步收斂成明確的 `Session`。

#### 3. Cube metadata 已經是 plain object

`cube.config.ts` 的 `CUBE_LIST` 本質上就是 `CubeDefinition[]`。

結論：

- Cube 不需要 class。
- 現有 `CUBE_LIST` 可以保留並改名/收斂成 `cube.definitions.ts` 或 `cube.registry.ts`。
- 每個 cube 的差異應該用 `uiType` / `behavior` / `interaction` 這類資料欄位描述，不用 subclass。

---

### 目前主要問題

#### 1. Random 還不可控

目前 `rollWeightedIndex` 直接使用：

```ts
Math.random()
```

而 `CubeManager`、`SoulManager`、`MoeManager` 都透過它進行抽選。

影響：

- 測試不可 deterministic。
- 無法 replay。
- auto-roll 與機率模擬難以驗證。

優先處理：

```ts
rollWeightedIndex(weights, rng)
```

再逐步把 `CubeManager.rollPots`、`rollRankUp`、`SoulManager.rollPot`、`MoeManager.rollPots` 改成吃 `rng`。

#### 2. Feature 還不是純函式

目前 `CubeManager` 混合了：

- metadata lookup
- potential pool 查詢
- rank up 計算
- random roll
- account store 讀取
- UI flow 所需的部分判斷

尤其 `getScaledRankUpWeights` 會直接讀：

```ts
useAccountStore.getState().rankUpMultiplier
```

這會讓 domain logic 依賴 global state。

方向：

- manager / feature function 不直接讀 store。
- UI 或 session 建立時把 options 傳入。

例如：

```ts
rollCube({
  equipment,
  cube,
  pools,
  rng,
  rankUpMultiplier,
});
```

#### 3. UI component 仍直接承擔流程

例如 `HexaCubeEnhancer` 內部同時負責：

- roll rank
- roll 6 條潛能
- 暫存候選結果
- 選 3 條
- commit 到 localData
- 增加 statistics

這些流程應該逐步移到 action / manager layer。

方向：

- UI 只呼叫 `roll(session)`、`select(session, index)`、`apply(session)`。
- UI 顯示 `session.working` 與 `session.context.tempResult`。

#### 4. 裝備特例目前只靠 `features: EquipmentFeature[]`

`equipment.config.ts` 目前用：

```ts
features: ["mainPot", "additionalPot", "soul"]
```

這可以處理「有沒有某系統」，但不足以描述：

- 某裝備能用某強化系統，但規則不同
- 某裝備某 feature 有特殊 pool
- 某部位不能出特定潛能
- 未來 starforce / scroll / starflame 的例外規則

方向：

先不要用 Equipment subclass 解決。

應改成 capability + rule lookup：

```ts
type EquipmentCapabilities = {
  mainPot: boolean;
  additionalPot: boolean;
  soul: boolean;
  starforce: boolean;
  scroll: boolean;
  starflame: boolean;
};

type EquipmentRuleContext = {
  subcategory: EquipmentSubcategory;
  level: number;
  feature: EquipmentFeature;
};
```

特例由 feature layer 查 rule，不由 equipment object override method。

---

## 從 Main 重開新 Branch 的務實步驟

### 原則

從 `main` 開新 branch 是建議做法。

原因：

- `main` 已經保留 plain object store，符合本文件方向。
- 目前 `refactor` branch 的 class / Valtio 實驗與新方向衝突。
- 從目前 branch 硬修會同時處理架構轉向與實驗殘留，成本較高。

建議 branch：

```bash
git switch main
git pull
git switch -c refactor/sandbox-pure-feature
```

若依專案慣例需要 `codex/` prefix：

```bash
git switch -c codex/refactor-sandbox-pure-feature
```

---

## 建議 PR 拆分

### PR 1：建立 RNG 基礎，不改 UI 行為

目標：

- 新增 `RNG` interface。
- 新增 production RNG。
- 新增 seed RNG。
- 修改 `rollWeightedIndex(weights, rng)`。
- 暫時提供 fallback wrapper，降低一次改動範圍。

建議檔案：

- `src/domains/random/rng.type.ts`
- `src/domains/random/cryptoRng.ts`
- `src/domains/random/seedRng.ts`
- `src/utils/rollWeightedIndex.ts`

完成標準：

- 新程式碼不直接使用 `Math.random()`。
- cube / soul / moe 的 roll function 可逐步傳入 rng。
- 既有 UI 行為不變。

---

### PR 2：把 CubeManager 拆成 metadata registry + pure cube feature

目標：

- 保留 `CUBE_LIST`，但把它視為 `CubeDefinition[]`。
- `CubeManager.getItem` / `getApplicableCubes` 這類查詢可以留在 registry。
- roll 行為移到 pure feature function。

建議拆分：

```ts
// cube.registry.ts
getCubeDefinition(id)
getApplicableCubes(...)

// cube.feature.ts
rollCubeRank(...)
rollCubeLines(...)
rollCube(...)
```

完成標準：

- `rollCube*` 不讀 Zustand store。
- `rollCube*` 不 mutate equipment。
- `rollCube*` 全部吃 `rng`。
- `rankUpMultiplier` 從參數傳入，不從 `useAccountStore` 讀。

---

### PR 3：正式建立 Equipment Session

目標：

把目前 `localData + setLocalData + component state` 收斂成 session。

建議型別：

```ts
type EquipmentEnhancementSession = {
  base: EquipmentInstance;
  working: EquipmentInstance;
  selectedEhmId: EquipmentApplicableEhmId;
  step: "idle" | "rolled" | "selecting";
  context: {
    rng: RNG;
    tempResult?: unknown;
    selectedIndices?: number[];
  };
};
```

完成標準：

- dialog open 建立 session。
- dialog close commit `session.working`。
- discard 不寫回 store。
- enhancer component 不直接管理核心流程狀態。

---

### PR 4：逐一遷移 cube interaction

不要一次搬全部 cube。

建議順序：

1. direct cube：`craftsmanCube` / `masterCraftsmanCube` / `additionalCube`
2. restore cube：`restoreCube` / `restoreAdditionalCube`
3. combine cube：`combineCube` / `combineAdditionalCube`
4. hexa cube：`hexaCube`
5. accumulate / pity cube：`shinyAdditionalCube`
6. special cube：`mirrorCube` / `equalCube` / `absAdditionalCube`

每搬一類，建立對應 action：

```ts
roll(session)
select(session, index)
apply(session)
cancel(session)
```

完成標準：

- UI component 不呼叫 `CubeManager.rollPots`。
- UI component 不自行決定 rank up。
- UI component 只顯示 session 與觸發 action。

---

### PR 5：處理 Soul / Moe，避免 cube-only 架構固化

目標：

- Soul / Moe 也使用相同 RNG。
- 若流程簡單，可以各自有 feature function，不強迫抽成 generic engine。

建議：

```ts
rollSoul(equipment, soulId, rng)
rollMoe(moeCard, moeCubeId, rng)
```

完成標準：

- Soul / Moe 不直接使用 `Math.random()`。
- Soul / Moe 不依賴 UI component 內部流程。
- 不為了共用而抽象過度。

---

## Cube Class 是否需要保留

結論：不需要。

理由：

- Cube 本身沒有需要保存的 runtime state。
- Cube 的核心資料已經在 `CUBE_LIST`。
- Cube 的行為可由 `uiType` / `behavior` 加 pure function 組合。
- 使用 class 會讓特殊 cube 很容易走向 subclass 分裂，但目前真正需要的是 rule composition。

建議保留：

- `CubeDefinition`
- `CubeRegistry`
- `rollCube*` pure functions

不建議保留：

- `BaseCube`
- `RegularCube`
- `RestoreCube`
- `CombineCube`
- `MirrorCube`
- 任何為了覆寫一點行為而建立的 cube subclass

---

## 裝備特例的建議處理方式

不要用 `WeaponEquipment` / `ArmorEquipment` / `AccessoryEquipment` subclass 處理特例。

建議把特例放在 rule layer：

```ts
type EquipmentFeatureRule = {
  feature: EquipmentFeature;
  appliesTo: (equipment: EquipmentInstance) => boolean;
  getPotentialPool?: (...args) => PotentialPool;
  canUseEnhancement?: (...args) => boolean;
};
```

務實落地方式：

1. 短期保留 `equipment.config.ts` 的 `features`。
2. 加上 `capabilities` 欄位，先支援 boolean。
3. 遇到第一個真實特例時，再引入 rule table。
4. 不預先建立完整 rule engine。

原則：

- 沒有真實 case 前，不抽象。
- 有特例時，用資料表或 pure rule function 描述。
- 不讓 equipment object 自己帶 method。

---

## 目前最小可行重構路線

如果只做最有價值的最小版本，順序如下：

1. 從 `main` 開新 branch。
2. 保留 `useEquipmentStore` plain object 架構。
3. 保留 `CUBE_LIST`，改名或視為 `CubeDefinition[]`。
4. 新增 RNG abstraction。
5. 改 `rollWeightedIndex` 接收 RNG。
6. 把 `CubeManager.rollRankUp` / `rollPots` 拆成 pure function。
7. 先只遷移一個 direct cube 驗證模式。
8. 再導入 Session，避免一次改全部 dialog。

不建議第一步就做：

- 全面重寫 UI。
- 全面導入 FSM。
- 把所有 feature 抽成同一個 generic engine。
- 建立裝備 class hierarchy。
- 把 cube metadata 拆成每個 cube 一個 class。
