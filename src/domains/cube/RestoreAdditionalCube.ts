import restoreAdditionalImg from "@/assets/enhancementItem/恢復附加方塊.png";
import { BaseCube } from "./BaseCube";
import { PotManager } from "../potential/potManager";
import type { EnhancementItem } from "@/domains/equipment/EnhancementItem";
import type { CubePools, PotentialResult } from "@/domains/shared/types";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

class RestoreAdditionalCube extends BaseCube {
  readonly uiType = "restore" as const;
  readonly cubeId = "restoreAdditionalCube";
  readonly name = "恢復附加方塊";
  readonly description =
    "使用後可預覽附加潛能重設結果，並由玩家選擇保留原始數值或套用新數值。";
  readonly apply = "additionalPot" as const;
  readonly price = 75;
  readonly imageUrl = restoreAdditionalImg;
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
    equip: EnhancementItem,
    multiplier: number,
    pools: CubePools,
  ): PotentialResult {
    const nextTier = this.rollRankUp(equip, multiplier);
    let potIds: string[];

    do {
      potIds = this.rollLines(nextTier, pools);
    } while (!PotManager.validateLineRules(potIds));

    this.incrementCount(equip);
    return { tier: nextTier, lines: potIds };
  }
}

export const restoreAdditionalCube = new RestoreAdditionalCube();
