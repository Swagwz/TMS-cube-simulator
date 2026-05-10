import type { EquipmentSubcategory } from "@/domains/equipment/equipment.type";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import { useAccountStore } from "@/store/useAccountStore";
import type { CubeApplicationType, CubeId } from "./cube.type";
import {
  getApplicableCubeDefinitions,
  getCubeCompanionItems,
  getCubeDefinition,
} from "./cube.registry";
import {
  getCubePotentialPools,
  getScaledRankUpWeights,
  getShinyCeiling,
} from "./cubeRoll.feature";

// TODO: shrink this facade after probability search and auto-roll move to registry / feature helpers directly.
export const CubeManager = {
  getItem<T extends CubeId>(cubeId: T) {
    return getCubeDefinition(cubeId);
  },
  getCubeItem<T extends CubeId>(cubeId: T) {
    return getCubeDefinition(cubeId);
  },
  getApplicableCubes(
    applyType: CubeApplicationType,
    currentTier: EquipmentRank,
  ) {
    return getApplicableCubeDefinitions(applyType, currentTier);
  },
  getRelatedItems(cubeId: string) {
    return getCubeCompanionItems(cubeId);
  },
  getCompanionItems(cubeId: string) {
    return getCubeCompanionItems(cubeId);
  },
  getScaledRankUpWeights(
    cubeId: Exclude<CubeId, "shinyAdditionalCube">,
    currTier: EquipmentRank,
    multiplier?: number,
  ) {
    const finalMultiplier =
      multiplier ?? useAccountStore.getState().rankUpMultiplier;
    return getScaledRankUpWeights({
      cube: this.getItem(cubeId),
      currentTier: currTier,
      rankUpMultiplier: finalMultiplier,
    });
  },
  getShinyCeiling(tier: EquipmentRank) {
    return getShinyCeiling(tier);
  },
  getCubePotentialPools(
    cubeId: CubeId,
    {
      subcategory,
      level,
    }: {
      subcategory: EquipmentSubcategory;
      level: number;
    },
  ) {
    return getCubePotentialPools(cubeId, { subcategory, level });
  },
};
