"use strict";

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
import * as setModel from "./model/setModel.js";
import * as additSetModel from "./model/additSetModel.js";

// button selector
const btnSoul = document.querySelector(".btn-soul");
const btnReturn = document.querySelector(".btn-return");
const btnHexa = document.querySelector(".btn-hexa");
const btnHexaComfirm = document.querySelector(".btn-hexa-comfirm");
const btnHexaAgain = document.querySelector(".btn-hexa-again");
const btnCombine = document.querySelector(".btn-combine");
const btnCombineStart = document.querySelector(".btn-combine-start");
const btnEqal = document.querySelector(".btn-eqal");
const btnReflect = document.querySelector(".btn-reflect");
const btnArtisan = document.querySelector(".btn-artisan");
const btnMaster = document.querySelector(".btn-master");
const btnAdditional = document.querySelector(".btn-additional");
const btnWhiteAdditional = document.querySelector(".btn-white-additional");
const btnAbs = document.querySelector(".btn-abs");
const btnShine = document.querySelector(".btn-shine");
const btnInit = document.querySelector(".btn-init");
const selectItem = document.querySelector("#item-select");
const btnSet = document.querySelector(".btn-set");
const btnSetComfirm = document.querySelector(".btn-set-comfirm");

// img selector
const imgSoul = document.querySelector(".img-soul");
const imgReturn = document.querySelector(".img-return");
const imgHexa = document.querySelector(".img-hexa");
const imgCombine = document.querySelector(".img-combine");
const imgEqal = document.querySelector(".img-eqal");
const imgReflect = document.querySelector(".img-reflect");
const imgArtisan = document.querySelector(".img-artisan");
const imgMaster = document.querySelector(".img-master");
const imgAdditional = document.querySelector(".img-additional");
const imgWhiteAdditional = document.querySelector(".img-white-additional");
const imgAbs = document.querySelector(".img-abs");
const imgShine = document.querySelector(".img-shine");

// cube div selector
const returnAfter = document.querySelector(".play-return .part-after");
const returnBefore = document.querySelector(".play-return .part-before");
const whiteAfter = document.querySelector(".play-white-additional .part-after");
const whiteBefore = document.querySelector(
  ".play-white-additional .part-before"
);

////////////////////////////////////////////////////
// function

// 計數器歸零
function counterZero() {
  document.querySelectorAll(".count-num").forEach((el) => (el.textContent = 0));
}

// 總花費歸零
function totalZero() {
  document.querySelector(".total-cost-num").textContent = "";
}

// 清空section-display的潛能
function clearSectionDisplay() {
  document.querySelectorAll(".result p").forEach((el) => (el.textContent = ""));
  document
    .querySelectorAll(".pot-div h4")
    .forEach((el) => (el.textContent = ""));
  document.querySelector(".soul .result").textContent = "";
}

// 清空閃耀方塊part-after
function clearPartAfter() {
  document
    .querySelectorAll(".part-after p")
    .forEach((el) => (el.textContent = ""));
}

// 清空閃炫方塊潛能
function clearHexaResult() {
  Array.from(document.querySelector(".part-hexa").children).forEach(
    (p) => (p.textContent = "")
  );
}

// 清空select option
function clearMainSelectOption() {
  document.querySelector(".main-set-first").innerHTML = "";
  document.querySelector(".main-set-second").innerHTML = "";
  document.querySelector(".main-set-third").innerHTML = "";
}

function clearAdditSelectOption() {
  document.querySelector(".additional-set-first").innerHTML = "";
  document.querySelector(".additional-set-second").innerHTML = "";
  document.querySelector(".additional-set-third").innerHTML = "";
}

function clearSelectOption() {
  clearMainSelectOption();
  clearAdditSelectOption();
}

// 隱藏sectioni-display的武公
function hideSoul() {
  document.querySelector(".soul").classList.add("display-none");
}

// 隱藏section-play
function hideSectionDisplay() {
  document
    .querySelectorAll(".play")
    .forEach((divPlay) => divPlay.classList.add("display-none"));
}

