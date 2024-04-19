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

const TextToPot = function (text) {
  if (text === "特殊") return 1;
  if (text === "稀有") return 2;
  if (text === "罕見") return 3;
  if (text === "傳說") return 4;
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
// 閃耀方塊
// 特殊等級
// 帽子,上衣,套服,下衣,手套,披風,腰帶,肩膀,機器心臟
const returnN1 = {
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
const returnN2 = {
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
const returnN3 = {
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
const returnN4 = {
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
const returnN5 = {
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
const returnR1 = {
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
const returnR2 = {
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
const returnR3 = {
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
const returnR4 = {
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
const returnR5 = {
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
const returnR6 = {
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
const returnR7 = {
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
const returnSR1 = {
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
const returnSR2 = {
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
const returnSR3 = {
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
const returnSR4 = {
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
const returnSR5 = {
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
const returnSR6 = {
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
const returnSR7 = {
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
const returnSR8 = {
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
const returnSR9 = {
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
const returnSSR1 = {
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
const returnSSR2 = {
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
const returnSSR3 = {
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
const returnSSR4 = {
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
const returnSSR5 = {
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
const returnSSR6 = {
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
const returnSSR7 = {
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
const returnSSR8 = {
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
const returnSSR9 = {
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

export const returnProb = [
  returnN1,
  returnN2,
  returnN3,
  returnN4,
  returnN5,
  returnR1,
  returnR2,
  returnR3,
  returnR4,
  returnR5,
  returnR6,
  returnR7,
  returnSR1,
  returnSR2,
  returnSR3,
  returnSR4,
  returnSR5,
  returnSR6,
  returnSR7,
  returnSR8,
  returnSR9,
  returnSSR1,
  returnSSR2,
  returnSSR3,
  returnSSR4,
  returnSSR5,
  returnSSR6,
  returnSSR7,
  returnSSR8,
  returnSSR9,
];

let potentialLV = [];
// 閃耀跳框機率
const returnLevelUp = function () {
  let potSelect = document.querySelector("#pot-select").value;

  if (Number(potSelect) === 1) {
    potentialLV[0] = potToText(
      renderProbResult([
        [0, 1],
        [97.7, 2],
        [2, 3],
        [0.3, 4],
      ])
    );
  } else if (Number(potSelect) === 2) {
    potentialLV[0] = potToText(
      renderProbResult([
        [91.4, 2],
        [8, 3],
        [0.6, 4],
      ])
    );
  } else if (Number(potSelect) === 3) {
    potentialLV[0] = potToText(
      renderProbResult([
        [97.9, 3],
        [2.1, 4],
      ])
    );
  } else if (Number(potSelect) === 4) {
    potentialLV[0] = potToText(renderProbResult([[100, 4]]));
  }
};

// 點閃耀
export const renderReturnResult = function (arrProb) {
  // 暫時存放確認用的潛能
  const playPotArr = [];
  // 先看有沒有跳框
  returnLevelUp();

  const itemSelect = document.querySelector("#item-select").value;
  const potSelect = TextToPot(potentialLV[0]);
  potentialLV.splice(0, potentialLV.length);
  // 同等潛能
  const [select] = arrProb.filter(
    (el) => el.item.find((item) => item === itemSelect) && el.lv === potSelect
  );
  // 低一階潛能
  const [selectLower] = arrProb.filter(
    (el) =>
      el.item.find((item) => item === itemSelect) && el.lv === potSelect - 1
  );
  // 沒鎖紅石的情況下

  if (
    document.querySelector(".play-return .part-after p").textContent === "" &&
    !Array.from(
      document.querySelector(".play-return .part-before p").parentNode.children
    ).some((el) => Array.from(el.classList).some((cl) => cl === "fixed-pot"))
  ) {
    if (potSelect === 1) {
      // 特殊
      playPotArr.push(renderProbResult(select.prob));
      playPotArr.push(renderProbResult(select.prob));
      playPotArr.push(renderProbResult(select.prob));
    }
    // 稀有
    if (potSelect === 2) {
      playPotArr.push(renderProbResult(select.prob));
      let secondPotLv = renderProbResult([
        [20, "same"],
        [80, "lower"],
      ]);
      if (secondPotLv === "same") {
        playPotArr.push(renderProbResult(select.prob));
      } else if (secondPotLv === "lower") {
        playPotArr.push(renderProbResult(selectLower.prob));
      }
      let thirdPotLv = renderProbResult([
        [15, "same"],
        [85, "lower"],
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
        [20, "same"],
        [80, "lower"],
      ]);
      if (secondPotLv === "same") {
        playPotArr.push(renderProbResult(select.prob));
      } else if (secondPotLv === "lower") {
        playPotArr.push(renderProbResult(selectLower.prob));
      }
      let thirdPotLv = renderProbResult([
        [10, "same"],
        [90, "lower"],
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
        [20, "same"],
        [80, "lower"],
      ]);
      if (secondPotLv === "same") {
        playPotArr.push(renderProbResult(select.prob));
      } else if (secondPotLv === "lower") {
        playPotArr.push(renderProbResult(selectLower.prob));
      }
      let thirdPotLv = renderProbResult([
        [5, "same"],
        [95, "lower"],
      ]);
      if (thirdPotLv === "same") {
        playPotArr.push(renderProbResult(select.prob));
      } else if (thirdPotLv === "lower") {
        playPotArr.push(renderProbResult(selectLower.prob));
      }
    }
    // 確認潛能
    if (!checkPot1(playPotArr) || !checkPot2(playPotArr)) {
      renderReturnResult(returnProb);
      return;
    }

    document.querySelector(".play-return .after-pot-lv").textContent =
      potToText(potSelect);
    document.querySelector(".play-return .after-first").textContent =
      playPotArr[0];
    document.querySelector(".play-return .after-second").textContent =
      playPotArr[1];
    document.querySelector(".play-return .after-third").textContent =
      playPotArr[2];

    // 計數器++
    document.querySelector(".counter-return").textContent++;
  } else if (
    // 鎖紅石的情況下
    document.querySelector(".play-return .part-after p").textContent === "" &&
    Array.from(
      document.querySelector(".play-return .part-before p").parentNode.children
    ).some((el) => Array.from(el.classList).some((cl) => cl === "fixed-pot"))
  ) {
    if (potSelect === 1) {
      // 特殊
      playPotArr.push(renderProbResult(select.prob));
      playPotArr.push(renderProbResult(select.prob));
      playPotArr.push(renderProbResult(select.prob));
    }
    // 稀有
    if (potSelect === 2) {
      playPotArr.push(renderProbResult(select.prob));
      let secondPotLv = renderProbResult([
        [20, "same"],
        [80, "lower"],
      ]);
      if (secondPotLv === "same") {
        playPotArr.push(renderProbResult(select.prob));
      } else if (secondPotLv === "lower") {
        playPotArr.push(renderProbResult(selectLower.prob));
      }
      let thirdPotLv = renderProbResult([
        [15, "same"],
        [85, "lower"],
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
        [20, "same"],
        [80, "lower"],
      ]);
      if (secondPotLv === "same") {
        playPotArr.push(renderProbResult(select.prob));
      } else if (secondPotLv === "lower") {
        playPotArr.push(renderProbResult(selectLower.prob));
      }
      let thirdPotLv = renderProbResult([
        [10, "same"],
        [90, "lower"],
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
        [20, "same"],
        [80, "lower"],
      ]);
      if (secondPotLv === "same") {
        playPotArr.push(renderProbResult(select.prob));
      } else if (secondPotLv === "lower") {
        playPotArr.push(renderProbResult(selectLower.prob));
      }
      let thirdPotLv = renderProbResult([
        [5, "same"],
        [95, "lower"],
      ]);
      if (thirdPotLv === "same") {
        playPotArr.push(renderProbResult(select.prob));
      } else if (thirdPotLv === "lower") {
        playPotArr.push(renderProbResult(selectLower.prob));
      }
    }
    // 確認潛能

    const checkFixedIndex = function () {
      if (
        Array.from(document.querySelector(".fixed-pot").classList).some((cl) =>
          cl.includes("first")
        )
      )
        return 0;
      if (
        Array.from(document.querySelector(".fixed-pot").classList).some((cl) =>
          cl.includes("second")
        )
      )
        return 1;
      if (
        Array.from(document.querySelector(".fixed-pot").classList).some((cl) =>
          cl.includes("third")
        )
      )
        return 2;
    };

    playPotArr[checkFixedIndex()] =
      document.querySelector(".fixed-pot").textContent;

    if (!checkPot1(playPotArr) || !checkPot2(playPotArr)) {
      renderReturnResult(returnProb);
      return;
    }
    document.querySelector(".play-return .after-pot-lv").textContent =
      potToText(potSelect);
    document.querySelector(".play-return .after-first").textContent =
      playPotArr[0];
    document.querySelector(".play-return .after-second").textContent =
      playPotArr[1];
    document.querySelector(".play-return .after-third").textContent =
      playPotArr[2];

    // 鎖紅石-
    document
      .querySelector(".fixed-pot")
      .parentElement.parentElement.querySelector(".play-return .part-after")
      .querySelector(
        `.${document
          .querySelector(".fixed-pot")
          .className.replace("before", "after")
          .split(" ")
          .splice(0, 1)
          .join("")}`
      ).textContent = document.querySelector(".fixed-pot").textContent;

    //計數器++
    document.querySelector(".counter-return").textContent++;
    document.querySelector(".counter-fixed").textContent++;
  }
};

export const selectAfter = function () {
  if (document.querySelector(".play-return .part-after p").textContent === "")
    return;
  const currentPot = [];

  document
    .querySelectorAll(".play-return .part-after p")
    .forEach((p) => currentPot.push(p.textContent));
  document.querySelector("#pot-select").value = TextToPot(
    document.querySelector(".play-return .after-pot-lv").textContent
  );
  document.querySelector(".play-return .before-pot-lv").textContent =
    document.querySelector(".play-return .after-pot-lv").textContent;

  document.querySelector(".play-return .before-first").textContent =
    currentPot[0];
  document.querySelector(".main-first").textContent = currentPot[0];

  document.querySelector(".play-return .before-second").textContent =
    currentPot[1];
  document.querySelector(".main-second").textContent = currentPot[1];

  document.querySelector(".play-return .before-third").textContent =
    currentPot[2];
  document.querySelector(".main-third").textContent = currentPot[2];

  document
    .querySelectorAll(".play-return .part-after p")
    .forEach((p) => (p.innerHTML = ""));
  document.querySelector(".play-return .after-pot-lv").textContent = "";
};

export const selectBefore = function () {
  if (document.querySelector(".play-return .part-before p").textContent === "")
    return;
  const currentPot = [];

  document
    .querySelectorAll(".play-return .part-before p")
    .forEach((p) => currentPot.push(p.innerHTML));

  document.querySelector("#pot-select").value = TextToPot(
    document.querySelector(".play-return .before-pot-lv").textContent
  );

  document.querySelector(".play-return .before-first").textContent =
    currentPot[0];
  document.querySelector(".main-first").textContent = currentPot[0];

  document.querySelector(".play-return .before-second").textContent =
    currentPot[1];
  document.querySelector(".main-second").textContent = currentPot[1];

  document.querySelector(".play-return .before-third").textContent =
    currentPot[2];
  document.querySelector(".main-third").textContent = currentPot[2];

  document
    .querySelectorAll(".play-return .part-after p")
    .forEach((p) => (p.innerHTML = ""));
  document.querySelector(".play-return .after-pot-lv").textContent = "";
};

export const fixedPot = function (ev) {
  // 沒鎖起來且不在選擇上或下的時候
  if (
    !Array.from(ev.target.parentNode.children).some((el) =>
      Array.from(el.classList).some((cl) => cl === "fixed-pot")
    ) &&
    document.querySelector(".play-return .part-after p").textContent === ""
  )
    ev.target.classList.add("fixed-pot");
  else if (
    Array.from(ev.target.parentNode.children).some((el) =>
      Array.from(el.classList).some((cl) => cl === "fixed-pot")
    ) &&
    document.querySelector(".play-return .part-after p").textContent === ""
  )
    ev.target.classList.remove("fixed-pot");
};
