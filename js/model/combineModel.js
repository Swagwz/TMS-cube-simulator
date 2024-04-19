"use strict";
// 產生機率對應的結果
const renderProbResult = function (arrProb) {
  let factor = 0;
  const sum = arrProb.map((el) => el[0]).reduce((acc, cur) => acc + cur, 0);
  const random = Math.random() * sum;
  for (const el of arrProb) {
    factor = Number((factor + el[0]).toFixed(2));
    if (random < factor) {
      return el[1];
    }
  }
};

// 潛能等級
export const potToText = function (num) {
  if (num === 1) return "特殊";
  if (num === 2) return "稀有";
  if (num === 3) return "罕見";
  if (num === 4) return "傳說";
};

// *下方潛在能力屬性只能最多設定一個

// 實用的技能系列
// 被擊後無敵時間增加

const checkPot1 = function (playPotArr) {
  const count = {};
  playPotArr.forEach((pot) => {
    if (pot.includes("實用")) {
      count["useful"] = (count["useful"] || 0) + 1;
    }
    if (pot.includes("被擊中後無敵時間增加")) {
      count["invicible"] = (count["invicible"] || 0) + 1;
    }
  });
  if (count.useful >= 2 || count.invicible >= 2) return false;
  else return true;
};

// *下方潛在能力屬性只能最多設定兩個(閃耀鏡射方塊不在此限制內)

// 怪物防禦率無視 +%
// 被擊時以一定機率無視傷害 %
// 被擊時以一定機率一定時間內無敵
// BOSS怪物攻擊時傷害 +%
// 道具掉落率 +%

