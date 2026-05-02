import additionalImg from "@/assets/enhancementItem/珍貴附加方塊.png";
import { BaseCube } from "./BaseCube";
import { PotManager } from "../potential/potManager";
import type { BaseEquipment } from "@/domains/equipment/BaseEquipment";
import type {
  CubePools,
  CubeUIType,
  PotentialResult,
} from "@/domains/shared/types";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

class AdditionalCube extends BaseCube {
  readonly uiType: CubeUIType = "direct";
  readonly cubeId = "additionalCube";
  readonly name = "珍貴附加方塊";
  readonly description = "用於重設裝備的附加潛能屬性。";
  readonly apply = "additionalPot";
  readonly price = 70;
  readonly imageUrl = additionalImg;
  readonly companions: BaseCompanionItem[] = [];

  readonly rankUp = {
    rare: [4.76],
    epic: [1.96],
    unique: [0.5],
  };

  readonly lineRank = {
    rare: [
      [100, 0],
      [1.96, 98.04],
      [1.96, 98.04],
    ],
    epic: [
      [100, 0],
      [4.76, 95.24],
      [4.76, 95.24],
    ],
    unique: [
      [100, 0],
      [1.96, 98.04],
      [1.96, 98.04],
    ],
    legendary: [
      [100, 0],
      [0.5, 99.5],
      [0.5, 99.5],
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

export const additionalCube = new AdditionalCube();
