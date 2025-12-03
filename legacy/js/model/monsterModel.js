"use strict";

import { getRandomResultByProbability, $doc } from "./helper.js";

/////////////////////////////////////////////////////////
// 萌獸方塊
const monsterProb = [
  [0.83, "STR +20"],
  [0.83, "DEX +20"],
  [0.83, "INT +20"],
  [0.83, "LUK +20"],
  [0.56, "Max HP +300"],
  [0.56, "Max MP +300"],
  [1.11, "DEX +1"],
  [0.56, "移動速度 +10"],
  [0.56, "跳躍力 +10"],
  [1.11, "物理攻擊力 +20"],
  [1.11, "魔法攻擊力 +20"],
  [1.11, "防禦力 +300"],
  [3.61, "爆擊機率 +20%"],
  [3.06, "最終傷害 +20%"],
  [3.06, "全屬性 +20"],
  [1.94, "一定秒數內恢復20HP"],
  [1.94, "一定秒數內恢復20MP"],
  [5, "STR +14%"],
  [5, "DEX +14%"],
  [5, "INT +14%"],
  [5, "LUK +14%"],
  [4.17, "Max HP +14%"],
  [4.17, "Max MP +14%"],
  [2.78, "DEX +1%"],
  [4.17, "物理攻擊力 +14%"],
  [4.17, "魔法攻擊力 +14%"],
  [2.78, "防禦力 +14%"],
  [2.78, "攻擊時有3%機率恢復50HP"],
  [2.78, "攻擊時有3%機率恢復50MP"],
  [2.22, "攻擊時有12%機率發動3級中毒效果"],
  [2.22, "攻擊時有12%機率發動3級暈眩效果"],
  [2.22, "攻擊時有12%機率發動3級緩慢效果"],
  [2.22, "攻擊時有12%機率發動3級闇黑效果"],
  [2.22, "攻擊時有12%機率發動3級冰結效果"],
  [2.22, "攻擊時有12%機率發動3級封印效果"],
  [2.78, "無視怪物防禦率 +45%"],
  [2.78, "依照角色90%攻擊力來追加萌獸攻擊力"],
  [4.17, "依照角色90%屬性來追加萌獸攻擊力"],
  [2.78, "加持技能持續時間 +50%"],
  [2.78, "增加被動技能等級 +2"],
];

// 點萌獸方塊
export const processMonster = function (num) {
  return new Promise((resolve) => {
    const tillFinalDamage = setInterval(() => {
      $doc(".btn-monster-double").disabled = true;
      $doc(".btn-monster-single").disabled = true;

      let tempPotentailArray = [];
      for (let i = 0; i < 3; i++) {
        tempPotentailArray.push(getRandomResultByProbability(monsterProb));
      }
      $doc(".counter-monster").textContent++;

      let count = {};
      tempPotentailArray.forEach((pot) => {
        if (pot.includes("最終")) {
          count["finalDamage"] = (count["finalDamage"] || 0) + 1;
        }
      });

      if (count["finalDamage"] >= num) {
        clearInterval(tillFinalDamage);
        for (let i = 0; i < 3; i++) {
          $doc(`.monster-${i + 1}`).textContent = tempPotentailArray[i];
        }
        $doc(".btn-monster-double").disabled = false;
        $doc(".btn-monster-single").disabled = false;

        resolve(); // Fulfill the promise here
      }
    }, 0);
  });
};
