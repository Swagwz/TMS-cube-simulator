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
// 絕對附加方塊

// 罕見等級
// 帽子, 上衣, 下衣, 套服, 手套, 鞋子, 披風, 腰帶, 肩膀裝飾, 機器心臟
const absSR1 = {
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
    [3.15, "STR +17"],
    [3.15, "DEX +17"],
    [3.15, "INT +17"],
    [3.15, "LUK +17"],
    [4.72, "最大HP +250"],
    [25.18, "最大MP +250"],
    [0.06, "物理攻擊力 +13"],
    [0.06, "魔法攻擊力 +13"],
    [0.03, "STR +6%"],
    [0.03, "DEX +6%"],
    [0.03, "INT +6%"],
    [0.03, "LUK +6%"],
    [0.31, "最大HP +8%"],
    [28.33, "最大MP +8%"],
    [0.03, "全屬性 +5%"],
    [28.33, "HP恢復道具及恢復技能效果增加 +20%"],
    [0.06, "以角色等級為準每9級STR +1"],
    [0.06, "以角色等級為準每9級DEX +1"],
    [0.06, "以角色等級為準每9級INT +1"],
    [0.06, "以角色等級為準每9級LUK +1"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const absSR2 = {
  lv: 3,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [3.15, "STR +17"],
    [3.15, "DEX +17"],
    [3.15, "INT +17"],
    [3.15, "LUK +17"],
    [4.72, "最大HP +250"],
    [25.18, "最大MP +250"],
    [0.06, "物理攻擊力 +13"],
    [0.06, "魔法攻擊力 +13"],
    [0.03, "STR +6%"],
    [0.03, "DEX +6%"],
    [0.03, "INT +6%"],
    [0.03, "LUK +6%"],
    [0.31, "最大HP +8%"],
    [28.33, "最大MP +8%"],
    [0.03, "全屬性 +5%"],
    [28.33, "HP恢復道具及恢復技能效果增加 +20%"],
    [0.06, "以角色等級為準每9級STR +1"],
    [0.06, "以角色等級為準每9級DEX +1"],
    [0.06, "以角色等級為準每9級INT +1"],
    [0.06, "以角色等級為準每9級LUK +1"],
  ],
};

// 武器, 輔助武器(包含力量之盾, 靈魂盾牌)
const absSR3 = {
  lv: 3,
  item: ["weapon", "second-weapon", "shield"],
  prob: [
    [0.33, "最大HP +8%"],
    [29.7, "最大MP +8%"],
    [0.03, "物理攻擊力 +10%"],
    [0.03, "魔法攻擊力 +10%"],
    [3.3, "爆擊機率 +10%"],
    [1.65, "STR +10%"],
    [1.65, "DEX +10%"],
    [1.65, "INT +10%"],
    [1.65, "LUK +10%"],
    [0.17, "總傷害 +10%"],
    [1.65, "全屬性 +7%"],
    [4.95, "無視怪物防禦率 +4%"],
    [0.17, "攻擊BOSS怪物時傷害增加 +12%"],
    [26.4, "攻擊時有 15% 機率恢復 97 HP"],
    [26.4, "攻擊時有 15% 機率恢復 97 MP"],
    [0.07, "以角色等級為準每9級STR +1"],
    [0.07, "以角色等級為準每9級DEX +1"],
    [0.07, "以角色等級為準每9級INT +1"],
    [0.07, "以角色等級為準每9級LUK +1"],
  ],
};

// 徽章
const absSR4 = {
  lv: 3,
  item: ["badge"],
  prob: [
    [0.33, "最大HP +8%"],
    [29.75, "最大MP +8%"],
    [0.03, "物理攻擊力 +10%"],
    [0.03, "魔法攻擊力 +10%"],
    [3.31, "爆擊機率 +10%"],
    [1.65, "STR +10%"],
    [1.65, "DEX +10%"],
    [1.65, "INT +10%"],
    [1.65, "LUK +10%"],
    [0.17, "總傷害 +10%"],
    [1.65, "全屬性 +7%"],
    [4.96, "無視怪物防禦率 +4%"],
    [26.45, "攻擊時有 15% 機率恢復 97 HP"],
    [26.45, "攻擊時有 15% 機率恢復 97 MP"],
    [0.07, "以角色等級為準每9級STR +1"],
    [0.07, "以角色等級為準每9級DEX +1"],
    [0.07, "以角色等級為準每9級INT +1"],
    [0.07, "以角色等級為準每9級LUK +1"],
  ],
};

// 傳說等級
// 帽子
const absSSR1 = {
  lv: 4,
  item: ["hat"],
  prob: [
    [4.34, "STR +19"],
    [4.34, "DEX +19"],
    [4.34, "INT +19"],
    [4.34, "LUK +19"],
    [4.34, "最大HP +310"],
    [6.51, "最大MP +310"],
    [3.47, "物理攻擊力 +15"],
    [3.47, "魔法攻擊力 +15"],
    [3.37, "STR +8%"],
    [3.37, "DEX +8%"],
    [3.37, "INT +8%"],
    [3.37, "LUK +8%"],
    [3.69, "最大HP +11%"],
    [6.51, "最大MP +11%"],
    [2.17, "爆擊傷害 +1%"],
    [3.37, "全屬性 +6%"],
    [3.47, "以角色等級為準每9級STR +2"],
    [3.47, "以角色等級為準每9級DEX +2"],
    [3.47, "以角色等級為準每9級INT +2"],
    [3.47, "以角色等級為準每9級LUK +2"],
    [6.95, "HP恢復道具及恢復技能效果增加 +30%"],
    [1.74, "減少所有技能冷卻時間 -1 秒"],
    [6.51, "楓幣獲得量 +5%"],
    [6.51, "道具掉落率 +5%"],
  ],
};

// 手套
const absSSR2 = {
  lv: 4,
  item: ["gloves"],
  prob: [
    [4.32, "STR +19"],
    [4.32, "DEX +19"],
    [4.32, "INT +19"],
    [4.32, "LUK +19"],
    [4.32, "最大HP +310"],
    [6.49, "最大MP +310"],
    [3.46, "物理攻擊力 +15"],
    [3.46, "魔法攻擊力 +15"],
    [3.35, "STR +8%"],
    [3.35, "DEX +8%"],
    [3.35, "INT +8%"],
    [3.35, "LUK +8%"],
    [3.68, "最大HP +11%"],
    [6.49, "最大MP +11%"],
    [2.16, "爆擊傷害 +3%"],
    [2.16, "爆擊傷害 +1%"],
    [3.35, "全屬性 +6%"],
    [3.46, "以角色等級為準每9級STR +2"],
    [3.46, "以角色等級為準每9級DEX +2"],
    [3.46, "以角色等級為準每9級INT +2"],
    [3.46, "以角色等級為準每9級LUK +2"],
    [6.92, "HP恢復道具及恢復技能效果增加 +30%"],
    [6.49, "楓幣獲得量 +5%"],
    [6.49, "道具掉落率 +5%"],
  ],
};

// 上衣, 下衣, 套服, 披風, 腰帶, 鞋子, 肩膀裝飾, 機器心臟
const absSSR3 = {
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
    [4.42, "STR +19"],
    [4.42, "DEX +19"],
    [4.42, "INT +19"],
    [4.42, "LUK +19"],
    [4.42, "最大HP +310"],
    [6.63, "最大MP +310"],
    [3.54, "物理攻擊力 +15"],
    [3.54, "魔法攻擊力 +15"],
    [3.43, "STR +8%"],
    [3.43, "DEX +8%"],
    [3.43, "INT +8%"],
    [3.43, "LUK +8%"],
    [3.76, "最大HP +11%"],
    [6.63, "最大MP +11%"],
    [2.21, "爆擊傷害 +1%"],
    [3.43, "全屬性 +6%"],
    [3.54, "以角色等級為準每9級STR +2"],
    [3.54, "以角色等級為準每9級DEX +2"],
    [3.54, "以角色等級為準每9級INT +2"],
    [3.54, "以角色等級為準每9級LUK +2"],
    [7.07, "HP恢復道具及恢復技能效果增加 +30%"],
    [6.63, "楓幣獲得量 +5%"],
    [6.63, "道具掉落率 +5%"],
  ],
};

