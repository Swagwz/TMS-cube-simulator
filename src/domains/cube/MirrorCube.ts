import mirrorImg from "@/assets/enhancementItem/閃耀鏡射方塊.png";
import { BaseCube } from "./BaseCube";
import { rollWeightedIndex } from "@/utils/rollWeightedIndex";
import type { BaseEquipment } from "@/domains/equipment/BaseEquipment";
import type {
  CubePools,
  CubeUIType,
  PotentialResult,
} from "@/domains/shared/types";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

class MirrorCube extends BaseCube {
  readonly uiType: CubeUIType = "direct";
  readonly cubeId = "mirrorCube";
  readonly name = "閃耀鏡射方塊";
  readonly description =
    "重設潛能時，有機率將第一排的潛能屬性複製並套用至第二排。";
  readonly apply = "mainPot";
  readonly price = 45;
  readonly imageUrl = mirrorImg;
  readonly companions: BaseCompanionItem[] = [];
  readonly mirrorProbPercent = 20;

  readonly rankUp = {
    rare: [97],
    epic: [2.25],
    unique: [0.99],
  };

  readonly lineRank = {
    rare: [
      [100, 0],
      [100, 0],
      [100, 0],
    ],
    epic: [
      [100, 0],
      [20, 80],
      [15, 85],
    ],
    unique: [
      [100, 0],
      [20, 80],
      [10, 90],
    ],
    legendary: [
      [100, 0],
      [20, 80],
      [5, 95],
    ],
  };

  roll(
    equip: BaseEquipment,
    multiplier: number,
    pools: CubePools,
  ): PotentialResult {
    const nextTier = this.rollRankUp(equip, multiplier);
    const lines = this.rollLines(nextTier, pools);

    const hasMirror =
      rollWeightedIndex([
        this.mirrorProbPercent,
        100 - this.mirrorProbPercent,
      ]) === 0;

    if (hasMirror) {
      lines[1] = lines[0];
    }

    equip.updatePotential(this.apply, nextTier, lines);
    this.incrementCount(equip);
    return { tier: nextTier, lines };
  }
}

export const mirrorCube = new MirrorCube();
