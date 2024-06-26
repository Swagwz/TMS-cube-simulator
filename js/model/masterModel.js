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
// 名匠方塊
// 帽子,上衣,套服,下衣,手套,披風,腰帶,肩膀,機器心臟
const master1 = {
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
const master2 = {
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
const master3 = {
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
const master4 = {
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
const masterN1 = {
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
const masterN2 = {
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
const masterN3 = {
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
    [4.76, "全屬性 +5"],
    [7.14, "每4秒恢復24HP"],
    [7.14, "每4秒恢復24MP"],
  ],
};

// 武器, 徽章, 輔助武器(力量之盾, 靈魂盾牌除外)
const masterN4 = {
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
const masterN5 = {
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
const masterR1 = {
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
const masterR2 = {
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
const masterR3 = {
  lv: 2,
  item: ["gloves"],
  prob: [
    [9.09, "擊殺怪物有 15% 機率恢復 95 HP"],
    [9.09, "擊殺怪物有 15% 機率恢復 95 MP"],
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
const masterR4 = {
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
const masterR5 = {
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
const masterR6 = {
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
const masterR7 = {
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
const masterSR1 = {
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
const masterSR2 = {
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
const masterSR3 = {
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
const masterSR4 = {
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
const masterSR5 = {
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
const masterSR6 = {
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
const masterSR7 = {
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
const masterSR8 = {
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
const masterSR9 = {
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
const masterSR10 = {
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

// 傳說等級
// 帽子
const masterSSR1 = {
  lv: 4,
  item: ["hat"],
  prob: [
    [9.09, "減少所有技能冷卻時間 -1 秒"],
    [6.06, "減少所有技能冷卻時間 -2 秒"],
    [9.09, "可以使用<實用的進階祝福>技能"],
    [6.06, "STR +13%"],
    [6.06, "DEX +13%"],
    [6.06, "INT +13%"],
    [6.06, "LUK +13%"],
    [9.09, "最大HP +13%"],
    [9.09, "最大MP +13%"],
    [6.06, "全屬性 +10%"],
    [9.09, "被擊中時有 10% 機率無視 20% 傷害"],
    [9.09, "被擊中時有 10% 機率無視 40% 傷害"],
    [9.09, "HP恢復道具及恢復技能效果增加 +40%"],
  ],
};

// 上衣,套服
const masterSSR2 = {
  lv: 4,
  item: ["top", "suit"],
  prob: [
    [9.68, "被擊中後無敵時間增加 +3 秒"],
    [9.68, "被擊中時有 4% 機率在 7 秒內無敵"],
    [6.45, "STR +13%"],
    [6.45, "DEX +13%"],
    [6.45, "INT +13%"],
    [6.45, "LUK +13%"],
    [9.68, "最大HP +13%"],
    [9.68, "最大MP +13%"],
    [6.45, "全屬性 +10%"],
    [9.68, "被擊中時有 10% 機率無視 20% 傷害"],
    [9.68, "被擊中時有 10% 機率無視 40% 傷害"],
    [9.68, "HP恢復道具及恢復技能效果增加 +40%"],
  ],
};

// 下衣
const masterSSR3 = {
  lv: 4,
  item: ["bottom"],
  prob: [
    [6.45, "STR +13%"],
    [6.45, "DEX +13%"],
    [6.45, "INT +13%"],
    [6.45, "LUK +13%"],
    [9.68, "最大HP +13%"],
    [9.68, "最大MP +13%"],
    [6.45, "全屬性 +10%"],
    [9.68, "被擊中時有 10% 機率無視 20% 傷害"],
    [9.68, "被擊中時有 10% 機率無視 40% 傷害"],
    [9.68, "有 30% 機率反射 50% 所受的傷害"],
    [9.68, "有 30% 機率反射 70% 所受的傷害"],
    [9.68, "HP恢復道具及恢復技能效果增加 +40%"],
  ],
};

// 手套
const masterSSR4 = {
  lv: 4,
  item: ["gloves"],
  prob: [
    [9.76, "爆擊傷害 +8%"],
    [7.32, "可以使用<實用的最終極速>技能"],
    [4.48, "STR +13%"],
    [4.48, "DEX +13%"],
    [4.48, "INT +13%"],
    [4.48, "LUK +13%"],
    [7.32, "最大HP +13%"],
    [7.32, "最大MP +13%"],
    [4.48, "全屬性 +10%"],
    [7.32, "被擊中時有 10% 機率無視 20% 傷害"],
    [7.32, "被擊中時有 10% 機率無視 40% 傷害"],
    [7.32, "HP恢復道具及恢復技能效果增加 +40%"],
    [7.32, "攻擊時有 3% 機率發動自動竊取"],
    [7.32, "攻擊時有 5% 機率發動自動竊取"],
    [7.32, "攻擊時有 7% 機率發動自動竊取"],
  ],
};

// 鞋子
const masterSSR5 = {
  lv: 4,
  item: ["shoes"],
  prob: [
    [10.71, "可以使用<實用的戰鬥命令>技能"],
    [7.14, "STR +13%"],
    [7.14, "DEX +13%"],
    [7.14, "INT +13%"],
    [7.14, "LUK +13%"],
    [10.71, "最大HP +13%"],
    [10.71, "最大MP +13%"],
    [7.14, "全屬性 +10%"],
    [10.71, "被擊中時有 10% 機率無視 20% 傷害"],
    [10.71, "被擊中時有 10% 機率無視 40% 傷害"],
    [10.71, "HP恢復道具及恢復技能效果增加 +40%"],
  ],
};

// 披風,腰帶,肩膀,機器心臟
const masterSSR6 = {
  lv: 4,
  item: ["cloak", "belt", "shoulder", "heart"],
  prob: [
    [8, "STR +13%"],
    [8, "DEX +13%"],
    [8, "INT +13%"],
    [8, "LUK +13%"],
    [12, "最大HP +13%"],
    [12, "最大MP +13%"],
    [8, "全屬性 +10%"],
    [12, "被擊中時有 10% 機率無視 20% 傷害"],
    [12, "被擊中時有 10% 機率無視 40% 傷害"],
    [12, "HP恢復道具及恢復技能效果增加 +40%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const masterSSR7 = {
  lv: 4,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [6.45, "STR +13%"],
    [6.45, "DEX +13%"],
    [6.45, "INT +13%"],
    [6.45, "LUK +13%"],
    [9.68, "最大HP +13%"],
    [9.68, "最大MP +13%"],
    [6.45, "全屬性 +10%"],
    [9.68, "所有技能的MP消耗 -15%"],
    [9.68, "所有技能的MP消耗 -30%"],
    [9.68, "HP恢復道具及恢復技能效果增加 +40%"],
    [9.68, "楓幣獲得量 +20%"],
    [9.68, "道具掉落率 +20%"],
  ],
};

// 武器
const masterSSR8 = {
  lv: 4,
  item: ["weapon"],
  prob: [
    [5.56, "物理攻擊力 +13%"],
    [5.56, "魔法攻擊力 +13%"],
    [5.56, "爆擊機率 +12%"],
    [5.56, "總傷害 +13%"],
    [5.56, "無視怪物防禦率 +35%"],
    [2.78, "無視怪物防禦率 +40%"],
    [11.11, "攻擊BOSS怪物時傷害增加 +35%"],
    [2.78, "攻擊BOSS怪物時傷害增加 +40%"],
    [11.11, "STR +13%"],
    [11.11, "DEX +13%"],
    [11.11, "INT +13%"],
    [11.11, "LUK +13%"],
    [11.11, "全屬性 +10%"],
  ],
};

// 輔助武器(包含力量之盾, 靈魂盾牌)
const masterSSR9 = {
  lv: 4,
  item: ["second-weapon", "shield"],
  prob: [
    [8.33, "STR +13%"],
    [8.33, "DEX +13%"],
    [8.33, "INT +13%"],
    [8.33, "LUK +13%"],
    [4.17, "物理攻擊力 +13%"],
    [4.17, "魔法攻擊力 +13%"],
    [4.17, "爆擊機率 +12%"],
    [4.17, "總傷害 +13%"],
    [8.33, "全屬性 +10%"],
    [4.17, "無視怪物防禦率 +35%"],
    [2.08, "無視怪物防禦率 +40%"],
    [12.5, "被擊中時有 10% 機率無視 20% 傷害"],
    [12.5, "被擊中時有 10% 機率無視 40% 傷害"],
    [8.33, "攻擊BOSS怪物時傷害增加 +35%"],
    [2.08, "攻擊BOSS怪物時傷害增加 +40%"],
  ],
};

// 徽章
const masterSSR10 = {
  lv: 4,
  item: ["badge"],
  prob: [
    [6.45, "物理攻擊力 +13%"],
    [6.45, "魔法攻擊力 +13%"],
    [6.45, "總傷害 +13%"],
    [6.45, "無視怪物防禦率 +35%"],
    [3.23, "無視怪物防禦率 +40%"],
    [6.45, "爆擊機率 +12%"],
    [12.9, "STR +13%"],
    [12.9, "DEX +13%"],
    [12.9, "INT +13%"],
    [12.9, "LUK +13%"],
    [12.9, "全屬性 +10%"],
  ],
};

export const masterProb = [
  master1,
  master2,
  master3,
  master4,
  masterN1,
  masterN2,
  masterN3,
  masterN4,
  masterN5,
  masterR1,
  masterR2,
  masterR3,
  masterR4,
  masterR5,
  masterR6,
  masterR7,
  masterSR1,
  masterSR2,
  masterSR3,
  masterSR4,
  masterSR5,
  masterSR6,
  masterSR7,
  masterSR8,
  masterSR9,
  masterSR10,
  masterSSR1,
  masterSSR2,
  masterSSR3,
  masterSSR4,
  masterSSR5,
  masterSSR6,
  masterSSR7,
  masterSSR8,
  masterSSR9,
  masterSSR10,
];

// 名匠跳框機率
const masterLevelUp = function () {
  let potSelect = document.querySelector("#pot-select").value;

  if (Number(potSelect) === 1) {
    document.querySelector("#pot-select").value = renderProbResult([
      [92, 1],
      [8, 2],
    ]);
  } else if (Number(potSelect) === 2) {
    document.querySelector("#pot-select").value = renderProbResult([
      [98.3, 2],
      [1.7, 3],
    ]);
  } else if (Number(potSelect) === 3) {
    document.querySelector("#pot-select").value = renderProbResult([
      [99.8, 3],
      [0.2, 4],
    ]);
  }
};

const doubleLevelUp = function () {
  let potSelect = document.querySelector("#pot-select").value;

  if (Number(potSelect) === 1) {
    document.querySelector("#pot-select").value = renderProbResult([
      [84, 1],
      [16, 2],
    ]);
  } else if (Number(potSelect) === 2) {
    document.querySelector("#pot-select").value = renderProbResult([
      [96.6, 2],
      [3.4, 3],
    ]);
  } else if (Number(potSelect) === 3) {
    document.querySelector("#pot-select").value = renderProbResult([
      [99.6, 3],
      [0.4, 4],
    ]);
  }
};

// 點名匠
export const renderMasterResult = function (arrProb) {
  // 暫時存放確認用的潛能
  const playPotArr = [];
  // 先看有沒有跳框
  if (document.getElementById("double").checked) {
    doubleLevelUp();
  } else {
    masterLevelUp();
  }

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
  // 特殊
  if (potSelect === 1) {
    playPotArr.push(renderProbResult(select.prob));
    let secondPotLv = renderProbResult([
      [16.67, "same"],
      [83.33, "lower"],
    ]);
    if (secondPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (secondPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
    let thirdPotLv = renderProbResult([
      [16.67, "same"],
      [83.33, "lower"],
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
      [8, "same"],
      [92, "lower"],
    ]);
    if (secondPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (secondPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
    let thirdPotLv = renderProbResult([
      [8, "same"],
      [92, "lower"],
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
      [1.7, "same"],
      [98.3, "lower"],
    ]);
    if (secondPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (secondPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
    let thirdPotLv = renderProbResult([
      [1.7, "same"],
      [98.3, "lower"],
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
      [0.2, "same"],
      [99.8, "lower"],
    ]);
    if (secondPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (secondPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
    let thirdPotLv = renderProbResult([
      [0.2, "same"],
      [99.8, "lower"],
    ]);
    if (thirdPotLv === "same") {
      playPotArr.push(renderProbResult(select.prob));
    } else if (thirdPotLv === "lower") {
      playPotArr.push(renderProbResult(selectLower.prob));
    }
  }

  // 確認潛能 2024/6/26不再限定潛能

  if (!checkPot1(playPotArr) || !checkPot2(playPotArr)) {
    renderMasterResult(masterProb);
    return;
  }

  document.querySelector(".part-master .pot-lv").textContent =
    potToText(potSelect);

  document.querySelector(".master-first").textContent = playPotArr[0];
  document.querySelector(".main-first").textContent = playPotArr[0];

  document.querySelector(".master-second").textContent = playPotArr[1];
  document.querySelector(".main-second").textContent = playPotArr[1];

  document.querySelector(".master-third").textContent = playPotArr[2];
  document.querySelector(".main-third").textContent = playPotArr[2];

  document.querySelector(".counter-master").textContent++;
};
