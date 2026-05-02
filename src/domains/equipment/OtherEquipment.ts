import { BaseEquipment, type EquipmentData } from "./BaseEquipment";
import type { EquipmentCapabilities } from "./equipment.type";

/**
 * 其他類裝備（心臟、胸章等）：預設能力最精簡
 */
export class OtherEquipment extends BaseEquipment {
  protected get defaultCapabilities(): EquipmentCapabilities {
    return {
      starforce: false,
      starflame: false,
      mainPot: false,
      additionalPot: false,
      soul: false,
      scroll: false,
    };
  }

  constructor(data: EquipmentData) {
    super(data);
    // @ts-ignore
    this.capabilities = this.setupCapabilities(data.capabilities);
  }
}
