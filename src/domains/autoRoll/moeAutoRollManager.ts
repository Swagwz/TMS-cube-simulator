import { STATUS_FIELD_MAP } from "@/domains/potential/potential.config";
import type { StatusField } from "@/domains/potential/potential.type";
import type {
  MoeAutoRollTarget,
  StatParser,
  StatSummary,
} from "./autoRoll.type";
import { MoeManager } from "../enhancement/moe/moeManager";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import type { MoeCubeId } from "../enhancement/moe/moe.type";

export class MoeAutoRollMatcher {
  private rules: Map<StatusField, number>[];
  public readonly relevantFields = new Set<StatusField>();

  constructor(targets: MoeAutoRollTarget[]) {
    this.rules = targets
      .map((target) => {
        const rule = new Map<StatusField, number>();
        target.stats.forEach(({ field, value }) => {
          if (!field) return;
          this.relevantFields.add(field);
          rule.set(field, (rule.get(field) || 0) + value);
          const related = STATUS_FIELD_MAP.get(field)?.relatedFields;
          related?.forEach((f) => {
            this.relevantFields.add(f);
            rule.set(f, (rule.get(f) || 0) + value);
          });
        });
        return rule;
      })
      .filter((rule) => rule.size > 0);
  }

  isMatch(statArrays: StatSummary): boolean {
    if (this.rules.length === 0) return true;

    return this.rules.some((rule) => {
      for (const [field, requiredValue] of rule) {
        const arr = statArrays.get(field) || [];
        const top3 = arr
          .slice()
          .sort((a, b) => b - a)
          .slice(0, 3);
        const sumTop3 = top3.reduce((a, b) => a + b, 0);
        if (sumTop3 < requiredValue) return false;
      }
      return true;
    });
  }
}

export const MoeStatParser: StatParser = {
  parse(ids: string[]): StatSummary {
    const summary: StatSummary = new Map();

    ids.forEach((id) => {
      const meta = MoeManager.getPotentialMetadata(id);
      if (!meta.field) return;

      const val = meta.value.x;

      // 1. 處理自身屬性：將每個 slot 的貢獻推入陣列
      const arr = summary.get(meta.field) || [];
      arr.push(val);
      summary.set(meta.field, arr);

      // 2. 處理關聯屬性 (例如全屬性 -> STR, DEX...)
      const related = MoeManager.getRelatedFields(meta.field);
      related.forEach((f) => {
        const r = summary.get(f) || [];
        r.push(val);
        summary.set(f, r);
      });
    });

    // sort desc for each field
    for (const [, v] of summary) {
      v.sort((a, b) => b - a);
    }

    return summary;
  },
};

export const MoeAutoRoll = {
  /**
   * 取得該分類下所有 field !== null 的潛能選項 (用於下拉選單)
   */
  getOptions(subcategory: MoeCardSubcategory) {
    const potList = MoeManager.getPotentialPool(subcategory);
    if (!potList) return [];

    return potList
      .filter((entry) => entry.field && STATUS_FIELD_MAP.has(entry.field))
      .map((entry) => {
        return {
          field: entry.field!,
          label: STATUS_FIELD_MAP.get(entry.field!)?.name,
        };
      });
  },
  calcProb(
    subcategory: MoeCardSubcategory,
    cube: MoeCubeId,
    target: MoeAutoRollTarget,
  ) {
    const pool = MoeManager.getPotentialPool(subcategory);
    const totalWeight = pool.reduce((acc, curr) => acc + curr.weights[cube], 0);

    const matchcer = new MoeAutoRollMatcher([target]);

    const optimizedPool = pool
      .filter((data) => {
        if (matchcer.relevantFields.has(data.field)) return true;

        const related = MoeManager.getRelatedFields(data.field);
        if (!related.length) return false;

        return related.some((field) => matchcer.relevantFields.has(field));
      })
      .map((data) => ({
        field: data.field,
        val: data.value.x,
        prob: data.weights[cube] / totalWeight,
      }));

    let finalProb = 0;
    const TOTAL_SLOTS = 3;

    function dfs(
      slotIndex: number,
      currArrays: Map<StatusField, number[]>,
      currProb: number,
    ) {
      const isSuccess = matchcer.isMatch(currArrays as StatSummary);

      if (isSuccess) {
        finalProb += currProb;
        return;
      }
      if (slotIndex === TOTAL_SLOTS) return;

      optimizedPool.forEach(({ field, val, prob }) => {
        const nextArrays = new Map<StatusField, number[]>();
        // copy previous arrays
        for (const [k, v] of currArrays) {
          nextArrays.set(k, v.slice());
        }

        // 處理自身field
        const arr = nextArrays.get(field) || [];
        arr.push(val);
        nextArrays.set(field, arr);

        // 處理related fields
        const related = MoeManager.getRelatedFields(field);
        related.forEach((f) => {
          if (matchcer.relevantFields.has(f)) {
            const r = nextArrays.get(f) || [];
            r.push(val);
            nextArrays.set(f, r);
          }
        });

        dfs(slotIndex + 1, nextArrays, currProb * prob);
      });
    }

    dfs(0, new Map<StatusField, number[]>(), 1);
    return finalProb;
  },
};
