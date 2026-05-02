import { STATUS_FIELD_MAP } from "@/domains/potential/potential.config";
import type {
  EquipmentRank,
  StatusField,
} from "@/domains/potential/potential.type";
import { PotManager } from "@/domains/potential/potManager";
import type {
  EquipmentAutoRollTarget,
  EquipmentStatParser,
  StatSummary,
} from "./autoRoll.type";
import type {
  EquipmentSubcategory,
  PotentialFeature,
} from "@/domains/equipment/equipment.type";
import { EquipManager } from "@/domains/equipment/equipManager";
import type { CubeId } from "../cube/type";
import { CubeManager } from "../enhancement/cube/cubeManager";

export class EquipmentAutoRollMatcher {
  private rules: {
    rank: EquipmentRank | null;
    stats: Map<StatusField, number>;
  }[];
  public readonly relevantFields = new Set<StatusField>();

  constructor(targets: EquipmentAutoRollTarget[]) {
    this.rules = targets
      .map((target) => {
        const stats = new Map<StatusField, number>();

        target.stats.forEach(({ field, value }) => {
          if (!field) return;
          this.relevantFields.add(field);
          stats.set(field, (stats.get(field) || 0) + value);

          const related = STATUS_FIELD_MAP.get(field)?.relatedFields;
          related?.forEach((f) => {
            this.relevantFields.add(f);
            stats.set(f, (stats.get(f) || 0) + value);
          });
        });

        return { rank: target.rank, stats };
      })
      .filter((rule) => rule.stats.size > 0);
  }

  isMatch(statArrays: StatSummary, currentRank: EquipmentRank): boolean {
    if (this.rules.length === 0) return true;

    return this.rules.some((rule) => {
      // 比對的時候要看target.rank有沒有設定
      if (rule.rank) {
        const currentRankIndex = PotManager.getIndex(currentRank);
        const targetRankIndex = PotManager.getIndex(rule.rank);
        // 有設定再比對 且currRankIndex要>=targetRankIndex 才會過
        if (currentRankIndex < targetRankIndex) return false;
      }
      for (const [field, requiredValue] of rule.stats) {
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

export const StatParser: EquipmentStatParser = {
  parse(
    ids: string[],
    level: number,
    subcategory: EquipmentSubcategory,
  ): StatSummary {
    const summary: StatSummary = new Map();

    ids.forEach((id) => {
      const meta = PotManager.getPotentialMetadata(id);
      if (!meta.field) return;
      const val = PotManager.resolvePotential(id, level, subcategory).values.x;

      const arr = summary.get(meta.field) || [];
      arr.push(val);
      summary.set(meta.field, arr);

      const related = PotManager.getRelatedFields(meta.field);
      related.forEach((f) => {
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

export const PotentialAutoRoll = {
  /**
   * 取得該分類下所有 field !== null 的潛能選項 (用於下拉選單)
   */
  getOptions(
    subcategory: EquipmentSubcategory,
    level: number,
    feature: PotentialFeature,
    tier: EquipmentRank,
  ) {
    const potList = EquipManager.getPotentialOptions({
      subcategory,
      level,
      rank: tier,
      feature,
    }).map((id) => PotManager.getPotentialMetadata(id));

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
    subcategory: EquipmentSubcategory,
    level: number,
    tier: EquipmentRank,
    cube: CubeId,
    target: EquipmentAutoRollTarget,
    lineRankArr: [number, number][],
  ) {
    const matchcer = new EquipmentAutoRollMatcher([target]);

    const pools = CubeManager.getCubePotentialPools(cube, {
      subcategory,
      level,
    });
    const primePool = pools[tier];
    const nonPrimePool = pools[PotManager.getPrev(tier)];

    function optimizePotentialPool(pool: { id: string; weight: number }[]) {
      const totalWeight = pool.reduce((acc, curr) => acc + curr.weight, 0);
      return pool
        .map(({ id, weight }) => ({
          ...PotManager.getPotentialMetadata(id),
          prob: weight / totalWeight,
        }))
        .filter((data) => {
          // 被限制的潛能
          if (data.limit) return true;
          if (matchcer.relevantFields.has(data.field)) return true;

          const related = PotManager.getRelatedFields(data.field);
          if (!related.length) return false;

          return related.some((field) => matchcer.relevantFields.has(field));
        })
        .map((data) => ({
          field: data.field,
          val: PotManager.resolvePotential(data.id, level, subcategory).values
            .x,
          prob: data.prob,
          limit: data.limit,
        }));
    }

    const optimizedPrimePool = optimizePotentialPool(primePool);
    const optimizedNonPrimePool = optimizePotentialPool(nonPrimePool);

    let finalProb = 0;
    let totalValidProb = 0;
    const TOTAL_SLOTS = lineRankArr.length;

    function dfs(
      slotIndex: number,
      currArrays: Map<StatusField, number[]>,
      currLimits: Map<string, number>,
      currProb: number,
    ) {
      if (slotIndex === TOTAL_SLOTS) {
        totalValidProb += currProb;
        if (matchcer.isMatch(currArrays as StatSummary, tier)) {
          finalProb += currProb;
        }
        return;
      }

      const currPool = optimizedPrimePool
        .map((data) => ({
          ...data,
          prob: (data.prob * lineRankArr[slotIndex][0]) / 100,
        }))
        .concat(
          optimizedNonPrimePool.map((data) => ({
            ...data,
            prob: (data.prob * lineRankArr[slotIndex][1]) / 100,
          })),
        )
        .filter((data) => data.prob > 0);

      currPool.push({
        field: null,
        val: 0,
        prob: 1 - currPool.reduce((acc, curr) => acc + curr.prob, 0),
        limit: undefined,
      });

      currPool.forEach(({ field, val, prob, limit }) => {
        if (limit) {
          const count = currLimits.get(limit.key) || 0;
          if (count >= limit.max) return;
        }

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
        const related = PotManager.getRelatedFields(field);
        related.forEach((f) => {
          if (matchcer.relevantFields.has(f)) {
            const r = nextArrays.get(f) || [];
            r.push(val);
            nextArrays.set(f, r);
          }
        });

        const nextLimits = new Map(currLimits);
        if (limit) {
          nextLimits.set(limit.key, (nextLimits.get(limit.key) || 0) + 1);
        }

        dfs(slotIndex + 1, nextArrays, nextLimits, currProb * prob);
      });
    }
    dfs(0, new Map<StatusField, number[]>(), new Map(), 1);

    return totalValidProb > 0 ? finalProb / totalValidProb : 0;
  },
};
