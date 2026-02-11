import type { StatusField } from "@/domains/potential/potential.type";
import type { EhmMetadata } from "../enhancement.type";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";

export type MoeCubeId = "moeCube" | "moeRestore";

export type MoeCubeMetadata = EhmMetadata & {
  id: MoeCubeId;
  apply: "moe";
};

export type MoePotentialEntry = {
  id: string;
  name: string;
  weights: Record<MoeCubeId, number>;
  template: string;
  value: { x: number; y?: number };
  field: StatusField;
};

export type MoeRegistry = Record<MoeCardSubcategory, MoePotentialEntry[]>;
