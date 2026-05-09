import type { EquipmentRank } from "@/domains/potential/potential.type";
import type { EnhancementItemBase } from "../enhancement.type";
import type { EquipmentPotentialSlot } from "@/domains/equipment/equipment.type";

type CubeCommon = EnhancementItemBase & {
  id: CubeId;
  apply: EquipmentPotentialSlot;
  workflow: CubeWorkflow;
  rankUpType: CubeRankUpType;
  validationType: CubeValidationType;
  lineEffect: CubeLineEffect;

  rankUp: Partial<Record<EquipmentRank, number[]>> | null;
  lineRank: Partial<Record<EquipmentRank, number[][]>>;
};

type RegularCube = CubeCommon & {
  id: Exclude<CubeId, "shinyAdditionalCube">;
};

type ShinyCube = CubeCommon & {
  id: "shinyAdditionalCube";
  rankUpIncr: Record<Exclude<EquipmentRank, "legendary">, number>;
  ceiling: Record<Exclude<EquipmentRank, "legendary">, number>;
};

export type CubeDefinition = RegularCube | ShinyCube;

export type CubeApplicationType = EquipmentPotentialSlot;
export type CubeWorkflow = "direct" | "restore" | "hexa" | "combine";
export type CubeRankUpType = "standard" | "accumulate" | "none";
export type CubeValidationType = "standard" | "none";
export type CubeLineEffect =
  | {
      type: "none";
    }
  | {
      type: "mirror";
      probability: number;
      fromIndex: 0;
      toIndex: 1;
    };

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
