import wuGongJewel from "@/assets/enhancementItem/武公寶珠.png";
import type { SoulId, SoulItem } from "./soul.type";

export const SOUL_LIST: SoulItem[] = [
  {
    id: "wuGongJewel",
    name: "\u6b66\u529f\u5bf6\u73e0",
    description: "\u53ef\u4ee5\u91cd\u65b0\u6d17\u934a\u88dd\u5099\u7684\u9748\u9b42\u6b66\u5668\u6f5b\u80fd\u3002",
    imagePath: wuGongJewel,
    price: 5500,
    discount: 0,
    apply: "soul",
  },
];

export const SOUL_METADATA_MAP = new Map<SoulId, SoulItem>(
  SOUL_LIST.map((data) => [data.id, data]),
);
