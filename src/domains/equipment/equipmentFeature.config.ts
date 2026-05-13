import type { EquipmentFeature } from "./equipment.type";

export const EQUIPMENT_FEATURE_LABELS = {
  mainPot: "一般潛能",
  additionalPot: "附加潛能",
  soul: "靈魂寶珠",
} satisfies Record<EquipmentFeature, string>;

export function getEquipmentFeatureLabel(feature: EquipmentFeature) {
  return EQUIPMENT_FEATURE_LABELS[feature];
}
