"use strict";

// helper
import { getTextFromSelectValue, $doc, $docAll } from "./model/helper.js";

// model
import * as soulModel from "./model/soulModel.js";
import * as returnModel from "./model/returnModel.js";
import * as hexaModel from "./model/hexaModel.js";
import * as combineModel from "./model/combineModel.js";
import * as eqalModel from "./model/eqalModel.js";
import * as reflectModel from "./model/reflectModel.js";
import * as artisanModel from "./model/artisanModel.js";
import * as masterModel from "./model/masterModel.js";
import * as additionalModel from "./model/additionalModel.js";
import * as whiteAdditionalModel from "./model/whiteadditionalModel.js";
import * as absModel from "./model/absModel.js";
import * as shineModel from "./model/shineModel.js";
import * as monsterModel from "./model/monsterModel.js";
import * as setModel from "./model/setModel.js";
import * as additSetModel from "./model/additSetModel.js";

// button selector
const btnSoul = $doc(".btn-soul");
const btnReturn = $doc(".btn-return");
const btnHexa = $doc(".btn-hexa");
const btnHexaComfirm = $doc(".btn-hexa-comfirm");
const btnHexaAgain = $doc(".btn-hexa-again");
const btnCombine = $doc(".btn-combine");
const btnCombineStart = $doc(".btn-combine-start");
const btnEqal = $doc(".btn-eqal");
const btnReflect = $doc(".btn-reflect");
const btnArtisan = $doc(".btn-artisan");
const btnMaster = $doc(".btn-master");
const btnAdditional = $doc(".btn-additional");
const btnWhiteAdditional = $doc(".btn-white-additional");
const btnAbs = $doc(".btn-abs");
const btnShine = $doc(".btn-shine");
const btnMonsterSingle = $doc(".btn-monster-single");
const btnMonsterDouble = $doc(".btn-monster-double");
const btnInit = $doc(".btn-init");
const selectItem = $doc("#item-select");
const btnSet = $doc(".btn-set");
const btnSetComfirm = $doc(".btn-set-comfirm");

// img selector
const imgSoul = $doc(".img-soul");
const imgReturn = $doc(".img-return");
const imgHexa = $doc(".img-hexa");
const imgCombine = $doc(".img-combine");
const imgEqal = $doc(".img-eqal");
const imgReflect = $doc(".img-reflect");
const imgArtisan = $doc(".img-artisan");
const imgMaster = $doc(".img-master");
const imgAdditional = $doc(".img-additional");
const imgWhiteAdditional = $doc(".img-white-additional");
const imgAbs = $doc(".img-abs");
const imgShine = $doc(".img-shine");
const imgMonster = $doc(".img-monster");

// cube div selector
const returnAfter = $doc(".play-return .part-after");
const returnBefore = $doc(".play-return .part-before");
const whiteAfter = $doc(".play-white-additional .part-after");
const whiteBefore = $doc(".play-white-additional .part-before");

////////////////////////////////////////////////////
// function

// 計數器歸零
function counterZero() {
  $docAll(".count-num").forEach((el) => (el.textContent = 0));
}

// 總花費歸零
function totalZero() {
  $doc(".total-cost-num").textContent = "";
}

// 清空section-display的潛能
function clearSectionDisplay() {
  $docAll(".result p").forEach((el) => (el.textContent = ""));
  $docAll(".pot-div h4").forEach((el) => (el.textContent = ""));
  $doc(".soul .result").textContent = "";
}

// 清空閃耀方塊part-after
function clearPartAfter() {
  $docAll(".part-after p").forEach((el) => (el.textContent = ""));
}

// 清空閃炫方塊潛能
function clearHexaResult() {
  Array.from($doc(".part-hexa").children).forEach((p) => (p.textContent = ""));
}

// 清空select option
function clearMainSelectOption() {
  for (let i = 1; i < 4; i++) {
    $doc(`.main-set-${i}`).innerHTML = "";
  }
}

