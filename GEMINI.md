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
      abstract/                ← 行為抽象層 (Direct, Restore, Accumulate, Combine, Hexa)
      [CubeId].ts              ← 具體實例類別 (SSoT)，封裝 metadata 與行為
      CubeFactory.ts           ← 工廠模式，建立方塊實例
    ...
```

---

## 🏗 核心架構模式 (Architectural Patterns)

### 1. Cube-as-SSoT (Source of Truth)

不再依賴外部設定檔 (`cube.config.ts`)。每個方塊（例如 `CraftsmanCube`, `ShinyAdditionalCube`）皆為一個獨立的 Class，元數據（Metadata）、機率配置（RankUp, LineRank）與業務邏輯（roll 行為）皆封裝在該 Class 內。

- **`BaseCube`**: 定義抽象基底，提供通用的數學運算方法（如升階判定 `rollRankUp`、權重計算 `getScaledRankUpWeights`）。
- **抽象行為層 (`abstract/`)**: 封裝 UI 模式（Direct, Restore, Accumulate, Combine, Hexa），處理重複的 `roll` 流程。
- **具體實例類別**: 繼承抽象層，定義自身特有的數據與規則，確保單一真理來源。

### 2. 數據與邏輯封裝

所有強化道具行為皆封裝在 `domains/cube/`：

```ts
// 範例：CraftsmanCube.ts
export class CraftsmanCube extends AbstractDirectCube {
  readonly cubeId = "craftsmanCube";
  readonly name = "工匠方塊";
  readonly rankUp = { ... };
  readonly lineRank = { ... };
  // roll 邏輯由抽象層 AbstractDirectCube 提供
}
```

### 3. Factory Pattern

使用 `CubeFactory` 統一管理方塊實例的創建與列表取得。外部組件透過 `CubeFactory.getCube(id)` 獲取實例，不直接讀取配置 JSON。

---

## 📏 開發規範 (Development Standards)

- **Class 純粹性:** Class 只封裝領域邏輯與自身狀態，不 import React、不 import store
- **SSoT 原則:** 每個方塊的機率、描述、行為皆封裝於該方塊的 class 中，拒絕散落的 config 檔案。
- **類型安全:** `domains/` 層禁止使用 `any`，所有遊戲數據必須有對應 TypeScript Interface。
- **擴充原則:** 新增強化系統只需新增對應的 Class 與 UI Component，不修改現有邏輯。
