"use strict";

import { findProbability, $doc } from "./helper.js";

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// 附加潛能
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const additSetting1 = {
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
    ["STR +6"],
    ["DEX +6"],
    ["INT +6"],
    ["LUK +6"],
    ["最大HP +60"],
    ["最大MP +60"],
    ["移動速度 +4"],
    ["跳躍力 +4"],
    ["物理攻擊力 +3"],
    ["魔法攻擊力 +3"],
    ["防禦率 +60"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const additSetting2 = {
  lv: 0,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    ["STR +6"],
    ["DEX +6"],
    ["INT +6"],
    ["LUK +6"],
    ["最大HP +60"],
    ["最大MP +60"],
    ["移動速度 +4"],
    ["跳躍力 +4"],
    ["物理攻擊力 +3"],
    ["魔法攻擊力 +3"],
    ["防禦率 +60"],
  ],
};

// 武器, 徽章, 輔助武器
const additSetting3 = {
  lv: 0,
  item: ["weapon", "second-weapon", "badge", "shield"],
  prob: [
    ["STR +6"],
    ["DEX +6"],
    ["INT +6"],
    ["LUK +6"],
    ["最大HP +60"],
    ["最大MP +60"],
    ["移動速度 +4"],
    ["跳躍力 +4"],
    ["物理攻擊力 +6"],
    ["魔法攻擊力 +6"],
    ["防禦率 +60"],
  ],
};

// 特殊等級
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const additSettingN1 = {
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
    ["STR +11"],
    ["DEX +11"],
    ["INT +11"],
    ["LUK +11"],
    ["最大HP +125"],
    ["最大MP +125"],
    ["移動速度 +6"],
    ["跳躍力 +6"],
    ["物理攻擊力 +11"],
    ["魔法攻擊力 +11"],
    ["防禦率 +125"],
    ["STR +3%"],
    ["DEX +3%"],
    ["INT +3%"],
    ["LUK +3%"],
    ["最大HP +3%"],
    ["最大MP +3%"],
    ["防禦率 +3%"],
    ["全屬性 +3"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const additSettingN2 = {
  lv: 1,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    ["STR +11"],
    ["DEX +11"],
    ["INT +11"],
    ["LUK +11"],
    ["最大HP +125"],
    ["最大MP +125"],
    ["移動速度 +6"],
    ["跳躍力 +6"],
    ["物理攻擊力 +11"],
    ["魔法攻擊力 +11"],
    ["防禦率 +125"],
    ["STR +3%"],
    ["DEX +3%"],
    ["INT +3%"],
    ["LUK +3%"],
    ["最大HP +3%"],
    ["最大MP +3%"],
    ["防禦率 +3%"],
    ["全屬性 +3"],
  ],
};

// 武器, 徽章, 輔助武器
const additSettingN3 = {
  lv: 1,
  item: ["weapon", "second-weapon", "badge", "shield"],
  prob: [
    ["最大HP +125"],
    ["最大MP +125"],
    ["移動速度 +6"],
    ["跳躍力 +6"],
    ["防禦率 +125"],
    ["STR +13"],
    ["DEX +13"],
    ["INT +13"],
    ["LUK +13"],
    ["物理攻擊力 +13"],
    ["魔法攻擊力 +13"],
    ["最大HP +3%"],
    ["最大MP +3%"],
    ["STR +4%"],
    ["DEX +4%"],
    ["INT +4%"],
    ["LUK +4%"],
    ["物理攻擊力 +4%"],
    ["魔法攻擊力 +4%"],
    ["爆擊機率 +4%"],
    ["總傷害 +4%"],
    ["全屬性 +6"],
  ],
};

// 稀有等級
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const additSettingR1 = {
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
    ["STR +15"],
    ["DEX +15"],
    ["INT +15"],
    ["LUK +15"],
    ["最大HP +185"],
    ["最大MP +185"],
    ["移動速度 +8"],
    ["跳躍力 +8"],
    ["物理攻擊力 +12"],
    ["魔法攻擊力 +12"],
    ["防禦率 +150"],
    ["STR +5%"],
    ["DEX +5%"],
    ["INT +5%"],
    ["LUK +5%"],
    ["最大HP +6%"],
    ["最大MP +6%"],
    ["防禦率 +5%"],
    ["全屬性 +3%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const additSettingR2 = {
  lv: 2,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    ["STR +15"],
    ["DEX +15"],
    ["INT +15"],
    ["LUK +15"],
    ["最大HP +185"],
    ["最大MP +185"],
    ["移動速度 +8"],
    ["跳躍力 +8"],
    ["物理攻擊力 +12"],
    ["魔法攻擊力 +12"],
    ["防禦率 +150"],
    ["STR +5%"],
    ["DEX +5%"],
    ["INT +5%"],
    ["LUK +5%"],
    ["最大HP +6%"],
    ["最大MP +6%"],
    ["防禦率 +5%"],
    ["全屬性 +3%"],
  ],
};

// 武器,輔助武器,徽章
const additSettingR3 = {
  lv: 2,
  item: ["weapon", "second-weapon", "badge", "shield"],
  prob: [
    ["最大HP +6%"],
    ["最大MP +6%"],
    ["物理攻擊力 +7%"],
    ["魔法攻擊力 +7%"],
    ["爆擊機率 +7%"],
    ["STR +7%"],
    ["DEX +7%"],
    ["INT +7%"],
    ["LUK +7%"],
    ["總傷害 +7%"],
    ["全屬性 +4%"],
    ["攻擊時有 3% 機率恢復 54 HP"],
    ["攻擊時有 3% 機率恢復 54 MP"],
    ["無視怪物防禦率 +3%"],
  ],
};

// 罕見等級
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const additSettingSR1 = {
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
    ["STR +17"],
    ["DEX +17"],
    ["INT +17"],
    ["LUK +17"],
    ["最大HP +250"],
    ["最大MP +250"],
    ["物理攻擊力 +13"],
    ["魔法攻擊力 +13"],
    ["STR +6%"],
    ["DEX +6%"],
    ["INT +6%"],
    ["LUK +6%"],
    ["最大HP +8%"],
    ["最大MP +8%"],
    ["全屬性 +5%"],
    ["HP恢復道具及恢復技能效果增加 +20%"],
    ["以角色等級為準每9級STR +1"],
    ["以角色等級為準每9級DEX +1"],
    ["以角色等級為準每9級INT +1"],
    ["以角色等級為準每9級LUK +1"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const additSettingSR2 = {
  lv: 3,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    ["STR +17"],
    ["DEX +17"],
    ["INT +17"],
    ["LUK +17"],
    ["最大HP +250"],
    ["最大MP +250"],
    ["物理攻擊力 +13"],
    ["魔法攻擊力 +13"],
    ["STR +6%"],
    ["DEX +6%"],
    ["INT +6%"],
    ["LUK +6%"],
    ["最大HP +8%"],
    ["最大MP +8%"],
    ["全屬性 +5%"],
    ["HP恢復道具及恢復技能效果增加 +20%"],
    ["以角色等級為準每9級STR +1"],
    ["以角色等級為準每9級DEX +1"],
    ["以角色等級為準每9級INT +1"],
    ["以角色等級為準每9級LUK +1"],
  ],
};

// 武器, 輔助武器(包含力量之盾, 靈魂盾牌)
const additSettingSR3 = {
  lv: 3,
  item: ["weapon", "second-weapon", "shield"],
  prob: [
    ["最大HP +8%"],
    ["最大MP +8%"],
    ["物理攻擊力 +10%"],
    ["魔法攻擊力 +10%"],
    ["爆擊機率 +10%"],
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["總傷害 +10%"],
    ["全屬性 +7%"],
    ["無視怪物防禦率 +4%"],
    ["攻擊BOSS怪物時傷害增加 +12%"],
    ["攻擊時有 15% 機率恢復 97 HP"],
    ["攻擊時有 15% 機率恢復 97 MP"],
    ["以角色等級為準每9級STR +1"],
    ["以角色等級為準每9級DEX +1"],
    ["以角色等級為準每9級INT +1"],
    ["以角色等級為準每9級LUK +1"],
  ],
};

// 徽章
const additSettingSR4 = {
  lv: 3,
  item: ["badge"],
  prob: [
    ["最大HP +8%"],
    ["最大MP +8%"],
    ["物理攻擊力 +10%"],
    ["魔法攻擊力 +10%"],
    ["爆擊機率 +10%"],
    ["STR +10%"],
    ["DEX +10%"],
    ["INT +10%"],
    ["LUK +10%"],
    ["總傷害 +10%"],
    ["全屬性 +7%"],
    ["無視怪物防禦率 +4%"],
    ["攻擊時有 15% 機率恢復 97 HP"],
    ["攻擊時有 15% 機率恢復 97 MP"],
    ["以角色等級為準每9級STR +1"],
    ["以角色等級為準每9級DEX +1"],
    ["以角色等級為準每9級INT +1"],
    ["以角色等級為準每9級LUK +1"],
  ],
};

// 傳說等級
// 帽子
const additSettingSSR1 = {
  lv: 4,
  item: ["hat"],
  prob: [
    ["STR +19"],
    ["DEX +19"],
    ["INT +19"],
    ["LUK +19"],
    ["最大HP +310"],
    ["最大MP +310"],
    ["物理攻擊力 +15"],
    ["魔法攻擊力 +15"],
    ["STR +8%"],
    ["DEX +8%"],
    ["INT +8%"],
    ["LUK +8%"],
    ["最大HP +11%"],
    ["最大MP +11%"],
    ["爆擊傷害 +1%"],
    ["全屬性 +6%"],
    ["以角色等級為準每9級STR +2"],
    ["以角色等級為準每9級DEX +2"],
    ["以角色等級為準每9級INT +2"],
    ["以角色等級為準每9級LUK +2"],
    ["HP恢復道具及恢復技能效果增加 +30%"],
    ["減少所有技能冷卻時間 -1 秒"],
    ["楓幣獲得量 +5%"],
    ["道具掉落率 +5%"],
  ],
};

// 手套
const additSettingSSR2 = {
  lv: 4,
  item: ["gloves"],
  prob: [
    ["STR +19"],
    ["DEX +19"],
    ["INT +19"],
    ["LUK +19"],
    ["最大HP +310"],
    ["最大MP +310"],
    ["物理攻擊力 +15"],
    ["魔法攻擊力 +15"],
    ["STR +8%"],
    ["DEX +8%"],
    ["INT +8%"],
    ["LUK +8%"],
    ["最大HP +11%"],
    ["最大MP +11%"],
    ["爆擊傷害 +3%"],
    ["爆擊傷害 +1%"],
    ["全屬性 +6%"],
    ["以角色等級為準每9級STR +2"],
    ["以角色等級為準每9級DEX +2"],
    ["以角色等級為準每9級INT +2"],
    ["以角色等級為準每9級LUK +2"],
    ["HP恢復道具及恢復技能效果增加 +30%"],
    ["楓幣獲得量 +5%"],
    ["道具掉落率 +5%"],
  ],
};

// 上衣, 下衣, 套服, 披風, 腰帶, 鞋子, 肩膀裝飾, 機器心臟
const additSettingSSR3 = {
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
    ["STR +19"],
    ["DEX +19"],
    ["INT +19"],
    ["LUK +19"],
    ["最大HP +310"],
    ["最大MP +310"],
    ["物理攻擊力 +15"],
    ["魔法攻擊力 +15"],
    ["STR +8%"],
    ["DEX +8%"],
    ["INT +8%"],
    ["LUK +8%"],
    ["最大HP +11%"],
    ["最大MP +11%"],
    ["爆擊傷害 +1%"],
    ["全屬性 +6%"],
    ["以角色等級為準每9級STR +2"],
    ["以角色等級為準每9級DEX +2"],
    ["以角色等級為準每9級INT +2"],
    ["以角色等級為準每9級LUK +2"],
    ["HP恢復道具及恢復技能效果增加 +30%"],
    ["楓幣獲得量 +5%"],
    ["道具掉落率 +5%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const additSettingSSR4 = {
  lv: 4,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    ["STR +19"],
    ["DEX +19"],
    ["INT +19"],
    ["LUK +19"],
    ["最大HP +310"],
    ["最大MP +310"],
    ["物理攻擊力 +15"],
    ["魔法攻擊力 +15"],
    ["STR +8%"],
    ["DEX +8%"],
    ["INT +8%"],
    ["LUK +8%"],
    ["最大HP +11%"],
    ["最大MP +11%"],
    ["全屬性 +6%"],
    ["以角色等級為準每9級STR +2"],
    ["以角色等級為準每9級DEX +2"],
    ["以角色等級為準每9級INT +2"],
    ["以角色等級為準每9級LUK +2"],
    ["所有技能的MP消耗 -10%"],
    ["HP恢復道具及恢復技能效果增加 +30%"],
    ["楓幣獲得量 +5%"],
    ["道具掉落率 +5%"],
  ],
};

// 武器
const additSettingSSR5 = {
  lv: 4,
  item: ["weapon"],
  prob: [
    ["最大HP +11%"],
    ["最大MP +11%"],
    ["物理攻擊力 +13%"],
    ["魔法攻擊力 +13%"],
    ["爆擊機率 +13%"],
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["總傷害 +13%"],
    ["全屬性 +10%"],
    ["無視怪物防禦率 +5%"],
    ["攻擊BOSS怪物時傷害增加 +18%"],
    ["以角色等級為準每9級STR +2"],
    ["以角色等級為準每9級DEX +2"],
    ["以角色等級為準每9級INT +2"],
    ["以角色等級為準每9級LUK +2"],
    ["物理攻擊力 +32"],
    ["魔法攻擊力 +32"],
  ],
};

// 輔助武器(包含力量之盾, 靈魂盾牌)
const additSettingSSR6 = {
  lv: 4,
  item: [, "second-weapon", "shield"],
  prob: [
    ["最大HP +11%"],
    ["最大MP +11%"],
    ["物理攻擊力 +13%"],
    ["魔法攻擊力 +13%"],
    ["爆擊機率 +13%"],
    ["爆擊傷害 +1%"],
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["總傷害 +13%"],
    ["全屬性 +10%"],
    ["無視怪物防禦率 +5%"],
    ["攻擊BOSS怪物時傷害增加 +18%"],
    ["以角色等級為準每9級STR +2"],
    ["以角色等級為準每9級DEX +2"],
    ["以角色等級為準每9級INT +2"],
    ["以角色等級為準每9級LUK +2"],
    ["物理攻擊力 +32"],
    ["魔法攻擊力 +32"],
  ],
};

// 徽章
const additSettingSSR7 = {
  lv: 4,
  item: ["badge"],
  prob: [
    ["最大HP +11%"],
    ["最大MP +11%"],
    ["物理攻擊力 +13%"],
    ["魔法攻擊力 +13%"],
    ["爆擊機率 +13%"],
    ["STR +13%"],
    ["DEX +13%"],
    ["INT +13%"],
    ["LUK +13%"],
    ["總傷害 +13%"],
    ["全屬性 +10%"],
    ["無視怪物防禦率 +5%"],
    ["以角色等級為準每9級STR +2"],
    ["以角色等級為準每9級DEX +2"],
    ["以角色等級為準每9級INT +2"],
    ["以角色等級為準每9級LUK +2"],
    ["物理攻擊力 +32"],
    ["魔法攻擊力 +32"],
  ],
};

export const settingProb = [
  additSetting1,
  additSetting2,
  additSetting3,
  additSettingN1,
  additSettingN2,
  additSettingN3,
  additSettingR1,
  additSettingR2,
  additSettingR3,
  additSettingSR1,
  additSettingSR2,
  additSettingSR3,
  additSettingSR4,
  additSettingSSR1,
  additSettingSSR2,
  additSettingSSR3,
  additSettingSSR4,
  additSettingSSR5,
  additSettingSSR6,
  additSettingSSR7,
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
  const potentialLevel = +$doc("#sec-pot-select").value;
  // 同等潛能
  const sameLV = findProbability(settingProb, itemName, potentialLevel);
  // 低一階潛能
  const lowerLV = findProbability(settingProb, itemName, potentialLevel - 1);

  const sortedPot = [...sameLV.prob, ...lowerLV.prob].flat().sort(sortByNumber);

  for (let i = 1; i < 4; i++) {
    sortedPot.forEach((_, index) =>
      $doc(`.additional-set-${i}`).insertAdjacentHTML(
        "afterbegin",
        renderMarkup(sortedPot[index])
      )
    );
    $doc(`.additional-set-${i}`).value = $doc(`.additional-${i}`).textContent;
  }
};
