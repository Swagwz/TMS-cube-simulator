import equalImg from "@/assets/enhancementItem/新對等方塊.png";
import { BaseCube } from "./BaseCube";
import { PotManager } from "../potential/potManager";
import type { BaseEquipment } from "@/domains/equipment/BaseEquipment";
import type {
  CubePools,
  CubeUIType,
  PotentialResult,
} from "@/domains/shared/types";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

class EqualCube extends BaseCube {
  readonly uiType: CubeUIType = "direct";
  readonly cubeId = "equalCube";
  readonly name = "新對等方塊";
  readonly description = "重設潛能時，各排必定出現此裝備目前階級的潛能屬性。";
  readonly apply = "mainPot";
  readonly price = 65;
  readonly imageUrl = equalImg;
  readonly companions: BaseCompanionItem[] = [];

  readonly rankUp = {
    rare: [97],
    epic: [3],
    unique: [1.35],
  };

  readonly lineRank = {
    rare: [
      [100, 0],
      [100, 0],
      [100, 0],
    ],
    epic: [
      [100, 0],
      [100, 0],
      [100, 0],
    ],
    unique: [
      [100, 0],
      [100, 0],
      [100, 0],
    ],
    legendary: [
      [100, 0],
      [100, 0],
      [100, 0],
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

export const equalCube = new EqualCube();