function clearAdditSelectOption() {
  for (let i = 1; i < 4; i++) {
    $doc(`.additional-set-${i}`).innerHTML = "";
  }
}

function clearSelectOption() {
  clearMainSelectOption();
  clearAdditSelectOption();
}

// 清空萌獸方塊潛能
function clearMonster() {
  for (let i = 1; i < 4; i++) {
    $doc(`.monster-${i}`).textContent = "";
  }
}

// 隱藏sectioni-display的武公
function hideSoul() {
  $doc(".soul").classList.add("display-none");
}

// 隱藏section-play
function hideSectionDisplay() {
  $docAll(".play").forEach((divPlay) => divPlay.classList.add("display-none"));
}

// 隱藏select option選項
function hideSelect() {
  $docAll(".setting").forEach((select) => select.classList.add("display-none"));
}

// 隱藏section-display的潛能
function hidePotential() {
  $docAll(".result p").forEach((select) =>
    select.classList.add("display-none")
  );
}

// 移除紅石鎖定的class
function removeFixed() {
  $docAll(".part-before p").forEach((el) => el.classList.remove("fixed-pot"));
}

// 移除結合鎖定的class
function removeCombineChosen() {
  $docAll(".part-combine p").forEach((el) => el.classList.remove("chosen"));
}

// 移除閃炫鎖定的class
function removeHexaChosen() {
  Array.from($doc(".part-hexa").children).forEach((el) =>
    el.classList.remove("chosen")
  );
}

// 切換閃炫的按鈕
function initHexaBtn() {
  $doc(".btn-hexa").classList.remove("display-none");
  $doc(".btn-hexa-again").classList.add("display-none");
}

// 切換select option按鈕
function initSelectBtn() {
  $doc(".btn-init").classList.remove("display-none");
  $doc(".btn-set-comfirm").classList.add("display-none");
}

// 顯示section-display的潛能
function displayResult() {
  for (let i = 1; i < 4; i++) {
    $doc(`.main-${i}`).classList.remove("display-none");
    $doc(`.additional-${i}`).classList.remove("display-none");
  }
}
////////////////////////////////////////////////////
// 初始化
function allInit() {
  // 計數器歸零
  counterZero();

  // 總花費歸零
  totalZero();

  // 清空section-display的潛能
  clearSectionDisplay();

  // 清空閃耀方塊part-after
  clearPartAfter();

  // 清空閃炫方塊潛能
  clearHexaResult();

  // 清空萌獸方塊潛能
  clearMonster();

  // 隱藏sectioni-display的武公
  hideSoul();

  // 隱藏section-play
  hideSectionDisplay();

  // 移除紅石鎖定的class
  removeFixed();

  // 移除閃炫鎖定的class
  removeHexaChosen();

  // 移除結合鎖定的class
  removeCombineChosen();

  // 重製閃炫潛能array
  hexaModel.clearSelectPot();

  // 重製閃亮方塊等級提升機率
  shineModel.resetLvProb();
}

function init() {
  // section-play隱藏
  hideSectionDisplay();

  // 移除結合鎖定的class
  removeCombineChosen();

  // 閃炫方塊潛能清空
  clearHexaResult();

  // 移除閃炫鎖定的class
  removeHexaChosen();

  // 重製閃炫潛能array
  hexaModel.clearSelectPot();

  // 切換閃炫的按鈕
  initHexaBtn();

  // 切換select option按鈕
  initSelectBtn();

  // 隱藏select option選項
  hideSelect();

  // 清空select option
  clearSelectOption();

  // 顯示section result的潛能
  displayResult();
}

////////////////////////////////////////////////////
// 武公寶珠
imgSoul.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-soul").classList.remove("display-none");

  $doc(".play .result").textContent = $doc(".soul .result").textContent;
});

btnSoul.addEventListener("click", function () {
  soulModel.processSoul();
});

////////////////////////////////////////////////////
// 閃耀方塊

