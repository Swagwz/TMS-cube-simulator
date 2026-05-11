import type { RNG } from "@/domains/random/rng.type";
import { rollWeightedIndex } from "@/utils/rollWeightedIndex";

export type SoulPotentialPoolEntry = {
  id: string;
  weight: number;
};

export function rollSoulPotential(params: {
  pool: SoulPotentialPoolEntry[];
  rng: RNG;
}) {
  const index = rollWeightedIndex(
    params.pool.map((entry) => entry.weight),
    params.rng,
  );

  return params.pool[index]!.id;
}
