import moePot from "@/data/moePot.json";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import type { MoePotentialEntry, MoeRegistry } from "./moe.type";

export const MOE_POTENTIAL_SOURCE = moePot as MoeRegistry;

export const MOE_POTENTIAL_ID_MAP = new Map<
  string,
  MoePotentialEntry & { type: MoeCardSubcategory }
>(
  (
    Object.entries(MOE_POTENTIAL_SOURCE) as [
      MoeCardSubcategory,
      MoePotentialEntry[],
    ][]
  ).flatMap(([type, pots]) => pots.map((pot) => [pot.id, { ...pot, type }])),
);