imgReturn.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-return").classList.remove("display-none");

  // 顯示目前潛能
  for (let i = 1; i < 4; i++) {
    $doc(`.play-return .before-${i}`).textContent = $doc(
      `.main-${i}`
    ).textContent;
  }

  //顯示潛能等級
  if ($doc(".main-1").textContent !== "")
    $doc(".play-return .before-pot-lv").textContent = getTextFromSelectValue(
      +$doc("#pot-select").value
    );
});

btnReturn.addEventListener("click", function () {
  init();

  // 顯示section-play
  $doc(".play-return").classList.remove("display-none");

  // 洗潛能
  returnModel.processReturn();
});

// 選前後
returnAfter.addEventListener("click", returnModel.selectAfter);
returnBefore.addEventListener("click", returnModel.selectBefore);

// 固定潛能
for (let i = 1; i < 4; i++) {
  $doc(`.play-return .before-${i}`).addEventListener(
    "click",
    returnModel.fixedPot
  );
}

////////////////////////////////////////////////////
// 閃炫方塊

imgHexa.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-hexa").classList.remove("display-none");

  // 顯示目前潛能
  for (let i = 1; i < 4; i++) {
    $doc(`.hexa-${i}`).textContent = $doc(`.main-${i}`).textContent;
  }

  //顯示潛能等級
  if ($doc(".main-1").textContent !== "")
    $doc(".part-hexa .pot-lv").textContent = getTextFromSelectValue(
      +$doc("#pot-select").value
    );
});

btnHexa.addEventListener("click", function () {
  if ($doc(".hexa-4").textContent !== "") return;
  init();
  // 顯示section-play
  $doc(".play-hexa").classList.remove("display-none");

  // 產生六排潛能
  hexaModel.processHexa();
  $doc(".btn-hexa").classList.add("display-none");
  $doc(".btn-hexa-again").classList.remove("display-none");

  removeFixed();
});

btnHexaAgain.addEventListener("click", function () {
  for (let i = 1; i < 4; i++) {
    $doc(`.main-${i}`).textContent = $doc(`.hexa-${i}`).textContent;
  }

  hexaModel.processHexa();
  // 移除閃炫鎖定的class
  removeHexaChosen();
  // 重製閃炫潛能array
  hexaModel.clearSelectPot();
});

// HEXA potential select
for (let i = 1; i < 7; i++) {
  $doc(`.hexa-${i}`).addEventListener("click", hexaModel.selectHexaPot);
}

btnHexaComfirm.addEventListener("click", function () {
  if (hexaModel.selectedPot.length === 3) {
    for (let i = 0; i < 3; i++) {
      $doc(`.main-${i + 1}`).textContent = hexaModel.selectedPot[i].textContent;
    }

    $doc(".part-hexa .pot-lv").textContent = getTextFromSelectValue(
      +$doc("#pot-select").value
    );

    for (let i = 1; i < 4; i++) {
      $doc(`.hexa-${i}`).textContent = $doc(`.main-${i}`).textContent;
    }
    for (let i = 4; i < 7; i++) {
      $doc(`.hexa-${i}`).textContent = "";
    }

    // 移除閃炫鎖定的class
    removeHexaChosen();

    // 重製閃炫潛能array
    hexaModel.clearSelectPot();

    $doc(".btn-hexa").classList.remove("display-none");
    $doc(".btn-hexa-again").classList.add("display-none");
  }
});

////////////////////////////////////////////////////
// 結合方塊

imgCombine.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-combine").classList.remove("display-none");

  // 顯示目前潛能
  for (let i = 1; i < 4; i++) {
    $doc(`.combine-${i}`).textContent = $doc(`.main-${i}`).textContent;
  }

  // 顯示潛能等級
  if ($doc(".main-1").textContent !== "")
    $doc(".part-combine .pot-lv").textContent = getTextFromSelectValue(
      +$doc("#pot-select").value
    );
});

btnCombine.addEventListener("click", function () {
  if ($doc(".main-1").textContent === "") return;
  init();
  // 顯示section-play
  $doc(".play-combine").classList.remove("display-none");

  // 選擇洗哪排
  combineModel.chooseOne();
});

