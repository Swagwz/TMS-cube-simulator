import type { CubeId } from "../cube/type";
import type { EquipmentSubcategory } from "../equipment/equipment.type";
import { STATUS_FIELDS } from "./potential.config";

export type StatusField = (typeof STATUS_FIELDS)[number]["field"] | null;

export type PotentialRank = "normal" | "rare" | "epic" | "unique" | "legendary";

export type EquipmentRank = Exclude<PotentialRank, "normal">;

export type PotentialValue = {
  minLevel: number;
  x: number;
  y?: number;
};

export type PotentialMetadata = PotentialItemConfig &
  Omit<PotentialRegistry[string], "main" | "additional"> & { name: string };

export type PotentialItemConfig = {
  id: string;
  type: string;
  rank: PotentialRank;
  values: PotentialValue[];
  overrides?: Partial<Record<EquipmentSubcategory, PotentialValue[]>>;
};

export type PotentialRegistry = Record<
  string,
  {
    main: PotentialItemConfig[];
    additional: PotentialItemConfig[];
    template: string;
    field: StatusField | null;
    limit?: { key: string; max: number };
  }
>;

export type PotentialWeightData = {
  id: string;
  weights: Record<CubeId, number | null>;
};

export type PotentialWeightGroup = {
  apply: EquipmentSubcategory[];
  data: PotentialWeightData[];
};

export type PotentialWeightRegistry = Record<
  PotentialRank,
  PotentialWeightGroup[]
>;
