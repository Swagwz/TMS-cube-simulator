import { rollWeightedIndex } from "@/utils/rollWeightedIndex";
import { SOUL_POTENTIAL_ID_MAP, SOUL_POTENTIAL_SOURCE } from "./soul.data";
import { SOUL_METADATA_MAP } from "./soul.config";
import formatTemplate from "@/utils/formatTemplate";
import type { SoulId } from "./soul.type";

export const SoulManager = {
  getItem(id: string) {
    const meta = SOUL_METADATA_MAP.get(id as SoulId);
    if (!meta) throw new Error("Invalid soul id");
    return meta; // Returns undefined if not found, which is fine for the aggregator
  },
  getLine(id: string, level: number) {
    const data = SOUL_POTENTIAL_ID_MAP.get(id);
    if (!data) throw new Error("Invalid soul pot id");

    const { template, values } = data;
    for (let i = values.length - 1; i >= 0; i--) {
      const { minLevel, x, y } = values[i];
      if (level < minLevel) continue;
      return formatTemplate(template, { x, y });
    }
    return template;
  },
  getPotPool() {
    const pool = SOUL_POTENTIAL_SOURCE.map(({ id, weight }) => ({
      id,
      weight,
    }));
    const totalWeight = pool.reduce((acc, curr) => acc + curr.weight, 0);
    return pool.map(({ id, weight }) => ({
      id,
      weight: weight,
      prob: (weight / totalWeight) * 100,
    }));
  },
  rollPot(pool: { id: string; weight: number }[]) {
    const rstIndex = rollWeightedIndex(pool.map(({ weight }) => weight));
    return pool[rstIndex].id;
  },
};
