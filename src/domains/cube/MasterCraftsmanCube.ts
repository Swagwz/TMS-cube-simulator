import masterCraftsmanImg from "@/assets/enhancementItem/名匠方塊.png";
import { BaseCube } from "./BaseCube";
import { PotManager } from "../potential/potManager";
import type { EnhancementItem } from "@/domains/equipment/EnhancementItem";
import type {
  CubePools,
  CubeUIType,
  PotentialResult,
} from "@/domains/shared/types";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

class MasterCraftsmanCube extends BaseCube {
  readonly uiType: CubeUIType = "direct";
  readonly cubeId = "masterCraftsmanCube";
  readonly name = "名匠方塊";
  readonly description = "重設裝備潛能，最高可將潛能階級提升至傳說等級。";
  readonly apply = "mainPot";
  readonly price = 0;
  readonly imageUrl = masterCraftsmanImg;
  readonly companions: BaseCompanionItem[] = [];

  readonly rankUp = {
    rare: [8],
    epic: [1.7],
    unique: [0.2],
  };

  readonly lineRank = {
    rare: [
      [100, 0],
      [16.67, 83.33],
      [16.67, 83.33],
    ],
    epic: [
      [100, 0],
      [8, 92],
      [8, 92],
    ],
    unique: [
      [100, 0],
      [1.7, 98.3],
      [1.7, 98.3],
    ],
    legendary: [
      [100, 0],
      [0.2, 99.8],
      [0.2, 99.8],
    ],
  };

  roll(
    equip: EnhancementItem,
    multiplier: number,
    pools: CubePools,
  ): PotentialResult {
    const nextTier = this.rollRankUp(equip, multiplier);
    let potIds: string[] = [];

    do {
      potIds = this.rollLines(nextTier, pools);
    } while (!PotManager.validateLineRules(potIds));

    equip.updatePotential(this.apply, nextTier, potIds);
    this.incrementCount(equip);
    return { tier: nextTier, lines: potIds };
  }
}

export const masterCraftsmanCube = new MasterCraftsmanCube();
