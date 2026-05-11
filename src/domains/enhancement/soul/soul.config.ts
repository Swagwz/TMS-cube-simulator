import wuGongJewel from "@/assets/enhancementItem/武公寶珠.png";
import type { SoulId, SoulItem } from "./soul.type";

export const SOUL_LIST: SoulItem[] = [
  {
    id: "wuGongJewel",
    name: "武公寶珠",
    description: "可重新洗鍊裝備的武公寶珠潛能。",
    imagePath: wuGongJewel,
    price: 5500,
    discount: 0,
    apply: "soul",
  },
];

export const SOUL_METADATA_MAP = new Map<SoulId, SoulItem>(
  SOUL_LIST.map((data) => [data.id, data]),
);
