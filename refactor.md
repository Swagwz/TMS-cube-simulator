# TMS Cube Simulator - 重構步驟指南

> 原則：每個 Phase 完成後專案必須仍可正常運行，不做破壞性的大爆炸式重構。

---

## Phase 1 — 建立型別基礎

**目標：** 在動任何邏輯之前，先把共用型別定義好，後續所有 Phase 都依賴這裡。

### 步驟

1. 建立 `src/domains/shared/types.ts`，定義以下型別：

```ts
// UI 類型識別
export type CubeUIType =
  | "toggle"
  | "direct"
  | "preview-line"
  | "six-pick-three"
  | "accumulate";

export type EnhancementUIType =
  | CubeUIType
  | "scroll"
  | "starforce"
  | "starflame";

// 抽潛能結果
export interface PotentialResult {
  lines: string[];
  isUpgraded: boolean;
}

// 傳入 roll() 的外部配置（不從 store 直接取）
export interface RollConfig {
  multiplier: number;
  accountLevel?: string;
}
```

2. 確認現有程式碼的所有 `any` 在 `domains/` 層，逐一列出（先不改，只是盤點）。

### 完成條件

- `types.ts` 存在且可被 import
- 專案正常編譯

---

## Phase 2 — EnhancementItem 改為 Class

**目標：** 把裝備資料從 plain object 改為 class，並用 Valtio proxy 包住後存入 Zustand。

### 步驟

1. 建立 `src/domains/equipment/EnhancementItem.ts`：

```ts
export class EnhancementItem {
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

  addStar() {
    this.starforce += 1;
  }

  scroll() {
    if (this.scrollEnhancementCount >= 9) return;
    this.scrollEnhancementCount += 1;
  }

  resetPot() {
    this.mainPot = [];
  }
}
```

2. 安裝 Valtio：`npm install valtio`

3. 改寫 `src/store/useInventoryStore.ts`，存入時用 `proxy()` 包住：

```ts
import { create } from "zustand";
import { proxy } from "valtio";
import { EnhancementItem } from "@/domains/equipment/EnhancementItem";

type ProxiedItem = ReturnType<typeof proxy<EnhancementItem>>;

interface InventoryStore {
  items: ProxiedItem[];
  addItem: (item: EnhancementItem) => void;
  removeItem: (id: string) => void;
  getItem: (id: string) => ProxiedItem | undefined;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, proxy(item)],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  getItem: (id) => get().items.find((i) => i.id === id),
}));
```

4. 把現有所有使用裝備 plain object 的地方，逐一替換成 `EnhancementItem` class。讀取用 `useSnapshot(item)`，寫入直接 call instance method。

```tsx
// Before
const [item, setItem] = useState({ starforce: 0 });
setItem((prev) => ({ ...prev, starforce: prev.starforce + 1 }));

// After
const snap = useSnapshot(item);
item.addStar();
```

### 完成條件

- 裝備列表正常顯示
- 強化操作 UI 正常更新
- 沒有直接對 store 內的 item 做 spread 更新

---

## Phase 3 — Cube 抽象層

**目標：** 建立 `BaseCube` abstract class，並把現有各 cube 邏輯遷移進對應的子 class。

### 步驟

1. 建立 `src/domains/cube/BaseCube.ts`：

```ts
import {
  CubeUIType,
  PotentialResult,
  RollConfig,
} from "@/domains/shared/types";
import { EnhancementItem } from "@/domains/equipment/EnhancementItem";

export abstract class BaseCube {
  abstract readonly uiType: CubeUIType;
  abstract readonly id: string;
  abstract roll(equip: EnhancementItem, config: RollConfig): PotentialResult;
}
```

2. 依序建立各 cube 子 class，**一次只做一個**，做完確認正常再繼續：

```
RestoreCube.ts       uiType: 'toggle'
MasterCube.ts        uiType: 'direct'
CombineCube.ts       uiType: 'preview-line'
GlitterCube.ts       uiType: 'six-pick-three'
ShiningCube.ts       uiType: 'accumulate'
```

3. `CombineCube` 的暫存狀態（隨機出來待確認的那一排）封裝進 class：

```ts
export class CombineCube extends BaseCube {
  readonly uiType = "preview-line" as const;
  readonly id = "COMBINE";

  // 暫存狀態放在 class 內，不需要外部 useState
  pendingLine: string | null = null;

  previewLine(equip: EnhancementItem, config: RollConfig): string {
    this.pendingLine = this.generateLine(equip, config);
    return this.pendingLine;
  }

  confirm(equip: EnhancementItem): PotentialResult {
    // 用 pendingLine 更新裝備
  }

  reject() {
    this.pendingLine = null;
  }
}
```

4. `ShiningCube` 的累計狀態封裝進 class：

