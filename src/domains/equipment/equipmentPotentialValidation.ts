import { PotManager } from "@/domains/potential/potManager";
import { getEquipmentFeatureLabel } from "./equipmentFeature.config";
import type { EquipmentPotentialSlot } from "./equipment.type";

export type EquipmentPotentialGroups = Record<
  EquipmentPotentialSlot,
  { potentialIds: string[] }
>;

export type EquipmentPotentialValidationResult = {
  valid: boolean;
  invalidFeatures: EquipmentPotentialSlot[];
};

export function validateEquipmentPotentialGroups(
  equipment: EquipmentPotentialGroups,
): EquipmentPotentialValidationResult {
  const invalidFeatures = (["mainPot", "additionalPot"] as const).filter(
    (feature) => !PotManager.validateLineRules(equipment[feature].potentialIds),
  );

  return {
    valid: invalidFeatures.length === 0,
    invalidFeatures,
  };
}

export function formatEquipmentPotentialValidationMessage(
  result: EquipmentPotentialValidationResult,
) {
  const labels = result.invalidFeatures.map(
    (feature) => getEquipmentFeatureLabel(feature),
  );

  if (labels.length === 0) return "";

  return `${labels.join("、")}組合超過潛能限制，請調整重複限制類型後再新增。`;
}
