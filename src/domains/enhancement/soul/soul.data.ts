import soulPot from "@/data/soul.json";
import type { SoulEntry } from "./soul.type";

export const SOUL_POTENTIAL_SOURCE = soulPot as SoulEntry[];

export const SOUL_POTENTIAL_ID_MAP = new Map<string, SoulEntry>(
  SOUL_POTENTIAL_SOURCE.map((data) => [data.id, data]),
);
