import { BaseEquipment, type EquipmentData } from "./BaseEquipment";
import type { EquipmentCapabilities } from "./equipment.type";

/**
 * 防具類裝備：預設不支援靈魂寶珠
 */
export class ArmorEquipment extends BaseEquipment {
  protected get defaultCapabilities(): EquipmentCapabilities {
    return {
      starforce: true,
      starflame: true,
      mainPot: true,
      additionalPot: true,
      soul: false,
      scroll: true,
    };
  }

  constructor(data: EquipmentData) {
    super(data);
    // @ts-ignore
    this.capabilities = this.setupCapabilities(data.capabilities);
  }
}
