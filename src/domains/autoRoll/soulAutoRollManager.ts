import { STATUS_FIELD_MAP } from "@/domains/potential/potential.config";
import type { StatusField } from "@/domains/potential/potential.type";
import type {
  SoulAutoRollTarget,
  SoulStatParser,
  StatSummary,
} from "./autoRoll.type";
import { SoulManager } from "../enhancement/soul/soulManager";
import { SOUL_POTENTIAL_ID_MAP } from "../enhancement/soul/soul.data";

export class SoulAutoRollMatcher {
  private rules: Map<StatusField, number>[];
  public readonly relevantFields = new Set<StatusField>();

  constructor(targets: SoulAutoRollTarget[]) {
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
        // Soul usually has 1 line, so sum is just the value.
        const sum = arr.reduce((a, b) => a + b, 0);
        if (sum < requiredValue) return false;
      }
      return true;
    });
  }
}

export const StatParser: SoulStatParser = {
  parse(ids: string[], level: number): StatSummary {
    const summary: StatSummary = new Map();

    ids.forEach((id) => {
      const data = SOUL_POTENTIAL_ID_MAP.get(id);
      if (!data || !data.field) return;

      let val = 0;
      // Logic from SoulManager.getLine
      for (let i = data.values.length - 1; i >= 0; i--) {
        const { minLevel, x } = data.values[i];
        if (level < minLevel) continue;
        val = x;
        break;
      }

      const arr = summary.get(data.field) || [];
      arr.push(val);
      summary.set(data.field, arr);

      const related = STATUS_FIELD_MAP.get(data.field)?.relatedFields;
      related?.forEach((f) => {
        const r = summary.get(f) || [];
        r.push(val);
        summary.set(f, r);
      });
    });

    for (const [, v] of summary) {
      v.sort((a, b) => b - a);
    }

    return summary;
  },
};

export const SoulAutoRoll = {
  getOptions() {
    const potList = SoulManager.getPotPool().map((entry) =>
      SoulManager.getPotentialMetadata(entry.id),
    );

    const uniqueFields = new Set(
      potList
        .map((entry) => entry.field)
        .filter(
          (field): field is NonNullable<StatusField> =>
            !!field && STATUS_FIELD_MAP.has(field),
        ),
    );

    return Array.from(uniqueFields).map((field) => {
      return {
        field,
        label: STATUS_FIELD_MAP.get(field)?.name,
      };
    });
  },
  calcProb(target: SoulAutoRollTarget, level: number) {
    const pool = SoulManager.getPotPool();
    const matcher = new SoulAutoRollMatcher([target]);

    let totalProb = 0;

    pool.forEach((entry) => {
      // Since Soul only has 1 line, we can check each entry directly
      // instead of using DFS like Moe/Equip
      const summary = StatParser.parse([entry.id], level);

      if (matcher.isMatch(summary)) {
        // SoulManager.getPotPool returns prob as percentage (0-100)
        totalProb += entry.prob;
      }
    });

    // Return as 0-1 probability
    return totalProb / 100;
  },
};
