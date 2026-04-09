# TMS Cube Simulator - 開發與架構指南

## 🚀 技術棧 (Technology Stack)

- **核心:** React 19 (Vite) + TypeScript
- **狀態管理:** Zustand + Immer (處理深層裝備數據更新)
- **樣式:** Tailwind CSS 4 + Shadcn UI
- **部署:** Cloudflare Workers (SPA 模式)

## 📂 目錄結構 (Directory Structure)

- `src/domains/`: 核心業務邏輯。
  - `enhancement/`: 強化行為（方塊 `cube/`、萌獸 `moe/`、武公 `soul/`）。
  - `potential/`: 潛能資料解析與規則檢查。
  - `equipment/`: 裝備元數據與過濾邏輯。
- `src/features/`: 功能模組（UI + 局部邏輯）。
- `src/store/`: 全域狀態（裝備列表、帳號設定）。
- `src/data/`: 靜態資料（JSON 權重與潛能清單）。

## 🏗 核心架構模式 (Architectural Patterns)

### 1. 管理者模式 (Manager Pattern)

所有模擬邏輯（如隨機、過濾、數值解析）都封裝在 `Manager` 物件中。

- `PotManager`: 處理潛能 ID 到顯示文字的解析，以及行數限制 (Line Rules)。
- `CubeManager`: 處理跳框、潛能抽取、機率加倍。
- `EquipManager`: 根據裝備分類（如：單手劍、披風）過濾合法潛能池。

### 2. 資料驅動 (Data-Driven)

潛能與機率權重完全由 `src/data` 的 JSON 檔案驅動。

---

## ⚠️ 核心耦合與技術債 (Critical Couplings & Technical Debt)

### 1. 強化道具 (EnhancementItem) 的混雜性

`EnhancementManager` 目前整合了多種不同性質的強化：

- **一般/附加方塊:** 影響 `mainPot` 或 `additionalPot` 整個屬性包。
- **特定屬性鎖定 (如: 恢復方塊):** 依賴於 `localData` 的特定 Index 鎖定。
- **武公寶珠 (Soul):** 雖然也被視為一種「強化項目」，但它影響的是獨立的 `soul` 欄位，與潛能系統的機率權重邏輯完全不同。
- **萌獸方塊:** 邏輯與裝備方塊高度相似，但卻擁有完全獨立的 `MoeManager` 與資料結構，存在程式碼重複。

### 2. 數據與邏輯的高度綁定

- **JSON 結構依賴:** `CubeManager` 依賴 JSON 檔案中必須包含特定的 `CubeID` 字串。若要新增一個方塊，必須同步更新多個權重 JSON (如 `normal.json`, `additional.json`)，否則會報錯。
- **Subcategory 映射:** `EquipManager` 內部的過濾邏輯與潛能 JSON 內的 `apply` 欄位必須完全吻合，這使得新增裝備類型時極易出錯。

### 3. Domain 層對 Store 的依賴

- **狀態洩漏:** 部分 Manager (如 `CubeManager`) 直接存取 `useAccountStore` 以取得加倍倍率。這使得領域邏輯不再是純函數，增加了單元測試的困難度。

### 4. 潛能解析邏輯碎片化

- 潛能從「ID」到最終「顯示文字」的過程經過了 `PotManager`、`formatTemplate`、以及 `utils` 內的多個步驟，追蹤與修改顯示格式較為困難。

---

## 📏 開發規範 (Development Standards)

- **純粹化 Manager:** 盡可能將 Manager 寫成純函數，透過參數傳入所需的全域配置。
- **類型安全:** 避免在 `domains` 層使用 `any`。所有與遊戲數據相關的邏輯必須有對應的 TypeScript Interface。
- **重構優先:** 在新增功能前，優先考慮是否能將現有的冗餘邏輯（如萌獸與裝備方塊）抽象化。
