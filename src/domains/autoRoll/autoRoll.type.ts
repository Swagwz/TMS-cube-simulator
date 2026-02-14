import type { EquipmentRank, StatusField } from "../potential/potential.type";
import type { EquipmentSubcategory } from "../equipment/equipment.type";

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

// Soul 自動洗潛
export type SoulAutoRollTarget = {
  stats: StatTarget[];
};

export type StatSummary = Map<StatusField, number[]>;

export interface MoeStatParser {
  parse(ids: string[]): StatSummary;
}

export interface EquipmentStatParser {
  parse(
    ids: string[],
    level: number,
    subcategory: EquipmentSubcategory,
  ): StatSummary;
}

export interface SoulStatParser {
  parse(ids: string[], level: number): StatSummary;
}