// 隱藏select option選項
function hideSelect() {
  document
    .querySelectorAll(".setting")
    .forEach((select) => select.classList.add("display-none"));
}

// 隱藏section-display的潛能
function hidePotential() {
  document
    .querySelectorAll(".result p")
    .forEach((select) => select.classList.add("display-none"));
}

// 移除紅石鎖定的class
function removeFixed() {
  document
    .querySelectorAll(".part-before p")
    .forEach((el) => el.classList.remove("fixed-pot"));
}

// 移除結合鎖定的class
function removeCombineChosen() {
  document
    .querySelectorAll(".part-combine p")
    .forEach((el) => el.classList.remove("chosen"));
}

// 移除閃炫鎖定的class
function removeHexaChosen() {
  Array.from(document.querySelector(".part-hexa").children).forEach((el) =>
    el.classList.remove("chosen")
  );
}

// 切換閃炫的按鈕
function initHexaBtn() {
  document.querySelector(".btn-hexa").classList.remove("display-none");
  document.querySelector(".btn-hexa-again").classList.add("display-none");
}

// 切換select option按鈕
function initSelectBtn() {
  document.querySelector(".btn-init").classList.remove("display-none");
  document.querySelector(".btn-set-comfirm").classList.add("display-none");
}

////////////////////////////////////////////////////
// 初始化
const allInit = function () {
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
};

const init = function () {
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
};

////////////////////////////////////////////////////
// 武公寶珠
imgSoul.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-soul").classList.remove("display-none");

  document.querySelector(".play .result").textContent =
    document.querySelector(".soul .result").textContent;
});

btnSoul.addEventListener("click", function () {
  soulModel.renderSoulResult(soulModel.soulProb);
});

////////////////////////////////////////////////////
// 閃耀方塊

imgReturn.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-return").classList.remove("display-none");

  // 顯示目前潛能
  document.querySelector(".play-return .before-first").textContent =
    document.querySelector(".main-first").textContent;
  document.querySelector(".play-return .before-second").textContent =
    document.querySelector(".main-second").textContent;
  document.querySelector(".play-return .before-third").textContent =
    document.querySelector(".main-third").textContent;
  //顯示潛能等級
  if (document.querySelector(".main-first").textContent !== "")
    document.querySelector(".play-return .before-pot-lv").textContent =
      returnModel.potToText(+document.querySelector("#pot-select").value);
});

btnReturn.addEventListener("click", function () {
  init();

  // 顯示section-play
  document.querySelector(".play-return").classList.remove("display-none");

  // 洗潛能
  returnModel.renderReturnResult(returnModel.returnProb);
});

// 選前後
returnAfter.addEventListener("click", returnModel.selectAfter);
returnBefore.addEventListener("click", returnModel.selectBefore);

// before-pot select
const beforeFirst = document.querySelector(".play-return .before-first");
const beforeSecond = document.querySelector(".play-return .before-second");
const beforeThird = document.querySelector(".play-return .before-third");

// 紅石
beforeFirst.addEventListener("click", returnModel.fixedPot);
beforeSecond.addEventListener("click", returnModel.fixedPot);
beforeThird.addEventListener("click", returnModel.fixedPot);

////////////////////////////////////////////////////
// 閃炫方塊

imgHexa.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-hexa").classList.remove("display-none");

  // 顯示目前潛能
  document.querySelector(".hexa-first").textContent =
    document.querySelector(".main-first").textContent;
  document.querySelector(".hexa-second").textContent =
    document.querySelector(".main-second").textContent;
  document.querySelector(".hexa-third").textContent =
    document.querySelector(".main-third").textContent;

  //顯示潛能等級
  if (document.querySelector(".main-first").textContent !== "")
    document.querySelector(".part-hexa .pot-lv").textContent =
      returnModel.potToText(+document.querySelector("#pot-select").value);
});

