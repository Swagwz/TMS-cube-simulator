// 產生機率對應的結果
function getRandomResultByProbability(arrProb) {
  let cumulativeProb = 0;
  const sum = arrProb.reduce((acc, [prob, result]) => acc + prob, 0);
  const random = Math.random() * sum;

  for (const [prob, result] of arrProb) {
    cumulativeProb += prob;
    if (random < cumulativeProb) return result;
  }
}

function getTextFromSelectValue(num) {
  switch (num) {
    case 1:
      return "特殊";
      break;
    case 2:
      return "稀有";
      break;
    case 3:
      return "罕見";
      break;
    case 4:
      return "傳說";
      break;
  }
}

function getValueFromText(text) {
  switch (text) {
    case "特殊":
      return 1;
      break;
    case "稀有":
      return 2;
      break;
    case "罕見":
      return 3;
      break;
    case "傳說":
      return 4;
      break;
  }
}

// *下方潛在能力屬性只能最多設定一個
// 實用的技能系列
// 被擊後無敵時間增加

function checkPotential_1(array) {
  const count = {};
  array.forEach((pot) => {
    if (pot.includes("實用")) {
      count["useful"] = (count["useful"] || 0) + 1;
    }
    if (pot.includes("被擊中後無敵時間增加")) {
      count["invicible"] = (count["invicible"] || 0) + 1;
    }
  });
  if (count.useful >= 2 || count.invicible >= 2) return false;
  else return true;
}

// *下方潛在能力屬性只能最多設定兩個(閃耀鏡射方塊不在此限制內)
// 被擊時以一定機率無視傷害 %
// 被擊時以一定機率一定時間內無敵

function checkPotential_2(array) {
  const count = {};
  array.forEach((pot) => {
    if (pot.includes("機率無視")) {
      count["ignore"] = (count["ignore"] || 0) + 1;
    }
    if (pot.includes("內無敵")) {
      count["invisibleTime"] = (count["invisibleTime"] || 0) + 1;
    }
  });
  if (count.ignore >= 3 || count.invisibleTime >= 3) return false;
  else return true;
}

function checkPotential(array) {
  return checkPotential_1(array) && checkPotential_2(array);
}

function findProbability(cubeProbabilityArray, item, level) {
  return cubeProbabilityArray.find(
    (el) => el.item.includes(item) && el.lv === level
  );
}

function $doc(selector) {
  return document.querySelector(selector);
}

function $docAll(selector) {
  return document.querySelectorAll(selector);
}

export {
  getRandomResultByProbability,
  getTextFromSelectValue,
  getValueFromText,
  findProbability,
  checkPotential,
  checkPotential_1,
  checkPotential_2,
  $doc,
  $docAll,
};
