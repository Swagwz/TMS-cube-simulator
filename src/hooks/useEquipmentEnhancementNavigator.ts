import { useMemo } from "react";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import type { EquipmentInstance } from "@/store/useEquipmentStore";
import type {
  EquipmentCubeSessionController,
  EquipmentEnhancementNavigatorResult,
  EquipmentSoulSessionController,
} from "@/contexts/useEquipmentEnhancementSessionContext";
import type { EquipmentEnhancingDialogRequest } from "./useEquipmentEnhancingDialog";
import { useEquipmentCubeSession } from "./useEquipmentCubeSession";
import { useEquipmentSoulSession } from "./useEquipmentSoulSession";

type UseEquipmentEnhancementNavigatorParams = {
  request: EquipmentEnhancingDialogRequest | null;
  baseInstance: EquipmentInstance | null;
  closeModal: () => void;
};

export function resolveEquipmentEnhancementNavigator(params: {
  itemId: string | null;
  cubeController: EquipmentCubeSessionController | null;
  soulController: EquipmentSoulSessionController | null;
}): EquipmentEnhancementNavigatorResult {
  if (!params.itemId) return null;

  if (SoulManager.isItem(params.itemId)) {
    return params.soulController
      ? {
          kind: "soul",
          controller: params.soulController,
        }
      : null;
  }

  return params.cubeController
    ? {
        kind: "cube",
        workflow: params.cubeController.cube.workflow,
        controller: params.cubeController,
      }
    : null;
}

export function useEquipmentEnhancementNavigator({
  request,
  baseInstance,
  closeModal,
}: UseEquipmentEnhancementNavigatorParams): EquipmentEnhancementNavigatorResult {
  const itemId = request?.itemId ?? null;

  const cubeController = useEquipmentCubeSession({
    itemId,
    baseInstance,
    closeModal,
  });
  const soulController = useEquipmentSoulSession({
    itemId,
    baseInstance,
    closeModal,
  });

  return useMemo(
    () =>
      resolveEquipmentEnhancementNavigator({
        itemId,
        cubeController,
        soulController,
      }),
    [cubeController, itemId, soulController],
  );
}