btnCombineStart.addEventListener("click", function () {
  // 洗潛能
  combineModel.processCombine();
});

////////////////////////////////////////////////////
// 新對等方塊

imgEqal.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-eqal").classList.remove("display-none");

  // 顯示目前潛能
  for (let i = 1; i < 4; i++) {
    $doc(`.eqal-${i}`).textContent = $doc(`.main-${i}`).textContent;
  }

  //顯示潛能等級
  if ($doc(".main-1").textContent !== "")
    $doc(".part-eqal .pot-lv").textContent = getTextFromSelectValue(
      +$doc("#pot-select").value
    );
});

btnEqal.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-eqal").classList.remove("display-none");

  // 洗潛能
  eqalModel.processEqal();
});

////////////////////////////////////////////////////
// 閃耀鏡射方塊

imgReflect.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-reflect").classList.remove("display-none");

  // 顯示目前潛能
  for (let i = 1; i < 4; i++) {
    $doc(`.reflect-${i}`).textContent = $doc(`.main-${i}`).textContent;
  }

  //顯示潛能等級
  if ($doc(".main-1").textContent !== "")
    $doc(".part-reflect .pot-lv").textContent = getTextFromSelectValue(
      +$doc("#pot-select").value
    );
});

btnReflect.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-reflect").classList.remove("display-none");

  // 洗潛能
  reflectModel.processReflect();
});

////////////////////////////////////////////////////
// 工匠方塊

imgArtisan.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-artisan").classList.remove("display-none");

  // 顯示目前潛能
  for (let i = 1; i < 4; i++) {
    $doc(`.artisan-${i}`).textContent = $doc(`.main-${i}`).textContent;
  }

  //顯示潛能等級
  if ($doc(".main-1").textContent !== "")
    $doc(".part-artisan .pot-lv").textContent = getTextFromSelectValue(
      +$doc("#pot-select").value
    );
});

btnArtisan.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-artisan").classList.remove("display-none");

  // 洗潛能
  artisanModel.processArtisan();
});

////////////////////////////////////////////////////
// 名匠方塊

imgMaster.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-master").classList.remove("display-none");

  // 顯示目前潛能
  for (let i = 1; i < 4; i++) {
    $doc(`.master-${i}`).textContent = $doc(`.main-${i}`).textContent;
  }

  //顯示潛能等級
  if ($doc(".main-1").textContent !== "")
    $doc(".part-master .pot-lv").textContent = getTextFromSelectValue(
      +$doc("#pot-select").value
    );
});

btnMaster.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-master").classList.remove("display-none");

  // 洗潛能
  masterModel.processMaster();
});

////////////////////////////////////////////////////
// 附加方塊

imgAdditional.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-addit").classList.remove("display-none");

  // 顯示目前潛能
  for (let i = 1; i < 4; i++) {
    $doc(`.addit-${i}`).textContent = $doc(`.additional-${i}`).textContent;
  }

  //顯示潛能等級
  if ($doc(".additional-1").textContent !== "")
    $doc(".part-addit .pot-lv").textContent = getTextFromSelectValue(
      +$doc("#sec-pot-select").value
    );
});

btnAdditional.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-addit").classList.remove("display-none");

  // 洗潛能
  additionalModel.processAdditional();
});

////////////////////////////////////////////////////
// 白色附加方塊

imgWhiteAdditional.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-white-additional").classList.remove("display-none");

  for (let i = 1; i < 4; i++) {
    $doc(`.play-white-additional .before-${i}`).textContent = $doc(
      `.additional-${i}`
    ).textContent;
  }

  if ($doc(".additional-1").textContent !== "")
    $doc(".play-white-additional .before-pot-lv").textContent =
      getTextFromSelectValue(+$doc("#sec-pot-select").value);
});

