import { wuGongJewel } from "./WuGongJewel";
import type { SoulId } from "./soul.type";
import type { BaseEquipment } from "../equipment/BaseEquipment";

const registry = [wuGongJewel];

export const SoulRegistry = {
  getById: (id: SoulId) => registry.find((s) => s.id === id)!,

  getAll: () => registry,

  /**
   * 取得適用於該裝備的靈魂系統
   */
  getApplicable: (equip: BaseEquipment) =>
    equip.capabilities.soul ? registry : [],
};
