import type { EquipmentRank, PotentialRank } from "../potential/potential.type";

export type CubeId = MainCubeId | AdditionalCubeId;

export type MainCubeId =
  | "restoreCube"
  | "hexaCube"
  | "combineCube"
  | "equalCube"
  | "mirrorCube"
  | "craftsmanCube"
  | "masterCraftsmanCube";

export type AdditionalCubeId =
  | "additionalCube"
  | "restoreAdditionalCube"
  | "shinyAdditionalCube"
  | "absAdditionalCube"
  | "combineAdditionalCube";

/**
 * UI 類型識別：用於決定渲染哪種方塊介面
 */
export type CubeUIType =
  | "restore" // 可選前後（恢復方塊類）
  | "direct" // 直接洗（工匠、名匠、對等類）
  | "combine" // 先隨機某排再決定（結合方塊類）
  | "hexa" // 6 選 3（閃炫方塊類）
  | "accumulate"; // 累加型跳框（閃亮方塊類）

export type ShinyPity = Record<Exclude<EquipmentRank, "legendary">, number>;

export type RankUpOptions = number | ShinyPity;

export type CubePools = Record<PotentialRank, { id: string; weight: number }[]>;

/**
 * 抽潛能結果介面
 */
export interface PotentialResult {
  lines: string[]; // 潛能 ID 列表
  tier: EquipmentRank;
}
