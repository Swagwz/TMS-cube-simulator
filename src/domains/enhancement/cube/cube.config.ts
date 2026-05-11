import absAdditionalCube from "@/assets/enhancementItem/絕對附加方塊.png";
import additionalCube from "@/assets/enhancementItem/珍貴附加方塊.png";
import combineAdditionalCube from "@/assets/enhancementItem/結合附加方塊.png";
import combineCube from "@/assets/enhancementItem/結合方塊.png";
import craftsmanCube from "@/assets/enhancementItem/工匠方塊.png";
import equalCube from "@/assets/enhancementItem/新對等方塊.png";
import fixPotential from "@/assets/enhancementItem/固定潛能.png";
import hexaCube from "@/assets/enhancementItem/閃炫方塊.png";
import masterCraftsmanCube from "@/assets/enhancementItem/名匠方塊.png";
import mirrorCube from "@/assets/enhancementItem/閃耀鏡射方塊.png";
import restoreAdditionalCube from "@/assets/enhancementItem/恢復附加方塊.png";
import restoreCube from "@/assets/enhancementItem/恢復方塊.png";
import shinyAdditionalCube from "@/assets/enhancementItem/閃亮附加方塊.png";
import type {
  CubeCompanionItem,
  CubeCompanionItemId,
  CubeDefinition,
} from "./cube.type";

