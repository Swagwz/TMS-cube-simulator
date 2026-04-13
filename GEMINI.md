# TMS Cube Simulator - 開發與架構指南

## 🚀 技術棧 (Technology Stack)

- **核心:** React 19 (Vite) + TypeScript
- **狀態管理:** Valtio (instance 響應式)
- **樣式:** Tailwind CSS 4 + Shadcn UI
- **部署:** Cloudflare Workers (SPA 模式)

---

## 📂 目錄結構 (Directory Structure)

```
src/
  domains/
    cube/
      BaseCube.ts              ← 核心領域引擎 (SSoT)
      [CubeId].ts              ← 具體實例類別 (各方塊獨立邏輯)
      CubeRegistry.ts          ← 統一管理所有方塊清單
    equipment/
      EnhancementItem.ts       ← 裝備領域物件
    potential/
      potManager.ts            ← 潛能解析與驗證
    shared/
      types.ts                 ← 全局 Interface
```

---

## 🏗 核心架構模式 (Architectural Patterns)

### 1. Cube-as-SSoT (Source of Truth)
每個方塊皆為一個獨立的 Class，元數據（Metadata）、機率配置（RankUp, LineRank）與業務邏輯（roll 行為）皆封裝在該 Class 內。
- **BaseCube**: 提供通用的數學運算方法（如升階判定 `rollRankUp`、抽排 `rollLines`）。
- **具體實例類別**: 定義自身數據，確保單一真理來源。

### 2. UI 分類策略
- **Resolver Pattern**: UI 層使用 `Map` 物件作為 `EnhancerResolver`，將 `cubeId` 直接映射至對應的強化組件，消除了龐大的 `switch-case` 邏輯。
- **類型共用**: 對於行為標準的方塊，使用 `uiType` 映射至通用渲染組件，提升 UI 復用性。

### 3. Registry 管理
- 使用 `CubeRegistry` 集中維護方塊實例清單，UI 層透過 ID 查找或依類型篩選，不直接依賴 JSON 配置檔。

---

## 📏 開發規範 (Development Standards)

- **SSoT 原則**: 方塊機率、行為邏輯皆封裝於具體 Class 中。
- **架構追蹤**: 所有重構與架構演進計畫皆詳列於 `refactor.md`，開發時務必參考該清單以確保邏輯一致性。
- **參數傳遞**: 廢除 `RollContext`，改採直接傳遞必要參數 (multiplier, pools, ...args)，以確保 Interface 靈活且符合各類別特徵。
- **狀態封裝**: 具備內部狀態的方塊 (如 ShiningCube) 使用 `proxy()`，無狀態引擎方塊直接 `new`。
