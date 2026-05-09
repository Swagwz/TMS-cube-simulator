import type { EquipmentSubcategory } from "@/domains/equipment/equipment.type";
import type { CubeApplicationType, CubeId } from "./cube.type";
import type {
  EquipmentRank,
  PotentialRank,
} from "@/domains/potential/potential.type";
import { useAccountStore } from "@/store/useAccountStore";
import {
  getApplicableCubeDefinitions,
  getCubeCompanionItems,
  getCubeDefinition,
} from "./cube.registry";
import {
  getCubePotentialPools,
  getScaledRankUpWeights,
  getShinyCeiling,
  rollPotentialLines,
  rollRankUp,
  rollShinyRankUp,
} from "./cubeRoll.feature";

export const CubeManager = {
  getItem<T extends CubeId>(cubeId: T) {
    return getCubeDefinition(cubeId);
  },
  getCubeItem<T extends CubeId>(cubeId: T) {
    return getCubeDefinition(cubeId);
  },
  /** 根據使用類型與當前裝備等級，回傳可用的方塊列表 */
  getApplicableCubes(
    applyType: CubeApplicationType,
    currentTier: EquipmentRank,
  ) {
    return getApplicableCubeDefinitions(applyType, currentTier);
  },
  /** 取得與該方塊相關聯的其他道具 */
  getRelatedItems(cubeId: string) {
    return getCubeCompanionItems(cubeId);
  },
  /** 取得該方塊的 companion items */
  getCompanionItems(cubeId: string) {
    return getCubeCompanionItems(cubeId);
  },
  /** 取得經過倍率放大後的升階機率分佈 [Stay, Up1, Up2...] */
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
  rollRankUp(
    cubeId: Exclude<CubeId, "shinyAdditionalCube">,
    currTier: EquipmentRank,
  ) {
    return rollRankUp({
      cube: this.getItem(cubeId),
      currentTier: currTier,
      rankUpMultiplier: useAccountStore.getState().rankUpMultiplier,
    });
  },
  getShinyCeiling(tier: EquipmentRank) {
    return getShinyCeiling(tier);
  },
  rollShinyRankUp(currTier: EquipmentRank, currentCount: number) {
    return rollShinyRankUp(currTier, currentCount);
  },
  /**
   * 取得指定方塊與裝備狀態下的潛能池 (所有階級)
   * 供 rollPots 重複使用，避免重複計算
   */
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
  /**
   * 執行洗潛能邏輯
   *
   * 流程：
   * 1. 根據方塊設定 (`lineRank`) 決定每一排潛能是 "當前階級 (Prime)" 還是 "低一階 (Non-Prime)"。
   * 2. 從傳入的潛能池 (`pools`) 中進行加權隨機，抽出最終的潛能 ID。
   * 3. 檢查潛能限制 (如: 只能有一排無敵)。
   */
  rollPots(
    cubeId: CubeId,
    tier: EquipmentRank,
    pools: Record<PotentialRank, { id: string; weight: number }[]>,
  ) {
    return rollPotentialLines({
      cube: this.getItem(cubeId),
      tier,
      pools,
    });
  },
};
