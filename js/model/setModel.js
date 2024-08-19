"use strict";

import { findProbability, $doc } from "./helper.js";

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// 一般潛能
// 帽子,上衣,套服,下衣,手套,披風,腰帶,肩膀,機器心臟
const setting1 = {
  lv: 0,
  item: [
    "hat",
    "top",
    "suit",
    "bottom",
    "gloves",
    "cloak",
    "belt",
    "shoulder",
    "heart",
    "ring",
    "necklace",
    "earrings",
    "face",
    "eyes",
  ],
  prob: [
    ["STR +6"],
    ["DEX +6"],
    ["INT +6"],
    ["LUK +6"],
    ["最大HP +60"],
    ["最大MP +60"],
    ["防禦率 +60"],
  ],
};

// 鞋子
const setting2 = {
  lv: 0,
  item: ["shoes"],
  prob: [
    ["STR +6"],
    ["DEX +6"],
    ["INT +6"],
    ["LUK +6"],
    ["最大HP +60"],
    ["最大MP +60"],
    ["移動速度 +4"],
    ["跳躍力 +4"],
    ["防禦率 +60"],
  ],
};

// 武器, 徽章, 輔助武器(力量之盾, 靈魂盾牌除外)
const setting3 = {
  lv: 0,
  item: ["weapon", "second-weapon", "badge"],
  prob: [
    ["STR +6"],
    ["DEX +6"],
    ["INT +6"],
    ["LUK +6"],
    ["最大HP +60"],
    ["最大MP +60"],
    ["物理攻擊力 +6"],
    ["魔法攻擊力 +6"],
  ],
};

// 輔助武器(力量之盾, 靈魂盾牌)
const setting4 = {
  lv: 0,
  item: ["shield"],
  prob: [
    ["STR +6"],
    ["DEX +6"],
    ["INT +6"],
    ["LUK +6"],
    ["最大HP +60"],
    ["物理攻擊力 +6"],
    ["魔法攻擊力 +6"],
  ],
};

// 特殊等級
// 帽子,上衣,套服,下衣,手套,披風,腰帶,肩膀,機器心臟
const settingN1 = {
  lv: 1,
  item: [
    "hat",
    "top",
    "bottom",
    "suit",
    "gloves",
    "cloak",
    "belt",
    "shoulder",
    "heart",
  ],
  prob: [
    ["STR +13"],
    ["DEX +13"],
    ["INT +13"],
    ["LUK +13"],
    ["最大HP +125"],
    ["最大MP +125"],
    ["防禦率 +125"],
    ["STR +4%"],
    ["DEX +4%"],
    ["INT +4%"],
    ["LUK +4%"],
    ["最大HP +4%"],
    ["最大MP +4%"],
    ["防禦率 +4%"],
    ["全屬性 +6"],
  ],
};

