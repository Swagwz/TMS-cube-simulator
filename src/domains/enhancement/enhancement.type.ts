import type { CompanionItemId } from "../companion/type";
import type { CubeId } from "../cube/type";
import type { MoeCubeId } from "./moe/moe.type";
import type { SoulId } from "../soul/soul.type";
import type { PotentialFeature } from "@/domains/equipment/equipment.type";

type CommonMeta = {
  name: string;
  description: string;
  imagePath: string;
  price: number;
  discount: number;
};

type FeatureMeta =
  | {
      id: CubeId | CompanionItemId;
      apply: PotentialFeature;
    }
  | {
      id: MoeCubeId;
      apply: "moe";
    }
  | {
      id: SoulId;
      apply: "soul";
    };

export type EhmMetadata = CommonMeta & FeatureMeta;

export type EhmId = CubeId | SoulId | MoeCubeId | CompanionItemId;

export type EhmSystemType = "equipment" | "moe";