btnHexa.addEventListener("click", function () {
  if (document.querySelector(".hexa-fourth").textContent !== "") return;
  init();
  // 顯示section-play
  document.querySelector(".play-hexa").classList.remove("display-none");

  // 產生六排潛能
  hexaModel.renderHexaResult(hexaModel.hexaProb);
  document.querySelector(".btn-hexa").classList.add("display-none");
  document.querySelector(".btn-hexa-again").classList.remove("display-none");

  removeFixed();
});

btnHexaAgain.addEventListener("click", function () {
  document.querySelector(".main-first").textContent =
    document.querySelector(".hexa-first").textContent;

  document.querySelector(".main-second").textContent =
    document.querySelector(".hexa-second").textContent;

  document.querySelector(".main-third").textContent =
    document.querySelector(".hexa-third").textContent;

  hexaModel.renderHexaResult(hexaModel.hexaProb);
  // 移除閃炫鎖定的class
  removeHexaChosen();
  // 重製閃炫潛能array
  hexaModel.clearSelectPot();
});

// HEXA potential select
const hexaFirst = document.querySelector(".hexa-first");
const hexaSecond = document.querySelector(".hexa-second");
const hexaThird = document.querySelector(".hexa-third");
const hexaFourth = document.querySelector(".hexa-fourth");
const hexaFifth = document.querySelector(".hexa-fifth");
const hexaSixth = document.querySelector(".hexa-sixth");

hexaFirst.addEventListener("click", hexaModel.selectHexaPot);
hexaSecond.addEventListener("click", hexaModel.selectHexaPot);
hexaThird.addEventListener("click", hexaModel.selectHexaPot);
hexaFourth.addEventListener("click", hexaModel.selectHexaPot);
hexaFifth.addEventListener("click", hexaModel.selectHexaPot);
hexaSixth.addEventListener("click", hexaModel.selectHexaPot);

btnHexaComfirm.addEventListener("click", function () {
  if (hexaModel.selectedPot.length === 3) {
    document.querySelector(".main-first").textContent =
      hexaModel.selectedPot[0].textContent;
    document.querySelector(".main-second").textContent =
      hexaModel.selectedPot[1].textContent;
    document.querySelector(".main-third").textContent =
      hexaModel.selectedPot[2].textContent;

    document.querySelector(".part-hexa .pot-lv").textContent =
      returnModel.potToText(+document.querySelector("#pot-select").value);

    document.querySelector(".hexa-first").textContent =
      document.querySelector(".main-first").textContent;
    document.querySelector(".hexa-second").textContent =
      document.querySelector(".main-second").textContent;
    document.querySelector(".hexa-third").textContent =
      document.querySelector(".main-third").textContent;
    document.querySelector(".hexa-fourth").textContent = "";
    document.querySelector(".hexa-fifth").textContent = "";
    document.querySelector(".hexa-sixth").textContent = "";

    // 移除閃炫鎖定的class
    removeHexaChosen();

    // 重製閃炫潛能array
    hexaModel.clearSelectPot();

    document.querySelector(".btn-hexa").classList.remove("display-none");
    document.querySelector(".btn-hexa-again").classList.add("display-none");
  }
});

////////////////////////////////////////////////////
// 結合方塊

imgCombine.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-combine").classList.remove("display-none");

  // 顯示目前潛能
  document.querySelector(".combine-first").textContent =
    document.querySelector(".main-first").textContent;
  document.querySelector(".combine-second").textContent =
    document.querySelector(".main-second").textContent;
  document.querySelector(".combine-third").textContent =
    document.querySelector(".main-third").textContent;

  // 顯示潛能等級
  if (document.querySelector(".main-first").textContent !== "")
    document.querySelector(".part-combine .pot-lv").textContent =
      returnModel.potToText(+document.querySelector("#pot-select").value);
});

btnCombine.addEventListener("click", function () {
  if (document.querySelector(".main-first").textContent === "") return;
  init();
  // 顯示section-play
  document.querySelector(".play-combine").classList.remove("display-none");

  // 選擇洗哪排
  combineModel.chooseOne();
});

btnCombineStart.addEventListener("click", function () {
  // 洗潛能
  combineModel.renderCombineResult(combineModel.combineProb);
});

