import type { CompanionItemId } from "../companion/type";
import type { CubeId } from "../cube/type";
import type { MoeCubeId } from "../enhancement/moe/moe.type";
import type { SoulId } from "../enhancement/soul/soul.type";
import type { EquipmentRank, PotentialRank } from "../potential/potential.type";

/**
 * UI 類型識別：用於決定渲染哪種強化介面
 */
export type CubeUIType =
  | "restore" // 可選前後（恢復方塊類）
  | "direct" // 直接洗（工匠、名匠、對等類）
  | "combine" // 先隨機某排再決定（結合方塊類）
  | "hexa" // 6 選 3（閃炫方塊類）
  | "accumulate"; // 累加型跳框（閃亮方塊類）

export type ShinyPity = Record<Exclude<EquipmentRank, "legendary">, number>;

export type RankUpOptions = number | ShinyPity;

export type CubePools = Record<PotentialRank, { id: string; weight: number }[]>;

/**
 * 廣義的強化 UI 類型，未來擴充用
 */
export type EnhancementUIType =
  | CubeUIType
  | "scroll" // 卷軸
  | "starforce" // 星力
  | "starflame"; // 星火

/**
 * 抽潛能結果介面
 */
export interface PotentialResult {
  lines: string[]; // 潛能 ID 列表
  tier: EquipmentRank;
}

/**
 * 所以強化道具的id
 */
export type EnhancementItemId = CubeId | CompanionItemId | MoeCubeId | SoulId;
