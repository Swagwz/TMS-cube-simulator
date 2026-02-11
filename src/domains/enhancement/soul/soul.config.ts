import wuGongJewel from "@/assets/enhancementItem/武公寶珠.png";
import type { SoulId, SoulItem } from "./soul.type";

export const SOUL_LIST: SoulItem[] = [
  {
    id: "wuGongJewel",
    name: "武公寶珠",
    description: "對武器使用後，可賦予其武公的靈魂寶珠能力。",
    imagePath: wuGongJewel,
    price: 5500,
    discount: 0,
    apply: "soul",
  },
];

export const SOUL_METADATA_MAP = new Map<SoulId, SoulItem>(
  SOUL_LIST.map((data) => [data.id, data]),
);
