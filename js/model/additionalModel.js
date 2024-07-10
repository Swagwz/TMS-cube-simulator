"use strict";
// 產生機率對應的結果
const renderProbResult = function (arrProb) {
  let factor = 0;
  const sum = arrProb.map((el) => el[0]).reduce((acc, cur) => acc + cur, 0);
  const random = Math.random() * sum;
  for (const el of arrProb) {
    factor = Number((factor + el[0]).toFixed(4));
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
    if (pot.includes("機率無視")) {
      count["ignore"] = (count["ignore"] || 0) + 1;
    }
    if (pot.includes("內無敵")) {
      count["invisibleTime"] = (count["invisibleTime"] || 0) + 1;
    }
  });
  if (count.ignore >= 3 || count.invisibleTime >= 3) return false;
  else return true;
};
/////////////////////////////////////////////////////////
// 附加方塊
// 特殊等級
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const additional1 = {
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
const additional2 = {
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
const additional3 = {
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
const additionalN1 = {
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
    [6.38, "STR +11"],
    [6.38, "DEX +11"],
    [6.38, "INT +11"],
    [6.38, "LUK +11"],
    [6.38, "最大HP +125"],
    [6.38, "最大MP +125"],
    [6.38, "移動速度 +6"],
    [6.38, "跳躍力 +6"],
    [4.26, "物理攻擊力 +11"],
    [4.26, "魔法攻擊力 +11"],
    [6.38, "防禦率 +125"],
    [4.26, "STR +3%"],
    [4.26, "DEX +3%"],
    [4.26, "INT +3%"],
    [4.26, "LUK +3%"],
    [4.26, "最大HP +3%"],
    [4.26, "最大MP +3%"],
    [4.26, "防禦率 +3%"],
    [4.26, "全屬性 +3"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const additionalN2 = {
  lv: 1,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [6.38, "STR +11"],
    [6.38, "DEX +11"],
    [6.38, "INT +11"],
    [6.38, "LUK +11"],
    [6.38, "最大HP +125"],
    [6.38, "最大MP +125"],
    [6.38, "移動速度 +6"],
    [6.38, "跳躍力 +6"],
    [4.26, "物理攻擊力 +11"],
    [4.26, "魔法攻擊力 +11"],
    [6.38, "防禦率 +125"],
    [4.26, "STR +3%"],
    [4.26, "DEX +3%"],
    [4.26, "INT +3%"],
    [4.26, "LUK +3%"],
    [4.26, "最大HP +3%"],
    [4.26, "最大MP +3%"],
    [4.26, "防禦率 +3%"],
    [4.26, "全屬性 +3"],
  ],
};

// 武器, 徽章, 輔助武器
const additionalN3 = {
  lv: 1,
  item: ["weapon", "second-weapon", "badge", "shield"],
  prob: [
    [5.88, "最大HP +125"],
    [5.88, "最大MP +125"],
    [5.88, "移動速度 +6"],
    [5.88, "跳躍力 +6"],
    [5.88, "防禦率 +125"],
    [5.88, "STR +13"],
    [5.88, "DEX +13"],
    [5.88, "INT +13"],
    [5.88, "LUK +13"],
    [3.92, "物理攻擊力 +13"],
    [3.92, "魔法攻擊力 +13"],
    [3.92, "最大HP +3%"],
    [3.92, "最大MP +3%"],
    [3.92, "STR +4%"],
    [3.92, "DEX +4%"],
    [3.92, "INT +4%"],
    [3.92, "LUK +4%"],
    [1.96, "物理攻擊力 +4%"],
    [1.96, "魔法攻擊力 +4%"],
    [3.92, "爆擊機率 +4%"],
    [1.96, "總傷害 +4%"],
    [5.88, "全屬性 +6"],
  ],
};

// 稀有等級
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const additionalR1 = {
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
    [6, "STR +15"],
    [6, "DEX +15"],
    [6, "INT +15"],
    [6, "LUK +15"],
    [6, "最大HP +185"],
    [6, "最大MP +185"],
    [6, "移動速度 +8"],
    [6, "跳躍力 +8"],
    [4, "物理攻擊力 +12"],
    [4, "魔法攻擊力 +12"],
    [6, "防禦率 +150"],
    [4, "STR +5%"],
    [4, "DEX +5%"],
    [4, "INT +5%"],
    [4, "LUK +5%"],
    [6, "最大HP +6%"],
    [6, "最大MP +6%"],
    [6, "防禦率 +5%"],
    [4, "全屬性 +3%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const additionalR2 = {
  lv: 2,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [6, "STR +15"],
    [6, "DEX +15"],
    [6, "INT +15"],
    [6, "LUK +15"],
    [6, "最大HP +185"],
    [6, "最大MP +185"],
    [6, "移動速度 +8"],
    [6, "跳躍力 +8"],
    [4, "物理攻擊力 +12"],
    [4, "魔法攻擊力 +12"],
    [6, "防禦率 +150"],
    [4, "STR +5%"],
    [4, "DEX +5%"],
    [4, "INT +5%"],
    [4, "LUK +5%"],
    [6, "最大HP +6%"],
    [6, "最大MP +6%"],
    [6, "防禦率 +5%"],
    [4, "全屬性 +3%"],
  ],
};

// 武器,輔助武器,徽章
const additionalR3 = {
  lv: 2,
  item: ["weapon", "second-weapon", "badge", "shield"],
  prob: [
    [8.82, "最大HP +6%"],
    [8.82, "最大MP +6%"],
    [5.88, "物理攻擊力 +7%"],
    [5.88, "魔法攻擊力 +7%"],
    [2.94, "爆擊機率 +7%"],
    [8.82, "STR +7%"],
    [8.82, "DEX +7%"],
    [8.82, "INT +7%"],
    [8.82, "LUK +7%"],
    [2.94, "總傷害 +7%"],
    [5.88, "全屬性 +4%"],
    [8.82, "攻擊時有 3% 機率恢復 54 HP"],
    [8.82, "攻擊時有 3% 機率恢復 54 MP"],
    [5.88, "無視怪物防禦率 +3%"],
  ],
};

// 罕見等級
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const additionalSR1 = {
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
    [6.12, "STR +17"],
    [6.12, "DEX +17"],
    [6.12, "INT +17"],
    [6.12, "LUK +17"],
    [6.12, "最大HP +250"],
    [6.12, "最大MP +250"],
    [4.08, "物理攻擊力 +13"],
    [4.08, "魔法攻擊力 +13"],
    [4.08, "STR +6%"],
    [4.08, "DEX +6%"],
    [4.08, "INT +6%"],
    [4.08, "LUK +6%"],
    [6.12, "最大HP +8%"],
    [6.12, "最大MP +8%"],
    [4.08, "全屬性 +5%"],
    [6.12, "HP恢復道具及恢復技能效果增加 +20%"],
    [4.08, "以角色等級為準每9級STR +1"],
    [4.08, "以角色等級為準每9級DEX +1"],
    [4.08, "以角色等級為準每9級INT +1"],
    [4.08, "以角色等級為準每9級LUK +1"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const additionalSR2 = {
  lv: 3,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [6.12, "STR +17"],
    [6.12, "DEX +17"],
    [6.12, "INT +17"],
    [6.12, "LUK +17"],
    [6.12, "最大HP +250"],
    [6.12, "最大MP +250"],
    [4.08, "物理攻擊力 +13"],
    [4.08, "魔法攻擊力 +13"],
    [4.08, "STR +6%"],
    [4.08, "DEX +6%"],
    [4.08, "INT +6%"],
    [4.08, "LUK +6%"],
    [6.12, "最大HP +8%"],
    [6.12, "最大MP +8%"],
    [4.08, "全屬性 +5%"],
    [6.12, "HP恢復道具及恢復技能效果增加 +20%"],
    [4.08, "以角色等級為準每9級STR +1"],
    [4.08, "以角色等級為準每9級DEX +1"],
    [4.08, "以角色等級為準每9級INT +1"],
    [4.08, "以角色等級為準每9級LUK +1"],
  ],
};

// 武器, 輔助武器(包含力量之盾, 靈魂盾牌)
const additionalSR3 = {
  lv: 3,
  item: ["weapon", "second-weapon", "shield"],
  prob: [
    [6.98, "最大HP +8%"],
    [6.98, "最大MP +8%"],
    [4.65, "物理攻擊力 +10%"],
    [4.65, "魔法攻擊力 +10%"],
    [4.65, "爆擊機率 +10%"],
    [6.98, "STR +10%"],
    [6.98, "DEX +10%"],
    [6.98, "INT +10%"],
    [6.98, "LUK +10%"],
    [2.33, "總傷害 +10%"],
    [4.65, "全屬性 +7%"],
    [2.33, "無視怪物防禦率 +4%"],
    [2.33, "攻擊BOSS怪物時傷害增加 +12%"],
    [6.98, "攻擊時有 15% 機率恢復 97 HP"],
    [6.98, "攻擊時有 15% 機率恢復 97 MP"],
    [4.65, "以角色等級為準每9級STR +1"],
    [4.65, "以角色等級為準每9級DEX +1"],
    [4.65, "以角色等級為準每9級INT +1"],
    [4.65, "以角色等級為準每9級LUK +1"],
  ],
};

// 徽章
const additionalSR4 = {
  lv: 3,
  item: ["badge"],
  prob: [
    [7.14, "最大HP +8%"],
    [7.14, "最大MP +8%"],
    [4.76, "物理攻擊力 +10%"],
    [4.76, "魔法攻擊力 +10%"],
    [4.76, "爆擊機率 +10%"],
    [7.14, "STR +10%"],
    [7.14, "DEX +10%"],
    [7.14, "INT +10%"],
    [7.14, "LUK +10%"],
    [2.38, "總傷害 +10%"],
    [4.76, "全屬性 +7%"],
    [2.38, "無視怪物防禦率 +4%"],
    [7.14, "攻擊時有 15% 機率恢復 97 HP"],
    [7.14, "攻擊時有 15% 機率恢復 97 MP"],
    [4.76, "以角色等級為準每9級STR +1"],
    [4.76, "以角色等級為準每9級DEX +1"],
    [4.76, "以角色等級為準每9級INT +1"],
    [4.76, "以角色等級為準每9級LUK +1"],
  ],
};

// 傳說等級
// 帽子
const additionalSSR1 = {
  lv: 4,
  item: ["hat"],
  prob: [
    [5, "STR +19"],
    [5, "DEX +19"],
    [5, "INT +19"],
    [5, "LUK +19"],
    [5, "最大HP +310"],
    [5, "最大MP +310"],
    [3.33, "物理攻擊力 +15"],
    [3.33, "魔法攻擊力 +15"],
    [3.33, "STR +8%"],
    [3.33, "DEX +8%"],
    [3.33, "INT +8%"],
    [3.33, "LUK +8%"],
    [5, "最大HP +11%"],
    [5, "最大MP +11%"],
    [3.33, "爆擊傷害 +1%"],
    [3.33, "全屬性 +6%"],
    [3.33, "以角色等級為準每9級STR +2"],
    [3.33, "以角色等級為準每9級DEX +2"],
    [3.33, "以角色等級為準每9級INT +2"],
    [3.33, "以角色等級為準每9級LUK +2"],
    [5, "HP恢復道具及恢復技能效果增加 +30%"],
    [5, "減少所有技能冷卻時間 -1 秒"],
    [5, "楓幣獲得量 +5%"],
    [5, "道具掉落率 +5%"],
  ],
};

// 手套
const additionalSSR2 = {
  lv: 4,
  item: ["gloves"],
  prob: [
    [5.08, "STR +19"],
    [5.08, "DEX +19"],
    [5.08, "INT +19"],
    [5.08, "LUK +19"],
    [5.08, "最大HP +310"],
    [5.08, "最大MP +310"],
    [3.39, "物理攻擊力 +15"],
    [3.39, "魔法攻擊力 +15"],
    [3.39, "STR +8%"],
    [3.39, "DEX +8%"],
    [3.39, "INT +8%"],
    [3.39, "LUK +8%"],
    [5.08, "最大HP +11%"],
    [5.08, "最大MP +11%"],
    [3.39, "爆擊傷害 +3%"],
    [3.39, "爆擊傷害 +1%"],
    [3.39, "全屬性 +6%"],
    [3.39, "以角色等級為準每9級STR +2"],
    [3.39, "以角色等級為準每9級DEX +2"],
    [3.39, "以角色等級為準每9級INT +2"],
    [3.39, "以角色等級為準每9級LUK +2"],
    [5.08, "HP恢復道具及恢復技能效果增加 +30%"],
    [5.08, "楓幣獲得量 +5%"],
    [5.08, "道具掉落率 +5%"],
  ],
};

// 上衣, 下衣, 套服, 披風, 腰帶, 鞋子, 肩膀裝飾, 機器心臟
const additionalSSR3 = {
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
    [5.26, "STR +19"],
    [5.26, "DEX +19"],
    [5.26, "INT +19"],
    [5.26, "LUK +19"],
    [5.26, "最大HP +310"],
    [5.26, "最大MP +310"],
    [3.51, "物理攻擊力 +15"],
    [3.51, "魔法攻擊力 +15"],
    [3.51, "STR +8%"],
    [3.51, "DEX +8%"],
    [3.51, "INT +8%"],
    [3.51, "LUK +8%"],
    [5.26, "最大HP +11%"],
    [5.26, "最大MP +11%"],
    [3.51, "爆擊傷害 +1%"],
    [3.51, "全屬性 +6%"],
    [3.51, "以角色等級為準每9級STR +2"],
    [3.51, "以角色等級為準每9級DEX +2"],
    [3.51, "以角色等級為準每9級INT +2"],
    [3.51, "以角色等級為準每9級LUK +2"],
    [5.26, "HP恢復道具及恢復技能效果增加 +30%"],
    [5.26, "楓幣獲得量 +5%"],
    [5.26, "道具掉落率 +5%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const additionalSSR4 = {
  lv: 4,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [5.17, "STR +19"],
    [5.17, "DEX +19"],
    [5.17, "INT +19"],
    [5.17, "LUK +19"],
    [5.17, "最大HP +310"],
    [5.17, "最大MP +310"],
    [3.45, "物理攻擊力 +15"],
    [3.45, "魔法攻擊力 +15"],
    [3.45, "STR +8%"],
    [3.45, "DEX +8%"],
    [3.45, "INT +8%"],
    [3.45, "LUK +8%"],
    [5.17, "最大HP +11%"],
    [5.17, "最大MP +11%"],
    [3.45, "全屬性 +6%"],
    [3.45, "以角色等級為準每9級STR +2"],
    [3.45, "以角色等級為準每9級DEX +2"],
    [3.45, "以角色等級為準每9級INT +2"],
    [3.45, "以角色等級為準每9級LUK +2"],
    [5.17, "所有技能的MP消耗 -10%"],
    [5.17, "HP恢復道具及恢復技能效果增加 +30%"],
    [5.17, "楓幣獲得量 +5%"],
    [5.17, "道具掉落率 +5%"],
  ],
};

// 武器
const additionalSSR5 = {
  lv: 4,
  item: ["weapon"],
  prob: [
    [7.69, "最大HP +11%"],
    [7.69, "最大MP +11%"],
    [5.13, "物理攻擊力 +13%"],
    [5.13, "魔法攻擊力 +13%"],
    [5.13, "爆擊機率 +13%"],
    [7.69, "STR +13%"],
    [7.69, "DEX +13%"],
    [7.69, "INT +13%"],
    [7.69, "LUK +13%"],
    [2.56, "總傷害 +13%"],
    [5.13, "全屬性 +10%"],
    [2.56, "無視怪物防禦率 +5%"],
    [2.56, "攻擊BOSS怪物時傷害增加 +18%"],
    [5.13, "以角色等級為準每9級STR +2"],
    [5.13, "以角色等級為準每9級DEX +2"],
    [5.13, "以角色等級為準每9級INT +2"],
    [5.13, "以角色等級為準每9級LUK +2"],
    [2.56, "物理攻擊力 +32"],
    [2.56, "魔法攻擊力 +32"],
  ],
};

// 輔助武器(包含力量之盾, 靈魂盾牌)
const additionalSSR6 = {
  lv: 4,
  item: [, "second-weapon", "shield"],
  prob: [
    [7.32, "最大HP +11%"],
    [7.32, "最大MP +11%"],
    [4.88, "物理攻擊力 +13%"],
    [4.88, "魔法攻擊力 +13%"],
    [4.88, "爆擊機率 +13%"],
    [4.88, "爆擊傷害 +1%"],
    [7.32, "STR +13%"],
    [7.32, "DEX +13%"],
    [7.32, "INT +13%"],
    [7.32, "LUK +13%"],
    [2.44, "總傷害 +13%"],
    [4.88, "全屬性 +10%"],
    [2.44, "無視怪物防禦率 +5%"],
    [2.44, "攻擊BOSS怪物時傷害增加 +18%"],
    [4.88, "以角色等級為準每9級STR +2"],
    [4.88, "以角色等級為準每9級DEX +2"],
    [4.88, "以角色等級為準每9級INT +2"],
    [4.88, "以角色等級為準每9級LUK +2"],
    [2.44, "物理攻擊力 +32"],
    [2.44, "魔法攻擊力 +32"],
  ],
};

// 徽章
const additionalSSR7 = {
  lv: 4,
  item: ["badge"],
  prob: [
    [7.89, "最大HP +11%"],
    [7.89, "最大MP +11%"],
    [5.26, "物理攻擊力 +13%"],
    [5.26, "魔法攻擊力 +13%"],
    [5.26, "爆擊機率 +13%"],
    [7.89, "STR +13%"],
    [7.89, "DEX +13%"],
    [7.89, "INT +13%"],
    [7.89, "LUK +13%"],
    [2.63, "總傷害 +13%"],
    [5.26, "全屬性 +10%"],
    [2.63, "無視怪物防禦率 +5%"],
    [5.26, "以角色等級為準每9級STR +2"],
    [5.26, "以角色等級為準每9級DEX +2"],
    [5.26, "以角色等級為準每9級INT +2"],
    [5.26, "以角色等級為準每9級LUK +2"],
    [2.63, "物理攻擊力 +32"],
    [2.63, "魔法攻擊力 +32"],
  ],
};

export const additionalProb = [
  additional1,
  additional2,
  additional3,
  additionalN1,
  additionalN2,
  additionalN3,
  additionalR1,
  additionalR2,
  additionalR3,
  additionalSR1,
  additionalSR2,
  additionalSR3,
  additionalSR4,
  additionalSSR1,
  additionalSSR2,
  additionalSSR3,
  additionalSSR4,
  additionalSSR5,
  additionalSSR6,
  additionalSSR7,
];

// 附加跳框機率
const additionalLevelUp = function () {
  let secpotSelect = document.querySelector("#sec-pot-select").value;

  if (Number(secpotSelect) === 1) {
    document.querySelector("#sec-pot-select").value = renderProbResult([
      [95.24, 1],
      [4.76, 2],
    ]);
  } else if (Number(secpotSelect) === 2) {
    document.querySelector("#sec-pot-select").value = renderProbResult([
      [98.04, 2],
      [1.96, 3],
    ]);
  } else if (Number(secpotSelect) === 3) {
    document.querySelector("#sec-pot-select").value = renderProbResult([
      [99.5, 3],
      [0.5, 4],
    ]);
  }
};

const doubleLevelUp = function () {
  let secpotSelect = document.querySelector("#sec-pot-select").value;

  if (Number(secpotSelect) === 1) {
    document.querySelector("#sec-pot-select").value = renderProbResult([
      [90.48, 1],
      [9.52, 2],
    ]);
  } else if (Number(secpotSelect) === 2) {
    document.querySelector("#sec-pot-select").value = renderProbResult([
      [96.08, 2],
      [3.92, 3],
    ]);
  } else if (Number(secpotSelect) === 3) {
    document.querySelector("#sec-pot-select").value = renderProbResult([
      [99, 3],
      [1, 4],
    ]);
  }
};

// 點附加
export const renderadditionalResult = function (arrProb) {
  // 暫時存放確認用的潛能
  const playPotArr = [];
  // 先看有沒有跳框
  if (document.getElementById("double").checked) {
    doubleLevelUp();
  } else {
    additionalLevelUp();
  }

  const itemSelect = document.querySelector("#item-select").value;
  const potSelect = Number(document.querySelector("#sec-pot-select").value);
  // 同等潛能
  const [select] = arrProb.filter(
    (el) => el.item.find((item) => item === itemSelect) && el.lv === potSelect
  );
  // 低一階潛能
  const [selectLower] = arrProb.filter(
    (el) =>
      el.item.find((item) => item === itemSelect) && el.lv === potSelect - 1
  );
  // 特殊
  if (potSelect === 1) {
    playPotArr.push(renderProbResult(select.prob));
    let secondPotLv = renderProbResult([
      [1.96, "same"],
      [98.04, "lower"],
    ]);
    if (secondPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (secondPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
    let thirdPotLv = renderProbResult([
      [1.96, "same"],
      [98.04, "lower"],
    ]);
    if (thirdPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (thirdPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
  }
  // 稀有
  if (potSelect === 2) {
    playPotArr.push(renderProbResult(select.prob));
    let secondPotLv = renderProbResult([
      [4.76, "same"],
      [95.24, "lower"],
    ]);
    if (secondPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (secondPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
    let thirdPotLv = renderProbResult([
      [4.76, "same"],
      [95.24, "lower"],
    ]);
    if (thirdPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (thirdPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
  }
  // 罕見
  if (potSelect === 3) {
    playPotArr.push(renderProbResult(select.prob));
    let secondPotLv = renderProbResult([
      [1.96, "same"],
      [98.04, "lower"],
    ]);
    if (secondPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (secondPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
    let thirdPotLv = renderProbResult([
      [1.96, "same"],
      [98.04, "lower"],
    ]);
    if (thirdPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (thirdPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
  }
  // 傳說
  if (potSelect === 4) {
    playPotArr.push(renderProbResult(select.prob));
    let secondPotLv = renderProbResult([
      [0.5, "same"],
      [99.5, "lower"],
    ]);
    if (secondPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (secondPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
    let thirdPotLv = renderProbResult([
      [0.5, "same"],
      [99.5, "lower"],
    ]);
    if (thirdPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (thirdPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
  }
  // 確認潛能 2024/6/26不再限定潛能
  if (!checkPot1(playPotArr) || !checkPot2(playPotArr)) {
    renderadditionalResult(additionalProb);
    return;
  }

  document.querySelector(".part-addit .pot-lv").textContent =
    potToText(potSelect);

  document.querySelector(".addit-first").textContent = playPotArr[0];
  document.querySelector(".additional-first").textContent = playPotArr[0];

  document.querySelector(".addit-second").textContent = playPotArr[1];
  document.querySelector(".additional-second").textContent = playPotArr[1];

  document.querySelector(".addit-third").textContent = playPotArr[2];
  document.querySelector(".additional-third").textContent = playPotArr[2];

  document.querySelector(".counter-additional").textContent++;
};
