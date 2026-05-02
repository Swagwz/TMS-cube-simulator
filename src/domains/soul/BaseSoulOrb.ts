import type { BaseEquipment } from "@/domains/equipment/BaseEquipment";
import { SoulManager } from "./soulManager";
import type { SoulId } from "./soul.type";

/**
 * 靈魂寶珠抽象基類
 */
export abstract class BaseSoulOrb {
  abstract readonly id: SoulId;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly imageUrl: string;
  abstract readonly price: number;

  readonly uiType = "direct" as const;

  /**
   * 執行靈魂潛能隨機抽取
   */
  roll(equip: BaseEquipment) {
    const pools = SoulManager.getPotPool();
    const newPotId = SoulManager.rollPot(pools);

    // 直接更新裝備實例 (Valtio Proxy)
    equip.soul = newPotId;
    equip.incrementCount(this.id);

    return newPotId;
  }

  /**
   * 取得目前的顯示文字
   */
  getDisplayText(potId: string, level: number) {
    return SoulManager.getLine(potId, level);
  }
}
