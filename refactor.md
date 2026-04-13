# Refactor 狀態紀錄與計畫

## ✅ 已完成重構項目

### 1. 領域模型架構重組 (Cube-as-SSoT)
- [x] **SSoT 封裝**: 移除 `cube.config.ts` 與 `cubeManager.ts`，將機率數據與邏輯完整封裝至具體方塊類別 (`Concrete Cube Classes`)。
- [x] **BaseCube 引擎化**: 整合機率運算、抽排邏輯於 `BaseCube`，作為領域層的執行引擎。
- [x] **行為繼承體系**: 移除冗餘的 `abstract/` 中間層，邏輯回歸 `BaseCube` 或直接實作於具體類別。
- [x] **Proxy 單例化**: 除了 ShiningCube，其餘無狀態方塊皆移除 `proxy()`，提升效能。
- [x] **Registry 管理**: 建立 `CubeRegistry` 統一維護所有方塊實例。

# Refactor 狀態紀錄與計畫

## ✅ 已完成重構項目

### 1. Cube 領域模型 (Cube-as-SSoT)
- [x] **SSoT 封裝**: 移除 `cube.config.ts` 與 `cubeManager.ts`。
- [x] **BaseCube 引擎化**: 統一強化計算引擎。
- [x] **Proxy 單例化**: 完成所有 Cube 的 Class 封裝與 `proxy` 單例化。
- [x] **Registry 管理**: 建立 `CubeRegistry`。

## 🚧 待處理事項 (Refactor Roadmap)

### 1. 核心 Domain Object Class 化 (領域封裝 Phase)
- [ ] **Equipment 封裝**: 將 `Equipment` 相關數據與邏輯封裝為 Domain Class，確保強化流程與計算方法內聚。
- [ ] **Moe 封裝**: 完成 `BaseMoeCube` 及其子類的 SSoT 化，移除對舊配置的依賴。
- [ ] **Soul 封裝**: 封裝 `Soul` 系統，確保 `WuGongJewel` 等邏輯符合 Class 封裝規範。

### 2. 領域引擎清理 (Clean-up Phase)
- [ ] **移除舊依賴**: 刪除 `cube.config.ts`, `cubeManager.ts` 以及任何已廢棄的舊領域 Manager/Config。
- [ ] **優化 Base 類別**: 確保所有 Domain Class 繼承自對應的抽象基礎。

### 3. UI 層重構 (Integration Phase)
- [ ] **導入 Resolver Pattern**: 建立 `EnhancerResolver`。
- [ ] **Enhancer 組件瘦身**: 徹底解耦 UI 與 Domain 邏輯。
- [ ] **遷移調用**: 將 `useEnhancer` Hooks 改為直接調用 Domain Class 方法。

### 4. 測試與驗證 (Verification Phase)
- [ ] **單元測試**: 確保類別封裝後的邏輯與原始行為一致。
