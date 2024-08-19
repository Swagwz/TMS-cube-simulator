"use strict";

import { getRandomResultByProbability, $doc } from "./helper.js";

/////////////////////////////////////////////////////////
// 武公寶珠
export const soulProb = [
  [3.57, "全屬性: +7%"],
  [3.57, "無視怪物防禦力: +30%"],
  [3.57, "攻擊BOSS怪物時傷害: +20%"],
  [3.57, "總傷害: +10%"],
  [3.57, "物理攻擊力: +10%"],
  [3.57, "魔法攻擊力: +10%"],
  [3.57, "爆擊機率: +10%"],
  [3.57, "所有技能等級: + 1"],
  [3.57, "被擊中時有5%機率無視20%傷害"],
  [3.57, "被攻擊時有2%機率在7秒內無敵 "],
  [3.57, "全屬性: +4%"],
  [3.57, "無視怪物防禦力: +15%"],
  [3.57, "總傷害: +7%"],
  [3.57, "物理攻擊力: +7%"],
  [3.57, "魔法攻擊力: +7%"],
  [3.57, "爆擊機率: +8%"],
  [3.57, "STR: +9%"],
  [3.57, "最大HP: +6%"],
  [3.57, "INT: +9%"],
  [3.57, "最大MP%: +6%"],
  [3.57, "STR: +10%"],
  [3.57, "DEX: +10%"],
  [3.57, "INT: +10%"],
  [3.57, "LUK: +10%"],
  [3.57, "STR: +7%"],
  [3.57, "DEX: +7%"],
  [3.57, "INT: +7%"],
  [3.57, "LUK: +7%"],
];

// 點武公
export const processSoul = function () {
  const itemName = $doc("#item-select").value;
  if (itemName === "weapon") {
    $doc(".soul").classList.remove("display-none");
    $doc(".soul .result").textContent = getRandomResultByProbability(soulProb);
    $doc(".play .result").textContent = $doc(".soul .result").textContent;
    $doc(".counter-soul").textContent++;
  } else {
    $doc(".soul").classList.add("display-none");
    $doc(".play .result").textContent = "武公寶珠只能套用在武器上";
  }
};
