import { BaseMoeCube } from "./BaseMoeCube";
import { MoeCubeId } from "@/domains/enhancement/moe/moe.type";
import { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import { PotentialResult } from "@/domains/shared/types";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";

export class ToggleMoeCube extends BaseMoeCube {
  readonly uiType = "toggle" as const;

  // 暫存結果
  pendingResult: string[] | null = null;

  constructor(public readonly id: MoeCubeId) {
    super();
  }

  roll(subcategory: MoeCardSubcategory): PotentialResult {
    const newPots = MoeManager.rollPots(this.id, subcategory);
    this.pendingResult = newPots;
    
    return {
      lines: newPots,
      isUpgraded: false,
    };
  }

  confirm() {
    const result = this.pendingResult;
    this.pendingResult = null;
    return result;
  }

  reject() {
    this.pendingResult = null;
  }
}
