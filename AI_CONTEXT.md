# Project Context: MapleStory Cube Simulator

## 1. Project Overview

這是一個楓之谷 (MapleStory) 的方塊模擬器專案，旨在模擬裝備強化、潛能洗鍊等機制。

## 2. Tech Stack

- **Framework**: React (vite), TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui (Radix UI based), Lucide React (Icons)
- **State Management**: React Hooks + Context (Local State preferred for UI) + zustand (Global State)

## 3. Architecture (Feature-Sliced Design Inspired)

專案採用 **Domain** 與 **Feature** 分離的架構：

### `src/domains/` (Core Logic)

- 存放純粹的業務邏輯、資料模型、計算公式。
- **不包含** 任何 React UI 程式碼。
- 例如：`CubeManager` (方塊邏輯), `EquipManager` (裝備邏輯)。

### `src/features/` (UI Slices)

- 存放具體的 UI 功能模組。
- 包含該功能所需的 Components, Local State, Dialogs。
- 資料透過 Hooks 從 Domains 獲取。
- 結構：`src/features/<FeatureName>/<SubFeature>/`
  - 例：`src/features/workbench/manual/EquipManual.tsx`

### `src/components/` (Shared UI)

- **layout/**: 全域佈局元件 (Navbar, Footer)。
- **ui/**: 通用基礎元件 (Button, Dialog, Sheet)。
- **potential/**: 潛能相關顯示元件 (PotentialLineBadge)。

## 4. Coding Conventions

- **Naming**:
  - Components: `PascalCase` (e.g., `EquipManual.tsx`)
  - Folders in features: `camelCase` preferred (e.g., `features/workbench`).
  - Hooks: `useCamelCase` (e.g., `useActiveItem`).
- **Scalability**:
  - 避免在 JSX 中使用過多巢狀的三元運算子 (Nested Ternaries)。
  - 遇到多種 Tab 或狀態渲染時，優先使用 `switch` case 或 Dictionary Mapping (`Record<Key, Component>`) 以利擴充。
- **Imports**: 使用 `@/` path alias。

## 5. Specific Rules

- **Navbar**: 位於 `src/components/layout/Navbar.tsx`，在大螢幕時使用 `container` 置中。
- **EquipManual**: 負責顯示裝備潛能與操作介面，透過 `PotDisplayBox` 顯示潛能列表。

## 6. AI Instructions

- 當重構程式碼時，請優先考慮未來的擴充性 (Scalability)。
- 修改 UI 時，請保持 Tailwind class 的簡潔與一致性。
- 盡量保持 `domains` 邏輯與 `features` UI 的分離。

## 7. Architecture & Data Flow

### Data Management (Settings)

- **Creation**: 使用者在 Settings 介面新增實體 (Moe/Equipment)。
- **Storage**: 資料存入 `useMoeStore` 或 `useEquipmentStore`。
- **Display**: 透過 `instanceIds` 與 `instanceMap` 在 Table 中渲染列表。

### Feature Interaction (Enhancement)

- **Selection**: 點擊 Table 項目時，更新 `useActiveStore` 的 `activeState`。
- **Operation Flow**:
  1. **Target Selection**: 使用者選擇要強化的屬性 (Main Potential / Additional Potential / Soul)。
  2. **Cube Selection**: 系統根據屬性顯示可用方塊，使用者選擇特定方塊。
  3. **Execution**: 按下開始後，彈出 Enhancing Dialog 進行模擬與結果顯示。
