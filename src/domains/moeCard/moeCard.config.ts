import type { MoeCardMetadata } from "./moeCard.type";

export const MOE_CARD_LIST: MoeCardMetadata[] = [
  {
    name: "一般萌獸",
    subcategory: "normal",
    category: "moe",
  },
  {
    name: "特殊萌獸",
    subcategory: "special",
    category: "moe",
  },
] as const;

export const MOE_CARD_METADATA_MAP = new Map<string, MoeCardMetadata>(
  MOE_CARD_LIST.map((data) => [data.subcategory, data]),
);