////////////////////////////////////////////////////
// 新對等方塊

imgEqal.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-eqal").classList.remove("display-none");

  // 顯示目前潛能
  document.querySelector(".eqal-first").textContent =
    document.querySelector(".main-first").textContent;
  document.querySelector(".eqal-second").textContent =
    document.querySelector(".main-second").textContent;
  document.querySelector(".eqal-third").textContent =
    document.querySelector(".main-third").textContent;

  //顯示潛能等級
  if (document.querySelector(".main-first").textContent !== "")
    document.querySelector(".part-eqal .pot-lv").textContent =
      returnModel.potToText(+document.querySelector("#pot-select").value);
});

btnEqal.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-eqal").classList.remove("display-none");

  // 洗潛能
  eqalModel.renderEqalResult(eqalModel.eqalProb);
});

////////////////////////////////////////////////////
// 閃耀鏡射方塊

imgReflect.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-reflect").classList.remove("display-none");

  // 顯示目前潛能
  document.querySelector(".reflect-first").textContent =
    document.querySelector(".main-first").textContent;
  document.querySelector(".reflect-second").textContent =
    document.querySelector(".main-second").textContent;
  document.querySelector(".reflect-third").textContent =
    document.querySelector(".main-third").textContent;

  //顯示潛能等級
  if (document.querySelector(".main-first").textContent !== "")
    document.querySelector(".part-reflect .pot-lv").textContent =
      returnModel.potToText(+document.querySelector("#pot-select").value);
});

btnReflect.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-reflect").classList.remove("display-none");

  // 洗潛能
  reflectModel.renderReflectResult(reflectModel.reflectProb);
});

////////////////////////////////////////////////////
// 工匠方塊

imgArtisan.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-artisan").classList.remove("display-none");

  // 顯示目前潛能
  document.querySelector(".artisan-first").textContent =
    document.querySelector(".main-first").textContent;
  document.querySelector(".artisan-second").textContent =
    document.querySelector(".main-second").textContent;
  document.querySelector(".artisan-third").textContent =
    document.querySelector(".main-third").textContent;

  //顯示潛能等級
  if (document.querySelector(".main-first").textContent !== "")
    document.querySelector(".part-artisan .pot-lv").textContent =
      returnModel.potToText(+document.querySelector("#pot-select").value);
});

btnArtisan.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-artisan").classList.remove("display-none");

  // 洗潛能
  artisanModel.renderArtisanResult(artisanModel.artisanProb);
});

////////////////////////////////////////////////////
// 名匠方塊

imgMaster.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-master").classList.remove("display-none");

  // 顯示目前潛能
  document.querySelector(".master-first").textContent =
    document.querySelector(".main-first").textContent;
  document.querySelector(".master-second").textContent =
    document.querySelector(".main-second").textContent;
  document.querySelector(".master-third").textContent =
    document.querySelector(".main-third").textContent;

  //顯示潛能等級
  if (document.querySelector(".main-first").textContent !== "")
    document.querySelector(".part-master .pot-lv").textContent =
      returnModel.potToText(+document.querySelector("#pot-select").value);
});

btnMaster.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-master").classList.remove("display-none");

  // 洗潛能
  masterModel.renderMasterResult(masterModel.masterProb);
});

////////////////////////////////////////////////////
// 附加方塊

imgAdditional.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-addit").classList.remove("display-none");

  // 顯示目前潛能
  document.querySelector(".addit-first").textContent =
    document.querySelector(".additional-first").textContent;
  document.querySelector(".addit-second").textContent =
    document.querySelector(".additional-second").textContent;
  document.querySelector(".addit-third").textContent =
    document.querySelector(".additional-third").textContent;

  //顯示潛能等級
  if (document.querySelector(".additional-first").textContent !== "")
    document.querySelector(".part-addit .pot-lv").textContent =
      returnModel.potToText(+document.querySelector("#sec-pot-select").value);
});

