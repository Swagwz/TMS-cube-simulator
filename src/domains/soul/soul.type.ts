import type { StatusField } from "../potential/potential.type";

export type SoulId = "wuGongJewel";

export interface SoulMetadata {
  id: SoulId;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

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
