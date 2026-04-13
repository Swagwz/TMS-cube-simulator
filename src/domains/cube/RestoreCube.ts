import restoreImg from "@/assets/enhancementItem/恢復方塊.png";
import { BaseCube } from "./BaseCube";
import { PotManager } from "../potential/potManager";
import type { EnhancementItem } from "@/domains/equipment/EnhancementItem";
import type {
  CubePools,
  CubeUIType,
  PotentialResult,
} from "@/domains/shared/types";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";
import { fixPotential } from "../companion/fixPotential";

class RestoreCube extends BaseCube {
  readonly cubeId = "restoreCube";
  readonly uiType: CubeUIType = "restore";
  readonly name = "恢復方塊";
  readonly description =
    "使用後可預覽重設結果，並由玩家選擇保留原始潛能或套用新潛能。";
  readonly apply = "mainPot";
  readonly price = 55;
  readonly imageUrl = restoreImg;
  readonly companions: BaseCompanionItem[] = [fixPotential];

  readonly rankUp = {
    rare: [97.7, 2, 0.3],
    epic: [8, 0.6],
    unique: [2.1],
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
    equip: EnhancementItem,
    multiplier: number,
    pools: CubePools,
    lockIndex: number = -1,
  ): PotentialResult {
    const nextTier = this.rollRankUp(equip, multiplier);
    const currentPotIds = equip.mainPot.potIds;
    let potIds: string[];

    do {
      potIds = this.rollLines(nextTier, pools);

      if (lockIndex >= 0 && lockIndex <= 2) {
        potIds[lockIndex] = currentPotIds[lockIndex];
      }
    } while (!PotManager.validateLineRules(potIds));

    this.incrementCount(equip);
    if (lockIndex >= 0 && lockIndex <= 2)
      this.companions[0].incrementCount(equip);

    return { tier: nextTier, lines: potIds };
  }
}

export const restoreCube = new RestoreCube();
