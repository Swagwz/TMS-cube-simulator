import { MOE_CARD_METADATA_MAP } from "@/domains/moeCard/moeCard.config";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import { MOE_POTENTIAL_ID_MAP, MOE_POTENTIAL_SOURCE } from "./moe.data";
import { MOE_CUBE_METADATA_MAP } from "./moe.config";
import type { MoeCubeId } from "./moe.type";
import formatTemplate from "@/utils/formatTemplate";
import { rollWeightedIndex } from "@/utils/rollWeightedIndex";
import type { StatusField } from "@/domains/potential/potential.type";
import { STATUS_FIELD_MAP } from "@/domains/potential/potential.config";

// 有價值的潛能
const POTENTIAL_ABBREVIATIONS = {
  "最終傷害%": "終",
  "無視怪物防禦率%": "無",
  加持技能持續時間: "加",
  增加被動技能等級: "被",
  "物理攻擊力%": "物",
  "魔法攻擊力%": "魔",
  "STR%": "力",
  "DEX%": "敏",
  "INT%": "智",
  "LUK%": "幸",
  "全屬性%": "全",
  "MaxHP%": "HP",
  "爆擊機率%": "爆",
};

function isPotAbbrKey(
  key: string,
): key is keyof typeof POTENTIAL_ABBREVIATIONS {
  return key in POTENTIAL_ABBREVIATIONS;
}

export const MoeManager = {
  // moe cube
  getMoeCubeMetadata(cubeId: MoeCubeId) {
    const meta = MOE_CUBE_METADATA_MAP.get(cubeId);
    if (!meta) throw new Error("Invalid moe cube id");
    return meta;
  },
  // moe card
  getCardMetadata(subcategory: MoeCardSubcategory) {
    const meta = MOE_CARD_METADATA_MAP.get(subcategory);
    if (!meta) throw new Error("Invalid subcategory");
    return meta;
  },
  getPotentialMetadata(id: string) {
    const meta = MOE_POTENTIAL_ID_MAP.get(id);
    if (!meta) throw new Error("Invalid moe pot id");
    return meta;
  },
  // moe potential
  getSummary(ids: string[]) {
    return ids
      .map((id) => {
        const data = this.getPotentialMetadata(id);

        const { name } = data;
        if (isPotAbbrKey(name)) return POTENTIAL_ABBREVIATIONS[name];
        else return "-";
      })
      .join("/");
  },

  getSummaryByNames(names: string[]) {
    return names
      .map((name) => {
        if (isPotAbbrKey(name)) return POTENTIAL_ABBREVIATIONS[name];
        else return "-";
      })
      .join("/");
  },

  getLine(id: string) {
    const { template, value } = this.getPotentialMetadata(id);
    return formatTemplate(template, value);
  },

  getPotentialPool(type: MoeCardSubcategory) {
    return MOE_POTENTIAL_SOURCE[type];
  },

  /** 用於創建時 隨機給的潛能 (不看權重) */
  createRandomPotentials(type: MoeCardSubcategory) {
    const potPool = this.getPotentialPool(type);
    const rst = [];
    for (let i = 0; i < 3; i++) {
      const rolledIndex = Math.floor(Math.random() * potPool.length);
      rst.push(potPool[rolledIndex].id);
    }
    return rst;
  },
  getRelatedFields: (field: StatusField) => {
    if (!field) return [];
    return STATUS_FIELD_MAP.get(field)?.relatedFields ?? [];
  },
  /** 根據權重模擬洗潛能 */
  rollPots(cubeId: MoeCubeId, type: MoeCardSubcategory) {
    const potPool = this.getPotentialPool(type);
    const weights = potPool.map((p) => p.weights[cubeId]);

    const rst = [];
    for (let i = 0; i < 3; i++) {
      const rolledIndex = rollWeightedIndex(weights);
      rst.push(potPool[rolledIndex].id);
    }
    return rst;
  },
};
