import { proxy } from "valtio";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import type {
  BaseStats,
  EquipmentSubcategory,
  PotentialFeature,
  EquipmentCapabilities,
  EnhancementItemId,
} from "@/domains/equipment/equipment.type";
import type { CompanionItemId } from "../companion/type";

export type PotentialGroup = {
  tier: EquipmentRank;
  potIds: string[];
};

export interface Statistics {
  counts: Partial<Record<EnhancementItemId, number>>;
}

/**
 * 裝備初始化/還原所需的所有資料結構
 */
export interface EquipmentData {
  id?: string;
  name: string;
  subcategory: EquipmentSubcategory;
  level: number;
  baseStats: BaseStats;
  mainPot: PotentialGroup;
  additionalPot: PotentialGroup;
  soul?: string | null;
  statistics?: Statistics;
  capabilities?: Partial<EquipmentCapabilities>;
  /**
   * 原始快照：代表最初創建時的資料。
   * 若從 localStorage 還原，此處應包含保存時的 _origin 內容。
   */
  _origin?: {
    readonly mainPot: PotentialGroup;
    readonly additionalPot: PotentialGroup;
    readonly soul: string | null;
  };
}

/**
 * 裝備領域物件基類：封裝狀態與行為
 */
export abstract class BaseEquipment {
  readonly id: string;
  readonly entity = "equipment" as const;
  readonly name: string;
  readonly subcategory: EquipmentSubcategory;
  readonly level: number;
  readonly baseStats: BaseStats;

  // 強化能力：由子類預設與傳入資料合併決定
  readonly capabilities: EquipmentCapabilities;

  mainPot: PotentialGroup;
  additionalPot: PotentialGroup;
  soul: string | null;

  statistics: Statistics;

  /**
   * 最初創建時的資料快照。
   * 一旦設定後不再更改，用於 reset() 功能。
   */
  protected readonly _origin: {
    readonly mainPot: PotentialGroup;
    readonly additionalPot: PotentialGroup;
    readonly soul: string | null;
  };

  /** 子類別必須定義其預設的強化能力矩陣 */
  protected abstract get defaultCapabilities(): EquipmentCapabilities;

  constructor(data: EquipmentData) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name;
    this.subcategory = data.subcategory;
    this.level = data.level;
    this.baseStats = { ...data.baseStats };

    this.mainPot = structuredClone(data.mainPot);
    this.additionalPot = structuredClone(data.additionalPot);
    this.soul = data.soul || null;
    this.statistics = data.statistics || { counts: {} };

    // 封裝邏輯：origin 是最初創建時的 data
    // 如果 data 中已有 _origin (來自 localStorage)，則還原它；
    // 否則，將當前傳入的狀態視為「最初創建」的狀態。
    this._origin = data._origin
      ? structuredClone(data._origin)
      : structuredClone({
          mainPot: data.mainPot,
          additionalPot: data.additionalPot,
          soul: data.soul || null,
        });

    // 初始化能力 (延遲到子類別 super() 之後呼叫 setupCapabilities 完成賦值)
    this.capabilities = {} as EquipmentCapabilities;
  }

  /**
   * 輔助方法：合併子類預設值與外部覆寫項
   */
  protected setupCapabilities(
    overrides?: Partial<EquipmentCapabilities>,
  ): EquipmentCapabilities {
    return {
      ...this.defaultCapabilities,
      ...(overrides ?? {}),
    };
  }

  /**
   * 更新潛能組
   */
  updatePotential(
    feature: PotentialFeature,
    tier: EquipmentRank,
    potIds: string[],
  ) {
    if (!this.capabilities[feature]) {
      throw new Error(`This equipment does not support ${feature}`);
    }
    this[feature].tier = tier;
    this[feature].potIds = [...potIds];
  }

  /**
   * 增加強化次數統計
   */
  incrementCount(itemId: EnhancementItemId) {
    const current = this.statistics.counts[itemId] || 0;
    this.statistics.counts[itemId] = current + 1;
  }

  /**
   * 重置裝備到初始狀態
   */
  reset() {
    this.mainPot = structuredClone(this._origin.mainPot);
    this.additionalPot = structuredClone(this._origin.additionalPot);
    this.soul = this._origin.soul;
    this.statistics.counts = {};
  }

  /**
   * 歸零統計次數
   */
  clearStatistics() {
    this.statistics.counts = {};
  }
}
