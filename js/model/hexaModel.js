"use strict";

import {
  getRandomResultByProbability,
  getTextFromSelectValue,
  findProbability,
  checkPotential,
  $doc,
} from "./helper.js";

/////////////////////////////////////////////////////////
// 閃炫方塊
// 特殊等級
// 帽子,上衣,套服,下衣,手套,披風,腰帶,肩膀,機器心臟
const hexaN1 = {
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
const hexaN2 = {
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
const hexaN3 = {
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
const hexaN4 = {
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
    [1.85, "爆擊機率 +4%"],
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
const hexaN5 = {
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
const hexaR1 = {
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
const hexaR2 = {
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
const hexaR3 = {
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
const hexaR4 = {
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
const hexaR5 = {
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
const hexaR6 = {
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
const hexaR7 = {
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
const hexaSR1 = {
  lv: 3,
  item: ["hat"],
  prob: [
    [7.55, "可以使用<實用的時空門>技能"],
    [9.43, "STR +10%"],
    [9.43, "DEX +10%"],
    [9.43, "INT +10%"],
    [9.43, "LUK +10%"],
    [11.32, "最大HP +10%"],
    [11.32, "最大MP +10%"],
    [7.55, "全屬性 +7%"],
    [7.55, "被擊中時有 5% 機率無視 20% 傷害"],
    [7.55, "被擊中時有 5% 機率無視 40% 傷害"],
    [9.43, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 上衣,套服
const hexaSR2 = {
  lv: 3,
  item: ["top", "suit"],
  prob: [
    [6.35, "被擊中後無敵時間增加 +2 秒"],
    [6.35, "被擊中時有 2% 機率在 7 秒內無敵"],
    [6.35, "有 30% 機率反射 50% 所受的傷害"],
    [3.17, "有 30% 機率反射 70% 所受的傷害"],
    [7.94, "STR +10%"],
    [7.94, "DEX +10%"],
    [7.94, "INT +10%"],
    [7.94, "LUK +10%"],
    [9.52, "最大HP +10%"],
    [9.52, "最大MP +10%"],
    [6.35, "全屬性 +7%"],
    [6.35, "被擊中時有 5% 機率無視 20% 傷害"],
    [6.35, "被擊中時有 5% 機率無視 40% 傷害"],
    [7.94, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 下衣
const hexaSR3 = {
  lv: 3,
  item: ["bottom"],
  prob: [
    [7.27, "可以使用<實用的神聖之火>技能"],
    [9.09, "STR +10%"],
    [9.09, "DEX +10%"],
    [9.09, "INT +10%"],
    [9.09, "LUK +10%"],
    [10.91, "最大HP +10%"],
    [10.91, "最大MP +10%"],
    [7.27, "全屬性 +7%"],
    [9.09, "被擊中時有 5% 機率無視 20% 傷害"],
    [9.09, "被擊中時有 5% 機率無視 40% 傷害"],
    [9.09, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 手套
const hexaSR4 = {
  lv: 3,
  item: ["gloves"],
  prob: [
    [1.75, "STR +32"],
    [1.75, "DEX +32"],
    [1.75, "INT +32"],
    [1.75, "LUK +32"],
    [7.02, "可以使用<實用的會心之眼>技能"],
    [8.87, "STR +10%"],
    [8.87, "DEX +10%"],
    [8.87, "INT +10%"],
    [8.87, "LUK +10%"],
    [10.53, "最大HP +10%"],
    [10.53, "最大MP +10%"],
    [7.02, "全屬性 +7%"],
    [7.02, "被擊中時有 5% 機率無視 20% 傷害"],
    [7.02, "被擊中時有 5% 機率無視 40% 傷害"],
    [8.77, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 鞋子
const hexaSR5 = {
  lv: 3,
  item: ["shoes"],
  prob: [
    [7.55, "可以使用<實用的速度激發>技能"],
    [9.43, "STR +10%"],
    [9.43, "DEX +10%"],
    [9.43, "INT +10%"],
    [9.43, "LUK +10%"],
    [11.32, "最大HP +10%"],
    [11.32, "最大MP +10%"],
    [7.55, "全屬性 +7%"],
    [7.55, "被擊中時有 5% 機率無視 20% 傷害"],
    [7.55, "被擊中時有 5% 機率無視 40% 傷害"],
    [9.43, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 披風,腰帶,肩膀,機器心臟
const hexaSR6 = {
  lv: 3,
  item: ["cloak", "belt", "shoulder", "heart"],
  prob: [
    [10.2, "STR +10%"],
    [10.2, "DEX +10%"],
    [10.2, "INT +10%"],
    [10.2, "LUK +10%"],
    [12.24, "最大HP +10%"],
    [12.24, "最大MP +10%"],
    [8.16, "全屬性 +7%"],
    [8.16, "被擊中時有 5% 機率無視 20% 傷害"],
    [8.16, "被擊中時有 5% 機率無視 40% 傷害"],
    [10.2, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const hexaSR7 = {
  lv: 3,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [12.2, "STR +10%"],
    [12.2, "DEX +10%"],
    [12.2, "INT +10%"],
    [12.2, "LUK +10%"],
    [14.63, "最大HP +10%"],
    [14.63, "最大MP +10%"],
    [9.76, "全屬性 +7%"],
    [12.2, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 武器, 輔助武器(包含力量之盾, 靈魂盾牌)
const hexaSR8 = {
  lv: 3,
  item: ["weapon", "second-weapon", "shield"],
  prob: [
    [6.52, "物理攻擊力 +10%"],
    [6.52, "魔法攻擊力 +10%"],
    [6.52, "總傷害 +10%"],
    [8.7, "無視怪物防禦率 +30%"],
    [6.52, "攻擊BOSS怪物時傷害增加 +30%"],
    [10.87, "爆擊機率 +10%"],
    [10.87, "STR +10%"],
    [10.87, "DEX +10%"],
    [10.87, "INT +10%"],
    [10.87, "LUK +10%"],
    [10.87, "全屬性 +7%"],
  ],
};

// 徽章
const hexaSR9 = {
  lv: 3,
  item: ["badge"],
  prob: [
    [6.98, "物理攻擊力 +10%"],
    [6.98, "魔法攻擊力 +10%"],
    [6.98, "總傷害 +10%"],
    [9.3, "無視怪物防禦率 +30%"],
    [11.63, "爆擊機率 +10%"],
    [11.63, "STR +10%"],
    [11.63, "DEX +10%"],
    [11.63, "INT +10%"],
    [11.63, "LUK +10%"],
    [11.63, "全屬性 +7%"],
  ],
};

// 傳說等級
// 帽子
const hexaSSR1 = {
  lv: 4,
  item: ["hat"],
  prob: [
    [6.98, "減少所有技能冷卻時間 -1 秒"],
    [4.65, "減少所有技能冷卻時間 -2 秒"],
    [6.98, "可以使用<實用的進階祝福>技能"],
    [9.3, "STR +13%"],
    [9.3, "DEX +13%"],
    [9.3, "INT +13%"],
    [9.3, "LUK +13%"],
    [9.3, "最大HP +13%"],
    [9.3, "最大MP +13%"],
    [6.98, "全屬性 +10%"],
    [9.3, "被擊中時有 10% 機率無視 20% 傷害"],
    [9.3, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 上衣,套服
const hexaSSR2 = {
  lv: 4,
  item: ["top", "suit"],
  prob: [
    [7.32, "被擊中後無敵時間增加 +3 秒"],
    [7.32, "被擊中時有 4% 機率在 7 秒內無敵"],
    [9.76, "STR +13%"],
    [9.76, "DEX +13%"],
    [9.76, "INT +13%"],
    [9.76, "LUK +13%"],
    [9.76, "最大HP +13%"],
    [9.76, "最大MP +13%"],
    [7.32, "全屬性 +10%"],
    [9.76, "被擊中時有 10% 機率無視 20% 傷害"],
    [9.76, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 下衣
const hexaSSR3 = {
  lv: 4,
  item: ["bottom"],
  prob: [
    [11.43, "STR +13%"],
    [11.43, "DEX +13%"],
    [11.43, "INT +13%"],
    [11.43, "LUK +13%"],
    [11.43, "最大HP +13%"],
    [11.43, "最大MP +13%"],
    [8.57, "全屬性 +10%"],
    [11.43, "被擊中時有 10% 機率無視 20% 傷害"],
    [11.43, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 手套
const hexaSSR4 = {
  lv: 4,
  item: ["gloves"],
  prob: [
    [9.52, "爆擊傷害 +8%"],
    [7.14, "可以使用<實用的最終極速>技能"],
    [9.52, "STR +13%"],
    [9.52, "DEX +13%"],
    [9.52, "INT +13%"],
    [9.52, "LUK +13%"],
    [9.52, "最大HP +13%"],
    [9.52, "最大MP +13%"],
    [7.14, "全屬性 +10%"],
    [9.52, "被擊中時有 10% 機率無視 20% 傷害"],
    [9.52, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 鞋子
const hexaSSR5 = {
  lv: 4,
  item: ["shoes"],
  prob: [
    [7.89, "可以使用<實用的戰鬥命令>技能"],
    [10.53, "STR +13%"],
    [10.53, "DEX +13%"],
    [10.53, "INT +13%"],
    [10.53, "LUK +13%"],
    [10.53, "最大HP +13%"],
    [10.53, "最大MP +13%"],
    [7.89, "全屬性 +10%"],
    [10.53, "被擊中時有 10% 機率無視 20% 傷害"],
    [10.53, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 披風,腰帶,肩膀,機器心臟
const hexaSSR6 = {
  lv: 4,
  item: ["cloak", "belt", "shoulder", "heart"],
  prob: [
    [11.43, "STR +13%"],
    [11.43, "DEX +13%"],
    [11.43, "INT +13%"],
    [11.43, "LUK +13%"],
    [11.43, "最大HP +13%"],
    [11.43, "最大MP +13%"],
    [8.57, "全屬性 +10%"],
    [11.43, "被擊中時有 10% 機率無視 20% 傷害"],
    [11.43, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const hexaSSR7 = {
  lv: 4,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [9.76, "STR +13%"],
    [9.76, "DEX +13%"],
    [9.76, "INT +13%"],
    [9.76, "LUK +13%"],
    [9.76, "最大HP +13%"],
    [9.76, "最大MP +13%"],
    [7.32, "全屬性 +10%"],
    [9.76, "所有技能的MP消耗 -15%"],
    [9.76, "所有技能的MP消耗 -30%"],
    [7.32, "楓幣獲得量 +20%"],
    [7.32, "道具掉落率 +20%"],
  ],
};

// 武器, 輔助武器(包含力量之盾, 靈魂盾牌)
const hexaSSR8 = {
  lv: 4,
  item: ["weapon", "second-weapon", "shield"],
  prob: [
    [4.44, "物理攻擊力 +13%"],
    [4.44, "魔法攻擊力 +13%"],
    [4.44, "總傷害 +13%"],
    [6.67, "無視怪物防禦率 +35%"],
    [6.67, "無視怪物防禦率 +40%"],
    [8.89, "攻擊BOSS怪物時傷害增加 +35%"],
    [4.44, "攻擊BOSS怪物時傷害增加 +40%"],
    [4.44, "爆擊機率 +12%"],
    [6.67, "物理攻擊力 +32"],
    [6.67, "魔法攻擊力 +32"],
    [8.89, "STR +13%"],
    [8.89, "DEX +13%"],
    [8.89, "INT +13%"],
    [8.89, "LUK +13%"],
    [6.67, "全屬性 +10%"],
  ],
};

// 徽章
const hexaSSR9 = {
  lv: 4,
  item: ["badge"],
  prob: [
    [5.13, "物理攻擊力 +13%"],
    [5.13, "魔法攻擊力 +13%"],
    [5.13, "總傷害 +13%"],
    [7.69, "無視怪物防禦率 +35%"],
    [7.69, "無視怪物防禦率 +40%"],
    [5.13, "爆擊機率 +12%"],
    [7.69, "物理攻擊力 +32"],
    [7.69, "魔法攻擊力 +32"],
    [10.26, "STR +13%"],
    [10.26, "DEX +13%"],
    [10.26, "INT +13%"],
    [10.26, "LUK +13%"],
    [7.69, "全屬性 +10%"],
  ],
};

export const hexaProb = [
  hexaN1,
  hexaN2,
  hexaN3,
  hexaN4,
  hexaN5,
  hexaR1,
  hexaR2,
  hexaR3,
  hexaR4,
  hexaR5,
  hexaR6,
  hexaR7,
  hexaSR1,
  hexaSR2,
  hexaSR3,
  hexaSR4,
  hexaSR5,
  hexaSR6,
  hexaSR7,
  hexaSR8,
  hexaSR9,
  hexaSSR1,
  hexaSSR2,
  hexaSSR3,
  hexaSSR4,
  hexaSSR5,
  hexaSSR6,
  hexaSSR7,
  hexaSSR8,
  hexaSSR9,
];

// 閃炫跳框機率
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
        [97, 2],
        [3, 3],
      ]);
      break;
    case 3:
      $doc("#pot-select").value = getRandomResultByProbability([
        [98.65, 3],
        [1.35, 4],
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
        [94, 2],
        [6, 3],
      ]);
      break;
    case 3:
      $doc("#pot-select").value = getRandomResultByProbability([
        [97.3, 3],
        [2.7, 4],
      ]);
      break;
  }
}

// 點閃炫
export const processHexa = function () {
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
  const sameLV = findProbability(hexaProb, itemName, potentialLevel);
  // 低一階潛能
  const lowerLV = findProbability(hexaProb, itemName, potentialLevel - 1);

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
    default:
      pushToPotentialArray(100, 0);
      pushToPotentialArray(20, 80);
      pushToPotentialArray(15, 85);
      pushToPotentialArray(100, 0);
      pushToPotentialArray(20, 80);
      pushToPotentialArray(15, 85);
      break;
  }

  // 確認潛能 2024/6/26不再限定潛能
  if (!checkPotential(tempPotentailArray)) {
    processHexa();
    return;
  }

  for (let i = 0; i < 6; i++) {
    $doc(`.play-hexa .hexa-${i + 1}`).textContent = tempPotentailArray[i];
  }

  $doc(".counter-hexa").textContent++;
};

function addOrRemove(array, value) {
  const index = array.indexOf(value);

  if (index === -1) {
    array.push(value);
  } else {
    array.splice(index, 1);
  }
}

function OnlyRemove(array, value) {
  const index = array.indexOf(value);
  if (array.includes(value)) array.splice(index, 1);
}

export const selectedPot = [];

export const selectHexaPot = function (ev) {
  if (selectedPot.length < 3 && $doc(".hexa-4").textContent !== "") {
    ev.target.classList.toggle("chosen");
    addOrRemove(selectedPot, ev.target);
  } else if (selectedPot.length === 3) {
    ev.target.classList.remove("chosen");
    OnlyRemove(selectedPot, ev.target);
  }
};

export const clearSelectPot = function () {
  selectedPot.splice(0, selectedPot.length);
};
