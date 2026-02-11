import type { EquipmentRank } from "@/domains/potential/potential.type";
import type { EhmMetadata } from "../enhancement.type";
import type { PotentialFeature } from "@/domains/equipment/equipment.type";

type CubeCommon = EhmMetadata & {
  apply: PotentialFeature;

  rankUp: Partial<Record<EquipmentRank, number[]>> | null;
  lineRank: Partial<Record<EquipmentRank, number[][]>>;
  minApplyTier?: EquipmentRank;
  maxApplyTier?: EquipmentRank;
};

type RegularCube = CubeCommon & {
  id: Exclude<CubeId, "shinyAdditionalCube" | "mirrorCube">;
};

type ShinyCube = CubeCommon & {
  id: "shinyAdditionalCube";
  rankUpIncr: Record<Exclude<EquipmentRank, "legendary">, number>;
  ceiling: Record<Exclude<EquipmentRank, "legendary">, number>;
};

type MirrorCube = CubeCommon & {
  id: "mirrorCube";
  mirrorProb: number;
};

export type CubeItem = RegularCube | ShinyCube | MirrorCube;

export type CubeApplicationType = PotentialFeature;

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

export type RelationItemId = "fixPotential";

export type RelationItem = EhmMetadata & {
  id: RelationItemId;
  apply: PotentialFeature;
};
