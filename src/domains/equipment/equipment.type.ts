import type { CompanionItemId } from "../companion/type";
import type { CubeId, CubeUIType } from "../cube/type";
import type { SoulId } from "../soul/soul.type";

/**
 * 裝備強化能力清單：定義該裝備支援哪些強化系統
 */
export interface EquipmentCapabilities {
  starforce: boolean;
  starflame: boolean;
  mainPot: boolean;
  additionalPot: boolean;
  soul: boolean;
  scroll: boolean;
}

/**
 * 裝備基礎屬性
 */
export interface BaseStats {
  str?: number;
  dex?: number;
  int?: number;
  luk?: number;
  hp?: number;
  mp?: number;
  attack?: number;
  magic?: number;
  defense?: number;
  speed?: number;
  jump?: number;
  bossDamage?: number;
  ignoreDefense?: number;
  allStat?: number;
}

/**
 * 裝備強化項目的 ID 聚合 (SSoT)
 */
export type EnhancementItemId = CubeId | CompanionItemId | SoulId;

/**
 * 裝備強化 UI 類型聚合
 */
export type EnhancementUIType =
  | CubeUIType
  | "scroll"
  | "starforce"
  | "starflame";

export type EquipmentMetadata = {
  name: string;
  subcategory: EquipmentSubcategory;
  category: EquipmentCategory;
  commonLevels: number[];
  isFixedLevel: boolean;
  baseStats: BaseStats;
  capabilities?: Partial<EquipmentCapabilities>;
};

export type EquipmentSubcategory =
  | "destiny-weapon"
  | "primary-weapon"
  | "secondary-weapon"
  | "secondary-weapon-other"
  | "emblem"
  | "hat"
  | "overall"
  | "top"
  | "bottom"
  | "shoes"
  | "gloves"
  | "cape"
  | "shoulder"
  | "belt"
  | "ring"
  | "pendant"
  | "earrings"
  | "face"
  | "eye"
  | "badge"
  | "heart";

export type EquipmentCategory = "weapon" | "armor" | "accessory" | "other";

export type EquipmentFeature = keyof EquipmentCapabilities;

export type PotentialFeature = Extract<
  EquipmentFeature,
  "mainPot" | "additionalPot"
>;
