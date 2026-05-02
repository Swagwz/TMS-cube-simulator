import combineImg from "@/assets/enhancementItem/結合方塊.png";
import { BaseCube } from "./BaseCube";
import { PotManager } from "../potential/potManager";
import type { BaseEquipment } from "@/domains/equipment/BaseEquipment";
import type { CubePools, PotentialResult } from "@/domains/shared/types";
import { rollWeightedIndex } from "@/utils/rollWeightedIndex";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

class CombineCube extends BaseCube {
  readonly cubeId = "combineCube";
  readonly uiType = "combine";
  readonly name = "結合方塊";
  readonly description = "隨機選擇一排潛能屬性，並決定是否重新設定。";
  readonly apply = "mainPot";
  readonly price = 120;
  readonly imageUrl = combineImg;
  readonly companions: BaseCompanionItem[] = [];

  readonly rankUp = null;
  readonly lineRank = {
    rare: [
      [15, 85],
      [15, 85],
      [15, 85],
    ],
    epic: [
      [15, 85],
      [15, 85],
      [15, 85],
    ],
    unique: [
      [15, 85],
      [15, 85],
      [15, 85],
    ],
    legendary: [
      [15, 85],
      [15, 85],
      [15, 85],
    ],
  };

  /**
   * 第一階段：抽籤並消耗方塊
   */
  pickLine(equip: BaseEquipment): number {
    this.incrementCount(equip);
    return rollWeightedIndex([1, 1, 1]);
  }

  /**
   * 第二階段：確認執行洗練 (不消耗方塊)
   */
  roll(
    equip: BaseEquipment,
    pools: CubePools,
    lineIndex: number,
  ): PotentialResult {
    if (lineIndex < 0 || lineIndex > 2) throw new Error("Invalid target index");
    const currentTier = equip.mainPot.tier;
    const nextPotIds = [...equip.mainPot.potIds];

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

export const combineCube = new CombineCube();
