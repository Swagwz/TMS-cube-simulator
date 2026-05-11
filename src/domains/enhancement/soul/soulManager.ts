import { SOUL_LIST, SOUL_METADATA_MAP } from "./soul.config";
import { SOUL_POTENTIAL_ID_MAP, SOUL_POTENTIAL_SOURCE } from "./soul.data";
import formatTemplate from "@/utils/formatTemplate";
import type { SoulId } from "./soul.type";

export const SoulManager = {
  isItem(id: string): id is SoulId {
    return SOUL_METADATA_MAP.has(id as SoulId);
  },
  getItems() {
    return SOUL_LIST;
  },
  getDefaultItemId() {
    const item = SOUL_LIST[0];
    if (!item) throw new Error("No soul items configured");
    return item.id;
  },
  getItem(id: string) {
    const meta = SOUL_METADATA_MAP.get(id as SoulId);
    if (!meta) throw new Error("Invalid soul id");
    return meta;
  },
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
      weight,
      prob: (weight / totalWeight) * 100,
    }));
  },
};
