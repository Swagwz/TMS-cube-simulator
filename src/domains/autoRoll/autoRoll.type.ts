import type { StatusField } from "../potential/potential.type";

// 基礎統計目標
export type StatTarget = {
  field: StatusField | null;
  value: number;
};

// Moe 自動洗潛 (無等級)
export type MoeAutoRollTarget = {
  stats: StatTarget[];
};

// Soul 自動洗潛
export type SoulAutoRollTarget = {
  stats: StatTarget[];
};

export type StatSummary = Map<StatusField, number[]>;

export interface MoeStatParser {
  parse(ids: string[]): StatSummary;
}

export interface SoulStatParser {
  parse(ids: string[], level: number): StatSummary;
}
