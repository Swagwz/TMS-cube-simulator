import type { EquipmentSubcategory } from "@/domains/equipment/equipment.type";
import {
  CUBE_LIST,
  CUBE_METADATA_MAP,
  CUBE_RELATIONS,
  RELATION_METADATA_MAP,
} from "./cube.config";
import type { CubeApplicationType, CubeId, CubeItem } from "./cube.type";
import type {
  EquipmentRank,
  PotentialRank,
} from "@/domains/potential/potential.type";
import { PotManager } from "@/domains/potential/potManager";
import { rollWeightedIndex } from "@/utils/rollWeightedIndex";
import { EquipManager } from "@/domains/equipment/equipManager";
import { useAccountStore } from "@/store/useAccountStore";

export const CubeManager = {
  getItem<T extends CubeId>(cubeId: T) {
    const meta = CUBE_METADATA_MAP.get(cubeId);
    if (!meta) throw new Error("Invalid cubeId");
    return meta as T extends "shinyAdditionalCube"
      ? Extract<CubeItem, { id: "shinyAdditionalCube" }>
      : T extends "mirrorCube"
        ? Extract<CubeItem, { id: "mirrorCube" }>
        : CubeItem;
  },
  /** 根據使用類型與當前裝備等級，回傳可用的方塊列表 */
  getApplicableCubes(
    applyType: CubeApplicationType,
    currentTier: EquipmentRank,
  ): CubeItem[] {
    return CUBE_LIST.filter(({ apply, minApplyTier, maxApplyTier }) => {
      // 1. 檢查 apply type 是否相符
      const isCorrectApplyType = apply === applyType;
      if (!isCorrectApplyType) return false;

      // 2. 檢查等級是否適用
      const currentTierIndex = PotManager.getIndex(currentTier);
      const minTierIndex = minApplyTier
        ? PotManager.getIndex(minApplyTier)
        : -Infinity;
      const maxTierIndex = maxApplyTier
        ? PotManager.getIndex(maxApplyTier)
        : Infinity;

      const isTierApplicable =
        currentTierIndex >= minTierIndex && currentTierIndex <= maxTierIndex;

      return isTierApplicable;
    });
  },
  /** 取得與該方塊相關聯的其他道具 */
  getRelatedItems(cubeId: string) {
    const relatedIds = CUBE_RELATIONS[cubeId];
    if (!relatedIds) return [];
    return relatedIds.map((id) => RELATION_METADATA_MAP.get(id)!);
  },
  /** 取得經過倍率放大後的升階機率分佈 [Stay, Up1, Up2...] */
  getScaledRankUpWeights(
    cubeId: Exclude<CubeId, "shinyAdditionalCube">,
    currTier: EquipmentRank,
    multiplier?: number,
  ) {
    const finalMultiplier =
      multiplier ?? useAccountStore.getState().rankUpMultiplier;
    const meta = this.getItem(cubeId);
    const rankUpData = meta.rankUp?.[currTier];

    if (!rankUpData || rankUpData.length === 0) return [];

    const scaledUpWeights = rankUpData.map((p) => p * finalMultiplier);
    const totalUpWeight = scaledUpWeights.reduce((a, b) => a + b, 0);
    const stayWeight = Math.max(100 - totalUpWeight, 0);

    return [stayWeight, ...scaledUpWeights];
  },
  rollRankUp(
    cubeId: Exclude<CubeId, "shinyAdditionalCube">,
    currTier: EquipmentRank,
  ) {
    const currTierIndex = PotManager.getIndex(currTier);
    const finalWeights = this.getScaledRankUpWeights(cubeId, currTier);

    if (finalWeights.length === 0) return currTier;

    const selectedIndex = rollWeightedIndex(finalWeights);

    // i=0 是維持 (index + 0)
    // i=1 是升一階 (index + 1)
    const resultTier = PotManager.indexToRank(
      currTierIndex + selectedIndex,
    ) as EquipmentRank;

    return resultTier;
  },
  getShinyCeiling(tier: EquipmentRank) {
    const meta = this.getItem("shinyAdditionalCube");

    if (tier === "legendary") return { ceiling: 0, probIncr: 0, baseProb: 0 };
    const tierKey = tier as Exclude<EquipmentRank, "legendary">;
    return {
      ceiling: meta.ceiling[tierKey],
      probIncr: meta.rankUpIncr[tierKey],
      baseProb: meta.rankUp?.[tierKey]?.[0] ?? 0,
    };
  },
  rollShinyRankUp(currTier: EquipmentRank, currentCount: number) {
    const meta = this.getItem("shinyAdditionalCube");

    if (currTier === "legendary") return currTier;

    const tierKey = currTier as Exclude<EquipmentRank, "legendary">;
    const ceiling = meta.ceiling[tierKey];
    const rankUpData = meta.rankUp?.[tierKey];
    const incr = meta.rankUpIncr[tierKey];

    if (!rankUpData || rankUpData.length === 0) return currTier;

    // 保底判斷: currentCount 是目前累積的失敗次數 (例如 ceiling=44, 累積43次失敗後, 第44次必過)
    if (currentCount >= ceiling - 1) {
      const currIndex = PotManager.getIndex(currTier);
      return PotManager.indexToRank(currIndex + 1) as EquipmentRank;
    }

    // 閃亮附加方塊不受加倍活動影響
    const baseProb = rankUpData[0];
    const currentProb = baseProb + currentCount * incr;
    const isSuccess = Math.random() * 100 < currentProb;

    if (isSuccess) {
      const currIndex = PotManager.getIndex(currTier);
      return PotManager.indexToRank(currIndex + 1) as EquipmentRank;
    }

    return currTier;
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
    const meta = this.getItem(cubeId);
    const feature = meta.apply;

    const getPotPool = (rank: PotentialRank) => {
      const rawPool = EquipManager.getRawPotentialList(
        subcategory,
        rank,
        feature,
      );
      return rawPool
        .filter((data) => {
          const weight = data.weights[cubeId];
          const meta = PotManager.getPotentialMetadata(data.id);
          return weight && level >= meta.values[0].minLevel;
        })
        .map((data) => ({ id: data.id, weight: data.weights[cubeId]! }));
    };

    return {
      normal: getPotPool("normal"),
      rare: getPotPool("rare"),
      epic: getPotPool("epic"),
      unique: getPotPool("unique"),
      legendary: getPotPool("legendary"),
    };
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
    const meta = this.getItem(cubeId);

    if (!meta.lineRank[tier]) throw new Error("Invalid tier");

    // 1. 決定每一排的階級 (Prime vs Non-Prime)
    const lineRankArr = meta.lineRank[tier].map((probArr) => {
      const isPrime = rollWeightedIndex(probArr) === 0;
      if (isPrime) return tier;
      else return PotManager.getPrev(tier);
    });

    // 2. 逐排隨機抽出潛能
    let rst = lineRankArr.map((rank) => {
      const pool = pools[rank];
      const rolledIndex = rollWeightedIndex(pool.map((p) => p.weight));
      return pool[rolledIndex].id;
    });

    // 3.檢查潛能限制(閃耀鏡射沒有限制)
    while (!PotManager.validateLineRules(rst) && cubeId !== "mirrorCube") {
      rst.length = 0;

      rst = lineRankArr.map((rank) => {
        const pool = pools[rank];
        const rolledIndex = rollWeightedIndex(pool.map((p) => p.weight));
        return pool[rolledIndex].id;
      });
    }

    return rst;
  },
};
