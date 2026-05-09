import type { EquipmentRank } from "@/domains/potential/potential.type";
import type { EnhancementItemBase } from "../enhancement.type";
import type { EquipmentPotentialSlot } from "@/domains/equipment/equipment.type";

type CubeCommon = EnhancementItemBase & {
  id: CubeId;
  apply: EquipmentPotentialSlot;

  rankUp: Partial<Record<EquipmentRank, number[]>> | null;
  lineRank: Partial<Record<EquipmentRank, number[][]>>;
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

export type CubeDefinition = RegularCube | ShinyCube | MirrorCube;

export type CubeApplicationType = EquipmentPotentialSlot;

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

export type CubeCompanionItemId = "fixPotential";

export type CubeCompanionItem = EnhancementItemBase & {
  id: CubeCompanionItemId;
};
