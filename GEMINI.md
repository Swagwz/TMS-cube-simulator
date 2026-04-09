# TMS Cube Simulator - 開發與架構指南

## 🚀 技術棧 (Technology Stack)

- **核心:** React 19 (Vite) + TypeScript
- **狀態管理:** Zustand (集合管理) + Valtio (instance 響應式)
- **樣式:** Tailwind CSS 4 + Shadcn UI
- **部署:** Cloudflare Workers (SPA 模式)

---

## 📂 目錄結構 (Directory Structure)

```
src/
  domains/
    cube/
      BaseCube.ts              ← abstract class，定義 roll()、uiType
      RestoreCube.ts           ← uiType: 'toggle'
      MasterCube.ts            ← uiType: 'direct'
      ShiningCube.ts           ← uiType: 'accumulate'
      CombineCube.ts           ← uiType: 'preview-line'
      GlitterCube.ts           ← uiType: 'six-pick-three'
    moe/
      BaseMoeCube.ts
      DirectMoeCube.ts         ← uiType: 'direct'
      ToggleMoeCube.ts         ← uiType: 'toggle'
    soul/
      SoulOrb.ts               ← 獨立系統，uiType: 'direct'
    equipment/
      EnhancementItem.ts       ← class，用 proxy() 包住後存入 Zustand
    potential/
      PotManager.ts            ← 純函數，ID → 顯示文字解析
    shared/
      types.ts                 ← 共用 Interface、CubeUIType
      utils.ts

  features/
    cube-simulator/
      CubeUI.tsx               ← switch(cube.uiType) 決定渲染哪個 component
      ui/
        ToggleCubeUI.tsx
        DirectCubeUI.tsx
        AccumulateCubeUI.tsx
        PreviewLineCubeUI.tsx
        SixPickThreeUI.tsx

  store/
    useInventoryStore.ts       ← Zustand，存 proxy(new EnhancementItem())
    useAccountStore.ts         ← Zustand，帳號設定（plain object）

  data/
    normal.json
    additional.json
```

---

## 🏗 核心架構模式 (Architectural Patterns)

### 1. Class + Valtio 封裝領域物件

所有具有狀態與行為的領域物件都用 **ES6 class** 定義，並在建立後以 `proxy()` 包住，使其具備響應式能力。Class 本身不依賴任何框架，Valtio 只在外部包覆。

```ts
// domains/equipment/EnhancementItem.ts
class EnhancementItem {
  id: string;
  name: string;
  level = 0;
  starforce = 0;
  mainPot: string[] = [];
  additionalPot: string[] = [];
  scrollEnhancementCount = 0;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  // 業務邏輯封裝在 instance method 內
  addStar() {
    this.starforce += 1;
  }

  scroll() {
    if (this.scrollEnhancementCount >= 9) return;
    this.scrollEnhancementCount += 1;
  }
}

// 建立時用 proxy() 包住
import { proxy } from "valtio";
const item = proxy(new EnhancementItem("sword-01", "楓葉長劍"));
```

### 2. Zustand 管理集合，Valtio 管理 instance

兩者職責明確分離，不混用：

```ts
// store/useInventoryStore.ts
import { create } from "zustand";
import { proxy } from "valtio";

type ProxiedItem = ReturnType<typeof proxy<EnhancementItem>>;

const useInventoryStore = create<{
  items: ProxiedItem[];
  addItem: (item: EnhancementItem) => void;
  removeItem: (id: string) => void;
}>((set) => ({
  items: [],

  // 存入時就包好 proxy
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, proxy(item)],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
}));
```

```tsx
// Component 內：讀用 useSnapshot，寫用原本的 proxy instance
import { useSnapshot } from "valtio";

const ItemCard = ({ item }: { item: ProxiedItem }) => {
  const snap = useSnapshot(item);

  return (
    <div>
      <p>
        {snap.name} ★{snap.starforce}
      </p>
      <button onClick={() => item.addStar()}>強化</button>
    </div>
  );
};
```

|                  | 負責                              |
| ---------------- | --------------------------------- |
| **Zustand**      | 集合管理（新增、刪除、查找 item） |
| **Valtio proxy** | 個別 instance 的響應式更新        |
| **Class**        | 業務邏輯與狀態封裝                |

### 3. Cube UI 類型系統

Cube class 只負責邏輯，UI 類型透過 `uiType` 常數對外宣告，UI 層根據此值決定渲染哪個 component，兩者完全解耦。

