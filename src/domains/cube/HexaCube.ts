import hexaImg from "@/assets/enhancementItem/閃炫方塊.png";
import { BaseCube } from "./BaseCube";
import type { EnhancementItem } from "@/domains/equipment/EnhancementItem";
import type { CubePools, PotentialResult } from "../shared/types";
import { PotManager } from "../potential/potManager";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

class HexaCube extends BaseCube {
  readonly uiType = "hexa";
  readonly cubeId = "hexaCube";
  readonly name = "閃炫方塊";
  readonly description =
    "使用後將顯示 6 條潛能屬性，玩家可從中任選 3 條進行套用。";
  readonly apply = "mainPot";
  readonly price = 60;
  readonly imageUrl = hexaImg;
  readonly companions: BaseCompanionItem[] = [];

  readonly rankUp = {
    rare: [97],
    epic: [3],
    unique: [1.35],
  };

  readonly lineRank = {
    rare: [
      [100, 0],
      [20, 80],
      [15, 85],
      [100, 0],
      [20, 80],
      [15, 85],
    ],
    epic: [
      [100, 0],
      [20, 80],
      [15, 85],
      [100, 0],
      [20, 80],
      [15, 85],
    ],
    unique: [
      [100, 0],
      [20, 80],
      [15, 85],
      [100, 0],
      [20, 80],
      [15, 85],
    ],
    legendary: [
      [100, 0],
      [20, 80],
      [15, 85],
      [100, 0],
      [20, 80],
      [15, 85],
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

    this.incrementCount(equip);
    return { tier: nextTier, lines: potIds };
  }
}

export const hexaCube = new HexaCube();
