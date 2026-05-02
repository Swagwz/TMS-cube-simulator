import absAdditionalImg from "@/assets/enhancementItem/絕對附加方塊.png";
import { BaseCube } from "./BaseCube";
import type { BaseEquipment } from "@/domains/equipment/BaseEquipment";
import type { CubePools, PotentialResult } from "@/domains/shared/types";
import { PotManager } from "../potential/potManager";
import type { BaseCompanionItem } from "../companion/BaseCompanionItem";

class AbsAdditionalCube extends BaseCube {
  readonly uiType = "direct";
  readonly cubeId = "absAdditionalCube";
  readonly name = "絕對附加方塊";
  readonly description =
    "僅限附加潛能為傳說等級之裝備使用。重設後第一、二排必定為傳說等級，第三排必定為罕見等級。";
  readonly apply = "additionalPot";
  readonly price = 100;
  readonly imageUrl = absAdditionalImg;
  readonly companions: BaseCompanionItem[] = [];

  readonly rankUp = null;

  readonly lineRank = {
    legendary: [
      [100, 0],
      [100, 0],
      [0, 100],
    ],
  };

  roll(
    equip: BaseEquipment,
    _multiplier: number,
    pools: CubePools,
  ): PotentialResult {
    const tier = "legendary" as const;
    let potIds: string[] = [];

    do {
      potIds = this.rollLines(tier, pools);
    } while (!PotManager.validateLineRules(potIds));

    equip.updatePotential(this.apply, tier, potIds);
    this.incrementCount(equip);
    return { tier, lines: potIds };
  }
}

export const absAdditionalCube = new AbsAdditionalCube();
