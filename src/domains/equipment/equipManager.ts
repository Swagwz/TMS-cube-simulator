import { EQUIPMENT_METADATA_MAP } from "./equipment.config";
import type {
  EquipmentFeature,
  EquipmentSubcategory,
  PotentialFeature,
} from "./equipment.type";
import type {
  PotentialRank,
  PotentialWeightData,
} from "../potential/potential.type";
import {
  ADDITIONAL_JSON,
  NORMAL_JSON,
  OTHER_JSON,
} from "../potential/potential.data";
import { PotManager } from "../potential/potManager";

export const EquipManager = {
  maxLevel: 300,

  getEquipmentMetadata: (subcategory: EquipmentSubcategory) => {
    const meta = EQUIPMENT_METADATA_MAP.get(subcategory);
    if (!meta) throw new Error("Invalid equipType");
    return meta;
  },
  /** 回傳裝備等級相關設定 */
  getLevelConfig(subcategory: EquipmentSubcategory) {
    const meta = this.getEquipmentMetadata(subcategory);

    // 邏輯：如果有 fixLevel，則它是固定的；否則使用 commonLevels
    const isFixed = meta.isFixedLevel;
    const levels = meta.commonLevels;

    return {
      levels, // 給 Badge 顯示用的陣列
      isFixed, // 給 Input disabled 用的布林值
      defaultLevel: levels.at(-1) || 200, // 預設值
    };
  },
  canApply(subcategory: EquipmentSubcategory, feature: EquipmentFeature) {
    try {
      const meta = this.getEquipmentMetadata(subcategory);
      return meta.features.includes(feature);
    } catch (error) {
      return false;
    }
  },
  getPotentialOptions({
    subcategory,
    level,
    rank,
    feature,
  }: {
    subcategory: EquipmentSubcategory;
    level: number;
    rank: PotentialRank;
    feature: PotentialFeature;
  }) {
    const pool = this.getRawPotentialList(subcategory, rank, feature);

    const ids = pool
      .filter((item) => {
        const meta = PotManager.getPotentialMetadata(item.id);
        return level >= meta.values[0].minLevel;
      })
      .map((item) => item.id);

    return Array.from(new Set(ids));
  },
  /** 取得該裝備可用的原始潛能池 (包含權重資訊) */
  getRawPotentialList(
    subcategory: EquipmentSubcategory,
    rank: PotentialRank,
    feature: PotentialFeature,
  ): PotentialWeightData[] {
    const getGroup = (registry: typeof NORMAL_JSON) =>
      registry[rank]?.find((g) => g.apply.includes(subcategory));

    if (feature === "additionalPot") {
      const group = getGroup(ADDITIONAL_JSON);
      return group?.data ?? [];
    }

    const normalGroup = getGroup(NORMAL_JSON);
    const otherGroup = getGroup(OTHER_JSON);
    return [...(normalGroup?.data ?? []), ...(otherGroup?.data ?? [])];
  },
};
