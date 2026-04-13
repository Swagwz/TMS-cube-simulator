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
  CubeId,
  CubeItem,
  CompanionItem,
  CompanionItemId,
} from "./cube.type";

export const CUBE_LIST: CubeItem[] = [
  {
    id: "restoreCube",
    name: "恢復方塊",
    price: 55,
    description: "使用後可預覽重設結果，並由玩家選擇保留原始潛能或套用新潛能。",
    discount: 10,
    apply: "mainPot",
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
    description: "使用後將顯示 6 條潛能屬性，玩家可從中任選 3 條進行套用。",
    discount: 10,
    apply: "mainPot",
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
    description: "隨機選擇一排潛能屬性，並決定是否重新設定。",
    discount: 10,
    apply: "mainPot",
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
    description: "重設潛能時，各排必定出現此裝備目前階級的潛能屬性。",
    discount: 10,
    apply: "mainPot",
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
    description: "重設潛能時，有機率將第一排的潛能屬性複製並套用至第二排。",
    discount: 10,
    apply: "mainPot",
    imagePath: mirrorCube,
    mirrorProb: 20,
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
    description: "重設裝備潛能，最高可將潛能階級提升至罕見等級。",
    discount: 0,
    apply: "mainPot",
    imagePath: craftsmanCube,
    maxApplyTier: "unique",
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
    description: "重設裝備潛能，最高可將潛能階級提升至傳說等級。",
    discount: 0,
    apply: "mainPot",
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
    description: "用於重設裝備的附加潛能屬性。",
    discount: 10,
    apply: "additionalPot",
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
      "使用後可預覽附加潛能重設結果，並由玩家選擇保留原始數值或套用新數值。",
    discount: 10,
    apply: "additionalPot",
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
      "重設附加潛能。階級提升機率隨使用次數提高，並具備必定升階的保底機制。",
    discount: 10,
    apply: "additionalPot",
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
      "僅限附加潛能為傳說等級之裝備使用。重設後第一、二排必定為傳說等級，第三排必定為罕見等級。",
    discount: 10,
    apply: "additionalPot",
    imagePath: absAdditionalCube,
    minApplyTier: "legendary",
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
    description: "隨機選擇一排附加潛能屬性，並決定是否重新設定。",
    discount: 10,
    apply: "additionalPot",
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

export const CUBE_METADATA_MAP = new Map<CubeId, CubeItem>(
  CUBE_LIST.map((data) => [data.id, data]),
);

const COMPANION_LIST: CompanionItem[] = [
  {
    id: "fixPotential",
    name: "固定潛能",
    description: "與恢復方塊一起使用，可以固定其中一排的潛能屬性。",
    imagePath: fixPotential,
    price: 0,
    discount: 0,
    apply: "mainPot",
  },
];

export const COMPANION_METADATA_MAP = new Map<CompanionItemId, CompanionItem>(
  COMPANION_LIST.map((data) => [data.id, data]),
);

/** 定義方塊與其他道具的關聯 */
export const CUBE_COMPANIONS: Record<string, CompanionItemId[]> = {
  restoreCube: ["fixPotential"],
};