```ts
// domains/shared/types.ts
type CubeUIType =
  | "toggle" // 可選前後（恢復、恢復附加）
  | "direct" // 直接洗（工匠、名匠、新對等...）
  | "preview-line" // 先隨機某排再決定（結合、結合附加）
  | "six-pick-three" // 6選3（閃炫）
  | "accumulate"; // 累加型跳框（閃亮）

// 未來擴充用
type EnhancementUIType = CubeUIType | "scroll" | "starforce" | "starflame";
```

```ts
// domains/cube/BaseCube.ts
abstract class BaseCube {
  abstract readonly uiType: CubeUIType;
  abstract readonly id: string;

  // 抽潛能邏輯在此，不知道 UI 存在
  abstract roll(equip: EnhancementItem, config: RollConfig): PotentialResult;
}
```

```ts
// domains/cube/ShiningCube.ts — 累加型範例
class ShiningCube extends BaseCube {
  readonly uiType = "accumulate" as const;
  readonly id = "SHINING";

  accumulatedCount = 0;
  upgradeChance = 0.01;

  roll(equip: EnhancementItem, config: RollConfig): PotentialResult {
    this.accumulatedCount += 1;
    // 計算機率上升...
    return result;
  }
}
```

```tsx
// features/cube-simulator/CubeUI.tsx
const CubeUI = ({ cube }: { cube: BaseCube }) => {
  switch (cube.uiType) {
    case "toggle":
      return <ToggleCubeUI cube={cube as RestoreCube} />;
    case "direct":
      return <DirectCubeUI cube={cube} />;
    case "preview-line":
      return <PreviewLineCubeUI cube={cube as CombineCube} />;
    case "six-pick-three":
      return <SixPickThreeUI cube={cube as GlitterCube} />;
    case "accumulate":
      return <AccumulateCubeUI cube={cube as ShiningCube} />;
  }
};
```

### 4. Manager 純函數化

Manager 不再是有狀態的物件，改為**純函數集合**，透過參數傳入所需配置，消除對 store 的直接依賴。

```ts
// domains/potential/PotManager.ts — 純函數，不 import 任何 store
export const PotManager = {
  parse: (id: string, data: PotentialData): string => { ... },
  filterByEquip: (pots: Potential[], equip: EnhancementItem): Potential[] => { ... },
  checkLineRules: (lines: string[]): boolean => { ... },
}

// domains/cube/CubeManager.ts — config 從外部傳入，不直接存取 store
export const CubeManager = {
  roll: (cube: BaseCube, equip: EnhancementItem, config: RollConfig): PotentialResult => { ... },
  applyMultiplier: (result: PotentialResult, multiplier: number): PotentialResult => { ... },
}
```

呼叫端（UI 或 feature 層）負責從 store 取出 config 後傳入：

```ts
// features/cube-simulator 內
const accountSnap = useSnapshot(useAccountStore.getState().account);
const result = CubeManager.roll(cube, item, {
  multiplier: accountSnap.multiplier,
});
```

---

## ⚠️ Refactor 目標 (Refactor Goals)

### 已解耦項目

- [x] Manager 改為純函數，不直接存取 store
- [x] Cube class 透過 `uiType` 與 UI 層解耦
- [x] `EnhancementItem` 用 class 封裝，proxy 後存入 Zustand
- [x] Soul、Moe 各自獨立 class hierarchy，不共用 `EnhancementManager`

### 待處理項目

- [ ] `ShiningCube` 的累計狀態改由 class instance 自身管理（`accumulatedCount`、`upgradeChance`）
- [ ] 潛能解析路徑統一進 `PotManager.parse()`，移除散落在 `utils` 的碎片邏輯
- [ ] `CombineCube` 的「隨機某排」暫存狀態封裝進 class，不存在外部 state
- [ ] Moe 與 Equip cube 的共用邏輯抽到 `BaseCube`，消除重複

---

## 📏 開發規範 (Development Standards)

- **Class 純粹性:** Class 只封裝領域邏輯與自身狀態，不 import React、不 import store
- **Valtio 使用規則:** 讀取用 `useSnapshot()`，寫入（呼叫 method）用原本的 proxy instance
- **Manager 純函數:** 所有 Manager 必須可在無 React 環境下單元測試
- **類型安全:** `domains/` 層禁止使用 `any`，所有遊戲數據必須有對應 TypeScript Interface
- **擴充原則:** 新增強化系統（卷軸、星力）只需新增對應 class 與 UI component，不修改現有邏輯