btnWhiteAdditional.addEventListener("click", function () {
  init();

  for (let i = 1; i < 4; i++) {
    $doc(`.play-white-additional .before-${i}`).textContent = $doc(
      `.additional-${i}`
    ).textContent;
  }

  // 顯示section-play
  $doc(".play-white-additional").classList.remove("display-none");

  // 洗潛能
  whiteAdditionalModel.processWhiteAdditional();
});

whiteAfter.addEventListener("click", whiteAdditionalModel.selectAfter);
whiteBefore.addEventListener("click", whiteAdditionalModel.selectBefore);

////////////////////////////////////////////////////
// 絕對附加方塊

imgAbs.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-abs").classList.remove("display-none");

  // 顯示目前潛能
  for (let i = 1; i < 4; i++) {
    $doc(`.abs-${i}`).textContent = $doc(`.additional-${i}`).textContent;
  }

  //顯示潛能等級
  if ($doc(".additional-1").textContent !== "")
    $doc(".part-abs .pot-lv").textContent = getTextFromSelectValue(
      +$doc("#sec-pot-select").value
    );
});

btnAbs.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-abs").classList.remove("display-none");

  // 洗潛能
  absModel.processAbs();
});

////////////////////////////////////////////////////
// 閃亮附加方塊

// 讀取的時候Level=[0], 所以按imgShine一定會更新提升機率
let Level = 0;
const updateShineLvProb = function () {
  switch (+$doc("#sec-pot-select").value) {
    case 1:
      $doc(".lv-prob").textContent = "4.700%";
      break;
    case 2:
      $doc(".lv-prob").textContent = "1.800%";
      break;
    case 3:
      $doc(".lv-prob").textContent = "0.300%";
      break;
    case 4:
      $doc(".lv-prob").textContent = "0.000%";
      break;
  }
};

imgShine.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-shine").classList.remove("display-none");

  // 顯示目前潛能
  for (let i = 1; i < 4; i++) {
    $doc(`.shine-${i}`).textContent = $doc(`.additional-${i}`).textContent;
  }

  // 更新潛能提升機率
  if (+$doc("#sec-pot-select").value !== Level) {
    Level = +$doc("#sec-pot-select").value;
    updateShineLvProb();
  }

  // 顯示潛能等級
  if ($doc(".additional-1").textContent !== "")
    $doc(".part-shine .pot-lv").textContent = getTextFromSelectValue(
      +$doc("#sec-pot-select").value
    );
});

btnShine.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-shine").classList.remove("display-none");

  // 更新潛能提升機率
  if (+$doc("#sec-pot-select").value !== Level) {
    Level = +$doc("#sec-pot-select").value;
    updateShineLvProb();
  }

  // 洗潛能
  shineModel.processShine();
});

$doc("#sec-pot-select").addEventListener("change", updateShineLvProb);

////////////////////////////////////////////////////
// 萌獸方塊

imgMonster.addEventListener("click", function () {
  init();
  // 顯示section-play
  $doc(".play-monster").classList.remove("display-none");
});

// 單終以上
btnMonsterSingle.addEventListener("click", async function () {
  init();
  // 顯示section-play
  $doc(".play-monster").classList.remove("display-none");
  $doc(".part-monster").classList.add("running");

  // 洗潛能
  await monsterModel.processMonster(1);
  $doc(".part-monster").classList.remove("running");
  renderTotalCost();
});

// 雙終以上
btnMonsterDouble.addEventListener("click", async function () {
  init();
  // 顯示section-play
  $doc(".play-monster").classList.remove("display-none");
  $doc(".part-monster").classList.add("running");

  // 洗潛能
  await monsterModel.processMonster(2);
  $doc(".part-monster").classList.remove("running");
  renderTotalCost();
});