// 墜飾,戒指,臉部裝飾,眼睛裝飾,耳環
const absSSR4 = {
  lv: 4,
  item: ["ring", "necklace", "earrings", "face", "eyes"],
  prob: [
    [4.21, "STR +19"],
    [4.21, "DEX +19"],
    [4.21, "INT +19"],
    [4.21, "LUK +19"],
    [4.21, "最大HP +310"],
    [6.32, "最大MP +310"],
    [3.37, "物理攻擊力 +15"],
    [3.37, "魔法攻擊力 +15"],
    [3.27, "STR +8%"],
    [3.27, "DEX +8%"],
    [3.27, "INT +8%"],
    [3.27, "LUK +8%"],
    [3.58, "最大HP +11%"],
    [6.32, "最大MP +11%"],
    [3.27, "全屬性 +6%"],
    [3.37, "以角色等級為準每9級STR +2"],
    [3.37, "以角色等級為準每9級DEX +2"],
    [3.37, "以角色等級為準每9級INT +2"],
    [3.37, "以角色等級為準每9級LUK +2"],
    [6.74, "所有技能的MP消耗 -10%"],
    [6.74, "HP恢復道具及恢復技能效果增加 +30%"],
    [6.32, "楓幣獲得量 +5%"],
    [6.32, "道具掉落率 +5%"],
  ],
};