const checkPot2 = function (playPotArr) {
  const count = {};
  playPotArr.forEach((pot) => {
    if (pot.includes("無視怪物防禦率")) {
      count["penetration"] = (count["penetration"] || 0) + 1;
    }
    if (pot.includes("機率無視")) {
      count["ignore"] = (count["ignore"] || 0) + 1;
    }
    if (pot.includes("內無敵")) {
      count["invisibleTime"] = (count["invisibleTime"] || 0) + 1;
    }
    if (pot.includes("BOSS怪物")) {
      count["bossing"] = (count["bossing"] || 0) + 1;
    }
    if (pot.includes("道具掉落率")) {
      count["drop"] = (count["drop"] || 0) + 1;
    }
  });
  if (
    count.penetration >= 3 ||
    count.ignore >= 3 ||
    count.invisibleTime >= 3 ||
    count.bossing >= 3 ||
    count.drop >= 3
  )
    return false;
  else return true;
};
/////////////////////////////////////////////////////////
// 結合方塊
const combine1 = {
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
const combine2 = {
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
const combine3 = {
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
const combine4 = {
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
const combineN1 = {
  lv: 1,
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
  ],
  prob: [
    [8.33, "STR +13"],
    [8.33, "DEX +13"],
    [8.33, "INT +13"],
    [8.33, "LUK +13"],
    [9.26, "最大HP +125"],
    [9.26, "最大MP +125"],
    [9.26, "防禦率 +125"],
    [2.78, "STR +4%"],
    [2.78, "DEX +4%"],
    [2.78, "INT +4%"],
    [2.78, "LUK +4%"],
    [2.78, "最大HP +4%"],
    [8.33, "最大MP +4%"],
    [8.33, "防禦率 +4%"],
    [8.33, "全屬性 +6"],
  ],
};

// 鞋子
const combineN2 = {
  lv: 1,
  item: ["shoes"],
  prob: [
    [8.03, "移動速度 +8"],
    [8.03, "跳躍力 +8"],
    [7.3, "STR +13"],
    [7.3, "DEX +13"],
    [7.3, "INT +13"],
    [7.3, "LUK +13"],
    [7.3, "最大HP +125"],
    [7.3, "最大MP +125"],
    [7.3, "防禦率 +125"],
    [2.19, "STR +4%"],
    [2.19, "DEX +4%"],
    [2.19, "INT +4%"],
    [2.19, "LUK +4%"],
    [2.19, "最大HP +4%"],
    [7.3, "最大MP +4%"],
    [7.3, "防禦率 +4%"],
    [7.3, "全屬性 +6"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const combineN3 = {
  lv: 1,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [8.33, "STR +13"],
    [8.33, "DEX +13"],
    [8.33, "INT +13"],
    [8.33, "LUK +13"],
    [9.26, "最大HP +125"],
    [9.26, "最大MP +125"],
    [9.26, "防禦率 +125"],
    [2.78, "STR +4%"],
    [2.78, "DEX +4%"],
    [2.78, "INT +4%"],
    [2.78, "LUK +4%"],
    [2.78, "最大HP +4%"],
    [8.33, "最大MP +4%"],
    [8.33, "防禦率 +4%"],
    [8.33, "全屬性 +6"],
  ],
};

// 武器, 徽章, 輔助武器(力量之盾, 靈魂盾牌除外)
const combineN4 = {
  lv: 1,
  item: ["weapon", "second-weapon", "badge"],
  prob: [
    [7.41, "STR +13"],
    [7.41, "DEX +13"],
    [7.41, "INT +13"],
    [7.41, "LUK +13"],
    [7.41, "最大HP +125"],
    [7.41, "最大MP +125"],
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
const combineN5 = {
  lv: 1,
  item: ["shield"],
  prob: [
    [9, "STR +13"],
    [9, "DEX +13"],
    [9, "INT +13"],
    [9, "LUK +13"],
    [9, "最大HP +125"],
    [4, "物理攻擊力 +13"],
    [4, "魔法攻擊力 +13"],
    [6, "STR +4%"],
    [6, "DEX +4%"],
    [6, "INT +4%"],
    [6, "LUK +4%"],
    [2, "物理攻擊力 +4%"],
    [2, "魔法攻擊力 +4%"],
    [2, "爆擊機率 +4%"],
    [2, "總傷害 +4%"],
    [4, "全屬性 +6"],
    [2, "攻擊時有 3% 機率恢復 33 MP"],
    [2, "攻擊時有 20% 機率發動 6級 中毒效果"],
    [2, "攻擊時有 10% 機率發動 2級 昏迷效果"],
    [2, "攻擊時有 20% 機率發動 2級 緩慢效果"],
    [2, "攻擊時有 20% 機率發動 3級 闇黑效果"],
    [2, "攻擊時有 10% 機率發動 2級 冰結效果"],
    [2, "攻擊時有 10% 機率發動 2級 封印效果"],
    [2, "無視怪物防禦率 +15%"],
  ],
};

// 稀有等級
// 帽子,下衣,披風,腰帶,肩膀,機器心臟
const combineR1 = {
  lv: 2,
  item: ["hat", "bottom", "cloak", "belt", "shoulder", "heart"],
  prob: [
    [14.08, "STR +7%"],
    [14.08, "DEX +7%"],
    [14.08, "INT +7%"],
    [14.08, "LUK +7%"],
    [14.08, "最大HP +7%"],
    [14.08, "最大MP +7%"],
    [14.08, "防禦率 +7%"],
    [1.41, "全屬性 +4%"],
  ],
};

// 上衣,套服
const combineR2 = {
  lv: 2,
  item: ["top", "suit"],
  prob: [
    [2.08, "被擊中後無敵時間增加 +1 秒"],
    [2.08, "被擊中後無敵時間增加 +1 秒"],
    [13.08, "STR +7%"],
    [13.08, "DEX +7%"],
    [13.08, "INT +7%"],
    [13.08, "LUK +7%"],
    [13.08, "最大HP +7%"],
    [14.02, "最大MP +7%"],
    [14.02, "防禦率 +7%"],
    [0.93, "全屬性 +4%"],
  ],
};

// 手套
const combineR3 = {
  lv: 2,
  item: ["gloves"],
  prob: [
    [2.8, "擊殺怪物有 15% 機率恢復 97 HP"],
    [2.8, "擊殺怪物有 15% 機率恢復 97 MP"],
    [13.08, "STR +7%"],
    [13.08, "DEX +7%"],
    [13.08, "INT +7%"],
    [13.08, "LUK +7%"],
    [13.08, "最大HP +7%"],
    [14.02, "最大MP +7%"],
    [14.02, "防禦率 +7%"],
    [0.93, "全屬性 +4%"],
  ],
};

// 鞋子
const combineR4 = {
  lv: 2,
  item: ["shoes"],
  prob: [
    [13.7, "STR +7%"],
    [13.7, "DEX +7%"],
    [13.7, "INT +7%"],
    [13.7, "LUK +7%"],
    [13.7, "最大HP +7%"],
    [15.07, "最大MP +7%"],
    [15.07, "防禦率 +7%"],
    [1.37, "全屬性 +4%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const combineR5 = {
  lv: 2,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [13.7, "STR +7%"],
    [13.7, "DEX +7%"],
    [13.7, "INT +7%"],
    [13.7, "LUK +7%"],
    [13.7, "最大HP +7%"],
    [15.07, "最大MP +7%"],
    [15.07, "防禦率 +7%"],
    [1.37, "全屬性 +4%"],
  ],
};

// 武器, 徽章, 輔助武器(力量之盾, 靈魂盾牌除外)
const combineR6 = {
  lv: 2,
  item: ["weapon", "second-weapon", "badge"],
  prob: [
    [4.11, "物理攻擊力 +7%"],
    [4.11, "魔法攻擊力 +7%"],
    [4.11, "爆擊機率 +8%"],
    [4.11, "總傷害 +7%"],
    [4.11, "攻擊時有 3% 機率恢復 54 HP"],
    [6.85, "攻擊時有 3% 機率恢復 54 MP"],
    [6.85, "無視怪物防禦率 +15%"],
    [9.59, "STR +7%"],
    [9.59, "DEX +7%"],
    [9.59, "INT +7%"],
    [9.59, "LUK +7%"],
    [9.59, "最大HP +7%"],
    [9.59, "最大MP +7%"],
    [8.22, "全屬性 +4%"],
  ],
};

// 輔助武器(力量之盾, 靈魂盾牌)
const combineR7 = {
  lv: 2,
  item: ["shield"],
  prob: [
    [4.55, "物理攻擊力 +7%"],
    [4.55, "魔法攻擊力 +7%"],
    [4.55, "爆擊機率 +8%"],
    [4.55, "總傷害 +7%"],
    [4.55, "攻擊時有 3% 機率恢復 54 HP"],
    [7.58, "攻擊時有 3% 機率恢復 54 MP"],
    [7.58, "無視怪物防禦率 +15%"],
    [10.61, "STR +7%"],
    [10.61, "DEX +7%"],
    [10.61, "INT +7%"],
    [10.61, "LUK +7%"],
    [10.61, "最大HP +7%"],
    [9.09, "全屬性 +4%"],
  ],
};

// 罕見等級
// 帽子
const combineSR1 = {
  lv: 3,
  item: ["hat"],
  prob: [
    [13.11, "可以使用<實用的時空門>技能"],
    [6.56, "STR +10%"],
    [6.56, "DEX +10%"],
    [6.56, "INT +10%"],
    [6.56, "LUK +10%"],
    [6.56, "最大HP +10%"],
    [13.11, "最大MP +10%"],
    [1.64, "全屬性 +7%"],
    [13.11, "被擊中時有 5% 機率無視 20% 傷害"],
    [13.11, "被擊中時有 5% 機率無視 40% 傷害"],
    [13.11, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 上衣,套服
const combineSR2 = {
  lv: 3,
  item: ["top", "suit"],
  prob: [
    [8.89, "被擊中後無敵時間增加 +2 秒"],
    [8.89, "被擊中時有 2% 機率在 7 秒內無敵"],
    [10, "有 30% 機率反射 50% 所受的傷害"],
    [10, "有 30% 機率反射 70% 所受的傷害"],
    [4.44, "STR +10%"],
    [4.44, "DEX +10%"],
    [4.44, "INT +10%"],
    [4.44, "LUK +10%"],
    [4.44, "最大HP +10%"],
    [8.89, "最大MP +10%"],
    [1.11, "全屬性 +7%"],
    [10, "被擊中時有 5% 機率無視 20% 傷害"],
    [10, "被擊中時有 5% 機率無視 40% 傷害"],
    [10, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 下衣
const combineSR3 = {
  lv: 3,
  item: ["bottom"],
  prob: [
    [12.5, "可以使用<實用的神聖之火>技能"],
    [7.14, "STR +10%"],
    [7.14, "DEX +10%"],
    [7.14, "INT +10%"],
    [7.14, "LUK +10%"],
    [7.14, "最大HP +10%"],
    [12.5, "最大MP +10%"],
    [1.79, "全屬性 +7%"],
    [12.5, "被擊中時有 5% 機率無視 20% 傷害"],
    [12.5, "被擊中時有 5% 機率無視 40% 傷害"],
    [12.5, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 手套
const combineSR4 = {
  lv: 3,
  item: ["gloves"],
  prob: [
    [5.75, "STR +32"],
    [5.75, "DEX +32"],
    [5.75, "INT +32"],
    [5.75, "LUK +32"],
    [9.2, "可以使用<實用的會心之眼>技能"],
    [5.75, "STR +10%"],
    [5.75, "DEX +10%"],
    [5.75, "INT +10%"],
    [5.75, "LUK +10%"],
    [5.75, "最大HP +10%"],
    [9.2, "最大MP +10%"],
    [1.15, "全屬性 +7%"],
    [9.2, "被擊中時有 5% 機率無視 20% 傷害"],
    [9.2, "被擊中時有 5% 機率無視 40% 傷害"],
    [10.34, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 鞋子
const combineSR5 = {
  lv: 3,
  item: ["shoes"],
  prob: [
    [10, "可以使用<實用的速度激發>技能"],
    [7.14, "STR +10%"],
    [7.14, "DEX +10%"],
    [7.14, "INT +10%"],
    [7.14, "LUK +10%"],
    [7.14, "最大HP +10%"],
    [12.86, "最大MP +10%"],
    [1.43, "全屬性 +7%"],
    [12.86, "被擊中時有 5% 機率無視 20% 傷害"],
    [12.86, "被擊中時有 5% 機率無視 40% 傷害"],
    [14.29, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 披風,腰帶,肩膀,機器心臟
const combineSR6 = {
  lv: 3,
  item: ["cloak", "belt", "shoulder", "heart"],
  prob: [
    [8.77, "STR +10%"],
    [8.77, "DEX +10%"],
    [8.77, "INT +10%"],
    [8.77, "LUK +10%"],
    [8.77, "最大HP +10%"],
    [12.28, "最大MP +10%"],
    [1.75, "全屬性 +7%"],
    [14.04, "被擊中時有 5% 機率無視 20% 傷害"],
    [14.04, "被擊中時有 5% 機率無視 40% 傷害"],
    [14.04, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const combineSR7 = {
  lv: 3,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [13.51, "STR +10%"],
    [13.51, "DEX +10%"],
    [13.51, "INT +10%"],
    [13.51, "LUK +10%"],
    [13.51, "最大HP +10%"],
    [13.51, "最大MP +10%"],
    [2.7, "全屬性 +7%"],
    [16.22, "HP恢復道具及恢復技能效果增加 +30%"],
  ],
};

// 武器, 輔助武器(包含力量之盾, 靈魂盾牌)
const combineSR8 = {
  lv: 3,
  item: ["weapon", "second-weapon", "shield"],
  prob: [
    [8.22, "物理攻擊力 +10%"],
    [8.22, "魔法攻擊力 +10%"],
    [16.44, "總傷害 +10%"],
    [20.55, "無視怪物防禦率 +30%"],
    [5.48, "攻擊BOSS怪物時傷害增加 +30%"],
    [27.4, "爆擊機率 +10%"],
    [2.74, "STR +10%"],
    [2.74, "DEX +10%"],
    [2.74, "INT +10%"],
    [2.74, "LUK +10%"],
    [2.74, "全屬性 +7%"],
  ],
};

// 徽章
const combineSR9 = {
  lv: 3,
  item: ["badge"],
  prob: [
    [8.7, "物理攻擊力 +10%"],
    [8.7, "魔法攻擊力 +10%"],
    [17.39, "總傷害 +10%"],
    [21.74, "無視怪物防禦率 +30%"],
    [28.99, "爆擊機率 +10%"],
    [2.9, "STR +10%"],
    [2.9, "DEX +10%"],
    [2.9, "INT +10%"],
    [2.9, "LUK +10%"],
    [2.9, "全屬性 +7%"],
  ],
};

// 傳說等級
// 帽子
const combineSSR1 = {
  lv: 4,
  item: ["hat"],
  prob: [
    [11.11, "減少所有技能冷卻時間 -1 秒"],
    [11.11, "減少所有技能冷卻時間 -2 秒"],
    [12.5, "可以使用<實用的進階祝福>技能"],
    [5.56, "STR +13%"],
    [5.56, "DEX +13%"],
    [5.56, "INT +13%"],
    [5.56, "LUK +13%"],
    [5.56, "最大HP +13%"],
    [11.11, "最大MP +13%"],
    [1.39, "全屬性 +10%"],
    [12.5, "被擊中時有 10% 機率無視 20% 傷害"],
    [12.5, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 上衣,套服
const combineSSR2 = {
  lv: 4,
  item: ["top", "suit"],
  prob: [
    [13.79, "被擊中後無敵時間增加 +3 秒"],
    [13.79, "被擊中時有 4% 機率在 7 秒內無敵"],
    [6.9, "STR +13%"],
    [6.9, "DEX +13%"],
    [6.9, "INT +13%"],
    [6.9, "LUK +13%"],
    [6.9, "最大HP +13%"],
    [12.07, "最大MP +13%"],
    [1.72, "全屬性 +10%"],
    [12.07, "被擊中時有 10% 機率無視 20% 傷害"],
    [12.07, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 下衣
const combineSSR3 = {
  lv: 4,
  item: ["bottom"],
  prob: [
    [10.26, "STR +13%"],
    [10.26, "DEX +13%"],
    [10.26, "INT +13%"],
    [10.26, "LUK +13%"],
    [10.26, "最大HP +13%"],
    [15.38, "最大MP +13%"],
    [2.56, "全屬性 +10%"],
    [15.38, "被擊中時有 10% 機率無視 20% 傷害"],
    [15.38, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 手套
const combineSSR4 = {
  lv: 4,
  item: ["gloves"],
  prob: [
    [3.39, "爆擊傷害 +8%"],
    [13.56, "可以使用<實用的最終極速>技能"],
    [6.78, "STR +13%"],
    [6.78, "DEX +13%"],
    [6.78, "INT +13%"],
    [6.78, "LUK +13%"],
    [6.78, "最大HP +13%"],
    [16.95, "最大MP +13%"],
    [1.69, "全屬性 +10%"],
    [15.25, "被擊中時有 10% 機率無視 20% 傷害"],
    [15.25, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 鞋子
const combineSSR5 = {
  lv: 4,
  item: ["shoes"],
  prob: [
    [12.5, "可以使用<實用的戰鬥命令>技能"],
    [8.33, "STR +13%"],
    [8.33, "DEX +13%"],
    [8.33, "INT +13%"],
    [8.33, "LUK +13%"],
    [8.33, "最大HP +13%"],
    [14.58, "最大MP +13%"],
    [2.08, "全屬性 +10%"],
    [14.58, "被擊中時有 10% 機率無視 20% 傷害"],
    [14.58, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 披風,腰帶,肩膀,機器心臟
const combineSSR6 = {
  lv: 4,
  item: ["cloak", "belt", "shoulder", "heart"],
  prob: [
    [10.26, "STR +13%"],
    [10.26, "DEX +13%"],
    [10.26, "INT +13%"],
    [10.26, "LUK +13%"],
    [10.26, "最大HP +13%"],
    [15.38, "最大MP +13%"],
    [7.69, "全屬性 +10%"],
    [12.82, "被擊中時有 10% 機率無視 20% 傷害"],
    [12.82, "被擊中時有 10% 機率無視 40% 傷害"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const combineSSR7 = {
  lv: 4,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [7.02, "STR +13%"],
    [7.02, "DEX +13%"],
    [7.02, "INT +13%"],
    [7.02, "LUK +13%"],
    [7.02, "最大HP +13%"],
    [14.04, "最大MP +13%"],
    [1.75, "全屬性 +10%"],
    [14.04, "所有技能的MP消耗 -15%"],
    [14.04, "所有技能的MP消耗 -30%"],
    [10.53, "楓幣獲得量 +20%"],
    [10.53, "道具掉落率 +20%"],
  ],
};

// 武器, 輔助武器(包含力量之盾, 靈魂盾牌)
const combineSSR8 = {
  lv: 4,
  item: ["weapon", "second-weapon", "shield"],
  prob: [
    [3.24, "物理攻擊力 +13%"],
    [3.24, "魔法攻擊力 +13%"],
    [16.18, "總傷害 +13%"],
    [25.89, "無視怪物防禦率 +35%"],
    [16.18, "無視怪物防禦率 +40%"],
    [5.18, "攻擊BOSS怪物時傷害增加 +35%"],
    [1.13, "攻擊BOSS怪物時傷害增加 +40%"],
    [21.04, "爆擊機率 +12%"],
    [1.13, "物理攻擊力 +32"],
    [1.13, "魔法攻擊力 +32"],
    [1.13, "STR +13%"],
    [1.13, "DEX +13%"],
    [1.13, "INT +13%"],
    [1.13, "LUK +13%"],
    [1.13, "全屬性 +10%"],
  ],
};

// 徽章
const combineSSR9 = {
  lv: 4,
  item: ["badge"],
  prob: [
    [3.45, "物理攻擊力 +13%"],
    [3.45, "魔法攻擊力 +13%"],
    [17.27, "總傷害 +13%"],
    [27.63, "無視怪物防禦率 +35%"],
    [17.27, "無視怪物防禦率 +40%"],
    [22.45, "爆擊機率 +12%"],
    [1.21, "物理攻擊力 +32"],
    [1.21, "魔法攻擊力 +32"],
    [1.21, "STR +13%"],
    [1.21, "DEX +13%"],
    [1.21, "INT +13%"],
    [1.21, "LUK +13%"],
    [1.21, "全屬性 +10%"],
  ],
};

export const combineProb = [
  combine1,
  combine2,
  combine3,
  combine4,
  combineN1,
  combineN2,
  combineN3,
  combineN4,
  combineN5,
  combineR1,
  combineR2,
  combineR3,
  combineR4,
  combineR5,
  combineR6,
  combineR7,
  combineSR1,
  combineSR2,
  combineSR3,
  combineSR4,
  combineSR5,
  combineSR6,
  combineSR7,
  combineSR8,
  combineSR9,
  combineSSR1,
  combineSSR2,
  combineSSR3,
  combineSSR4,
  combineSSR5,
  combineSSR6,
  combineSSR7,
  combineSSR8,
  combineSSR9,
];

export const chooseOne = function () {
  // 移除結合鎖定的class
  Array.from(document.querySelectorAll(".part-combine p")).map((el) =>
    el.classList.remove("chosen")
  );

  // 選擇洗哪排
  const chooseOne = renderProbResult([
    [1, "first"],
    [1, "second"],
    [1, "third"],
  ]);
  document.querySelector(".combine-first").textContent =
    document.querySelector(".main-first").textContent;

  document.querySelector(".combine-second").textContent =
    document.querySelector(".main-second").textContent;

  document.querySelector(".combine-third").textContent =
    document.querySelector(".main-third").textContent;

  document.querySelector(`.combine-${chooseOne}`).classList.add("chosen");
  document.querySelector(".counter-combine").textContent++;
};

// 點結合
export const renderCombineResult = function (arrProb) {
  // 暫時存放確認用的潛能
  const playPotArr = [];

  const itemSelect = document.querySelector("#item-select").value;
  const potSelect = Number(document.querySelector("#pot-select").value);
  // 同等潛能
  const [select] = arrProb.filter(
    (el) => el.item.find((item) => item === itemSelect) && el.lv === potSelect
  );
  // 低一階潛能
  const [selectLower] = arrProb.filter(
    (el) =>
      el.item.find((item) => item === itemSelect) && el.lv === potSelect - 1
  );

  let potLv = renderProbResult([
    [15, "same"],
    [85, "lower"],
  ]);
  if (potLv === "same") {
    document.querySelector(".chosen").textContent = renderProbResult(
      select.prob
    );
  } else if (potLv === "lower") {
    document.querySelector(".chosen").textContent = renderProbResult(
      selectLower.prob
    );
  }

  // 確認潛能
  playPotArr[0] = document.querySelector(".combine-first").textContent;
  playPotArr[1] = document.querySelector(".combine-second").textContent;
  playPotArr[2] = document.querySelector(".combine-third").textContent;

  const checkFixedIndex = function () {
    if (
      Array.from(document.querySelector(".chosen").classList).some((cl) =>
        cl.includes("first")
      )
    )
      return 0;
    if (
      Array.from(document.querySelector(".chosen").classList).some((cl) =>
        cl.includes("second")
      )
    )
      return 1;
    if (
      Array.from(document.querySelector(".chosen").classList).some((cl) =>
        cl.includes("third")
      )
    )
      return 2;
  };

  playPotArr[checkFixedIndex()] = document.querySelector(".chosen").textContent;
  if (!checkPot1(playPotArr) || !checkPot2(playPotArr)) {
    renderCombineResult(combineProb);
    return;
  }

  document.querySelector(".part-combine .pot-lv").textContent =
    potToText(potSelect);

  document.querySelector(".main-first").textContent = playPotArr[0];
  document.querySelector(".combine-first").textContent = playPotArr[0];

  document.querySelector(".main-second").textContent = playPotArr[1];
  document.querySelector(".combine-second").textContent = playPotArr[1];

  document.querySelector(".main-third").textContent = playPotArr[2];
  document.querySelector(".combine-third").textContent = playPotArr[2];

  document.querySelector(".chosen").classList.remove("chosen");
};
