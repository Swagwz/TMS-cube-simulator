import type { StatusField } from "../../potential/potential.type";
import type { EhmMetadata } from "../enhancement.type";

export type SoulId = "wuGongJewel";

export type SoulItem = EhmMetadata & {
  id: SoulId;
  apply: "soul";
};

export type SoulEntry = {
  id: string;
  weight: number;
  name: string;
  template: string;
  field: StatusField | null;
  values: {
    minLevel: number;
    x: number;
    y?: number;
  }[];
};