// 鞋子
const settingN2 = {
  lv: 1,
  item: ["shoes"],
  prob: [
    ["移動速度 +8"],
    ["跳躍力 +8"],
    ["STR +13"],
    ["DEX +13"],
    ["INT +13"],
    ["LUK +13"],
    ["最大HP +125"],
    ["最大MP +125"],
    ["防禦率 +125"],
    ["STR +4%"],
    ["DEX +4%"],
    ["INT +4%"],
    ["LUK +4%"],
    ["最大HP +4%"],
    ["最大MP +4%"],
    ["防禦率 +4%"],
    ["全屬性 +6"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const settingN3 = {
  lv: 1,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    ["STR +13"],
    ["DEX +13"],
    ["INT +13"],
    ["LUK +13"],
    ["最大HP +125"],
    ["最大MP +125"],
    ["防禦率 +125"],
    ["STR +4%"],
    ["DEX +4%"],
    ["INT +4%"],
    ["LUK +4%"],
    ["最大HP +4%"],
    ["最大MP +4%"],
    ["防禦率 +4%"],
    ["全屬性 +6"],
    ["每4秒恢復24HP"],
    ["每4秒恢復24MP"],
  ],
};

// 武器, 徽章, 輔助武器(力量之盾, 靈魂盾牌除外)
const settingN4 = {
  lv: 1,
  item: ["weapon", "second-weapon", "badge"],
  prob: [
    ["STR +13"],
    ["DEX +13"],
    ["INT +13"],
    ["LUK +13"],
    ["最大HP +125"],
    ["最大MP +125"],
    ["物理攻擊力 +13"],
    ["魔法攻擊力 +13"],
    ["STR +4%"],
    ["DEX +4%"],
    ["INT +4%"],
    ["LUK +4%"],
    ["物理攻擊力 +4%"],
    ["魔法攻擊力 +4%"],
    ["爆擊機率 +4%"],
    ["總傷害 +4%"],
    ["全屬性 +6"],
    ["攻擊時有 3% 機率恢復 33 HP"],
    ["攻擊時有 3% 機率恢復 33 MP"],
    ["攻擊時有 10% 機率發動 6級 中毒效果"],
    ["攻擊時有 5% 機率發動 2級 昏迷效果"],
    ["攻擊時有 10% 機率發動 2級 緩慢效果"],
    ["攻擊時有 10% 機率發動 3級 闇黑效果"],
    ["攻擊時有 5% 機率發動 2級 冰結效果"],
    ["攻擊時有 5% 機率發動 2級 封印效果"],
    ["無視怪物防禦率 +15%"],
  ],
};

// 輔助武器(力量之盾, 靈魂盾牌)
const settingN5 = {
  lv: 1,
  item: ["shield"],
  prob: [
    ["STR +13"],
    ["DEX +13"],
    ["INT +13"],
    ["LUK +13"],
    ["最大HP +125"],
    ["物理攻擊力 +13"],
    ["魔法攻擊力 +13"],
    ["STR +4%"],
    ["DEX +4%"],
    ["INT +4%"],
    ["LUK +4%"],
    ["物理攻擊力 +4%"],
    ["魔法攻擊力 +4%"],
    ["爆擊機率 +4%"],
    ["總傷害 +4%"],
    ["全屬性 +6"],
    ["攻擊時有 3% 機率恢復 33 MP"],
    ["攻擊時有 10% 機率發動 6級 中毒效果"],
    ["攻擊時有 5% 機率發動 2級 昏迷效果"],
    ["攻擊時有 10% 機率發動 2級 緩慢效果"],
    ["攻擊時有 10% 機率發動 3級 闇黑效果"],
    ["攻擊時有 5% 機率發動 2級 冰結效果"],
    ["攻擊時有 5% 機率發動 2級 封印效果"],
    ["無視怪物防禦率 +15%"],
  ],
};

// 稀有等級
// 帽子,下衣,披風,腰帶,肩膀,機器心臟
const settingR1 = {
  lv: 2,
  item: ["hat", "bottom", "cloak", "belt", "shoulder", "heart"],
  prob: [
    ["STR +7%"],
    ["DEX +7%"],
    ["INT +7%"],
    ["LUK +7%"],
    ["最大HP +7%"],
    ["最大MP +7%"],
    ["防禦率 +7%"],
    ["全屬性 +4%"],
    ["被擊中時有 20% 機率無視 26 傷害"],
    ["被擊中時有 20% 機率無視 39 傷害"],
    ["被擊中時有 30% 機率無視 53 傷害"],
  ],
};

// 上衣,套服
const settingR2 = {
  lv: 2,
  item: ["top", "suit"],
  prob: [
    ["被擊中後無敵時間增加 +1 秒"],
    ["STR +7%"],
    ["DEX +7%"],
    ["INT +7%"],
    ["LUK +7%"],
    ["最大HP +7%"],
    ["最大MP +7%"],
    ["防禦率 +7%"],
    ["全屬性 +4%"],
    ["被擊中時有 20% 機率無視 26 傷害"],
    ["被擊中時有 20% 機率無視 39 傷害"],
    ["被擊中時有 30% 機率無視 53 傷害"],
  ],
};

// 手套
const settingR3 = {
  lv: 2,
  item: ["gloves"],
  prob: [
    ["擊殺怪物有 15% 機率恢復 95 HP"],
    ["擊殺怪物有 15% 機率恢復 95 MP"],
    ["STR +7%"],
    ["DEX +7%"],
    ["INT +7%"],
    ["LUK +7%"],
    ["最大HP +7%"],
    ["最大MP +7%"],
    ["防禦率 +7%"],
    ["全屬性 +4%"],
    ["被擊中時有 20% 機率無視 26 傷害"],
    ["被擊中時有 20% 機率無視 39 傷害"],
    ["被擊中時有 30% 機率無視 53 傷害"],
  ],
};

// 鞋子
const settingR4 = {
  lv: 2,
  item: ["shoes"],
  prob: [
    ["STR +7%"],
    ["DEX +7%"],
    ["INT +7%"],
    ["LUK +7%"],
    ["最大HP +7%"],
    ["最大MP +7%"],
    ["防禦率 +7%"],
    ["全屬性 +4%"],
    ["被擊中時有 20% 機率無視 26 傷害"],
    ["被擊中時有 20% 機率無視 39 傷害"],
    ["被擊中時有 30% 機率無視 53 傷害"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const settingR5 = {
  lv: 2,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    ["STR +7%"],
    ["DEX +7%"],
    ["INT +7%"],
    ["LUK +7%"],
    ["最大HP +7%"],
    ["最大MP +7%"],
    ["防禦率 +7%"],
    ["全屬性 +4%"],
  ],
};

// 武器, 徽章, 輔助武器(力量之盾, 靈魂盾牌除外)
const settingR6 = {
  lv: 2,
  item: ["weapon", "second-weapon", "badge"],
  prob: [
    ["物理攻擊力 +7%"],
    ["魔法攻擊力 +7%"],
    ["爆擊機率 +8%"],
    ["總傷害 +7%"],
    ["攻擊時有 3% 機率恢復 54 HP"],
    ["攻擊時有 3% 機率恢復 54 MP"],
    ["無視怪物防禦率 +15%"],
    ["STR +7%"],
    ["DEX +7%"],
    ["INT +7%"],
    ["LUK +7%"],
    ["最大HP +7%"],
    ["最大MP +7%"],
    ["全屬性 +4%"],
  ],
};

// 輔助武器(力量之盾, 靈魂盾牌)
const settingR7 = {
  lv: 2,
  item: ["shield"],
  prob: [
    ["STR +7%"],
    ["DEX +7%"],
    ["INT +7%"],
    ["LUK +7%"],
    ["最大HP +7%"],
    ["物理攻擊力 +7%"],
    ["魔法攻擊力 +7%"],
    ["爆擊機率 +8%"],
    ["總傷害 +7%"],
    ["全屬性 +4%"],
    ["攻擊時有 3% 機率恢復 54 HP"],
    ["攻擊時有 3% 機率恢復 54 MP"],
    ["無視怪物防禦率 +15%"],
    ["被擊中時有 20% 機率無視 26 傷害"],
    ["被擊中時有 20% 機率無視 39 傷害"],
    ["被擊中時有 30% 機率無視 53 傷害"],
  ],
};

// 罕見等級
// 帽子
const settingSR1 = {
  lv: 3,
  item: ["hat"],
  prob: [
    ["可以使用<實用的時空門>技能"],
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["最大HP +10%"],
    ["最大MP +10%"],
    ["全屬性 +7%"],
    ["被擊中時有 5% 機率無視 20% 傷害"],
    ["被擊中時有 5% 機率無視 40% 傷害"],
    ["HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 上衣,套服
const settingSR2 = {
  lv: 3,
  item: ["top", "suit"],
  prob: [
    ["被擊中後無敵時間增加 +2 秒"],
    ["被擊中時有 2% 機率在 7 秒內無敵"],
    ["有 30% 機率反射 50% 所受的傷害"],
    ["有 30% 機率反射 70% 所受的傷害"],
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["最大HP +10%"],
    ["最大MP +10%"],
    ["全屬性 +7%"],
    ["被擊中時有 5% 機率無視 20% 傷害"],
    ["被擊中時有 5% 機率無視 40% 傷害"],
    ["HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 下衣
const settingSR3 = {
  lv: 3,
  item: ["bottom"],
  prob: [
    ["可以使用<實用的神聖之火>技能"],
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["最大HP +10%"],
    ["最大MP +10%"],
    ["全屬性 +7%"],
    ["被擊中時有 5% 機率無視 20% 傷害"],
    ["被擊中時有 5% 機率無視 40% 傷害"],
    ["HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 手套
const settingSR4 = {
  lv: 3,
  item: ["gloves"],
  prob: [
    ["STR +32"],
    ["DEX +32"],
    ["INT +32"],
    ["LUK +32"],
    ["可以使用<實用的會心之眼>技能"],
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["最大HP +10%"],
    ["最大MP +10%"],
    ["全屬性 +7%"],
    ["被擊中時有 5% 機率無視 20% 傷害"],
    ["被擊中時有 5% 機率無視 40% 傷害"],
    ["HP恢復道具及恢復技能效果增加 +30%"],
    ["攻擊時有 1% 機率發動自動竊取"],
    ["攻擊時有 2% 機率發動自動竊取"],
  ],
};

// 鞋子
const settingSR5 = {
  lv: 3,
  item: ["shoes"],
  prob: [
    ["可以使用<實用的速度激發>技能"],
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["最大HP +10%"],
    ["最大MP +10%"],
    ["全屬性 +7%"],
    ["被擊中時有 5% 機率無視 20% 傷害"],
    ["被擊中時有 5% 機率無視 40% 傷害"],
    ["HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 披風,腰帶,肩膀,機器心臟
const settingSR6 = {
  lv: 3,
  item: ["cloak", "belt", "shoulder", "heart"],
  prob: [
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["最大HP +10%"],
    ["最大MP +10%"],
    ["全屬性 +7%"],
    ["被擊中時有 5% 機率無視 20% 傷害"],
    ["被擊中時有 5% 機率無視 40% 傷害"],
    ["HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const settingSR7 = {
  lv: 3,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["最大HP +10%"],
    ["最大MP +10%"],
    ["全屬性 +7%"],
    ["HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 武器
const settingSR8 = {
  lv: 3,
  item: ["weapon"],
  prob: [
    ["物理攻擊力 +10%"],
    ["魔法攻擊力 +10%"],
    ["爆擊機率 +10%"],
    ["總傷害 +10%"],
    ["無視怪物防禦率 +30%"],
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["全屬性 +7%"],
    ["攻擊BOSS怪物時傷害增加 +30%"],
  ],
};
// 輔助武器(包含力量之盾, 靈魂之環)
const settingSR9 = {
  lv: 3,
  item: ["second-weapon", "shield"],
  prob: [
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["物理攻擊力 +10%"],
    ["魔法攻擊力 +10%"],
    ["爆擊機率 +10%"],
    ["總傷害 +10%"],
    ["全屬性 +7%"],
    ["無視怪物防禦率 +30%"],
    ["被擊中時有 5% 機率無視 20% 傷害"],
    ["被擊中時有 5% 機率無視 40% 傷害"],
    ["攻擊BOSS怪物時傷害增加 +30%"],
  ],
};

// 徽章
const settingSR10 = {
  lv: 3,
  item: ["badge"],
  prob: [
    ["物理攻擊力 +10%"],
    ["魔法攻擊力 +10%"],
    ["爆擊機率 +10%"],
    ["總傷害 +10%"],
    ["無視怪物防禦率 +30%"],
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["全屬性 +7%"],
  ],
};

// 傳說等級
// 帽子
const settingSSR1 = {
  lv: 4,
  item: ["hat"],
  prob: [
    ["減少所有技能冷卻時間 -1 秒"],
    ["減少所有技能冷卻時間 -2 秒"],
    ["可以使用<實用的進階祝福>技能"],
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["最大HP +13%"],
    ["最大MP +13%"],
    ["全屬性 +10%"],
    ["被擊中時有 10% 機率無視 20% 傷害"],
    ["被擊中時有 10% 機率無視 40% 傷害"],
    ["HP恢復道具及恢復技能效果增加 +40%"],
  ],
};

// 上衣,套服
const settingSSR2 = {
  lv: 4,
  item: ["top", "suit"],
  prob: [
    ["被擊中後無敵時間增加 +3 秒"],
    ["被擊中時有 4% 機率在 7 秒內無敵"],
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["最大HP +13%"],
    ["最大MP +13%"],
    ["全屬性 +10%"],
    ["被擊中時有 10% 機率無視 20% 傷害"],
    ["被擊中時有 10% 機率無視 40% 傷害"],
    ["HP恢復道具及恢復技能效果增加 +40%"],
  ],
};

// 下衣
const settingSSR3 = {
  lv: 4,
  item: ["bottom"],
  prob: [
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["最大HP +13%"],
    ["最大MP +13%"],
    ["全屬性 +10%"],
    ["被擊中時有 10% 機率無視 20% 傷害"],
    ["被擊中時有 10% 機率無視 40% 傷害"],
    ["有 30% 機率反射 50% 所受的傷害"],
    ["有 30% 機率反射 70% 所受的傷害"],
    ["HP恢復道具及恢復技能效果增加 +40%"],
  ],
};

// 手套
const settingSSR4 = {
  lv: 4,
  item: ["gloves"],
  prob: [
    ["爆擊傷害 +8%"],
    ["可以使用<實用的最終極速>技能"],
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["最大HP +13%"],
    ["最大MP +13%"],
    ["全屬性 +10%"],
    ["被擊中時有 10% 機率無視 20% 傷害"],
    ["被擊中時有 10% 機率無視 40% 傷害"],
    ["HP恢復道具及恢復技能效果增加 +40%"],
    ["攻擊時有 3% 機率發動自動竊取"],
    ["攻擊時有 5% 機率發動自動竊取"],
    ["攻擊時有 7% 機率發動自動竊取"],
  ],
};

// 鞋子
const settingSSR5 = {
  lv: 4,
  item: ["shoes"],
  prob: [
    ["可以使用<實用的戰鬥命令>技能"],
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["最大HP +13%"],
    ["最大MP +13%"],
    ["全屬性 +10%"],
    ["被擊中時有 10% 機率無視 20% 傷害"],
    ["被擊中時有 10% 機率無視 40% 傷害"],
    ["HP恢復道具及恢復技能效果增加 +40%"],
  ],
};

// 披風,腰帶,肩膀,機器心臟
const settingSSR6 = {
  lv: 4,
  item: ["cloak", "belt", "shoulder", "heart"],
  prob: [
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["最大HP +13%"],
    ["最大MP +13%"],
    ["全屬性 +10%"],
    ["被擊中時有 10% 機率無視 20% 傷害"],
    ["被擊中時有 10% 機率無視 40% 傷害"],
    ["HP恢復道具及恢復技能效果增加 +40%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const settingSSR7 = {
  lv: 4,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["最大HP +13%"],
    ["最大MP +13%"],
    ["全屬性 +10%"],
    ["所有技能的MP消耗 -15%"],
    ["所有技能的MP消耗 -30%"],
    ["HP恢復道具及恢復技能效果增加 +40%"],
    ["楓幣獲得量 +20%"],
    ["道具掉落率 +20%"],
  ],
};

// 武器
const settingSSR8 = {
  lv: 4,
  item: ["weapon"],
  prob: [
    ["物理攻擊力 +13%"],
    ["魔法攻擊力 +13%"],
    ["爆擊機率 +12%"],
    ["總傷害 +13%"],
    ["無視怪物防禦率 +35%"],
    ["無視怪物防禦率 +40%"],
    ["攻擊BOSS怪物時傷害增加 +35%"],
    ["攻擊BOSS怪物時傷害增加 +40%"],
    ["物理攻擊力 +32"],
    ["魔法攻擊力 +32"],
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["全屬性 +10%"],
  ],
};

// 輔助武器(包含力量之盾, 靈魂盾牌)
const settingSSR9 = {
  lv: 4,
  item: ["second-weapon", "shield"],
  prob: [
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["物理攻擊力 +13%"],
    ["魔法攻擊力 +13%"],
    ["爆擊機率 +12%"],
    ["總傷害 +13%"],
    ["全屬性 +10%"],
    ["無視怪物防禦率 +35%"],
    ["無視怪物防禦率 +40%"],
    ["被擊中時有 10% 機率無視 20% 傷害"],
    ["被擊中時有 10% 機率無視 40% 傷害"],
    ["攻擊BOSS怪物時傷害增加 +35%"],
    ["攻擊BOSS怪物時傷害增加 +40%"],
    ["物理攻擊力 +32"],
    ["魔法攻擊力 +32"],
  ],
};

// 徽章
const settingSSR10 = {
  lv: 4,
  item: ["badge"],
  prob: [
    ["物理攻擊力 +13%"],
    ["魔法攻擊力 +13%"],
    ["總傷害 +13%"],
    ["無視怪物防禦率 +35%"],
    ["無視怪物防禦率 +40%"],
    ["爆擊機率 +12%"],
    ["物理攻擊力 +32"],
    ["魔法攻擊力 +32"],
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["全屬性 +10%"],
  ],
};

export const settingProb = [
  setting1,
  setting2,
  setting3,
  setting4,
  settingN1,
  settingN2,
  settingN3,
  settingN4,
  settingN5,
  settingR1,
  settingR2,
  settingR3,
  settingR4,
  settingR5,
  settingR6,
  settingR7,
  settingSR1,
  settingSR2,
  settingSR3,
  settingSR4,
  settingSR5,
  settingSR6,
  settingSR7,
  settingSR8,
  settingSR9,
  settingSR10,
  settingSSR1,
  settingSSR2,
  settingSSR3,
  settingSSR4,
  settingSSR5,
  settingSSR6,
  settingSSR7,
  settingSSR8,
  settingSSR9,
  settingSSR10,
];

function sortByNumber(a, b) {
  const numA = parseInt(a.match(/\d+/)?.[0]) || Infinity;
  const numB = parseInt(b.match(/\d+/)?.[0]) || Infinity;
  const firstCharA = a[0][0]; // 提取第一个字符
  const firstCharB = b[0][0];

  // 首字母相同，按照数字大小排序
  if (firstCharA === firstCharB) {
    return numB - numA;
  } else {
    // 否則按照字符串的顺序排序
    return a[0].localeCompare(b[0]);
  }
}

function renderMarkup(pot) {
  return `<option value="${pot}">${pot}</option>`;
}

export const renderOption = function () {
  const itemName = $doc("#item-select").value;
  const potentialLevel = +$doc("#pot-select").value;
  // 同等潛能
  const sameLV = findProbability(settingProb, itemName, potentialLevel);
  // 低一階潛能
  const lowerLV = findProbability(settingProb, itemName, potentialLevel - 1);

  const sortedPot = [...sameLV.prob, ...lowerLV.prob].flat().sort(sortByNumber);

  for (let i = 1; i < 4; i++) {
    sortedPot.forEach((_, index) =>
      document
        .querySelector(`.main-set-${i}`)
        .insertAdjacentHTML("afterbegin", renderMarkup(sortedPot[index]))
    );
    $doc(`.main-set-${i}`).value = $doc(`.main-${i}`).textContent;
  }
};