```ts
export class ShiningCube extends BaseCube {
  readonly uiType = "accumulate" as const;
  readonly id = "SHINING";

  accumulatedCount = 0;
  upgradeChance = 0.01;

  roll(equip: EnhancementItem, config: RollConfig): PotentialResult {
    this.accumulatedCount += 1;
    this.upgradeChance = this.calcChance(this.accumulatedCount);
    // ...
  }
}
```

5. 把現有 `CubeManager` 的 switch/if 邏輯，分散進各 class 的 `roll()` 方法。

### 完成條件

- 每種 cube 的抽潛能行為與重構前結果一致
- `CombineCube` 的暫存狀態不再依賴外部 useState
- `ShiningCube` 的累計計數不再存在 store 或外部 state

---

## Phase 4 — Manager 純函數化

**目標：** 切斷 Manager 對 store 的直接依賴，改為純函數，config 從外部傳入。

### 步驟

1. 找出所有 Manager 內直接 import store 的地方（`useAccountStore`、`useInventoryStore` 等）。

2. 將這些依賴改為函數參數：

```ts
// Before
export const CubeManager = {
  roll: (cube: BaseCube, equip: EnhancementItem) => {
    const multiplier = useAccountStore.getState().multiplier; // 直接存取 store
    // ...
  },
};

// After
export const CubeManager = {
  roll: (cube: BaseCube, equip: EnhancementItem, config: RollConfig) => {
    const { multiplier } = config; // 從參數取得
    // ...
  },
};
```

3. 呼叫端（feature 層）負責從 store 取出 config 後傳入：

```ts
// features/cube-simulator 內
const { multiplier } = useAccountStore();
CubeManager.roll(cube, item, { multiplier });
```

4. 將 `PotManager` 統一成純函數，移除散落在 `utils` 的潛能解析邏輯：

```ts
// domains/potential/PotManager.ts
export const PotManager = {
  parse: (id: string, data: PotentialData): string => { ... },
  filterByEquip: (pots: Potential[], equip: EnhancementItem): Potential[] => { ... },
  checkLineRules: (lines: string[]): boolean => { ... },
}
```

### 完成條件

- `domains/` 層沒有任何 `import` 指向 `store/`
- Manager 函數可以在無 React 環境下被呼叫（可寫簡單 unit test 驗證）

---

## Phase 5 — Moe 與 Soul 獨立化

**目標：** 把 Moe 和 Soul 從 `EnhancementManager` 拆出來，各自建立獨立 class hierarchy。

### 步驟

1. 建立 `src/domains/moe/BaseMoeCube.ts`，複用 `BaseCube` 介面但獨立繼承：

```ts
export abstract class BaseMoeCube {
  abstract readonly uiType: "direct" | "toggle";
  abstract readonly id: string;
  abstract roll(equip: EnhancementItem, config: RollConfig): PotentialResult;
}
```

2. 建立 `DirectMoeCube` 和 `ToggleMoeCube`，把現有 `MoeManager` 的邏輯遷移進去。

3. 建立 `src/domains/soul/SoulOrb.ts`：

```ts
export class SoulOrb {
  readonly uiType = "direct" as const;
  readonly id: string;
  soulOption: string = "";

  constructor(id: string) {
    this.id = id;
  }

  roll(equip: EnhancementItem, config: RollConfig): SoulResult {
    // Soul 邏輯完全獨立，不碰 mainPot / additionalPot
  }
}
```

4. 確認 `EnhancementManager` 不再混雜三種系統，可以刪除或降級為薄薄的 facade。

### 完成條件

- Moe、Cube、Soul 各自有獨立的 class hierarchy
- 三者互不 import 對方的邏輯
- 現有功能行為不變

---

## Phase 6 — UI 層對接 uiType

**目標：** 把 UI 層的 cube 渲染邏輯統一到 `CubeUI.tsx` 的 switch，移除散落的條件判斷。

### 步驟

1. 建立 `src/features/cube-simulator/CubeUI.tsx`：

```tsx
import { BaseCube } from "@/domains/cube/BaseCube";

export const CubeUI = ({ cube }: { cube: BaseCube }) => {
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

2. 把現有各 cube UI component 遷移進 `features/cube-simulator/ui/`。

3. 清除原本散落在各處的 `if (cubeType === 'RESTORE')` 判斷。

### 完成條件

- 新增一種 cube 只需要：新增 class + 新增 UI component + 在 switch 加一個 case
- 不需要動到其他現有 cube 的邏輯

---

## 各 Phase 依賴關係

```
Phase 1 (型別)
    ↓
Phase 2 (EnhancementItem class)
    ↓
Phase 3 (Cube class hierarchy)   ←→   Phase 4 (Manager 純函數化)
    ↓
Phase 5 (Moe / Soul 獨立化)
    ↓
Phase 6 (UI 層 uiType 對接)
```

Phase 3 和 Phase 4 可以平行進行，其他需依序完成。