// 武器
const absSSR5 = {
  lv: 4,
  item: ["weapon"],
  prob: [
    [7.15, "最大HP +11%"],
    [12.63, "最大MP +11%"],
    [2.61, "物理攻擊力 +13%"],
    [2.61, "魔法攻擊力 +13%"],
    [4.71, "爆擊機率 +13%"],
    [4.71, "STR +13%"],
    [4.71, "DEX +13%"],
    [4.71, "INT +13%"],
    [4.71, "LUK +13%"],
    [4.63, "總傷害 +13%"],
    [4.71, "全屬性 +10%"],
    [5.47, "無視怪物防禦率 +5%"],
    [2.95, "攻擊BOSS怪物時傷害增加 +18%"],
    [6.73, "以角色等級為準每9級STR +2"],
    [6.73, "以角色等級為準每9級DEX +2"],
    [6.73, "以角色等級為準每9級INT +2"],
    [6.73, "以角色等級為準每9級LUK +2"],
    [3.37, "物理攻擊力 +32"],
    [3.37, "魔法攻擊力 +32"],
  ],
};

// 輔助武器(包含力量之盾, 靈魂盾牌)
const absSSR6 = {
  lv: 4,
  item: [, "second-weapon", "shield"],
  prob: [
    [6.87, "最大HP +11%"],
    [12.12, "最大MP +11%"],
    [2.5, "物理攻擊力 +13%"],
    [2.5, "魔法攻擊力 +13%"],
    [4.52, "爆擊機率 +13%"],
    [4.04, "爆擊傷害 +1%"],
    [4.52, "STR +13%"],
    [4.52, "DEX +13%"],
    [4.52, "INT +13%"],
    [4.52, "LUK +13%"],
    [4.44, "總傷害 +13%"],
    [4.52, "全屬性 +10%"],
    [5.25, "無視怪物防禦率 +5%"],
    [2.83, "攻擊BOSS怪物時傷害增加 +18%"],
    [6.46, "以角色等級為準每9級STR +2"],
    [6.46, "以角色等級為準每9級DEX +2"],
    [6.46, "以角色等級為準每9級INT +2"],
    [6.46, "以角色等級為準每9級LUK +2"],
    [3.23, "物理攻擊力 +32"],
    [3.23, "魔法攻擊力 +32"],
  ],
};

// 徽章
const absSSR7 = {
  lv: 4,
  item: ["badge"],
  prob: [
    [7.37, "最大HP +11%"],
    [13.01, "最大MP +11%"],
    [2.69, "物理攻擊力 +13%"],
    [2.69, "魔法攻擊力 +13%"],
    [4.86, "爆擊機率 +13%"],
    [4.86, "STR +13%"],
    [4.86, "DEX +13%"],
    [4.86, "INT +13%"],
    [4.86, "LUK +13%"],
    [4.77, "總傷害 +13%"],
    [4.86, "全屬性 +10%"],
    [5.64, "無視怪物防禦率 +5%"],
    [6.94, "以角色等級為準每9級STR +2"],
    [6.94, "以角色等級為準每9級DEX +2"],
    [6.94, "以角色等級為準每9級INT +2"],
    [6.94, "以角色等級為準每9級LUK +2"],
    [3.47, "物理攻擊力 +32"],
    [3.47, "魔法攻擊力 +32"],
  ],
};

export const absProb = [
  absSR1,
  absSR2,
  absSR3,
  absSR4,
  absSSR1,
  absSSR2,
  absSSR3,
  absSSR4,
  absSSR5,
  absSSR6,
  absSSR7,
];

// 點絕對附加
export const renderAbsResult = function (arrProb) {
  // 暫時存放確認用的潛能
  const playPotArr = [];

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

  // 只能用在附加傳說
  if (potSelect !== 4) {
    document.querySelector(".abs-first").textContent =
      "絕對附加方塊只適用於附加傳說潛能的裝備";
    document.querySelector(".abs-second").textContent = "";
    document.querySelector(".abs-third").textContent = "";
    return;
  }

  // 傳說
  if (potSelect !== 4) return;
  // 1,2排必定傳說 3排必定罕見
  playPotArr.push(renderProbResult(select.prob));
  playPotArr.push(renderProbResult(select.prob));
  playPotArr.push(renderProbResult(selectLower.prob));

  // 確認潛能 2024/6/26不再限定潛能
  if (!checkPot1(playPotArr) || !checkPot2(playPotArr)) {
    renderAbsResult(absProb);
    return;
  }

  document.querySelector(".part-abs .pot-lv").textContent =
    potToText(potSelect);

  document.querySelector(".abs-first").textContent = playPotArr[0];
  document.querySelector(".additional-first").textContent = playPotArr[0];

  document.querySelector(".abs-second").textContent = playPotArr[1];
  document.querySelector(".additional-second").textContent = playPotArr[1];

  document.querySelector(".abs-third").textContent = playPotArr[2];
  document.querySelector(".additional-third").textContent = playPotArr[2];

  document.querySelector(".counter-abs").textContent++;
};