btnAdditional.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-addit").classList.remove("display-none");

  // 洗潛能
  additionalModel.renderadditionalResult(additionalModel.additionalProb);
});

////////////////////////////////////////////////////
// 白色附加方塊

imgWhiteAdditional.addEventListener("click", function () {
  init();
  // 顯示section-play
  document
    .querySelector(".play-white-additional")
    .classList.remove("display-none");

  document.querySelector(".play-white-additional .before-first").textContent =
    document.querySelector(".additional-first").textContent;
  document.querySelector(".play-white-additional .before-second").textContent =
    document.querySelector(".additional-second").textContent;
  document.querySelector(".play-white-additional .before-third").textContent =
    document.querySelector(".additional-third").textContent;
  if (document.querySelector(".additional-first").textContent !== "")
    document.querySelector(
      ".play-white-additional .before-pot-lv"
    ).textContent = returnModel.potToText(
      +document.querySelector("#sec-pot-select").value
    );
});

btnWhiteAdditional.addEventListener("click", function () {
  init();

  document.querySelector(".play-white-additional .before-first").textContent =
    document.querySelector(".additional-first").textContent;
  document.querySelector(".play-white-additional .before-second").textContent =
    document.querySelector(".additional-second").textContent;
  document.querySelector(".play-white-additional .before-third").textContent =
    document.querySelector(".additional-third").textContent;

  // 顯示section-play
  document
    .querySelector(".play-white-additional")
    .classList.remove("display-none");

  // 洗潛能
  whiteAdditionalModel.renderWhiteAdditionalResult(
    whiteAdditionalModel.whiteAdditionalProb
  );
});

whiteAfter.addEventListener("click", whiteAdditionalModel.selectAfter);
whiteBefore.addEventListener("click", whiteAdditionalModel.selectBefore);

////////////////////////////////////////////////////
// 絕對附加方塊

imgAbs.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-abs").classList.remove("display-none");

  // 顯示目前潛能
  document.querySelector(".abs-first").textContent =
    document.querySelector(".additional-first").textContent;
  document.querySelector(".abs-second").textContent =
    document.querySelector(".additional-second").textContent;
  document.querySelector(".abs-third").textContent =
    document.querySelector(".additional-third").textContent;

  //顯示潛能等級
  if (document.querySelector(".additional-first").textContent !== "")
    document.querySelector(".part-abs .pot-lv").textContent =
      returnModel.potToText(+document.querySelector("#sec-pot-select").value);
});

btnAbs.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-abs").classList.remove("display-none");

  // 洗潛能
  absModel.renderAbsResult(absModel.absProb);
});

////////////////////////////////////////////////////
// 閃亮附加方塊

// 讀取的時候Level=[0], 所以按imgShine一定會更新提升機率
const Level = [0];
const updateShineLvProb = function () {
  if (+document.querySelector("#sec-pot-select").value === 1)
    document.querySelector(".lv-prob").textContent = "4.700%";
  if (+document.querySelector("#sec-pot-select").value === 2)
    document.querySelector(".lv-prob").textContent = "1.800%";
  if (+document.querySelector("#sec-pot-select").value === 3)
    document.querySelector(".lv-prob").textContent = "0.300%";
  if (+document.querySelector("#sec-pot-select").value === 4)
    document.querySelector(".lv-prob").textContent = "0.000%";
};

imgShine.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-shine").classList.remove("display-none");

  // 顯示目前潛能
  document.querySelector(".shine-first").textContent =
    document.querySelector(".additional-first").textContent;
  document.querySelector(".shine-second").textContent =
    document.querySelector(".additional-second").textContent;
  document.querySelector(".shine-third").textContent =
    document.querySelector(".additional-third").textContent;
  // 更新潛能提升機率
  if (+document.querySelector("#sec-pot-select").value !== Level[0]) {
    Level[0] = +document.querySelector("#sec-pot-select").value;
    updateShineLvProb();
  }

  // 顯示潛能等級
  if (document.querySelector(".additional-first").textContent !== "")
    document.querySelector(".part-shine .pot-lv").textContent =
      returnModel.potToText(+document.querySelector("#sec-pot-select").value);
});

