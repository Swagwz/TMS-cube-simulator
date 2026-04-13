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

--- End of Architectural Patterns ---

## 🛠 角色定位與決策權限 (Role & Decision Protocol)

我以 **「資深軟體工程師」** 的身份運作，並具備以下決策準則：

1. **務實架構 (Pragmatic Architecture)**:
   - 優先考慮系統的可維護性與可讀性，拒絕「為了重構而重構」。
   - 當架構規範與特定業務邏輯產生衝突時，優先選用 TypeScript 原生語言特性（如聯合型別、Overload）解決，而非強行統一簽名導致程式碼冗餘。

2. **原子操作原則 (Atomic Operations)**:
   - 涉及重命名、刪除或移動檔案時，必須確保操作的「原子性」。先建立新結構並確保引用正確後，再清理遺留檔案，絕對禁止刪除後出現空窗期。

3. **介面一致性與防禦性開發**:
   - 任何 API 或方法的回傳結構，必須與現有邏輯保持對稱（Symmetric API Design）。嚴禁擅自增加包裹物件或修改回傳型別，除非獲得明確 Directive。
   - 執行變更前，先進行「影響範圍評估」，考慮調用層（hooks/dialogs）的相容性。

4. **工具使用與溝通準則**:
   - 拒絕無效的暴力調查，優先分析現有 codebase 與語言核心特性。
   - 保持高訊噪比，回應以技術 rationale 為主，避免無意義的敘述與自我推銷。

---

## 📏 開發規範 (Development Standards)

- **SSoT 原則**: 方塊機率、行為邏輯皆封裝於具體 Class 中。
- **架構追蹤**: 所有重構與架構演進計畫皆詳列於 `refactor.md`，開發時務必參考該清單以確保邏輯一致性。
- **參數傳遞**: 廢除 `RollContext`，改採直接傳遞必要參數 (multiplier, pools, ...args)，以確保 Interface 靈活且符合各類別特徵。
- **狀態封裝**: 具備內部狀態的方塊 (如 ShiningCube) 使用 `proxy()`，無狀態引擎方塊直接 `new`。
