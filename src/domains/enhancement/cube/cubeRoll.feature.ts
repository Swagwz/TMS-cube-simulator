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
import type {
  CombineCubeRollOutput,
  DirectCubeRollOutput,
  HexaCubeRollOutput,
  PotentialLines,
  RestoreCubeRollOutput,
} from "./cubeSession.type";

export type PotentialPoolMap = Record<
  PotentialRank,
  { id: string; weight: number }[]
>;

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

export function rollRankUpByType(params: {
  cube: CubeDefinition;
  currentTier: EquipmentRank;
  rankUpMultiplier?: number;
  accumulateCount?: number;
  rng: RNG;
}) {
  switch (params.cube.rankUpType) {
    case "none":
      return params.currentTier;
    case "standard":
      return rollRankUp({
        cube: params.cube,
        currentTier: params.currentTier,
        rankUpMultiplier: params.rankUpMultiplier ?? 1,
        rng: params.rng,
      });
    case "accumulate":
      if (params.accumulateCount == null) {
        throw new Error("accumulateCount is required for accumulate rank-up");
      }
      return rollAccumulatedRankUp({
        cube: params.cube,
        currentTier: params.currentTier,
        currentCount: params.accumulateCount,
        rng: params.rng,
      });
  }
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

  return rollAccumulatedRankUp({
    cube,
    currentTier,
    currentCount,
    rng,
  });
}

function rollAccumulatedRankUp(params: {
  cube: CubeDefinition;
  currentTier: EquipmentRank;
  currentCount: number;
  rng: RNG;
}) {
  const { cube, currentTier, currentCount, rng } = params;

  if (!("ceiling" in cube) || !("rankUpIncr" in cube)) {
    throw new Error("accumulate rank-up requires accumulate cube metadata");
  }

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
  if (params.cube.validationType === "none") {
    return rollRawPotentialLines(params);
  }

  return rollValidPotentialLines(params);
}

