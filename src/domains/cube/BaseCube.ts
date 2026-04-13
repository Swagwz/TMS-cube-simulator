import type { EnhancementItem } from "@/domains/equipment/EnhancementItem";
import type {
  CubePools,
  CubeUIType,
  RankUpOptions,
} from "@/domains/shared/types";
import type { CubeId } from "@/domains/cube/type";
import type { PotentialFeature } from "../equipment/equipment.type";
import type { EquipmentRank, PotentialRank } from "../potential/potential.type";
import { PotManager } from "../potential/potManager";
import { rollWeightedIndex } from "@/utils/rollWeightedIndex";
import { EquipManager } from "../equipment/equipManager";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

/**
 * 方塊抽象基類
 * 此類別為 Source of Truth (SSoT) 的基礎，所有元數據皆由具體實例定義。
 */
export abstract class BaseCube {
  // --- 基礎元數據 (必須由具體類別定義) ---
  abstract readonly cubeId: CubeId;
  abstract readonly uiType: CubeUIType;
  abstract readonly name: string;
  abstract readonly price: number;
  abstract readonly description: string;
  abstract readonly apply: PotentialFeature;
  abstract readonly imageUrl: string;
  abstract readonly companions: BaseCompanionItem[];

  // --- 機率數據 ---
  abstract readonly rankUp: Partial<Record<EquipmentRank, number[]>> | null;
  abstract readonly lineRank: Partial<Record<EquipmentRank, number[][]>>;

  /**
   * 執行升階邏輯
   */
  rollRankUp(
    equip: EnhancementItem,
    options: RankUpOptions = 1,
  ): EquipmentRank {
    // 嚴格檢查 options 型別，確保呼叫端傳入正確參數。
    // 在此階段我們不支援除 number 以外的 options，以防止靜默錯誤或邏輯偏移。
    if (typeof options !== "number") {
      throw new Error(`Invalid options: expected number, got ${typeof options}`);
    }

    const currentTier =
      this.apply === "mainPot" ? equip.mainPot.tier : equip.additionalPot.tier;

    if (!this.rankUp) return currentTier;

    const multiplier = options;
    const weights = this.getScaledRankUpWeights(currentTier, multiplier);
    if (weights.length === 0) return currentTier;

    const rolledIndex = rollWeightedIndex(weights);
    return PotManager.indexToRank(
      PotManager.getIndex(currentTier) + rolledIndex,
    ) as EquipmentRank;
  }

  /**
   * 輔助方法：增加裝備的強化次數 (支援方塊本身與相關聯的道具)
   */
  protected incrementCount(equip: EnhancementItem) {
    equip.incrementCount(this.cubeId);
  }

  /**
   * 內部輔助方法：計算放大倍率後的升階權重 [不變, 升一階, 升二階...]
   */
  protected getScaledRankUpWeights(
    currTier: EquipmentRank,
    multiplier: number,
  ): number[] {
    const rankUpData = this.rankUp?.[currTier];
    if (!rankUpData || rankUpData.length === 0) return [];

    const scaledUpWeights = rankUpData.map((p) => p * multiplier);
    const totalUpWeight = scaledUpWeights.reduce((a, b) => a + b, 0);
    const stayWeight = Math.max(100 - totalUpWeight, 0);

    return [stayWeight, ...scaledUpWeights];
  }

  /**
   * 檢查當前裝備階級是否適用此方塊
   */
  canApply(equip: EnhancementItem): boolean {
    const currentTier =
      this.apply === "mainPot" ? equip.mainPot.tier : equip.additionalPot.tier;

    return currentTier in this.lineRank;
  }

  /**
   * 洗潛能核心邏輯
   */
  protected rollLines(tier: EquipmentRank, pools: CubePools): string[] {
    const lineRanks = this.determineLineRanks(tier);
    return lineRanks.map((rank) => this.rollSingleLine(rank, pools));
  }

  /** 根據 lineRank 決定每一排的潛能階級 (例如 [Legendary, Legendary, Unique]) */
  protected determineLineRanks(tier: EquipmentRank): PotentialRank[] {
    const lineRankProbs = this.lineRank[tier];
    if (!lineRankProbs) throw new Error("Invalid tier");

    return lineRankProbs.map((probArr) => {
      const isPrime = rollWeightedIndex(probArr) === 0;
      return isPrime ? tier : PotManager.getPrev(tier);
    });
  }

  /**
   * 根據決定的階級與池子，抽出一排潛能 ID
   */
  protected rollSingleLine(rank: PotentialRank, pools: CubePools): string {
    const pool = pools[rank];
    if (!pool || pool.length === 0)
      throw new Error(`Empty pool for rank: ${rank}`);
    const rolledIndex = rollWeightedIndex(pool.map((p) => p.weight));
    return pool[rolledIndex].id;
  }

  /**
   * 根據裝備回傳對應的該方塊潛能池
   */
  protected generateCubePools(equip: EnhancementItem): CubePools {
    const { subcategory, level } = equip;
    const feature = this.apply;

    const getFilteredPool = (rank: PotentialRank) => {
      const rawPool = EquipManager.getRawPotentialList(
        subcategory,
        rank,
        feature,
      );
      return rawPool
        .filter((data) => {
          const weight = data.weights[this.cubeId];
          const meta = PotManager.getPotentialMetadata(data.id);
          return weight && level >= meta.values[0].minLevel;
        })
        .map((data) => ({ id: data.id, weight: data.weights[this.cubeId]! }));
    };

    return {
      normal: getFilteredPool("normal"),
      rare: getFilteredPool("rare"),
      epic: getFilteredPool("epic"),
      unique: getFilteredPool("unique"),
      legendary: getFilteredPool("legendary"),
    };
  }
}
