import craftsmanImg from "@/assets/enhancementItem/工匠方塊.png";
import { BaseCube } from "./BaseCube";
import { PotManager } from "../potential/potManager";
import type { BaseEquipment } from "@/domains/equipment/BaseEquipment";
import type {
  CubePools,
  CubeUIType,
  PotentialResult,
} from "@/domains/shared/types";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

class CraftsmanCube extends BaseCube {
  readonly uiType: CubeUIType = "direct";
  readonly cubeId = "craftsmanCube";
  readonly name = "工匠方塊";
  readonly description = "重設裝備潛能，最高可將潛能階級提升至罕見等級。";
  readonly apply = "mainPot";
  readonly price = 0;
  readonly imageUrl = craftsmanImg;
  readonly companions: BaseCompanionItem[] = [];

  readonly rankUp = {
    rare: [4.76],
    epic: [1.19],
  };

  readonly lineRank = {
    rare: [
      [100, 0],
      [16.67, 83.33],
      [16.67, 83.33],
    ],
    epic: [
      [100, 0],
      [4.76, 95.24],
      [4.76, 95.24],
    ],
    unique: [
      [100, 0],
      [1.19, 98.81],
      [1.19, 98.81],
    ],
  };

  roll(
    equip: BaseEquipment,
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

export const craftsmanCube = new CraftsmanCube();