export function rollRawPotentialLines(params: {
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

  return rollPotentialIds(lineRankArr, params.pools, params.rng);
}

export function rollValidPotentialLines(params: {
  cube: CubeDefinition;
  tier: EquipmentRank;
  pools: PotentialPoolMap;
  rng: RNG;
}) {
  let potentialIds = rollRawPotentialLines(params);

  while (!validatePotentialLinesByType(params.cube, potentialIds)) {
    potentialIds = rollRawPotentialLines(params);
  }

  return potentialIds;
}

export function rollDirectCube(params: {
  cube: CubeDefinition;
  current: PotentialLines;
  pools: PotentialPoolMap;
  rankUpMultiplier?: number;
  accumulateCount?: number;
  rng: RNG;
}): DirectCubeRollOutput {
  const tier = rollRankUpByType({
    cube: params.cube,
    currentTier: params.current.tier,
    rankUpMultiplier: params.rankUpMultiplier,
    accumulateCount: params.accumulateCount,
    rng: params.rng,
  });
  let potentialIds = rollRawPotentialLines({
    cube: params.cube,
    tier,
    pools: params.pools,
    rng: params.rng,
  });
  potentialIds = applyLineEffect({
    cube: params.cube,
    potentialIds,
    rng: params.rng,
  });

  while (!validatePotentialLinesByType(params.cube, potentialIds)) {
    potentialIds = rollRawPotentialLines({
      cube: params.cube,
      tier,
      pools: params.pools,
      rng: params.rng,
    });
    potentialIds = applyLineEffect({
      cube: params.cube,
      potentialIds,
      rng: params.rng,
    });
  }

  return {
    flow: "direct",
    rolled: {
      tier,
      potentialIds,
    },
  };
}

export function rollRestoreCube(params: {
  cube: CubeDefinition;
  current: PotentialLines;
  pools: PotentialPoolMap;
  fixedIndex?: number;
  canFixLine: boolean;
  rankUpMultiplier?: number;
  accumulateCount?: number;
  rng: RNG;
}): RestoreCubeRollOutput {
  const fixedIndex = params.fixedIndex ?? -1;
  validateFixedPotentialIndex(fixedIndex, params.current.potentialIds.length);

  const tier = rollRankUpByType({
    cube: params.cube,
    currentTier: params.current.tier,
    rankUpMultiplier: params.rankUpMultiplier,
    accumulateCount: params.accumulateCount,
    rng: params.rng,
  });
  let potentialIds = rollRestorePotentialIds({
    cube: params.cube,
    tier,
    pools: params.pools,
    originalPotentialIds: params.current.potentialIds,
    fixedIndex,
    canFixLine: params.canFixLine,
    rng: params.rng,
  });

  while (!validatePotentialLinesByType(params.cube, potentialIds)) {
    potentialIds = rollRestorePotentialIds({
      cube: params.cube,
      tier,
      pools: params.pools,
      originalPotentialIds: params.current.potentialIds,
      fixedIndex,
      canFixLine: params.canFixLine,
      rng: params.rng,
    });
  }

  return {
    flow: "restore",
    before: {
      tier: params.current.tier,
      potentialIds: [...params.current.potentialIds],
    },
    after: {
      tier,
      potentialIds,
    },
    fixedIndex,
  };
}

export function rollHexaCube(params: {
  cube: CubeDefinition;
  current: PotentialLines;
  pools: PotentialPoolMap;
  rankUpMultiplier?: number;
  rng: RNG;
}): HexaCubeRollOutput {
  const tier = rollRankUpByType({
    cube: params.cube,
    currentTier: params.current.tier,
    rankUpMultiplier: params.rankUpMultiplier,
    rng: params.rng,
  });
  const potentialIds = rollValidPotentialLines({
    cube: params.cube,
    tier,
    pools: params.pools,
    rng: params.rng,
  });

  return {
    flow: "hexa",
    candidates: {
      tier,
      potentialIds,
    },
  };
}

export function rollCombineSelectedLine(params: { rng: RNG }) {
  return rollWeightedIndex([1, 1, 1], params.rng);
}

export function rollCombinePotentialLine(params: {
  cube: CubeDefinition;
  current: PotentialLines;
  pools: PotentialPoolMap;
  selectedIndex: number;
  rng: RNG;
}) {
  /**
   * Combine cubes can only target one of the three existing potential lines.
   * Valid selectedIndex values are 0, 1, and 2.
   */
  if (
    !Number.isInteger(params.selectedIndex) ||
    params.selectedIndex < 0 ||
    params.selectedIndex > 2
  ) {
    throw new Error("selectedIndex must be a line index between 0 and 2");
  }

  let potentialIds = rollPotentialLineReplacement(params);

  while (!validatePotentialLinesByType(params.cube, potentialIds)) {
    potentialIds = rollPotentialLineReplacement(params);
  }

  return potentialIds[params.selectedIndex]!;
}

export function rollCombineCube(params: {
  cube: CubeDefinition;
  current: PotentialLines;
  pools: PotentialPoolMap;
  targetIndex: number;
  rng: RNG;
}): { output: CombineCubeRollOutput; attempts: number } {
  validateTargetPotentialLineIndex(params.targetIndex);

  let attempts = 1;
  let selectedIndex = rollCombineSelectedLine({ rng: params.rng });

  while (params.targetIndex >= 0 && selectedIndex !== params.targetIndex) {
    attempts += 1;
    selectedIndex = rollCombineSelectedLine({ rng: params.rng });
  }

  return {
    output: {
      flow: "combine",
      step: "rolledLine",
      selectedIndex,
      rolledPotentialId: rollCombinePotentialLine({
        cube: params.cube,
        current: params.current,
        pools: params.pools,
        selectedIndex,
        rng: params.rng,
      }),
    },
    attempts,
  };
}

function rollRestorePotentialIds(params: {
  cube: CubeDefinition;
  tier: EquipmentRank;
  pools: PotentialPoolMap;
  originalPotentialIds: string[];
  fixedIndex: number;
  canFixLine: boolean;
  rng: RNG;
}) {
  const rolledPotentialIds = rollRawPotentialLines({
    cube: params.cube,
    tier: params.tier,
    pools: params.pools,
    rng: params.rng,
  });

  if (!params.canFixLine) return rolledPotentialIds;

  return replaceFixedPotentialLine({
    rolledPotentialIds,
    originalPotentialIds: params.originalPotentialIds,
    fixedIndex: params.fixedIndex,
  });
}

export function applyLineEffect(params: {
  cube: CubeDefinition;
  potentialIds: string[];
  rng: RNG;
}) {
  const potentialIds = [...params.potentialIds];

  switch (params.cube.lineEffect.type) {
    case "none":
      return potentialIds;
    case "mirror": {
      const effect = params.cube.lineEffect;
      const shouldMirror =
        rollWeightedIndex(
          [effect.probability, 100 - effect.probability],
          params.rng,
        ) === 0;

      if (shouldMirror) {
        potentialIds[effect.toIndex] = potentialIds[effect.fromIndex];
      }

      return potentialIds;
    }
  }
}

export function validatePotentialLinesByType(
  cube: CubeDefinition,
  potentialIds: string[],
) {
  switch (cube.validationType) {
    case "none":
      return true;
    case "standard":
      return PotManager.validateLineRules(potentialIds);
  }
}

export function replaceFixedPotentialLine(params: {
  rolledPotentialIds: string[];
  originalPotentialIds: string[];
  fixedIndex: number;
}) {
  validateFixedPotentialIndex(
    params.fixedIndex,
    Math.min(
      params.rolledPotentialIds.length,
      params.originalPotentialIds.length,
    ),
  );

  if (params.fixedIndex < 0) return [...params.rolledPotentialIds];

  const potentialIds = [...params.rolledPotentialIds];
  potentialIds[params.fixedIndex] =
    params.originalPotentialIds[params.fixedIndex];

  return potentialIds;
}

export function validateFixedPotentialIndex(
  fixedIndex: number,
  _lineCount: number,
) {
  validateOptionalSelectionIndex(fixedIndex, "fixedIndex");
}

export function validateTargetPotentialLineIndex(targetIndex: number) {
  validateOptionalSelectionIndex(targetIndex, "targetIndex");
}

function validateOptionalSelectionIndex(index: number, label: string) {
  if (index === -1) return;

  if (!Number.isInteger(index) || index < 0 || index > 2) {
    throw new Error(`${label} must be -1 or a line index between 0 and 2`);
  }
}

function rollPotentialLineReplacement(params: {
  cube: CubeDefinition;
  current: PotentialLines;
  pools: PotentialPoolMap;
  selectedIndex: number;
  rng: RNG;
}) {
  const potentialIds = [...params.current.potentialIds];
  potentialIds[params.selectedIndex] = rollSinglePotentialLineId({
    cube: params.cube,
    tier: params.current.tier,
    pools: params.pools,
    lineIndex: params.selectedIndex,
    rng: params.rng,
  });

  return potentialIds;
}

function rollSinglePotentialLineId(params: {
  cube: CubeDefinition;
  tier: EquipmentRank;
  pools: PotentialPoolMap;
  lineIndex: number;
  rng: RNG;
}) {
  const lineRank = params.cube.lineRank[params.tier];
  if (!lineRank) throw new Error("Invalid tier");

  const rankWeights = lineRank[params.lineIndex];
  if (!rankWeights) throw new Error("Invalid line index");

  const isPrime = rollWeightedIndex(rankWeights, params.rng) === 0;
  const rank = isPrime ? params.tier : PotManager.getPrev(params.tier);
  const pool = params.pools[rank];
  const rolledIndex = rollWeightedIndex(
    pool.map((p) => p.weight),
    params.rng,
  );

  return pool[rolledIndex].id;
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