btnShine.addEventListener("click", function () {
  init();
  // 顯示section-play
  document.querySelector(".play-shine").classList.remove("display-none");

  // 更新潛能提升機率
  if (+document.querySelector("#sec-pot-select").value !== Level[0]) {
    Level[0] = +document.querySelector("#sec-pot-select").value;
    updateShineLvProb();
  }

  // 洗潛能
  shineModel.renderShineResult(shineModel.shineProb);
});

document
  .querySelector("#sec-pot-select")
  .addEventListener("change", updateShineLvProb);

////////////////////////////////////////////////////
// 計算花費
const calcTotalCost = function () {
  const soul = document.querySelector(".counter-soul").textContent;
  const soulPrice = document.querySelector("#soul-price").value;
  const retrn = document.querySelector(".counter-return").textContent;
  const hexa = document.querySelector(".counter-hexa").textContent;
  const combine = document.querySelector(".counter-combine").textContent;
  const eqal = document.querySelector(".counter-eqal").textContent;
  const reflect = document.querySelector(".counter-reflect").textContent;

  const addit = document.querySelector(".counter-additional").textContent;
  const whiteAddit = document.querySelector(
    ".counter-white-additional"
  ).textContent;
  const abs = document.querySelector(".counter-abs").textContent;
  const shine = document.querySelector(".counter-shine").textContent;
  const discount = document.querySelector("#discount").value;

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
        shine * 60);

  return totalCost;
};

const renderTotalCost = function () {
  document.querySelector(
    ".total-cost-num"
  ).textContent = `$ ${calcTotalCost()}`;
};

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
  btnShine
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

  if (document.querySelector(".main-set-first").value !== "") return;
  // section-display的潛能清空
  hidePotential();

  // 隱藏sectioni-display的武公
  hideSoul();

  // 切換按鈕
  document.querySelector(".btn-init").classList.add("display-none");
  document.querySelector(".btn-set-comfirm").classList.remove("display-none");

  // 顯示選項
  document
    .querySelectorAll(".setting")
    .forEach((select) => select.classList.remove("display-none"));

  setModel.renderOption(setModel.settingProb);
  additSetModel.renderOption(additSetModel.settingProb);
});

////////////////////////////////////////////////////
// 確認裝備潛能
btnSetComfirm.addEventListener("click", function () {
  // section-play隱藏
  hideSectionDisplay();

  // 切換按鈕
  initSelectBtn();

  // 關閉選項
  document
    .querySelectorAll(".setting")
    .forEach((select) => select.classList.add("display-none"));

  document
    .querySelectorAll(".result p")
    .forEach((p) => p.classList.remove("display-none"));

  // 產生潛能
  document.querySelector(".main-first").textContent =
    document.querySelector(".main-set-first").value;
  document.querySelector(".main-second").textContent =
    document.querySelector(".main-set-second").value;
  document.querySelector(".main-third").textContent =
    document.querySelector(".main-set-third").value;

  document.querySelector(".additional-first").textContent =
    document.querySelector(".additional-set-first").value;
  document.querySelector(".additional-second").textContent =
    document.querySelector(".additional-set-second").value;
  document.querySelector(".additional-third").textContent =
    document.querySelector(".additional-set-third").value;

  // 清空select option
  clearSelectOption();
});

document.querySelector("#item-select").addEventListener("change", function () {
  // 清空select option
  clearSelectOption();

  setModel.renderOption(setModel.settingProb);
  additSetModel.renderOption(additSetModel.settingProb);
});

document.querySelector("#pot-select").addEventListener("change", function () {
  // 清空select option
  clearMainSelectOption();

  setModel.renderOption(setModel.settingProb);
});

document
  .querySelector("#sec-pot-select")
  .addEventListener("change", function () {
    // 清空select option
    clearAdditSelectOption();

    additSetModel.renderOption(additSetModel.settingProb);
  });

btnInit.addEventListener("click", allInit);

selectItem.addEventListener("change", allInit);
