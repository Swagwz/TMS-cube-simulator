import { WeaponEquipment } from "./WeaponEquipment";
import { ArmorEquipment } from "./ArmorEquipment";
import { AccessoryEquipment } from "./AccessoryEquipment";
import { OtherEquipment } from "./OtherEquipment";
import { EQUIPMENT_METADATA_MAP } from "./equipment.config";
import type { EquipmentData, BaseEquipment } from "./BaseEquipment";
import { proxy } from "valtio";

/**
 * 裝備工廠：負責根據 subcategory 與類別建立對應的實體
 */
export class EquipmentFactory {
  /**
   * 根據 data 中的 subcategory 判斷應建立哪種 Class
   */
  static create(data: EquipmentData): BaseEquipment {
    const meta = EQUIPMENT_METADATA_MAP.get(data.subcategory);
    if (!meta) {
      throw new Error(`Unknown subcategory: ${data.subcategory}`);
    }

    switch (meta.category) {
      case "weapon":
        return new WeaponEquipment(data);
      case "armor":
        return new ArmorEquipment(data);
      case "accessory":
        return new AccessoryEquipment(data);
      case "other":
      default:
        return new OtherEquipment(data);
    }
  }

  /**
   * 建立一個被 Valtio proxy 包裝的實例（用於應用程式狀態管理）
   */
  static createProxy(data: EquipmentData): ReturnType<typeof proxy<BaseEquipment>> {
    const instance = this.create(data);
    return proxy(instance);
  }
}
