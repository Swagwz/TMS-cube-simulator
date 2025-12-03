"use strict";

import {
  getRandomResultByProbability,
  getTextFromSelectValue,
  findProbability,
  checkPotential_1,
  $doc,
} from "./helper.js";

/////////////////////////////////////////////////////////
// 閃耀鏡射方塊
// 特殊等級
// 帽子,上衣,套服,下衣,手套,披風,腰帶,肩膀,機器心臟
const reflectN1 = {
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
    [6, "STR +13"],
    [6, "DEX +13"],
    [6, "INT +13"],
    [6, "LUK +13"],
    [10, "最大HP +125"],
    [10, "最大MP +125"],
    [8, "防禦率 +125"],
    [6, "STR +4%"],
    [6, "DEX +4%"],
    [6, "INT +4%"],
    [6, "LUK +4%"],
    [6, "最大HP +4%"],
    [6, "最大MP +4%"],
    [8, "防禦率 +4%"],
    [4, "全屬性 +6"],
  ],
};

// 鞋子
const reflectN2 = {
  lv: 1,
  item: ["shoes"],
  prob: [
    [3.7, "移動速度 +8"],
    [3.7, "跳躍力 +8"],
    [5.56, "STR +13"],
    [5.56, "DEX +13"],
    [5.56, "INT +13"],
    [5.56, "LUK +13"],
    [9.25, "最大HP +125"],
    [9.25, "最大MP +125"],
    [7.4, "防禦率 +125"],
    [5.56, "STR +4%"],
    [5.56, "DEX +4%"],
    [5.56, "INT +4%"],
    [5.56, "LUK +4%"],
    [5.56, "最大HP +4%"],
    [5.56, "最大MP +4%"],
    [7.4, "防禦率 +4%"],
    [3.7, "全屬性 +6"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const reflectN3 = {
  lv: 1,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [6, "STR +13"],
    [6, "DEX +13"],
    [6, "INT +13"],
    [6, "LUK +13"],
    [10, "最大HP +125"],
    [10, "最大MP +125"],
    [8, "防禦率 +125"],
    [6, "STR +4%"],
    [6, "DEX +4%"],
    [6, "INT +4%"],
    [6, "LUK +4%"],
    [6, "最大HP +4%"],
    [6, "最大MP +4%"],
    [8, "防禦率 +4%"],
    [4, "全屬性 +6"],
  ],
};

// 武器, 徽章, 輔助武器(力量之盾, 靈魂盾牌除外)
const reflectN4 = {
  lv: 1,
  item: ["weapon", "second-weapon", "badge"],
  prob: [
    [5.56, "STR +13"],
    [5.56, "DEX +13"],
    [5.56, "INT +13"],
    [5.56, "LUK +13"],
    [11.11, "最大HP +125"],
    [11.11, "最大MP +125"],
    [3.7, "物理攻擊力 +13"],
    [3.7, "魔法攻擊力 +13"],
    [5.56, "STR +4%"],
    [5.56, "DEX +4%"],
    [5.56, "INT +4%"],
    [5.56, "LUK +4%"],
    [1.85, "物理攻擊力 +4%"],
    [1.85, "魔法攻擊力 +4%"],
    [1.85, "爆擊機率 +8%"],
    [1.85, "總傷害 +4%"],
    [3.7, "全屬性 +6"],
    [1.85, "攻擊時有 3% 機率恢復 33 MP"],
    [1.85, "攻擊時有 20% 機率發動 6級 中毒效果"],
    [1.85, "攻擊時有 10% 機率發動 2級 昏迷效果"],
    [1.85, "攻擊時有 20% 機率發動 2級 緩慢效果"],
    [1.85, "攻擊時有 20% 機率發動 3級 闇黑效果"],
    [1.85, "攻擊時有 10% 機率發動 2級 冰結效果"],
    [1.85, "攻擊時有 10% 機率發動 2級 封印效果"],
    [1.85, "無視怪物防禦率 +15%"],
  ],
};

// 輔助武器(力量之盾, 靈魂盾牌)
const reflectN5 = {
  lv: 1,
  item: ["shield"],
  prob: [
    [6.25, "STR +13"],
    [6.25, "DEX +13"],
    [6.25, "INT +13"],
    [6.25, "LUK +13"],
    [12.5, "最大HP +125"],
    [4.17, "物理攻擊力 +13"],
    [4.17, "魔法攻擊力 +13"],
    [6.25, "STR +4%"],
    [6.25, "DEX +4%"],
    [6.25, "INT +4%"],
    [6.25, "LUK +4%"],
    [2.08, "物理攻擊力 +4%"],
    [2.08, "魔法攻擊力 +4%"],
    [2.08, "爆擊機率 +4%"],
    [2.08, "總傷害 +4%"],
    [4.17, "全屬性 +6"],
    [2.08, "攻擊時有 3% 機率恢復 33 MP"],
    [2.08, "攻擊時有 20% 機率發動 6級 中毒效果"],
    [2.08, "攻擊時有 10% 機率發動 2級 昏迷效果"],
    [2.08, "攻擊時有 20% 機率發動 2級 緩慢效果"],
    [2.08, "攻擊時有 20% 機率發動 3級 闇黑效果"],
    [2.08, "攻擊時有 10% 機率發動 2級 冰結效果"],
    [2.08, "攻擊時有 10% 機率發動 2級 封印效果"],
    [2.08, "無視怪物防禦率 +15%"],
  ],
};

// 稀有等級
// 帽子,下衣,披風,腰帶,肩膀,機器心臟
const reflectR1 = {
  lv: 2,
  item: ["hat", "bottom", "cloak", "belt", "shoulder", "heart"],
  prob: [
    [11.9, "STR +7%"],
    [11.9, "DEX +7%"],
    [11.9, "INT +7%"],
    [11.9, "LUK +7%"],
    [16.67, "最大HP +7%"],
    [16.67, "最大MP +7%"],
    [14.29, "防禦率 +7%"],
    [4.76, "全屬性 +4%"],
  ],
};

// 上衣,套服
const reflectR2 = {
  lv: 2,
  item: ["top", "suit"],
  prob: [
    [6.25, "被擊中後無敵時間增加 +1 秒"],
    [6.25, "被擊中後無敵時間增加 +1 秒"],
    [10.42, "STR +7%"],
    [10.42, "DEX +7%"],
    [10.42, "INT +7%"],
    [10.42, "LUK +7%"],
    [14.58, "最大HP +7%"],
    [14.58, "最大MP +7%"],
    [12.5, "防禦率 +7%"],
    [4.17, "全屬性 +4%"],
  ],
};

// 手套
const reflectR3 = {
  lv: 2,
  item: ["gloves"],
  prob: [
    [6.25, "擊殺怪物有 15% 機率恢復 97 HP"],
    [6.25, "擊殺怪物有 15% 機率恢復 97 MP"],
    [10.42, "STR +7%"],
    [10.42, "DEX +7%"],
    [10.42, "INT +7%"],
    [10.42, "LUK +7%"],
    [14.58, "最大HP +7%"],
    [14.58, "最大MP +7%"],
    [12.5, "防禦率 +7%"],
    [4.17, "全屬性 +4%"],
  ],
};

// 鞋子
const reflectR4 = {
  lv: 2,
  item: ["shoes"],
  prob: [
    [11.9, "STR +7%"],
    [11.9, "DEX +7%"],
    [11.9, "INT +7%"],
    [11.9, "LUK +7%"],
    [16.67, "最大HP +7%"],
    [16.67, "最大MP +7%"],
    [14.29, "防禦率 +7%"],
    [4.76, "全屬性 +4%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const reflectR5 = {
  lv: 2,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [11.9, "STR +7%"],
    [11.9, "DEX +7%"],
    [11.9, "INT +7%"],
    [11.9, "LUK +7%"],
    [16.67, "最大HP +7%"],
    [16.67, "最大MP +7%"],
    [14.29, "防禦率 +7%"],
    [4.76, "全屬性 +4%"],
  ],
};

// 武器, 徽章, 輔助武器(力量之盾, 靈魂盾牌除外)
const reflectR6 = {
  lv: 2,
  item: ["weapon", "second-weapon", "badge"],
  prob: [
    [4, "物理攻擊力 +7%"],
    [4, "魔法攻擊力 +7%"],
    [4, "爆擊機率 +8%"],
    [4, "總傷害 +7%"],
    [4, "攻擊時有 3% 機率恢復 54 HP"],
    [4, "攻擊時有 3% 機率恢復 54 MP"],
    [4, "無視怪物防禦率 +15%"],
    [10, "STR +7%"],
    [10, "DEX +7%"],
    [10, "INT +7%"],
    [10, "LUK +7%"],
    [14, "最大HP +7%"],
    [14, "最大MP +7%"],
    [4, "全屬性 +4%"],
  ],
};

// 輔助武器(力量之盾, 靈魂盾牌)
const reflectR7 = {
  lv: 2,
  item: ["shield"],
  prob: [
    [4.65, "物理攻擊力 +7%"],
    [4.65, "魔法攻擊力 +7%"],
    [4.65, "爆擊機率 +8%"],
    [4.65, "總傷害 +7%"],
    [4.65, "攻擊時有 3% 機率恢復 54 HP"],
    [4.65, "攻擊時有 3% 機率恢復 54 MP"],
    [4.65, "無視怪物防禦率 +15%"],
    [11.63, "STR +7%"],
    [11.63, "DEX +7%"],
    [11.63, "INT +7%"],
    [11.63, "LUK +7%"],
    [16.28, "最大HP +7%"],
    [4.65, "全屬性 +4%"],
  ],
};

// 罕見等級
// 帽子
const reflectSR1 = {
  lv: 3,
  item: ["hat"],
  prob: [
    [11.43, "可以使用<實用的時空門>技能"],
    [5.71, "STR +10%"],
    [5.71, "DEX +10%"],
    [5.71, "INT +10%"],
    [5.71, "LUK +10%"],
    [5.71, "最大HP +10%"],
    [17.14, "最大MP +10%"],
    [5.71, "全屬性 +7%"],
    [11.43, "被擊中時有 5% 機率無視 20% 傷害"],
    [11.43, "被擊中時有 5% 機率無視 40% 傷害"],
    [14.29, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 上衣,套服
const reflectSR2 = {
  lv: 3,
  item: ["top", "suit"],
  prob: [
    [8.89, "被擊中後無敵時間增加 +2 秒"],
    [8.89, "被擊中時有 2% 機率在 7 秒內無敵"],
    [8.89, "有 30% 機率反射 50% 所受的傷害"],
    [4.44, "有 30% 機率反射 70% 所受的傷害"],
    [4.44, "STR +10%"],
    [4.44, "DEX +10%"],
    [4.44, "INT +10%"],
    [4.44, "LUK +10%"],
    [4.44, "最大HP +10%"],
    [13.33, "最大MP +10%"],
    [4.44, "全屬性 +7%"],
    [8.89, "被擊中時有 5% 機率無視 20% 傷害"],
    [8.89, "被擊中時有 5% 機率無視 40% 傷害"],
    [11.11, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 下衣
const reflectSR3 = {
  lv: 3,
  item: ["bottom"],
  prob: [
    [10.81, "可以使用<實用的神聖之火>技能"],
    [5.41, "STR +10%"],
    [5.41, "DEX +10%"],
    [5.41, "INT +10%"],
    [5.41, "LUK +10%"],
    [5.41, "最大HP +10%"],
    [16.22, "最大MP +10%"],
    [5.41, "全屬性 +7%"],
    [13.51, "被擊中時有 5% 機率無視 20% 傷害"],
    [13.51, "被擊中時有 5% 機率無視 40% 傷害"],
    [13.51, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 手套
const reflectSR4 = {
  lv: 3,
  item: ["gloves"],
  prob: [
    [2.56, "STR +32"],
    [2.56, "DEX +32"],
    [2.56, "INT +32"],
    [2.56, "LUK +32"],
    [10.26, "可以使用<實用的會心之眼>技能"],
    [5.13, "STR +10%"],
    [5.13, "DEX +10%"],
    [5.13, "INT +10%"],
    [5.13, "LUK +10%"],
    [5.13, "最大HP +10%"],
    [15.38, "最大MP +10%"],
    [5.13, "全屬性 +7%"],
    [10.26, "被擊中時有 5% 機率無視 20% 傷害"],
    [10.26, "被擊中時有 5% 機率無視 40% 傷害"],
    [12.82, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 鞋子
const reflectSR5 = {
  lv: 3,
  item: ["shoes"],
  prob: [
    [11.43, "可以使用<實用的速度激發>技能"],
    [5.71, "STR +10%"],
    [5.71, "DEX +10%"],
    [5.71, "INT +10%"],
    [5.71, "LUK +10%"],
    [5.71, "最大HP +10%"],
    [17.14, "最大MP +10%"],
    [5.71, "全屬性 +7%"],
    [11.43, "被擊中時有 5% 機率無視 20% 傷害"],
    [11.43, "被擊中時有 5% 機率無視 40% 傷害"],
    [14.29, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 披風,腰帶,肩膀,機器心臟
const reflectSR6 = {
  lv: 3,
  item: ["cloak", "belt", "shoulder", "heart"],
  prob: [
    [6.45, "STR +10%"],
    [6.45, "DEX +10%"],
    [6.45, "INT +10%"],
    [6.45, "LUK +10%"],
    [6.45, "最大HP +10%"],
    [19.35, "最大MP +10%"],
    [6.45, "全屬性 +7%"],
    [12.9, "被擊中時有 5% 機率無視 20% 傷害"],
    [12.9, "被擊中時有 5% 機率無視 40% 傷害"],
    [16.13, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const reflectSR7 = {
  lv: 3,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [8.7, "STR +10%"],
    [8.7, "DEX +10%"],
    [8.7, "INT +10%"],
    [8.7, "LUK +10%"],
    [8.7, "最大HP +10%"],
    [26.09, "最大MP +10%"],
    [8.7, "全屬性 +7%"],
    [21.74, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 武器, 輔助武器(包含力量之盾, 靈魂盾牌)
const reflectSR8 = {
  lv: 3,
  item: ["weapon", "second-weapon", "shield"],
  prob: [
    [2.7, "物理攻擊力 +10%"],
    [2.7, "魔法攻擊力 +10%"],
    [2.7, "總傷害 +10%"],
    [5.41, "無視怪物防禦率 +30%"],
    [5.41, "攻擊BOSS怪物時傷害增加 +30%"],
    [13.51, "爆擊機率 +10%"],
    [13.51, "STR +10%"],
    [13.51, "DEX +10%"],
    [13.51, "INT +10%"],
    [13.51, "LUK +10%"],
    [13.51, "全屬性 +7%"],
  ],
};

// 徽章
const reflectSR9 = {
  lv: 3,
  item: ["badge"],
  prob: [
    [2.86, "物理攻擊力 +10%"],
    [2.86, "魔法攻擊力 +10%"],
    [2.86, "總傷害 +10%"],
    [5.71, "無視怪物防禦率 +30%"],
    [14.29, "爆擊機率 +10%"],
    [14.29, "STR +10%"],
    [14.29, "DEX +10%"],
    [14.29, "INT +10%"],
    [14.29, "LUK +10%"],
    [14.29, "全屬性 +7%"],
  ],
};

// 傳說等級
// 帽子
const reflectSSR1 = {
  lv: 4,
  item: ["hat"],
  prob: [
    [9.38, "減少所有技能冷卻時間 -1 秒"],
    [6.25, "減少所有技能冷卻時間 -2 秒"],
    [9.38, "可以使用<實用的進階祝福>技能"],
    [6.25, "STR +13%"],
    [6.25, "DEX +13%"],
    [6.25, "INT +13%"],
    [6.25, "LUK +13%"],
    [6.25, "最大HP +13%"],
    [12.5, "最大MP +13%"],
    [6.25, "全屬性 +10%"],
    [12.5, "被擊中時有 10% 機率無視 20% 傷害"],
    [12.5, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 上衣,套服
const reflectSSR2 = {
  lv: 4,
  item: ["top", "suit"],
  prob: [
    [10, "被擊中後無敵時間增加 +3 秒"],
    [10, "被擊中時有 4% 機率在 7 秒內無敵"],
    [6.67, "STR +13%"],
    [6.67, "DEX +13%"],
    [6.67, "INT +13%"],
    [6.67, "LUK +13%"],
    [6.67, "最大HP +13%"],
    [13.33, "最大MP +13%"],
    [6.67, "全屬性 +10%"],
    [13.33, "被擊中時有 10% 機率無視 20% 傷害"],
    [13.33, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 下衣
const reflectSSR3 = {
  lv: 4,
  item: ["bottom"],
  prob: [
    [8.33, "STR +13%"],
    [8.33, "DEX +13%"],
    [8.33, "INT +13%"],
    [8.33, "LUK +13%"],
    [8.33, "最大HP +13%"],
    [16.67, "最大MP +13%"],
    [8.33, "全屬性 +10%"],
    [16.67, "被擊中時有 10% 機率無視 20% 傷害"],
    [16.67, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 手套
const reflectSSR4 = {
  lv: 4,
  item: ["gloves"],
  prob: [
    [12.9, "爆擊傷害 +8%"],
    [9.68, "可以使用<實用的最終極速>技能"],
    [6.45, "STR +13%"],
    [6.45, "DEX +13%"],
    [6.45, "INT +13%"],
    [6.45, "LUK +13%"],
    [6.45, "最大HP +13%"],
    [12.9, "最大MP +13%"],
    [6.45, "全屬性 +10%"],
    [12.9, "被擊中時有 10% 機率無視 20% 傷害"],
    [12.9, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 鞋子
const reflectSSR5 = {
  lv: 4,
  item: ["shoes"],
  prob: [
    [11.11, "可以使用<實用的戰鬥命令>技能"],
    [7.41, "STR +13%"],
    [7.41, "DEX +13%"],
    [7.41, "INT +13%"],
    [7.41, "LUK +13%"],
    [7.41, "最大HP +13%"],
    [14.81, "最大MP +13%"],
    [7.41, "全屬性 +10%"],
    [14.81, "被擊中時有 10% 機率無視 20% 傷害"],
    [14.81, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 披風,腰帶,肩膀,機器心臟
const reflectSSR6 = {
  lv: 4,
  item: ["cloak", "belt", "shoulder", "heart"],
  prob: [
    [8.33, "STR +13%"],
    [8.33, "DEX +13%"],
    [8.33, "INT +13%"],
    [8.33, "LUK +13%"],
    [8.33, "最大HP +13%"],
    [16.67, "最大MP +13%"],
    [8.33, "全屬性 +10%"],
    [16.67, "被擊中時有 10% 機率無視 20% 傷害"],
    [16.67, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const reflectSSR7 = {
  lv: 4,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [6.67, "STR +13%"],
    [6.67, "DEX +13%"],
    [6.67, "INT +13%"],
    [6.67, "LUK +13%"],
    [6.67, "最大HP +13%"],
    [13.33, "最大MP +13%"],
    [6.67, "全屬性 +10%"],
    [13.33, "所有技能的MP消耗 -15%"],
    [13.33, "所有技能的MP消耗 -30%"],
    [10, "楓幣獲得量 +20%"],
    [10, "道具掉落率 +20%"],
  ],
};

// 武器, 輔助武器(包含力量之盾, 靈魂盾牌)
const reflectSSR8 = {
  lv: 4,
  item: ["weapon", "second-weapon", "shield"],
  prob: [
    [2.78, "物理攻擊力 +13%"],
    [2.78, "魔法攻擊力 +13%"],
    [2.78, "總傷害 +13%"],
    [5.56, "無視怪物防禦率 +35%"],
    [5.56, "無視怪物防禦率 +40%"],
    [5.56, "攻擊BOSS怪物時傷害增加 +35%"],
    [2.78, "攻擊BOSS怪物時傷害增加 +40%"],
    [2.78, "爆擊機率 +12%"],
    [8.33, "物理攻擊力 +32"],
    [8.33, "魔法攻擊力 +32"],
    [11.11, "STR +13%"],
    [11.11, "DEX +13%"],
    [11.11, "INT +13%"],
    [11.11, "LUK +13%"],
    [8.33, "全屬性 +10%"],
  ],
};

// 徽章
const reflectSSR9 = {
  lv: 4,
  item: ["badge"],
  prob: [
    [3.03, "物理攻擊力 +13%"],
    [3.03, "魔法攻擊力 +13%"],
    [3.03, "總傷害 +13%"],
    [6.06, "無視怪物防禦率 +35%"],
    [6.06, "無視怪物防禦率 +40%"],
    [3.03, "爆擊機率 +12%"],
    [9.09, "物理攻擊力 +32"],
    [9.09, "魔法攻擊力 +32"],
    [12.12, "STR +13%"],
    [12.12, "DEX +13%"],
    [12.12, "INT +13%"],
    [12.12, "LUK +13%"],
    [9.09, "全屬性 +10%"],
  ],
};

export const reflectProb = [
  reflectN1,
  reflectN2,
  reflectN3,
  reflectN4,
  reflectN5,
  reflectR1,
  reflectR2,
  reflectR3,
  reflectR4,
  reflectR5,
  reflectR6,
  reflectR7,
  reflectSR1,
  reflectSR2,
  reflectSR3,
  reflectSR4,
  reflectSR5,
  reflectSR6,
  reflectSR7,
  reflectSR8,
  reflectSR9,
  reflectSSR1,
  reflectSSR2,
  reflectSSR3,
  reflectSSR4,
  reflectSSR5,
  reflectSSR6,
  reflectSSR7,
  reflectSSR8,
  reflectSSR9,
];

// 閃耀鏡射跳框機率
function levelUp() {
  let potentialLevel = +$doc("#pot-select").value;
  switch (potentialLevel) {
    case 1:
      $doc("#pot-select").value = getRandomResultByProbability([
        [3, 1],
        [97, 2],
      ]);
      break;
    case 2:
      $doc("#pot-select").value = getRandomResultByProbability([
        [97.75, 2],
        [2.25, 3],
      ]);
      break;
    case 3:
      $doc("#pot-select").value = getRandomResultByProbability([
        [99.01, 3],
        [0.99, 4],
      ]);
      break;
  }
}

function doubleLevelUp() {
  let potentialLevel = +$doc("#pot-select").value;
  switch (potentialLevel) {
    case 1:
      $doc("#pot-select").value = getRandomResultByProbability([
        [0, 1],
        [100, 2],
      ]);
      break;
    case 2:
      $doc("#pot-select").value = getRandomResultByProbability([
        [95.5, 2],
        [4.5, 3],
      ]);
      break;
    case 3:
      $doc("#pot-select").value = getRandomResultByProbability([
        [98.02, 3],
        [1.98, 4],
      ]);
      break;
  }
}

// 點閃耀鏡射
export const processReflect = function () {
  // 暫時存放確認用的潛能
  const tempPotentailArray = [];

  // 先看有沒有跳框
  if ($doc("#double").checked) {
    doubleLevelUp();
  } else {
    levelUp();
  }

  const itemName = $doc("#item-select").value;
  const potentialLevel = +$doc("#pot-select").value;
  // 同等潛能
  const sameLV = findProbability(reflectProb, itemName, potentialLevel);
  // 低一階潛能
  const lowerLV = findProbability(reflectProb, itemName, potentialLevel - 1);

  function pushToPotentialArray(same, lower) {
    let sameOrLower = getRandomResultByProbability([
      [same, "same"],
      [lower, "lower"],
    ]);
    tempPotentailArray.push(
      sameOrLower === "same"
        ? getRandomResultByProbability(sameLV.prob)
        : getRandomResultByProbability(lowerLV.prob)
    );
  }

  switch (potentialLevel) {
    case 1: // 特殊
      pushToPotentialArray(100, 0);
      pushToPotentialArray(100, 0);
      pushToPotentialArray(100, 0);
      break;
    case 2: // 稀有
      pushToPotentialArray(100, 0);
      pushToPotentialArray(20, 80);
      pushToPotentialArray(15, 85);
      break;
    case 3: // 罕見
      pushToPotentialArray(100, 0);
      pushToPotentialArray(20, 80);
      pushToPotentialArray(10, 90);
      break;
    case 4: // 傳說
      pushToPotentialArray(100, 0);
      pushToPotentialArray(20, 80);
      pushToPotentialArray(5, 95);
      break;
  }

  // 第二排潛能以20%機率複製第一排
  const reflectSuccess = getRandomResultByProbability([
    [20, "reflect"],
    [80, ""],
  ]);

  if (reflectSuccess === "reflect") {
    tempPotentailArray[1] = tempPotentailArray[0];
  }

  // 確認潛能
  if (!checkPotential_1(tempPotentailArray)) {
    processReflect();
    return;
  }

  $doc(".part-reflect .pot-lv").textContent =
    getTextFromSelectValue(potentialLevel);

  for (let i = 0; i < 3; i++) {
    $doc(`.reflect-${i + 1}`).textContent = tempPotentailArray[i];
    $doc(`.main-${i + 1}`).textContent = tempPotentailArray[i];
  }

  $doc(".counter-reflect").textContent++;
};
