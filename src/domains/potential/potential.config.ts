import type { PotentialRank, StatusField } from "./potential.type";

export const STATUS_FIELDS = [
  { name: "STR", field: "str", relatedFields: [] },
  { name: "DEX", field: "dex", relatedFields: [] },
  { name: "INT", field: "int", relatedFields: [] },
  { name: "LUK", field: "luk", relatedFields: [] },
  {
    name: "全屬性",
    field: "allStat",
    relatedFields: ["str", "dex", "int", "luk"],
  },
  { name: "最大HP", field: "mhp", relatedFields: [] },
  { name: "最大MP", field: "mmp", relatedFields: [] },
  { name: "物理攻擊力", field: "pad", relatedFields: [] },
  { name: "魔法攻擊力", field: "mad", relatedFields: [] },
  { name: "STR%", field: "strR", relatedFields: [] },
  { name: "DEX%", field: "dexR", relatedFields: [] },
  { name: "INT%", field: "intR", relatedFields: [] },
  { name: "LUK%", field: "lukR", relatedFields: [] },
  {
    name: "全屬性%",
    field: "allStatR",
    relatedFields: ["strR", "dexR", "intR", "lukR"],
  },
  { name: "最大HP%", field: "mhpR", relatedFields: [] },
  { name: "最大MP%", field: "mmpR", relatedFields: [] },
  { name: "每9級增加STR", field: "strLevel", relatedFields: [] },
  { name: "每9級增加DEX", field: "dexLevel", relatedFields: [] },
  { name: "每9級增加INT", field: "intLevel", relatedFields: [] },
  { name: "每9級增加LUK", field: "lukLevel", relatedFields: [] },
  { name: "物理攻擊力%", field: "padR", relatedFields: [] },
  { name: "魔法攻擊力%", field: "madR", relatedFields: [] },
  { name: "爆擊機率%", field: "crit", relatedFields: [] },
  { name: "總傷害%", field: "damR", relatedFields: [] },
  { name: "無視怪物防禦力%", field: "imdR", relatedFields: [] },
  { name: "BOSS傷害%", field: "bdR", relatedFields: [] },
  { name: "爆擊傷害%", field: "critDamR", relatedFields: [] },
  { name: "減少所有技能冷卻時間", field: "cd", relatedFields: [] },
  { name: "楓幣獲得量%", field: "coin", relatedFields: [] },
  { name: "道具掉落率%", field: "drop", relatedFields: [] },
  { name: "最終傷害%", field: "finalDam", relatedFields: [] },
  { name: "加持技能持續時間", field: "buffTime", relatedFields: [] },
  { name: "增加被動技能等級", field: "passiveLevel", relatedFields: [] },
] as const;

type RankInfo = {
  name: string;
  rank: PotentialRank;
};

export const POTENTIAL_RANK_LIST: RankInfo[] = [
  { name: "普通", rank: "normal" },
  { name: "特殊", rank: "rare" },
  { name: "稀有", rank: "epic" },
  { name: "罕見", rank: "unique" },
  { name: "傳說", rank: "legendary" },
];

export const STATUS_FIELD_MAP = new Map<
  NonNullable<StatusField>,
  { name: string; relatedFields: NonNullable<StatusField>[] }
>(
  STATUS_FIELDS.map((data) => [
    data.field,
    { name: data.name, relatedFields: [...data.relatedFields] },
  ]),
);
