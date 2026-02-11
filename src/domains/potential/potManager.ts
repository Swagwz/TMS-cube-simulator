import { POTENTIAL_RANK_LIST, STATUS_FIELD_MAP } from "./potential.config";
import { POTENTIAL_METADATA_MAP } from "./potential.data";
import formatTemplate from "@/utils/formatTemplate";
import type { PotentialRank, StatusField } from "./potential.type";
import type { EquipmentSubcategory } from "../equipment/equipment.type";

export const PotManager = {
  /** 取得potential的metadata */
  getPotentialMetadata(id: string) {
    const meta = POTENTIAL_METADATA_MAP.get(id);
    if (!meta) throw new Error(`Invalid equip pot id: ${id}`);
    return meta;
  },
  /**  把rank轉成中文 */
  rankToZh(currRank: PotentialRank): string {
    const currIndex = this.getIndex(currRank);
    return POTENTIAL_RANK_LIST[currIndex]["name"];
  },
  /**  取得目前的索引 */
  getIndex(currRank: PotentialRank) {
    return POTENTIAL_RANK_LIST.findIndex((r) => r.rank === currRank);
  },
  /**  取得下一階級 (若已是最高則回傳原階級) */
  getNext(currRank: PotentialRank): PotentialRank {
    const currIndex = this.getIndex(currRank);
    const nextIndex = Math.min(currIndex + 1, POTENTIAL_RANK_LIST.length - 1);
    return POTENTIAL_RANK_LIST[nextIndex].rank;
  },
  /**  取得前一階級 (若已是最低則回傳原階級) */
  getPrev(currRank: PotentialRank): PotentialRank {
    const currIndex = this.getIndex(currRank);
    const prevIndex = Math.max(currIndex - 1, 0);
    return POTENTIAL_RANK_LIST[prevIndex].rank;
  },
  indexToRank(index: number): PotentialRank {
    if (index < 0) return "normal";
    else if (index >= POTENTIAL_RANK_LIST.length) return "legendary";
    return POTENTIAL_RANK_LIST[index].rank;
  },
  getRelatedFields: (field: StatusField) => {
    if (!field) return [];
    return STATUS_FIELD_MAP.get(field)?.relatedFields ?? [];
  },
  /**  確認潛能符合限制 */
  validateLineRules(ids: string[]) {
    const potentialMetas = ids.map((id) => this.getPotentialMetadata(id));
    const counts = new Map<string, number>();

    for (const meta of potentialMetas) {
      const { limit } = meta;
      if (limit) {
        counts.set(limit.key, (counts.get(limit.key) ?? 0) + 1);
        if (counts.get(limit.key)! > limit.max) return false;
      }
    }

    return true;
  },
  /**  解析潛能：回傳數值、顯示文字與相關資訊 */
  resolvePotential(
    id: string,
    level: number,
    subcategory: EquipmentSubcategory,
  ) {
    const meta = this.getPotentialMetadata(id);

    const { template, overrides, rank, field } = meta;
    let finalValues = this.getMatchedValues(id, level);

    // 如果有針對特定子分類的覆蓋值，則使用它
    if (overrides?.[subcategory]) {
      // 假設 overrides 也是一個 value 陣列，取第一個
      const overrideValue = overrides[subcategory]?.[0];
      if (overrideValue) {
        finalValues = { x: overrideValue.x, y: overrideValue.y ?? 0 };
      }
    }

    return {
      meta,
      rank,
      field,
      values: finalValues,
      display: formatTemplate(template, finalValues),
    };
  },
  getMatchedValues(id: string, level: number) {
    const meta = this.getPotentialMetadata(id);

    let matchedValues = { x: 0, y: 0 };

    let { values } = meta;

    for (let i = values.length - 1; i >= 0; i--) {
      const { minLevel, x, y } = values[i];
      if (level >= minLevel) {
        matchedValues = { x, y: y ?? 0 };
        break;
      }
    }

    return matchedValues;
  },
};
