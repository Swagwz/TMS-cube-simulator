"use strict";

import {
  getRandomResultByProbability,
  getTextFromSelectValue,
  findProbability,
  checkPotential,
  $doc,
} from "./helper.js";

/////////////////////////////////////////////////////////
// 工匠方塊
// 帽子,上衣,套服,下衣,手套,披風,腰帶,肩膀,機器心臟
const artisan1 = {
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
    [9.8039, "STR +6"],
    [9.8039, "DEX +6"],
    [9.8039, "INT +6"],
    [9.8039, "LUK +6"],
    [14.7059, "最大HP +60"],
    [14.7059, "最大MP +60"],
    [14.7059, "防禦率 +60"],
  ],
};

// 鞋子
const artisan2 = {
  lv: 0,
  item: ["shoes"],
  prob: [
    [7.2464, "STR +6"],
    [7.2464, "DEX +6"],
    [7.2464, "INT +6"],
    [7.2464, "LUK +6"],
    [10.8696, "最大HP +60"],
    [10.8696, "最大MP +60"],
    [10.8696, "移動速度 +4"],
    [10.8696, "跳躍力 +4"],
    [10.8696, "防禦率 +60"],
  ],
};

// 武器, 徽章, 輔助武器(力量之盾, 靈魂盾牌除外)
const artisan3 = {
  lv: 0,
  item: ["weapon", "second-weapon", "badge"],
  prob: [
    [10.4167, "STR +6"],
    [10.4167, "DEX +6"],
    [10.4167, "INT +6"],
    [10.4167, "LUK +6"],
    [15.625, "最大HP +60"],
    [15.625, "最大MP +60"],
    [5.2083, "物理攻擊力 +6"],
    [5.2083, "魔法攻擊力 +6"],
  ],
};

// 輔助武器(力量之盾, 靈魂盾牌)
const artisan4 = {
  lv: 0,
  item: ["shield"],
  prob: [
    [12.8205, "STR +6"],
    [12.8205, "DEX +6"],
    [12.8205, "INT +6"],
    [12.8205, "LUK +6"],
    [19.2308, "最大HP +60"],
    [6.4103, "物理攻擊力 +6"],
    [6.4103, "魔法攻擊力 +6"],
  ],
};

// 特殊等級
// 帽子,上衣,套服,下衣,手套,披風,腰帶,肩膀,機器心臟
const artisanN1 = {
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
    [5.56, "STR +13"],
    [5.56, "DEX +13"],
    [5.56, "INT +13"],
    [5.56, "LUK +13"],
    [8.33, "最大HP +125"],
    [8.33, "最大MP +125"],
    [8.33, "防禦率 +125"],
    [5.56, "STR +4%"],
    [5.56, "DEX +4%"],
    [5.56, "INT +4%"],
    [5.56, "LUK +4%"],
    [8.33, "最大HP +4%"],
    [8.33, "最大MP +4%"],
    [8.33, "防禦率 +4%"],
    [5.56, "全屬性 +6"],
  ],
};

