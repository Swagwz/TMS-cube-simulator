import type { EquipmentRank, StatusField } from "../potential/potential.type";

// 基礎統計目標
export type StatTarget = {
  field: StatusField | null;
  value: number;
};

// Moe 自動洗潛 (無等級)
export type MoeAutoRollTarget = {
  stats: StatTarget[];
};

// Equipment 自動洗潛 (有等級)
export type EquipmentAutoRollTarget = {
  stats: StatTarget[];
  rank: EquipmentRank | null;
};

export type StatSummary = Map<StatusField, number[]>;

export interface StatParser {
  parse(ids: string[], level?: number): StatSummary;
}
