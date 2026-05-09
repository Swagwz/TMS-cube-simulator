import type { EquipmentSubcategory } from "@/domains/equipment/equipment.type";
import { EquipManager } from "@/domains/equipment/equipManager";
import { PotManager } from "@/domains/potential/potManager";
import type {
  EquipmentRank,
  PotentialRank,
} from "@/domains/potential/potential.type";
import type { RNG } from "@/domains/random/rng.type";
import { rollWeightedIndex } from "@/utils/rollWeightedIndex";
import type { CubeDefinition, CubeId } from "./cube.type";
import { getCubeDefinition } from "./cube.registry";

type PotentialPoolMap = Record<PotentialRank, { id: string; weight: number }[]>;

export function getScaledRankUpWeights(params: {
  cube: CubeDefinition;
  currentTier: EquipmentRank;
  rankUpMultiplier: number;
}) {
  const rankUpData = params.cube.rankUp?.[params.currentTier];

  if (!rankUpData || rankUpData.length === 0) return [];

  const scaledUpWeights = rankUpData.map((p, index) =>
    index === 0 ? p * params.rankUpMultiplier : p,
  );
  const totalUpWeight = scaledUpWeights.reduce((a, b) => a + b, 0);
  const stayWeight = Math.max(100 - totalUpWeight, 0);

  return [stayWeight, ...scaledUpWeights];
}

export function rollRankUp(params: {
  cube: CubeDefinition;
  currentTier: EquipmentRank;
  rankUpMultiplier: number;
  rng: RNG;
}) {
  const currentTierIndex = PotManager.getIndex(params.currentTier);
  const finalWeights = getScaledRankUpWeights(params);

  if (finalWeights.length === 0) return params.currentTier;

  const selectedIndex = rollWeightedIndex(finalWeights, params.rng);

  return PotManager.indexToRank(
    currentTierIndex + selectedIndex,
  ) as EquipmentRank;
}

export function getShinyCeiling(tier: EquipmentRank) {
  const cube = getCubeDefinition("shinyAdditionalCube");

  if (tier === "legendary") return { ceiling: 0, probIncr: 0, baseProb: 0 };
  const tierKey = tier as Exclude<EquipmentRank, "legendary">;
  return {
    ceiling: cube.ceiling[tierKey],
    probIncr: cube.rankUpIncr[tierKey],
    baseProb: cube.rankUp?.[tierKey]?.[0] ?? 0,
  };
}

export function rollShinyRankUp(
  currentTier: EquipmentRank,
  currentCount: number,
  rng: RNG,
) {
  const cube = getCubeDefinition("shinyAdditionalCube");

  if (currentTier === "legendary") return currentTier;

  const tierKey = currentTier as Exclude<EquipmentRank, "legendary">;
  const ceiling = cube.ceiling[tierKey];
  const rankUpData = cube.rankUp?.[tierKey];
  const incr = cube.rankUpIncr[tierKey];

  if (!rankUpData || rankUpData.length === 0) return currentTier;

  if (currentCount >= ceiling - 1) {
    const currentIndex = PotManager.getIndex(currentTier);
    return PotManager.indexToRank(currentIndex + 1) as EquipmentRank;
  }

  const baseProb = rankUpData[0];
  const currentProb = baseProb + currentCount * incr;
  const isSuccess = rng.next() * 100 < currentProb;

  if (isSuccess) {
    const currentIndex = PotManager.getIndex(currentTier);
    return PotManager.indexToRank(currentIndex + 1) as EquipmentRank;
  }

  return currentTier;
}

export function getCubePotentialPools(
  cubeId: CubeId,
  {
    subcategory,
    level,
  }: {
    subcategory: EquipmentSubcategory;
    level: number;
  },
): PotentialPoolMap {
  const cube = getCubeDefinition(cubeId);
  const feature = cube.apply;

  const getPotentialPool = (rank: PotentialRank) => {
    const rawPool = EquipManager.getRawPotentialList(
      subcategory,
      rank,
      feature,
    );
    return rawPool
      .filter((data) => {
        const weight = data.weights[cubeId];
        const metadata = PotManager.getPotentialMetadata(data.id);
        return weight && level >= metadata.values[0].minLevel;
      })
      .map((data) => ({ id: data.id, weight: data.weights[cubeId]! }));
  };

  return {
    normal: getPotentialPool("normal"),
    rare: getPotentialPool("rare"),
    epic: getPotentialPool("epic"),
    unique: getPotentialPool("unique"),
    legendary: getPotentialPool("legendary"),
  };
}

export function rollPotentialLines(params: {
  cube: CubeDefinition;
  tier: EquipmentRank;
  pools: PotentialPoolMap;
  rng: RNG;
}) {
  const lineRank = params.cube.lineRank[params.tier];
  if (!lineRank) throw new Error("Invalid tier");

  const lineRankArr = lineRank.map((probArr) => {
    const isPrime = rollWeightedIndex(probArr, params.rng) === 0;
    return isPrime ? params.tier : PotManager.getPrev(params.tier);
  });

  let potentialIds = rollPotentialIds(lineRankArr, params.pools, params.rng);

  while (
    !PotManager.validateLineRules(potentialIds) &&
    params.cube.id !== "mirrorCube"
  ) {
    potentialIds = rollPotentialIds(lineRankArr, params.pools, params.rng);
  }

  return potentialIds;
}

function rollPotentialIds(
  lineRanks: PotentialRank[],
  pools: PotentialPoolMap,
  rng: RNG,
) {
  return lineRanks.map((rank) => {
    const pool = pools[rank];
    const rolledIndex = rollWeightedIndex(
      pool.map((p) => p.weight),
      rng,
    );
    return pool[rolledIndex].id;
  });
}
