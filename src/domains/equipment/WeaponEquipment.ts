import { BaseEquipment, type EquipmentData } from "./BaseEquipment";
import type { EquipmentCapabilities } from "./equipment.type";

/**
 * 武器類裝備：預設支援所有強化系統（包含靈魂寶珠）
 */
export class WeaponEquipment extends BaseEquipment {
  protected get defaultCapabilities(): EquipmentCapabilities {
    return {
      starforce: true,
      starflame: true,
      mainPot: true,
      additionalPot: true,
      soul: true,
      scroll: true,
    };
  }

  constructor(data: EquipmentData) {
    super(data);
    // @ts-ignore: capabilities is readonly in Base but initialized here
    this.capabilities = this.setupCapabilities(data.capabilities);
  }
}
