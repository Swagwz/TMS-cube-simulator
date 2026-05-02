import { rollWeightedIndex } from "@/utils/rollWeightedIndex";
import { SOUL_POTENTIAL_ID_MAP, SOUL_POTENTIAL_SOURCE } from "./soul.data";
import formatTemplate from "@/utils/formatTemplate";

export const SoulManager = {
  getPotentialMetadata(id: string) {
    const data = SOUL_POTENTIAL_ID_MAP.get(id);
    if (!data) throw new Error("Invalid soul pot id");
    return data;
  },
  getLine(id: string, level: number) {
    const data = this.getPotentialMetadata(id);

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
