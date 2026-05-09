import {
  CUBE_COMPANION_ITEMS,
  CUBE_COMPANIONS,
  CUBE_LIST,
} from "./cube.config";
import type {
  CubeApplicationType,
  CubeDefinition,
  CubeId,
} from "./cube.type";
import type { EquipmentRank } from "@/domains/potential/potential.type";

const CUBE_METADATA_MAP = new Map<CubeId, CubeDefinition>(
  CUBE_LIST.map((data) => [data.id, data]),
);

const CUBE_COMPANION_ITEM_MAP = new Map(
  CUBE_COMPANION_ITEMS.map((data) => [data.id, data]),
);

export function getCubeDefinition<T extends CubeId>(cubeId: T) {
  const definition = CUBE_METADATA_MAP.get(cubeId);
  if (!definition) throw new Error("Invalid cubeId");
  return definition as T extends "shinyAdditionalCube"
    ? Extract<CubeDefinition, { id: "shinyAdditionalCube" }>
    : T extends "mirrorCube"
      ? Extract<CubeDefinition, { id: "mirrorCube" }>
      : CubeDefinition;
}

export function canApplyCubeAtTier(
  cube: CubeDefinition,
  currentTier: EquipmentRank,
) {
  return !!cube.lineRank[currentTier];
}

export function getApplicableCubeDefinitions(
  applyType: CubeApplicationType,
  currentTier: EquipmentRank,
): CubeDefinition[] {
  return CUBE_LIST.filter(
    (cube) =>
      cube.apply === applyType && canApplyCubeAtTier(cube, currentTier),
  );
}

export function getCubeCompanionItems(cubeId: string) {
  const companionIds = CUBE_COMPANIONS[cubeId];
  if (!companionIds) return [];
  return companionIds.map((id) => CUBE_COMPANION_ITEM_MAP.get(id)!);
}
