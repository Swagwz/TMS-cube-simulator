import { EquipManager } from "@/domains/equipment/equipManager";
import type {
  EquipmentEnhancementItemId,
  EquipmentFeature,
} from "@/domains/equipment/equipment.type";
import {
  canApplyCubeAtTier,
  getApplicableCubeDefinitions,
  getCubeDefinition,
} from "@/domains/enhancement/cube/cube.registry";
import type {
  AdditionalCubeId,
  MainCubeId,
} from "@/domains/enhancement/cube/cube.type";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import type { EquipmentInstance } from "@/store/useEquipmentStore";

export type EquipmentEnhancementListItem = {
  id: EquipmentEnhancementItemId;
  kind: "cube" | "soul";
  feature: EquipmentFeature;
  name: string;
  description: string;
  imagePath: string;
  count: number;
  disabled: boolean;
};

export function canUseEquipmentEnhancementItem(
  equipment: EquipmentInstance,
  itemId: EquipmentEnhancementItemId,
) {
  if (SoulManager.isItem(itemId)) {
    return EquipManager.canApply(equipment.subcategory, "soul");
  }

  const cube = getCubeDefinition(itemId);
  return (
    EquipManager.canApply(equipment.subcategory, cube.apply) &&
    canApplyCubeAtTier(cube, equipment[cube.apply].tier)
  );
}

export function getEquipmentEnhancementItemsForFeature(
  equipment: EquipmentInstance,
  feature: EquipmentFeature,
): EquipmentEnhancementListItem[] {
  if (feature === "soul") {
    return SoulManager.getItems().map((item) => ({
      id: item.id,
      kind: "soul",
      feature: "soul",
      name: item.name,
      description: item.description,
      imagePath: item.imagePath,
      count: equipment.statistics.counts.soul[item.id] || 0,
      disabled: !canUseEquipmentEnhancementItem(equipment, item.id),
    }));
  }

  return getApplicableCubeDefinitions(feature, equipment[feature].tier).map(
    (cube) => ({
      id: cube.id,
      kind: "cube",
      feature: cube.apply,
      name: cube.name,
      description: cube.description,
      imagePath: cube.imagePath,
      count:
        cube.apply === "mainPot"
          ? equipment.statistics.counts.mainPot[cube.id as MainCubeId] || 0
          : equipment.statistics.counts.additionalPot[
              cube.id as AdditionalCubeId
            ] || 0,
      disabled: !canUseEquipmentEnhancementItem(equipment, cube.id),
    }),
  );
}
