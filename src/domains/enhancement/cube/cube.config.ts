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
    name: "\u9084\u539f\u65b9\u584a",
    price: 55,
    description:
      "\u91cd\u65b0\u6d17\u934a\u5f8c\uff0c\u53ef\u5728\u539f\u672c\u8207\u65b0\u7684\u4e00\u822c\u6f5b\u80fd\u4e4b\u9593\u64c7\u4e00\u5957\u5957\u7528\u3002",
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
    name: "\u516d\u89d2\u65b9\u584a",
    price: 60,
    description:
      "\u91cd\u65b0\u6d17\u51fa 6 \u689d\u5019\u9078\u6f5b\u80fd\uff0c\u518d\u4f9d\u9078\u53d6\u9806\u5e8f\u5957\u7528 3 \u689d\u3002",
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
    name: "\u7d50\u5408\u65b9\u584a",
    price: 120,
    description:
      "\u5148\u9078\u51fa\u4e00\u689d\u4e00\u822c\u6f5b\u80fd\u9032\u884c\u91cd\u6d17\uff0c\u4f60\u53ef\u4ee5\u6c7a\u5b9a\u662f\u5426\u5957\u7528\u8a72\u7d50\u679c\u3002",
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
    name: "\u5747\u7b49\u65b9\u584a",
    price: 65,
    description:
      "\u91cd\u65b0\u6d17\u934a\u6642\uff0c\u4e09\u689d\u6f5b\u80fd\u90fd\u6703\u4fdd\u6301\u70ba\u540c\u4e00\u500b\u7b49\u7d1a\u3002",
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
    name: "\u93e1\u5c04\u65b9\u584a",
    price: 45,
    description:
      "20% \u6a5f\u7387\u5c07\u7b2c\u4e00\u689d\u6f5b\u80fd\u8907\u88fd\u5230\u7b2c\u4e8c\u689d\uff0c\u4e14\u4e0d\u53d7\u6f5b\u80fd\u884c\u6578\u9650\u5236\u3002",
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
    name: "\u540d\u5320\u65b9\u584a",
    price: 0,
    description:
      "\u53ef\u91cd\u8a2d\u4e00\u822c\u6f5b\u80fd\uff0c\u4e26\u6709\u6a5f\u6703\u63d0\u5347\u6f5b\u80fd\u7b49\u7d1a\u3002",
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
    name: "\u5927\u5e2b\u65b9\u584a",
    price: 0,
    description:
      "\u53ef\u91cd\u8a2d\u4e00\u822c\u6f5b\u80fd\uff0c\u4e26\u64c1\u6709\u66f4\u9ad8\u7684\u8df3\u6846\u6a5f\u7387\u3002",
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
    name: "\u9644\u52a0\u65b9\u584a",
    price: 70,
    description:
      "\u53ef\u91cd\u8a2d\u9644\u52a0\u6f5b\u80fd\uff0c\u4e26\u6709\u6a5f\u6703\u63d0\u5347\u6f5b\u80fd\u7b49\u7d1a\u3002",
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
    name: "\u9644\u52a0\u9084\u539f\u65b9\u584a",
    price: 75,
    description:
      "\u91cd\u65b0\u6d17\u934a\u5f8c\uff0c\u53ef\u5728\u539f\u672c\u8207\u65b0\u7684\u9644\u52a0\u6f5b\u80fd\u4e4b\u9593\u64c7\u4e00\u5957\u5957\u7528\u3002",
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
    name: "\u9583\u8000\u9644\u52a0\u65b9\u584a",
    price: 60,
    description:
      "\u53ef\u91cd\u8a2d\u9644\u52a0\u6f5b\u80fd\uff0c\u672a\u8df3\u6846\u6642\u6703\u7d2f\u7a4d\u6b21\u6578\uff0c\u63d0\u9ad8\u4e0b\u4e00\u6b21\u8df3\u6846\u6a5f\u7387\u3002",
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
    name: "\u7d55\u5c0d\u9644\u52a0\u65b9\u584a",
    price: 100,
    description:
      "\u53ea\u6703\u91cd\u65b0\u6d17\u934a\u50b3\u8aaa\u9644\u52a0\u6f5b\u80fd\uff0c\u4e14\u7d50\u679c\u6703\u4fdd\u7559\u524d\u5169\u689d\u7684\u7b49\u7d1a\u7d50\u69cb\u3002",
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
    name: "\u9644\u52a0\u7d50\u5408\u65b9\u584a",
    price: 150,
    description:
      "\u5148\u9078\u51fa\u4e00\u689d\u9644\u52a0\u6f5b\u80fd\u9032\u884c\u91cd\u6d17\uff0c\u4f60\u53ef\u4ee5\u6c7a\u5b9a\u662f\u5426\u5957\u7528\u8a72\u7d50\u679c\u3002",
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
    name: "\u56fa\u5b9a\u6f5b\u80fd",
    description:
      "\u9396\u5b9a\u6307\u5b9a\u7684\u6f5b\u80fd\u884c\uff0c\u91cd\u6d17\u6642\u4fdd\u7559\u8a72\u884c\u539f\u672c\u7d50\u679c\u3002",
    imagePath: fixPotential,
    price: 0,
    discount: 0,
  },
];

export const CUBE_COMPANIONS: Record<string, CubeCompanionItemId[]> = {
  restoreCube: ["fixPotential"],
};
