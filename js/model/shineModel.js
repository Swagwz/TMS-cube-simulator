"use strict";

import {
  getRandomResultByProbability,
  getTextFromSelectValue,
  findProbability,
  checkPotential,
  $doc,
} from "./helper.js";

/////////////////////////////////////////////////////////
// 閃亮附加方塊
// 特殊等級
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const shine1 = {
  lv: 0,
  item: [
    "hat",
    "top",
    "bottom",
    "suit",
    "gloves",
    "shoes",
    "cloak",
    "belt",
    "shoulder",
    "heart",
  ],
  prob: [
    [7.2622, "STR +6"],
    [7.2622, "DEX +6"],
    [7.2622, "INT +6"],
    [7.2622, "LUK +6"],
    [10.8932, "最大HP +60"],
    [10.8932, "最大MP +60"],
    [10.8932, "移動速度 +4"],
    [10.8932, "跳躍力 +4"],
    [7.2622, "物理攻擊力 +3"],
    [7.2622, "魔法攻擊力 +3"],
    [10.8932, "防禦率 +60"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const shine2 = {
  lv: 0,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [7.2622, "STR +6"],
    [7.2622, "DEX +6"],
    [7.2622, "INT +6"],
    [7.2622, "LUK +6"],
    [10.8932, "最大HP +60"],
    [10.8932, "最大MP +60"],
    [10.8932, "移動速度 +4"],
    [10.8932, "跳躍力 +4"],
    [7.2622, "物理攻擊力 +3"],
    [7.2622, "魔法攻擊力 +3"],
    [10.8932, "防禦率 +60"],
  ],
};

// 武器, 徽章, 輔助武器
const shine3 = {
  lv: 0,
  item: ["weapon", "second-weapon", "badge", "shield"],
  prob: [
    [7.2622, "STR +6"],
    [7.2622, "DEX +6"],
    [7.2622, "INT +6"],
    [7.2622, "LUK +6"],
    [10.8932, "最大HP +60"],
    [10.8932, "最大MP +60"],
    [10.8932, "移動速度 +4"],
    [10.8932, "跳躍力 +4"],
    [7.2622, "物理攻擊力 +6"],
    [7.2622, "魔法攻擊力 +6"],
    [10.8932, "防禦率 +60"],
  ],
};

// 特殊等級
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const shineN1 = {
  lv: 1,
  item: [
    "hat",
    "top",
    "bottom",
    "suit",
    "gloves",
    "shoes",
    "cloak",
    "belt",
    "shoulder",
    "heart",
  ],
  prob: [
    [8.91, "STR +11"],
    [8.91, "DEX +11"],
    [8.91, "INT +11"],
    [8.91, "LUK +11"],
    [8.91, "最大HP +125"],
    [8.91, "最大MP +125"],
    [8.91, "移動速度 +6"],
    [8.91, "跳躍力 +6"],
    [1.98, "物理攻擊力 +11"],
    [1.98, "魔法攻擊力 +11"],
    [8.91, "防禦率 +125"],
    [1.98, "STR +3%"],
    [1.98, "DEX +3%"],
    [1.98, "INT +3%"],
    [1.98, "LUK +3%"],
    [1.98, "最大HP +3%"],
    [1.98, "最大MP +3%"],
    [1.98, "防禦率 +3%"],
    [1.98, "全屬性 +3"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const shineN2 = {
  lv: 1,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [8.91, "STR +11"],
    [8.91, "DEX +11"],
    [8.91, "INT +11"],
    [8.91, "LUK +11"],
    [8.91, "最大HP +125"],
    [8.91, "最大MP +125"],
    [8.91, "移動速度 +6"],
    [8.91, "跳躍力 +6"],
    [1.98, "物理攻擊力 +11"],
    [1.98, "魔法攻擊力 +11"],
    [8.91, "防禦率 +125"],
    [1.98, "STR +3%"],
    [1.98, "DEX +3%"],
    [1.98, "INT +3%"],
    [1.98, "LUK +3%"],
    [1.98, "最大HP +3%"],
    [1.98, "最大MP +3%"],
    [1.98, "防禦率 +3%"],
    [1.98, "全屬性 +3"],
  ],
};

// 武器, 徽章, 輔助武器
const shineN3 = {
  lv: 1,
  item: ["weapon", "second-weapon", "badge", "shield"],
  prob: [
    [8.11, "最大HP +125"],
    [8.11, "最大MP +125"],
    [8.11, "移動速度 +6"],
    [8.11, "跳躍力 +6"],
    [8.11, "防禦率 +125"],
    [8.11, "STR +13"],
    [8.11, "DEX +13"],
    [8.11, "INT +13"],
    [8.11, "LUK +13"],
    [1.8, "物理攻擊力 +13"],
    [1.8, "魔法攻擊力 +13"],
    [1.8, "最大HP +3%"],
    [1.8, "最大MP +3%"],
    [1.8, "STR +4%"],
    [1.8, "DEX +4%"],
    [1.8, "INT +4%"],
    [1.8, "LUK +4%"],
    [0.9, "物理攻擊力 +4%"],
    [0.9, "魔法攻擊力 +4%"],
    [1.8, "爆擊機率 +4%"],
    [0.9, "總傷害 +4%"],
    [8.11, "全屬性 +6"],
  ],
};

// 稀有等級
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const shineR1 = {
  lv: 2,
  item: [
    "hat",
    "top",
    "bottom",
    "suit",
    "gloves",
    "shoes",
    "cloak",
    "belt",
    "shoulder",
    "heart",
  ],
  prob: [
    [7.38, "STR +15"],
    [7.38, "DEX +15"],
    [7.38, "INT +15"],
    [7.38, "LUK +15"],
    [7.38, "最大HP +185"],
    [7.38, "最大MP +185"],
    [7.38, "移動速度 +8"],
    [7.38, "跳躍力 +8"],
    [1.64, "物理攻擊力 +12"],
    [1.64, "魔法攻擊力 +12"],
    [7.38, "防禦率 +150"],
    [1.64, "STR +5%"],
    [1.64, "DEX +5%"],
    [1.64, "INT +5%"],
    [1.64, "LUK +5%"],
    [7.38, "最大HP +6%"],
    [7.38, "最大MP +6%"],
    [7.38, "防禦率 +5%"],
    [1.64, "全屬性 +3%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const shineR2 = {
  lv: 2,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [7.38, "STR +15"],
    [7.38, "DEX +15"],
    [7.38, "INT +15"],
    [7.38, "LUK +15"],
    [7.38, "最大HP +185"],
    [7.38, "最大MP +185"],
    [7.38, "移動速度 +8"],
    [7.38, "跳躍力 +8"],
    [1.64, "物理攻擊力 +12"],
    [1.64, "魔法攻擊力 +12"],
    [7.38, "防禦率 +150"],
    [1.64, "STR +5%"],
    [1.64, "DEX +5%"],
    [1.64, "INT +5%"],
    [1.64, "LUK +5%"],
    [7.38, "最大HP +6%"],
    [7.38, "最大MP +6%"],
    [7.38, "防禦率 +5%"],
    [1.64, "全屬性 +3%"],
  ],
};

// 武器,輔助武器,徽章
const shineR3 = {
  lv: 2,
  item: ["weapon", "second-weapon", "badge", "shield"],
  prob: [
    [10.98, "最大HP +6%"],
    [10.98, "最大MP +6%"],
    [2.44, "物理攻擊力 +7%"],
    [2.44, "魔法攻擊力 +7%"],
    [1.22, "爆擊機率 +7%"],
    [10.98, "STR +7%"],
    [10.98, "DEX +7%"],
    [10.98, "INT +7%"],
    [10.98, "LUK +7%"],
    [1.22, "總傷害 +7%"],
    [2.44, "全屬性 +4%"],
    [10.98, "攻擊時有 3% 機率恢復 54 HP"],
    [10.98, "攻擊時有 3% 機率恢復 54 MP"],
    [2.44, "無視怪物防禦率 +3%"],
  ],
};

// 罕見等級
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const shineSR1 = {
  lv: 3,
  item: [
    "hat",
    "top",
    "bottom",
    "suit",
    "gloves",
    "shoes",
    "cloak",
    "belt",
    "shoulder",
    "heart",
  ],
  prob: [
    [9.52, "STR +17"],
    [9.52, "DEX +17"],
    [9.52, "INT +17"],
    [9.52, "LUK +17"],
    [9.52, "最大HP +250"],
    [9.52, "最大MP +250"],
    [1.9, "物理攻擊力 +13"],
    [1.9, "魔法攻擊力 +13"],
    [1.9, "STR +6%"],
    [1.9, "DEX +6%"],
    [1.9, "INT +6%"],
    [1.9, "LUK +6%"],
    [9.52, "最大HP +8%"],
    [9.52, "最大MP +8%"],
    [1.9, "全屬性 +5%"],
    [2.86, "HP恢復道具及恢復技能效果增加 +20%"],
    [1.9, "以角色等級為準每9級STR +1"],
    [1.9, "以角色等級為準每9級DEX +1"],
    [1.9, "以角色等級為準每9級INT +1"],
    [1.9, "以角色等級為準每9級LUK +1"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const shineSR2 = {
  lv: 3,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [9.52, "STR +17"],
    [9.52, "DEX +17"],
    [9.52, "INT +17"],
    [9.52, "LUK +17"],
    [9.52, "最大HP +250"],
    [9.52, "最大MP +250"],
    [1.9, "物理攻擊力 +13"],
    [1.9, "魔法攻擊力 +13"],
    [1.9, "STR +6%"],
    [1.9, "DEX +6%"],
    [1.9, "INT +6%"],
    [1.9, "LUK +6%"],
    [9.52, "最大HP +8%"],
    [9.52, "最大MP +8%"],
    [1.9, "全屬性 +5%"],
    [2.86, "HP恢復道具及恢復技能效果增加 +20%"],
    [1.9, "以角色等級為準每9級STR +1"],
    [1.9, "以角色等級為準每9級DEX +1"],
    [1.9, "以角色等級為準每9級INT +1"],
    [1.9, "以角色等級為準每9級LUK +1"],
  ],
};

// 武器, 輔助武器(包含力量之盾, 靈魂盾牌)
const shineSR3 = {
  lv: 3,
  item: ["weapon", "second-weapon", "shield"],
  prob: [
    [14.08, "最大HP +8%"],
    [14.08, "最大MP +8%"],
    [2.82, "物理攻擊力 +10%"],
    [2.82, "魔法攻擊力 +10%"],
    [2.82, "爆擊機率 +10%"],
    [4.23, "STR +10%"],
    [4.23, "DEX +10%"],
    [4.23, "INT +10%"],
    [4.23, "LUK +10%"],
    [1.41, "總傷害 +10%"],
    [2.82, "全屬性 +7%"],
    [1.41, "無視怪物防禦率 +4%"],
    [1.41, "攻擊BOSS怪物時傷害增加 +12%"],
    [14.08, "攻擊時有 15% 機率恢復 97 HP"],
    [14.08, "攻擊時有 15% 機率恢復 97 MP"],
    [2.82, "以角色等級為準每9級STR +1"],
    [2.82, "以角色等級為準每9級DEX +1"],
    [2.82, "以角色等級為準每9級INT +1"],
    [2.82, "以角色等級為準每9級LUK +1"],
  ],
};

// 徽章
const shineSR4 = {
  lv: 3,
  item: ["badge"],
  prob: [
    [14.29, "最大HP +8%"],
    [14.29, "最大MP +8%"],
    [2.86, "物理攻擊力 +10%"],
    [2.86, "魔法攻擊力 +10%"],
    [2.86, "爆擊機率 +10%"],
    [4.29, "STR +10%"],
    [4.29, "DEX +10%"],
    [4.29, "INT +10%"],
    [4.29, "LUK +10%"],
    [1.43, "總傷害 +10%"],
    [2.86, "全屬性 +7%"],
    [1.43, "無視怪物防禦率 +4%"],
    [14.29, "攻擊時有 15% 機率恢復 97 HP"],
    [14.29, "攻擊時有 15% 機率恢復 97 MP"],
    [2.86, "以角色等級為準每9級STR +1"],
    [2.86, "以角色等級為準每9級DEX +1"],
    [2.86, "以角色等級為準每9級INT +1"],
    [2.86, "以角色等級為準每9級LUK +1"],
  ],
};

// 傳說等級
// 帽子
const shineSSR1 = {
  lv: 4,
  item: ["hat"],
  prob: [
    [9.62, "STR +19"],
    [9.62, "DEX +19"],
    [9.62, "INT +19"],
    [9.62, "LUK +19"],
    [9.62, "最大HP +310"],
    [9.62, "最大MP +310"],
    [1.28, "物理攻擊力 +15"],
    [1.28, "魔法攻擊力 +15"],
    [1.28, "STR +8%"],
    [1.28, "DEX +8%"],
    [1.28, "INT +8%"],
    [1.28, "LUK +8%"],
    [9.62, "最大HP +11%"],
    [9.62, "最大MP +11%"],
    [1.28, "爆擊傷害 +1%"],
    [1.28, "全屬性 +6%"],
    [1.28, "以角色等級為準每9級STR +2"],
    [1.28, "以角色等級為準每9級DEX +2"],
    [1.28, "以角色等級為準每9級INT +2"],
    [1.28, "以角色等級為準每9級LUK +2"],
    [1.92, "HP恢復道具及恢復技能效果增加 +30%"],
    [1.92, "減少所有技能冷卻時間 -1 秒"],
    [1.92, "楓幣獲得量 +5%"],
    [1.92, "道具掉落率 +5%"],
  ],
};

// 手套
const shineSSR2 = {
  lv: 4,
  item: ["gloves"],
  prob: [
    [9.68, "STR +19"],
    [9.68, "DEX +19"],
    [9.68, "INT +19"],
    [9.68, "LUK +19"],
    [9.68, "最大HP +310"],
    [9.68, "最大MP +310"],
    [1.29, "物理攻擊力 +15"],
    [1.29, "魔法攻擊力 +15"],
    [1.29, "STR +8%"],
    [1.29, "DEX +8%"],
    [1.29, "INT +8%"],
    [1.29, "LUK +8%"],
    [9.68, "最大HP +11%"],
    [9.68, "最大MP +11%"],
    [1.29, "爆擊傷害 +3%"],
    [1.29, "爆擊傷害 +1%"],
    [1.29, "全屬性 +6%"],
    [1.29, "以角色等級為準每9級STR +2"],
    [1.29, "以角色等級為準每9級DEX +2"],
    [1.29, "以角色等級為準每9級INT +2"],
    [1.29, "以角色等級為準每9級LUK +2"],
    [1.94, "HP恢復道具及恢復技能效果增加 +30%"],
    [1.94, "楓幣獲得量 +5%"],
    [1.94, "道具掉落率 +5%"],
  ],
};

// 上衣, 下衣, 套服, 披風, 腰帶, 鞋子, 肩膀裝飾, 機器心臟
const shineSSR3 = {
  lv: 4,
  item: [
    "top",
    "bottom",
    "suit",
    "cloak",
    "belt",
    "shoes",
    "shoulder",
    "heart",
  ],
  prob: [
    [9.8, "STR +19"],
    [9.8, "DEX +19"],
    [9.8, "INT +19"],
    [9.8, "LUK +19"],
    [9.8, "最大HP +310"],
    [9.8, "最大MP +310"],
    [1.31, "物理攻擊力 +15"],
    [1.31, "魔法攻擊力 +15"],
    [1.31, "STR +8%"],
    [1.31, "DEX +8%"],
    [1.31, "INT +8%"],
    [1.31, "LUK +8%"],
    [9.8, "最大HP +11%"],
    [9.8, "最大MP +11%"],
    [1.31, "爆擊傷害 +1%"],
    [1.31, "全屬性 +6%"],
    [1.31, "以角色等級為準每9級STR +2"],
    [1.31, "以角色等級為準每9級DEX +2"],
    [1.31, "以角色等級為準每9級INT +2"],
    [1.31, "以角色等級為準每9級LUK +2"],
    [1.96, "HP恢復道具及恢復技能效果增加 +30%"],
    [1.96, "楓幣獲得量 +5%"],
    [1.96, "道具掉落率 +5%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const shineSSR4 = {
  lv: 4,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [9.74, "STR +19"],
    [9.74, "DEX +19"],
    [9.74, "INT +19"],
    [9.74, "LUK +19"],
    [9.74, "最大HP +310"],
    [9.74, "最大MP +310"],
    [1.3, "物理攻擊力 +15"],
    [1.3, "魔法攻擊力 +15"],
    [1.3, "STR +8%"],
    [1.3, "DEX +8%"],
    [1.3, "INT +8%"],
    [1.3, "LUK +8%"],
    [9.74, "最大HP +11%"],
    [9.74, "最大MP +11%"],
    [1.3, "全屬性 +6%"],
    [1.3, "以角色等級為準每9級STR +2"],
    [1.3, "以角色等級為準每9級DEX +2"],
    [1.3, "以角色等級為準每9級INT +2"],
    [1.3, "以角色等級為準每9級LUK +2"],
    [1.95, "所有技能的MP消耗 -10%"],
    [1.95, "HP恢復道具及恢復技能效果增加 +30%"],
    [1.95, "楓幣獲得量 +5%"],
    [1.95, "道具掉落率 +5%"],
  ],
};

// 武器
const shineSSR5 = {
  lv: 4,
  item: ["weapon"],
  prob: [
    [23.81, "最大HP +11%"],
    [23.81, "最大MP +11%"],
    [3.17, "物理攻擊力 +13%"],
    [3.17, "魔法攻擊力 +13%"],
    [3.17, "爆擊機率 +13%"],
    [4.76, "STR +13%"],
    [4.76, "DEX +13%"],
    [4.76, "INT +13%"],
    [4.76, "LUK +13%"],
    [1.59, "總傷害 +13%"],
    [3.17, "全屬性 +10%"],
    [1.59, "無視怪物防禦率 +5%"],
    [1.59, "攻擊BOSS怪物時傷害增加 +18%"],
    [3.17, "以角色等級為準每9級STR +2"],
    [3.17, "以角色等級為準每9級DEX +2"],
    [3.17, "以角色等級為準每9級INT +2"],
    [3.17, "以角色等級為準每9級LUK +2"],
    [1.59, "物理攻擊力 +32"],
    [1.59, "魔法攻擊力 +32"],
  ],
};

// 輔助武器(包含力量之盾, 靈魂盾牌)
const shineSSR6 = {
  lv: 4,
  item: [, "second-weapon", "shield"],
  prob: [
    [23.08, "最大HP +11%"],
    [23.08, "最大MP +11%"],
    [3.08, "物理攻擊力 +13%"],
    [3.08, "魔法攻擊力 +13%"],
    [3.08, "爆擊機率 +13%"],
    [3.08, "爆擊傷害 +1%"],
    [4.62, "STR +13%"],
    [4.62, "DEX +13%"],
    [4.62, "INT +13%"],
    [4.62, "LUK +13%"],
    [1.54, "總傷害 +13%"],
    [3.08, "全屬性 +10%"],
    [1.54, "無視怪物防禦率 +5%"],
    [1.54, "攻擊BOSS怪物時傷害增加 +18%"],
    [3.08, "以角色等級為準每9級STR +2"],
    [3.08, "以角色等級為準每9級DEX +2"],
    [3.08, "以角色等級為準每9級INT +2"],
    [3.08, "以角色等級為準每9級LUK +2"],
    [1.54, "物理攻擊力 +32"],
    [1.54, "魔法攻擊力 +32"],
  ],
};

// 徽章
const shineSSR7 = {
  lv: 4,
  item: ["badge"],
  prob: [
    [24.19, "最大HP +11%"],
    [24.19, "最大MP +11%"],
    [3.23, "物理攻擊力 +13%"],
    [3.23, "魔法攻擊力 +13%"],
    [3.23, "爆擊機率 +13%"],
    [4.84, "STR +13%"],
    [4.84, "DEX +13%"],
    [4.84, "INT +13%"],
    [4.84, "LUK +13%"],
    [1.61, "總傷害 +13%"],
    [3.23, "全屬性 +10%"],
    [1.61, "無視怪物防禦率 +5%"],
    [3.23, "以角色等級為準每9級STR +2"],
    [3.23, "以角色等級為準每9級DEX +2"],
    [3.23, "以角色等級為準每9級INT +2"],
    [3.23, "以角色等級為準每9級LUK +2"],
    [1.61, "物理攻擊力 +32"],
    [1.61, "魔法攻擊力 +32"],
  ],
};

export const shineProb = [
  shine1,
  shine2,
  shine3,
  shineN1,
  shineN2,
  shineN3,
  shineR1,
  shineR2,
  shineR3,
  shineSR1,
  shineSR2,
  shineSR3,
  shineSR4,
  shineSSR1,
  shineSSR2,
  shineSSR3,
  shineSSR4,
  shineSSR5,
  shineSSR6,
  shineSSR7,
];

let LevelUpProb = [
  [4.7, 2],
  [1.8, 3],
  [0.3, 4],
  [0, 5],
];

export const resetLvProb = function () {
  LevelUpProb = [
    [4.7, 2],
    [1.8, 3],
    [0.3, 4],
    [0, 5],
  ];
};

// 閃亮附加跳框機率
const levelUp = function () {
  let secpotSelect = +$doc("#sec-pot-select").value;
  const levelUpResult = getRandomResultByProbability([
    [LevelUpProb[secpotSelect - 1][0], secpotSelect + 1],
    [100 - LevelUpProb[secpotSelect - 1][0], secpotSelect],
  ]);

  function updateProbability(currentLevel, increment, resetValue) {
    if (levelUpResult === currentLevel) {
      LevelUpProb[currentLevel - 1][0] += increment;
    } else if (levelUpResult === currentLevel + 1) {
      LevelUpProb[currentLevel - 1][0] = resetValue;
      secpotSelect = currentLevel + 1;
    }
  }

  switch (secpotSelect) {
    case 1:
      updateProbability(1, 0.05, 4.7);
      break;
    case 2:
      updateProbability(2, 0.01, 1.8);
      break;
    case 3:
      updateProbability(3, 0.005, 0.3);
      break;
  }

  $doc("#sec-pot-select").value = secpotSelect;
  $doc(".lv-prob").textContent =
    LevelUpProb[+secpotSelect - 1][0].toFixed(3) + "%";
};

// 點閃亮附加
export const processShine = function (arrProb) {
  // 暫時存放確認用的潛能
  const tempPotentailArray = [];
  // 先看有沒有跳框
  levelUp();

  const itemName = $doc("#item-select").value;
  const potentialLevel = +$doc("#sec-pot-select").value;
  // 同等潛能
  const sameLV = findProbability(shineProb, itemName, potentialLevel);
  // 低一階潛能
  const lowerLV = findProbability(shineProb, itemName, potentialLevel - 1);

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
      pushToPotentialArray(1.96, 98.04);
      pushToPotentialArray(1.96, 98.04);
      break;
    case 2: // 稀有
      pushToPotentialArray(100, 0);
      pushToPotentialArray(4.76, 95.24);
      pushToPotentialArray(4.76, 95.24);
      break;
    case 3: // 罕見
      pushToPotentialArray(100, 0);
      pushToPotentialArray(1.96, 98.04);
      pushToPotentialArray(1.96, 98.04);
      break;
    case 4: // 傳說
      pushToPotentialArray(100, 0);
      pushToPotentialArray(0.5, 99.5);
      pushToPotentialArray(0.5, 99.5);
      break;
  }

  // 確認潛能 2024/6/26不再限定潛能
  if (!checkPotential(tempPotentailArray)) {
    processShine();
    return;
  }

  $doc(".part-shine .pot-lv").textContent =
    getTextFromSelectValue(potentialLevel);

  for (let i = 0; i < 3; i++) {
    $doc(`.shine-${i + 1}`).textContent = tempPotentailArray[i];
    $doc(`.additional-${i + 1}`).textContent = tempPotentailArray[i];
  }

  $doc(".counter-shine").textContent++;
};
