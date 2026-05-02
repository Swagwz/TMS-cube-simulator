import { BaseMoeCube } from "./BaseMoeCube";
import { MoeCubeId } from "@/domains/enhancement/moe/moe.type";
import { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import { PotentialResult } from "@/domains/shared/types";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";

export class DirectMoeCube extends BaseMoeCube {
  readonly uiType = "direct" as const;

  constructor(public readonly id: MoeCubeId) {
    super();
  }

  roll(subcategory: MoeCardSubcategory): PotentialResult {
    const newPots = MoeManager.rollPots(this.id, subcategory);
    return {
      lines: newPots,
      isUpgraded: false, // 萌獸目前無跳框機制
    };
  }
}