////////////////////////////////////////////////////
// 計算花費
function calcTotalCost() {
  const soul = $doc(".counter-soul").textContent;
  const soulPrice = $doc("#soul-price").value;
  const retrn = $doc(".counter-return").textContent;
  const hexa = $doc(".counter-hexa").textContent;
  const combine = $doc(".counter-combine").textContent;
  const eqal = $doc(".counter-eqal").textContent;
  const reflect = $doc(".counter-reflect").textContent;

  const addit = $doc(".counter-additional").textContent;
  const whiteAddit = $doc(".counter-white-additional").textContent;
  const abs = $doc(".counter-abs").textContent;
  const shine = $doc(".counter-shine").textContent;
  const monster = $doc(".counter-monster").textContent;
  const discount = $doc("#discount").value;

  if (discount > 100 || discount < 0) return "折扣超出範圍";

  const totalCost =
    soul * soulPrice +
    (100 - discount) *
      0.01 *
      (retrn * 55 +
        hexa * 60 +
        combine * 120 +
        eqal * 65 +
        reflect * 45 +
        addit * 70 +
        whiteAddit * 75 +
        abs * 100 +
        shine * 60 +
        monster * 30);

  return totalCost.toFixed(0);
}

function renderTotalCost() {
  $doc(".total-cost-num").textContent = `$ ${calcTotalCost()}`;
}

[
  btnSoul,
  btnReturn,
  btnHexa,
  btnHexaAgain,
  btnCombine,
  btnEqal,
  btnReflect,
  btnArtisan,
  btnMaster,
  btnAdditional,
  btnWhiteAdditional,
  btnAbs,
  btnShine,
  btnMonsterSingle,
  btnMonsterDouble,
].forEach((btn) =>
  btn.addEventListener("click", function () {
    renderTotalCost();
  })
);

////////////////////////////////////////////////////
// 設定裝備潛能
btnSet.addEventListener("click", function () {
  // 清空select option
  clearSelectOption();

  if ($doc(".main-set-1").value !== "") return;
  // section-display的潛能清空
  hidePotential();

  // 隱藏sectioni-display的武公
  hideSoul();

  // 切換按鈕
  $doc(".btn-init").classList.add("display-none");
  $doc(".btn-set-comfirm").classList.remove("display-none");

  // 顯示選項
  $docAll(".setting").forEach((select) =>
    select.classList.remove("display-none")
  );

  setModel.renderOption();
  additSetModel.renderOption();
});

////////////////////////////////////////////////////
// 確認裝備潛能
btnSetComfirm.addEventListener("click", function () {
  // section-play隱藏
  hideSectionDisplay();

  // 切換按鈕
  initSelectBtn();

  // 關閉選項
  $docAll(".setting").forEach((select) => select.classList.add("display-none"));

  $docAll(".result p").forEach((p) => p.classList.remove("display-none"));

  // 產生潛能
  for (let i = 1; i < 4; i++) {
    $doc(`.main-${i}`).textContent = $doc(`.main-set-${i}`).value;
    $doc(`.additional-${i}`).textContent = $doc(`.additional-set-${i}`).value;
  }

  // 清空select option
  clearSelectOption();
});

$doc("#item-select").addEventListener("change", function () {
  // 清空select option
  clearSelectOption();

  setModel.renderOption();
  additSetModel.renderOption();
});

$doc("#pot-select").addEventListener("change", function () {
  // 清空select option
  clearMainSelectOption();

  setModel.renderOption();
});

$doc("#sec-pot-select").addEventListener("change", function () {
  // 清空select option
  clearAdditSelectOption();

  additSetModel.renderOption();
});

btnInit.addEventListener("click", allInit);

selectItem.addEventListener("change", allInit);

// section-cube下拉功能
let btnExpand = $doc(".btn-expand");
let btnCollapse = $doc(".btn-collapse");
let sectionCube = $doc(".section-cube");

[btnExpand, btnCollapse].forEach((btn) =>
  btn.addEventListener("click", (e) => {
    btnExpand.classList.toggle("display-none");
    btnCollapse.classList.toggle("display-none");

    if (e.target.classList.contains("btn-expand")) {
      sectionCube.style.flexWrap = "wrap";
    } else {
      sectionCube.style.flexWrap = "";
    }
  })
);
