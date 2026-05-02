import shinyImg from "@/assets/enhancementItem/閃亮附加方塊.png";
import { BaseCube } from "./BaseCube";
import { PotManager } from "../potential/potManager";
import type { BaseEquipment } from "@/domains/equipment/BaseEquipment";
import type {
  CubePools,
  PotentialResult,
  RankUpOptions,
  ShinyPity,
} from "@/domains/shared/types";
import type { EquipmentRank } from "../potential/potential.type";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

class ShinyCube extends BaseCube {
  readonly uiType = "accumulate";
  readonly cubeId = "shinyAdditionalCube";
  readonly name = "閃亮附加方塊";
  readonly description =
    "重設附加潛能。階級提升機率隨使用次數提高，並具備必定升階的保底機制。";
  readonly apply = "additionalPot";
  readonly price = 60;
  readonly imageUrl = shinyImg;
  readonly companions: BaseCompanionItem[] = [];

  readonly rankUp = {
    rare: [4.7],
    epic: [1.8],
    unique: [0.3],
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

  readonly rankUpIncr = { rare: 0.05, epic: 0.01, unique: 0.005 };
  readonly ceiling = { rare: 44, epic: 109, unique: 307 };

  roll(
    equip: BaseEquipment,
    pools: CubePools,
    pity: ShinyPity,
  ): PotentialResult {
    const nextTier = this.rollRankUp(equip, pity);

    let potIds: string[] = [];
    do {
      potIds = this.rollLines(nextTier, pools);
    } while (!PotManager.validateLineRules(potIds));

    equip.updatePotential(this.apply, nextTier, potIds);
    this.incrementCount(equip);
    return { tier: nextTier, lines: potIds };
  }

  override rollRankUp(
    equip: BaseEquipment,
    options: RankUpOptions,
  ): EquipmentRank {
    const pity = options as ShinyPity;
    const currentTier = equip.additionalPot.tier;
    if (currentTier === "legendary") return currentTier;

    const tierKey = currentTier as Exclude<EquipmentRank, "legendary">;
    const count = pity[tierKey];
    const ceiling = this.ceiling[tierKey];

    // 觸發保底
    if (count + 1 >= ceiling) {
      return PotManager.getNext(currentTier) as EquipmentRank;
    }

    const baseProb = this.rankUp[tierKey][0];
    const currentProb = baseProb + count * this.rankUpIncr[tierKey];
    const isRankUp = Math.random() * 100 < currentProb;

    return isRankUp
      ? (PotManager.getNext(currentTier) as EquipmentRank)
      : currentTier;
  }
}

export const shinyCube = new ShinyCube();
