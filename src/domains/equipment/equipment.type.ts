import type { CubeId } from "../cube/type";
import type { SoulId } from "../enhancement/soul/soul.type";

export type EquipmentMetadata = {
  name: string;
  subcategory: EquipmentSubcategory;
  category: EquipmentCategory;
  features: EquipmentFeature[];
  commonLevels: number[];
  isFixedLevel: boolean;
};

export type EquipmentSubcategory =
  | "destiny-weapon"
  | "primary-weapon"
  | "secondary-weapon"
  | "secondary-weapon-other"
  // | "shield"
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

export type EquipmentFeature = "mainPot" | "additionalPot" | "soul";

export type PotentialFeature = Extract<
  EquipmentFeature,
  "mainPot" | "additionalPot"
>;

export type EquipmentApplicableEhmId = CubeId | SoulId;