// 鞋子
const artisanN2 = {
  lv: 1,
  item: ["shoes"],
  prob: [
    [7.14, "移動速度 +8"],
    [7.14, "跳躍力 +8"],
    [4.76, "STR +13"],
    [4.76, "DEX +13"],
    [4.76, "INT +13"],
    [4.76, "LUK +13"],
    [7.14, "最大HP +125"],
    [7.14, "最大MP +125"],
    [7.14, "防禦率 +125"],
    [4.76, "STR +4%"],
    [4.76, "DEX +4%"],
    [4.76, "INT +4%"],
    [4.76, "LUK +4%"],
    [7.14, "最大HP +4%"],
    [7.14, "最大MP +4%"],
    [7.14, "防禦率 +4%"],
    [4.76, "全屬性 +6"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const artisanN3 = {
  lv: 1,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [4.76, "STR +13"],
    [4.76, "DEX +13"],
    [4.76, "INT +13"],
    [4.76, "LUK +13"],
    [7.14, "最大HP +125"],
    [7.14, "最大MP +125"],
    [7.14, "防禦率 +125"],
    [4.76, "STR +4%"],
    [4.76, "DEX +4%"],
    [4.76, "INT +4%"],
    [4.76, "LUK +4%"],
    [7.14, "最大HP +4%"],
    [7.14, "最大MP +4%"],
    [7.14, "防禦率 +4%"],
    [4.76, "全屬性 +6"],
    [7.14, "每4秒恢復24HP"],
    [7.14, "每4秒恢復24MP"],
  ],
};

// 武器, 徽章, 輔助武器(力量之盾, 靈魂盾牌除外)
const artisanN4 = {
  lv: 1,
  item: ["weapon", "second-weapon", "badge"],
  prob: [
    [3.51, "STR +13"],
    [3.51, "DEX +13"],
    [3.51, "INT +13"],
    [3.51, "LUK +13"],
    [5.26, "最大HP +125"],
    [5.26, "最大MP +125"],
    [3.51, "物理攻擊力 +13"],
    [3.51, "魔法攻擊力 +13"],
    [3.51, "STR +4%"],
    [3.51, "DEX +4%"],
    [3.51, "INT +4%"],
    [3.51, "LUK +4%"],
    [1.75, "物理攻擊力 +4%"],
    [1.75, "魔法攻擊力 +4%"],
    [1.75, "爆擊機率 +4%"],
    [1.75, "總傷害 +4%"],
    [3.51, "全屬性 +6"],
    [5.26, "攻擊時有 3% 機率恢復 33 HP"],
    [5.26, "攻擊時有 3% 機率恢復 33 MP"],
    [5.26, "攻擊時有 10% 機率發動 6級 中毒效果"],
    [5.26, "攻擊時有 5% 機率發動 2級 昏迷效果"],
    [5.26, "攻擊時有 10% 機率發動 2級 緩慢效果"],
    [5.26, "攻擊時有 10% 機率發動 3級 闇黑效果"],
    [5.26, "攻擊時有 5% 機率發動 2級 冰結效果"],
    [5.26, "攻擊時有 5% 機率發動 2級 封印效果"],
    [1.75, "無視怪物防禦率 +15%"],
  ],
};

// 輔助武器(力量之盾, 靈魂盾牌)
const artisanN5 = {
  lv: 1,
  item: ["shield"],
  prob: [
    [3.92, "STR +13"],
    [3.92, "DEX +13"],
    [3.92, "INT +13"],
    [3.92, "LUK +13"],
    [5.88, "最大HP +125"],
    [3.92, "物理攻擊力 +13"],
    [3.92, "魔法攻擊力 +13"],
    [3.92, "STR +4%"],
    [3.92, "DEX +4%"],
    [3.92, "INT +4%"],
    [3.92, "LUK +4%"],
    [1.96, "物理攻擊力 +4%"],
    [1.96, "魔法攻擊力 +4%"],
    [1.96, "爆擊機率 +4%"],
    [1.96, "總傷害 +4%"],
    [3.92, "全屬性 +6"],
    [5.88, "攻擊時有 3% 機率恢復 33 MP"],
    [5.88, "攻擊時有 10% 機率發動 6級 中毒效果"],
    [5.88, "攻擊時有 5% 機率發動 2級 昏迷效果"],
    [5.88, "攻擊時有 10% 機率發動 2級 緩慢效果"],
    [5.88, "攻擊時有 10% 機率發動 3級 闇黑效果"],
    [5.88, "攻擊時有 5% 機率發動 2級 冰結效果"],
    [5.88, "攻擊時有 5% 機率發動 2級 封印效果"],
    [1.96, "無視怪物防禦率 +15%"],
  ],
};

// 稀有等級
// 帽子,下衣,披風,腰帶,肩膀,機器心臟
const artisanR1 = {
  lv: 2,
  item: ["hat", "bottom", "cloak", "belt", "shoulder", "heart"],
  prob: [
    [7.41, "STR +7%"],
    [7.41, "DEX +7%"],
    [7.41, "INT +7%"],
    [7.41, "LUK +7%"],
    [11.11, "最大HP +7%"],
    [11.11, "最大MP +7%"],
    [11.11, "防禦率 +7%"],
    [3.7, "全屬性 +4%"],
    [11.11, "被擊中時有 20% 機率無視 26 傷害"],
    [11.11, "被擊中時有 20% 機率無視 39 傷害"],
    [11.11, "被擊中時有 30% 機率無視 53 傷害"],
  ],
};

// 上衣,套服
const artisanR2 = {
  lv: 2,
  item: ["top", "suit"],
  prob: [
    [10, "被擊中後無敵時間增加 +1 秒"],
    [6.67, "STR +7%"],
    [6.67, "DEX +7%"],
    [6.67, "INT +7%"],
    [6.67, "LUK +7%"],
    [10, "最大HP +7%"],
    [10, "最大MP +7%"],
    [10, "防禦率 +7%"],
    [3.33, "全屬性 +4%"],
    [10, "被擊中時有 20% 機率無視 26 傷害"],
    [10, "被擊中時有 20% 機率無視 39 傷害"],
    [10, "被擊中時有 30% 機率無視 53 傷害"],
  ],
};

// 手套
const artisanR3 = {
  lv: 2,
  item: ["gloves"],
  prob: [
    [9.09, "擊殺怪物有 15% 機率恢復 97 HP"],
    [9.09, "擊殺怪物有 15% 機率恢復 97 MP"],
    [6.06, "STR +7%"],
    [6.06, "DEX +7%"],
    [6.06, "INT +7%"],
    [6.06, "LUK +7%"],
    [9.09, "最大HP +7%"],
    [9.09, "最大MP +7%"],
    [9.09, "防禦率 +7%"],
    [3.03, "全屬性 +4%"],
    [9.09, "被擊中時有 20% 機率無視 26 傷害"],
    [9.09, "被擊中時有 20% 機率無視 39 傷害"],
    [9.09, "被擊中時有 30% 機率無視 53 傷害"],
  ],
};

// 鞋子
const artisanR4 = {
  lv: 2,
  item: ["shoes"],
  prob: [
    [7.41, "STR +7%"],
    [7.41, "DEX +7%"],
    [7.41, "INT +7%"],
    [7.41, "LUK +7%"],
    [11.11, "最大HP +7%"],
    [11.11, "最大MP +7%"],
    [11.11, "防禦率 +7%"],
    [3.7, "全屬性 +4%"],
    [11.11, "被擊中時有 20% 機率無視 26 傷害"],
    [11.11, "被擊中時有 20% 機率無視 39 傷害"],
    [11.11, "被擊中時有 30% 機率無視 53 傷害"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const artisanR5 = {
  lv: 2,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [11.11, "STR +7%"],
    [11.11, "DEX +7%"],
    [11.11, "INT +7%"],
    [11.11, "LUK +7%"],
    [16.67, "最大HP +7%"],
    [16.67, "最大MP +7%"],
    [16.67, "防禦率 +7%"],
    [5.56, "全屬性 +4%"],
  ],
};

// 武器, 徽章, 輔助武器(力量之盾, 靈魂盾牌除外)
const artisanR6 = {
  lv: 2,
  item: ["weapon", "second-weapon", "badge"],
  prob: [
    [3.85, "物理攻擊力 +7%"],
    [3.85, "魔法攻擊力 +7%"],
    [3.85, "爆擊機率 +8%"],
    [3.85, "總傷害 +7%"],
    [11.54, "攻擊時有 3% 機率恢復 54 HP"],
    [11.54, "攻擊時有 3% 機率恢復 54 MP"],
    [3.85, "無視怪物防禦率 +15%"],
    [7.69, "STR +7%"],
    [7.69, "DEX +7%"],
    [7.69, "INT +7%"],
    [7.69, "LUK +7%"],
    [11.54, "最大HP +7%"],
    [11.54, "最大MP +7%"],
    [3.85, "全屬性 +4%"],
  ],
};

// 輔助武器(力量之盾, 靈魂盾牌)
const artisanR7 = {
  lv: 2,
  item: ["shield"],
  prob: [
    [6.9, "STR +7%"],
    [6.9, "DEX +7%"],
    [6.9, "INT +7%"],
    [6.9, "LUK +7%"],
    [10.34, "最大HP +7%"],
    [3.45, "物理攻擊力 +7%"],
    [3.45, "魔法攻擊力 +7%"],
    [3.45, "爆擊機率 +8%"],
    [3.45, "總傷害 +7%"],
    [3.45, "全屬性 +4%"],
    [10.34, "攻擊時有 3% 機率恢復 54 HP"],
    [3.45, "無視怪物防禦率 +15%"],
    [10.34, "被擊中時有 20% 機率無視 26 傷害"],
    [10.34, "被擊中時有 20% 機率無視 39 傷害"],
    [10.34, "被擊中時有 30% 機率無視 53 傷害"],
  ],
};

// 罕見等級
// 帽子
const artisanSR1 = {
  lv: 3,
  item: ["hat"],
  prob: [
    [7.69, "可以使用<實用的時空門>技能"],
    [7.69, "STR +10%"],
    [7.69, "DEX +10%"],
    [7.69, "INT +10%"],
    [7.69, "LUK +10%"],
    [11.54, "最大HP +10%"],
    [11.54, "最大MP +10%"],
    [3.85, "全屬性 +7%"],
    [11.54, "被擊中時有 5% 機率無視 20% 傷害"],
    [11.54, "被擊中時有 5% 機率無視 40% 傷害"],
    [11.54, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 上衣,套服
const artisanSR2 = {
  lv: 3,
  item: ["top", "suit"],
  prob: [
    [10, "被擊中後無敵時間增加 +2 秒"],
    [10, "被擊中時有 2% 機率在 7 秒內無敵"],
    [6.67, "STR +10%"],
    [6.67, "DEX +10%"],
    [6.67, "INT +10%"],
    [6.67, "LUK +10%"],
    [10, "最大HP +10%"],
    [10, "最大MP +10%"],
    [3.33, "全屬性 +7%"],
    [10, "被擊中時有 5% 機率無視 20% 傷害"],
    [10, "被擊中時有 5% 機率無視 40% 傷害"],
    [10, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 下衣
const artisanSR3 = {
  lv: 3,
  item: ["bottom"],
  prob: [
    [7.69, "可以使用<實用的神聖之火>技能"],
    [7.69, "STR +10%"],
    [7.69, "DEX +10%"],
    [7.69, "INT +10%"],
    [7.69, "LUK +10%"],
    [11.54, "最大HP +10%"],
    [11.54, "最大MP +10%"],
    [3.85, "全屬性 +7%"],
    [11.54, "被擊中時有 5% 機率無視 20% 傷害"],
    [11.54, "被擊中時有 5% 機率無視 40% 傷害"],
    [11.54, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 手套
const artisanSR4 = {
  lv: 3,
  item: ["gloves"],
  prob: [
    [6.25, "可以使用<實用的會心之眼>技能"],
    [6.25, "STR +10%"],
    [6.25, "DEX +10%"],
    [6.25, "INT +10%"],
    [6.25, "LUK +10%"],
    [9.38, "最大HP +10%"],
    [9.38, "最大MP +10%"],
    [3.13, "全屬性 +7%"],
    [9.38, "被擊中時有 5% 機率無視 20% 傷害"],
    [9.38, "被擊中時有 5% 機率無視 40% 傷害"],
    [9.38, "HP恢復道具及恢復技能效果增加 +30%"],
    [9.38, "攻擊時有 1% 機率發動自動竊取"],
    [9.38, "攻擊時有 2% 機率發動自動竊取"],
  ],
};

// 鞋子
const artisanSR5 = {
  lv: 3,
  item: ["shoes"],
  prob: [
    [7.69, "可以使用<實用的速度激發>技能"],
    [7.69, "STR +10%"],
    [7.69, "DEX +10%"],
    [7.69, "INT +10%"],
    [7.69, "LUK +10%"],
    [11.54, "最大HP +10%"],
    [11.54, "最大MP +10%"],
    [3.85, "全屬性 +7%"],
    [11.54, "被擊中時有 5% 機率無視 20% 傷害"],
    [11.54, "被擊中時有 5% 機率無視 40% 傷害"],
    [11.54, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 披風,腰帶,肩膀,機器心臟
const artisanSR6 = {
  lv: 3,
  item: ["cloak", "belt", "shoulder", "heart"],
  prob: [
    [8.33, "STR +10%"],
    [8.33, "DEX +10%"],
    [8.33, "INT +10%"],
    [8.33, "LUK +10%"],
    [12.5, "最大HP +10%"],
    [12.5, "最大MP +10%"],
    [4.17, "全屬性 +7%"],
    [12.5, "被擊中時有 5% 機率無視 20% 傷害"],
    [12.5, "被擊中時有 5% 機率無視 40% 傷害"],
    [12.5, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const artisanSR7 = {
  lv: 3,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [11.11, "STR +10%"],
    [11.11, "DEX +10%"],
    [11.11, "INT +10%"],
    [11.11, "LUK +10%"],
    [16.67, "最大HP +10%"],
    [16.67, "最大MP +10%"],
    [5.56, "全屬性 +7%"],
    [16.67, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 武器
const artisanSR8 = {
  lv: 3,
  item: ["weapon"],
  prob: [
    [6.67, "物理攻擊力 +10%"],
    [6.67, "魔法攻擊力 +10%"],
    [6.67, "爆擊機率 +10%"],
    [6.67, "總傷害 +10%"],
    [6.67, "無視怪物防禦率 +30%"],
    [13.33, "STR +10%"],
    [13.33, "DEX +10%"],
    [13.33, "INT +10%"],
    [13.33, "LUK +10%"],
    [6.67, "全屬性 +7%"],
    [6.67, "攻擊BOSS怪物時傷害增加 +30%"],
  ],
};
// 輔助武器(包含力量之盾, 靈魂之環)
const artisanSR9 = {
  lv: 3,
  item: ["second-weapon", "shield"],
  prob: [
    [9.52, "STR +10%"],
    [9.52, "DEX +10%"],
    [9.52, "INT +10%"],
    [9.52, "LUK +10%"],
    [4.76, "物理攻擊力 +10%"],
    [4.76, "魔法攻擊力 +10%"],
    [4.76, "爆擊機率 +10%"],
    [4.76, "總傷害 +10%"],
    [4.76, "全屬性 +7%"],
    [4.76, "無視怪物防禦率 +30%"],
    [14.29, "被擊中時有 5% 機率無視 20% 傷害"],
    [14.29, "被擊中時有 5% 機率無視 40% 傷害"],
    [4.76, "攻擊BOSS怪物時傷害增加 +30%"],
  ],
};

// 徽章
const artisanSR10 = {
  lv: 3,
  item: ["badge"],
  prob: [
    [7.14, "物理攻擊力 +10%"],
    [7.14, "魔法攻擊力 +10%"],
    [7.14, "爆擊機率 +10%"],
    [7.14, "總傷害 +10%"],
    [7.14, "無視怪物防禦率 +30%"],
    [14.29, "STR +10%"],
    [14.29, "DEX +10%"],
    [14.29, "INT +10%"],
    [14.29, "LUK +10%"],
    [7.14, "全屬性 +7%"],
  ],
};

export const artisanProb = [
  artisan1,
  artisan2,
  artisan3,
  artisan4,
  artisanN1,
  artisanN2,
  artisanN3,
  artisanN4,
  artisanN5,
  artisanR1,
  artisanR2,
  artisanR3,
  artisanR4,
  artisanR5,
  artisanR6,
  artisanR7,
  artisanSR1,
  artisanSR2,
  artisanSR3,
  artisanSR4,
  artisanSR5,
  artisanSR6,
  artisanSR7,
  artisanSR8,
  artisanSR9,
  artisanSR10,
];

// 工匠跳框機率
function levelUp() {
  let potentialLevel = +$doc("#pot-select").value;
  switch (potentialLevel) {
    case 1:
      $doc("#pot-select").value = getRandomResultByProbability([
        [95.24, 1],
        [4.76, 2],
      ]);
      break;
    case 2:
      $doc("#pot-select").value = getRandomResultByProbability([
        [98.81, 2],
        [1.19, 3],
      ]);
      break;
  }
}

function doubleLevelUp() {
  let potentialLevel = +$doc("#pot-select").value;
  switch (potentialLevel) {
    case 1:
      $doc("#pot-select").value = getRandomResultByProbability([
        [90.48, 1],
        [9.52, 2],
      ]);
      break;
    case 2:
      $doc("#pot-select").value = getRandomResultByProbability([
        [97.62, 2],
        [2.38, 3],
      ]);
      break;
  }
}

// 點工匠
export const processArtisan = function () {
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
  const sameLV = findProbability(artisanProb, itemName, potentialLevel);
  // 低一階潛能
  const lowerLV = findProbability(artisanProb, itemName, potentialLevel - 1);

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
      pushToPotentialArray(16.67, 83.33);
      pushToPotentialArray(16.67, 83.33);
      break;
    case 2: // 稀有
      pushToPotentialArray(100, 0);
      pushToPotentialArray(4.76, 95.24);
      pushToPotentialArray(4.76, 95.24);
      break;
    case 3: // 罕見
      pushToPotentialArray(100, 0);
      pushToPotentialArray(1.19, 98.81);
      pushToPotentialArray(1.19, 98.81);
      break;
    case 4:
      $doc(".artisan-1").textContent = "工匠方塊只適用於罕見潛能以下的裝備";
      $doc(".artisan-2").textContent = "";
      $doc(".artisan-3").textContent = "";
      return;
  }

  // 確認潛能 2024/6/26不再限定潛能
  if (!checkPotential(tempPotentailArray)) {
    processArtisan();
    return;
  }

  $doc(".part-artisan .pot-lv").textContent =
    getTextFromSelectValue(potentialLevel);

  for (let i = 0; i < 3; i++) {
    $doc(`.artisan-${i + 1}`).textContent = tempPotentailArray[i];
    $doc(`.main-${i + 1}`).textContent = tempPotentailArray[i];
  }

  $doc(".counter-artisan").textContent++;
};