export const CUBE_LIST: CubeDefinition[] = [
  {
    id: "restoreCube",
    name: "恢復方塊",
    price: 55,
    description:
      "重新洗鍊後，可在原本與新的一般潛能之間擇一套用。",
    discount: 10,
    apply: "mainPot",
    workflow: "restore",
    rankUpType: "standard",
    validationType: "standard",
    lineEffect: { type: "none" },
    imagePath: restoreCube,
    rankUp: {
      rare: [97.7, 2, 0.3],
      epic: [8, 0.6],
      unique: [2.1],
    },
    lineRank: {
      rare: [
        [100, 0],
        [100, 0],
        [100, 0],
      ],
      epic: [
        [100, 0],
        [20, 80],
        [15, 85],
      ],
      unique: [
        [100, 0],
        [20, 80],
        [10, 90],
      ],
      legendary: [
        [100, 0],
        [20, 80],
        [5, 95],
      ],
    },
  },
  {
    id: "hexaCube",
    name: "閃炫方塊",
    price: 60,
    description:
      "重新洗出 6 條候選潛能，再依選取順序套用 3 條。",
    discount: 10,
    apply: "mainPot",
    workflow: "hexa",
    rankUpType: "standard",
    validationType: "standard",
    lineEffect: { type: "none" },
    imagePath: hexaCube,
    rankUp: {
      rare: [97],
      epic: [3],
      unique: [1.35],
    },
    lineRank: {
      rare: [
        [100, 0],
        [20, 80],
        [15, 85],
        [100, 0],
        [20, 80],
        [15, 85],
      ],
      epic: [
        [100, 0],
        [20, 80],
        [15, 85],
        [100, 0],
        [20, 80],
        [15, 85],
      ],
      unique: [
        [100, 0],
        [20, 80],
        [15, 85],
        [100, 0],
        [20, 80],
        [15, 85],
      ],
      legendary: [
        [100, 0],
        [20, 80],
        [15, 85],
        [100, 0],
        [20, 80],
        [15, 85],
      ],
    },
  },
  {
    id: "combineCube",
    name: "結合方塊",
    price: 120,
    description:
      "先選出一條一般潛能進行重洗，你可以決定是否套用該結果。",
    discount: 10,
    apply: "mainPot",
    workflow: "combine",
    rankUpType: "none",
    validationType: "standard",
    lineEffect: { type: "none" },
    imagePath: combineCube,
    rankUp: null,
    lineRank: {
      rare: [
        [15, 85],
        [15, 85],
        [15, 85],
      ],
      epic: [
        [15, 85],
        [15, 85],
        [15, 85],
      ],
      unique: [
        [15, 85],
        [15, 85],
        [15, 85],
      ],
      legendary: [
        [15, 85],
        [15, 85],
        [15, 85],
      ],
    },
  },
  {
    id: "equalCube",
    name: "新對等方塊",
    price: 65,
    description:
      "重新洗鍊時，三條潛能都會保持為同一個等級。",
    discount: 10,
    apply: "mainPot",
    workflow: "direct",
    rankUpType: "standard",
    validationType: "standard",
    lineEffect: { type: "none" },
    imagePath: equalCube,
    rankUp: {
      rare: [97],
      epic: [3],
      unique: [1.35],
    },
    lineRank: {
      rare: [
        [100, 0],
        [100, 0],
        [100, 0],
      ],
      epic: [
        [100, 0],
        [100, 0],
        [100, 0],
      ],
      unique: [
        [100, 0],
        [100, 0],
        [100, 0],
      ],
      legendary: [
        [100, 0],
        [100, 0],
        [100, 0],
      ],
    },
  },
  {
    id: "mirrorCube",
    name: "閃耀鏡射方塊",
    price: 45,
    description:
      "20% 機率將第一條潛能複製到第二條，且不受潛能行數限制。",
    discount: 10,
    apply: "mainPot",
    workflow: "direct",
    rankUpType: "standard",
    validationType: "none",
    lineEffect: {
      type: "mirror",
      probability: 20,
      fromIndex: 0,
      toIndex: 1,
    },
    imagePath: mirrorCube,
    rankUp: {
      rare: [97],
      epic: [2.25],
      unique: [0.99],
    },
    lineRank: {
      rare: [
        [100, 0],
        [100, 0],
        [100, 0],
      ],
      epic: [
        [100, 0],
        [20, 80],
        [15, 85],
      ],
      unique: [
        [100, 0],
        [20, 80],
        [10, 90],
      ],
      legendary: [
        [100, 0],
        [20, 80],
        [5, 95],
      ],
    },
  },
  {
    id: "craftsmanCube",
    name: "工匠方塊",
    price: 0,
    description:
      "可重新設定一般潛能，並有機會提升潛能等級。",
    discount: 0,
    apply: "mainPot",
    workflow: "direct",
    rankUpType: "standard",
    validationType: "standard",
    lineEffect: { type: "none" },
    imagePath: craftsmanCube,
    rankUp: {
      rare: [4.76],
      epic: [1.19],
    },
    lineRank: {
      rare: [
        [100, 0],
        [16.67, 83.33],
        [16.67, 83.33],
      ],
      epic: [
        [100, 0],
        [4.76, 95.24],
        [4.76, 95.24],
      ],
      unique: [
        [100, 0],
        [1.19, 98.81],
        [1.19, 98.81],
      ],
    },
  },
  {
    id: "masterCraftsmanCube",
    name: "名匠方塊",
    price: 0,
    description:
      "可重新設定一般潛能，並擁有更高的跳框機率。",
    discount: 0,
    apply: "mainPot",
    workflow: "direct",
    rankUpType: "standard",
    validationType: "standard",
    lineEffect: { type: "none" },
    imagePath: masterCraftsmanCube,
    rankUp: {
      rare: [8],
      epic: [1.7],
      unique: [0.2],
    },
    lineRank: {
      rare: [
        [100, 0],
        [16.67, 83.33],
        [16.67, 83.33],
      ],
      epic: [
        [100, 0],
        [8, 92],
        [8, 92],
      ],
      unique: [
        [100, 0],
        [1.7, 98.3],
        [1.7, 98.3],
      ],
      legendary: [
        [100, 0],
        [0.2, 99.8],
        [0.2, 99.8],
      ],
    },
  },
  {
    id: "additionalCube",
    name: "珍貴附加方塊",
    price: 70,
    description:
      "可重新設定附加潛能，並有機會提升潛能等級。",
    discount: 10,
    apply: "additionalPot",
    workflow: "direct",
    rankUpType: "standard",
    validationType: "standard",
    lineEffect: { type: "none" },
    imagePath: additionalCube,
    rankUp: {
      rare: [4.76],
      epic: [1.96],
      unique: [0.5],
    },
    lineRank: {
      rare: [
        [100, 0],
        [1.96, 98.04],
        [1.96, 98.04],
      ],
      epic: [
        [100, 0],
        [4.76, 95.24],
        [4.76, 95.24],
      ],
      unique: [
        [100, 0],
        [1.96, 98.04],
        [1.96, 98.04],
      ],
      legendary: [
        [100, 0],
        [0.5, 99.5],
        [0.5, 99.5],
      ],
    },
  },
  {
    id: "restoreAdditionalCube",
    name: "恢復附加方塊",
    price: 75,
    description:
      "重新洗鍊後，可在原本與新的附加潛能之間擇一套用。",
    discount: 10,
    apply: "additionalPot",
    workflow: "restore",
    rankUpType: "standard",
    validationType: "standard",
    lineEffect: { type: "none" },
    imagePath: restoreAdditionalCube,
    rankUp: {
      rare: [4.76],
      epic: [1.96],
      unique: [0.5],
    },
    lineRank: {
      rare: [
        [100, 0],
        [1.96, 98.04],
        [1.96, 98.04],
      ],
      epic: [
        [100, 0],
        [4.76, 95.24],
        [4.76, 95.24],
      ],
      unique: [
        [100, 0],
        [1.96, 98.04],
        [1.96, 98.04],
      ],
      legendary: [
        [100, 0],
        [0.5, 99.5],
        [0.5, 99.5],
      ],
    },
  },
  {
    id: "shinyAdditionalCube",
    name: "閃亮附加方塊",
    price: 60,
    description:
      "可重新設定附加潛能，未跳框時會累積次數，提高下一次跳框機率。",
    discount: 10,
    apply: "additionalPot",
    workflow: "direct",
    rankUpType: "accumulate",
    validationType: "standard",
    lineEffect: { type: "none" },
    imagePath: shinyAdditionalCube,
    rankUp: {
      rare: [4.7],
      epic: [1.8],
      unique: [0.3],
    },
    rankUpIncr: {
      rare: 0.05,
      epic: 0.01,
      unique: 0.005,
    },
    ceiling: {
      rare: 44,
      epic: 109,
      unique: 307,
    },
    lineRank: {
      rare: [
        [100, 0],
        [1.96, 98.04],
        [1.96, 98.04],
      ],
      epic: [
        [100, 0],
        [4.76, 95.24],
        [4.76, 95.24],
      ],
      unique: [
        [100, 0],
        [1.96, 98.04],
        [1.96, 98.04],
      ],
      legendary: [
        [100, 0],
        [0.5, 99.5],
        [0.5, 99.5],
      ],
    },
  },
  {
    id: "absAdditionalCube",
    name: "絕對附加方塊",
    price: 100,
    description:
      "只會重新洗鍊傳說附加潛能，且結果會保留前兩條的等級結構。",
    discount: 10,
    apply: "additionalPot",
    workflow: "direct",
    rankUpType: "none",
    validationType: "standard",
    lineEffect: { type: "none" },
    imagePath: absAdditionalCube,
    rankUp: null,
    lineRank: {
      legendary: [
        [100, 0],
        [100, 0],
        [0, 100],
      ],
    },
  },
  {
    id: "combineAdditionalCube",
    name: "結合附加方塊",
    price: 150,
    description:
      "先選出一條附加潛能進行重洗，你可以決定是否套用該結果。",
    discount: 10,
    apply: "additionalPot",
    workflow: "combine",
    rankUpType: "none",
    validationType: "standard",
    lineEffect: { type: "none" },
    imagePath: combineAdditionalCube,
    rankUp: null,
    lineRank: {
      rare: [
        [0.5, 99.5],
        [0.5, 99.5],
        [0.5, 99.5],
      ],
      epic: [
        [0.5, 99.5],
        [0.5, 99.5],
        [0.5, 99.5],
      ],
      unique: [
        [0.5, 99.5],
        [0.5, 99.5],
        [0.5, 99.5],
      ],
      legendary: [
        [0.5, 99.5],
        [0.5, 99.5],
        [0.5, 99.5],
      ],
    },
  },
];

export const CUBE_COMPANION_ITEMS: CubeCompanionItem[] = [
  {
    id: "fixPotential",
    name: "固定潛能",
    description: "鎖定指定的潛能行，重洗時保留該行原本結果。",
    imagePath: fixPotential,
    price: 0,
    discount: 0,
  },
];

export const CUBE_COMPANIONS: Record<string, CubeCompanionItemId[]> = {
  restoreCube: ["fixPotential"],
};
