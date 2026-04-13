import combineAdditionalImg from "@/assets/enhancementItem/結合附加方塊.png";
import { BaseCube } from "./BaseCube";
import { PotManager } from "../potential/potManager";
import type { EnhancementItem } from "@/domains/equipment/EnhancementItem";
import type { CubePools, PotentialResult } from "@/domains/shared/types";
import { rollWeightedIndex } from "@/utils/rollWeightedIndex";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

class CombineAdditionalCube extends BaseCube {
  readonly uiType = "combine";
  readonly cubeId = "combineAdditionalCube";
  readonly name = "結合附加方塊";
  readonly description = "隨機選擇一排附加潛能屬性，並決定是否重新設定。";
  readonly apply = "additionalPot";
  readonly price = 150;
  readonly imageUrl = combineAdditionalImg;
  readonly companions: BaseCompanionItem[] = [];

  readonly rankUp = null;

  readonly lineRank = {
    rare: [
      [0.5, 99.5],
      [0.5, 99.5],
      [0.5, 99.5],
    ],
    epic: [
      [0.5, 99.5],
      [0.5, 99.5],
      [0.5, 99.5],
    ],
    unique: [
      [0.5, 99.5],
      [0.5, 99.5],
      [0.5, 99.5],
    ],
    legendary: [
      [0.5, 99.5],
      [0.5, 99.5],
      [0.5, 99.5],
    ],
  };

  /**
   * 第一階段：抽籤並消耗方塊
   */
  pickLine(equip: EnhancementItem): number {
    this.incrementCount(equip);
    return rollWeightedIndex([1, 1, 1]);
  }

  /**
   * 第二階段：確認執行洗練 (不消耗方塊)
   */
  roll(
    equip: EnhancementItem,
    pools: CubePools,
    lineIndex: number,
  ): PotentialResult {
    if (lineIndex < 0 || lineIndex > 2) throw new Error("Invalid target index");
    const currentTier = equip.additionalPot.tier;
    const nextPotIds = [...equip.additionalPot.potIds];

    do {
      const lineRankProbs = this.lineRank[currentTier][lineIndex];
      const isPrime = rollWeightedIndex(lineRankProbs) === 0;
      const rank = isPrime ? currentTier : PotManager.getPrev(currentTier);
      nextPotIds[lineIndex] = this.rollSingleLine(rank, pools);
    } while (!PotManager.validateLineRules(nextPotIds));

    equip.updatePotential(this.apply, currentTier, nextPotIds);
    return { tier: currentTier, lines: nextPotIds };
  }
}

export const combineAdditionalCube = new CombineAdditionalCube();
