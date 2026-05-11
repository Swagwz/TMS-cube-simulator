import { useCallback, useState } from "react";
import type { EquipmentEnhancementItemId } from "@/domains/equipment/equipment.type";
import { canUseEquipmentEnhancementItem } from "@/features/workbench/enhancement/equipment/equipmentEnhancementItems";
import type { EquipmentInstance } from "@/store/useEquipmentStore";

export type EquipmentEnhancingDialogRequest = {
  equipmentId: string;
  itemId: EquipmentEnhancementItemId;
};

export function createEquipmentEnhancingDialogRequest(
  equipment: EquipmentInstance,
  itemId: EquipmentEnhancementItemId,
): EquipmentEnhancingDialogRequest | null {
  if (!canUseEquipmentEnhancementItem(equipment, itemId)) return null;

  return {
    equipmentId: equipment.id,
    itemId,
  };
}

export function useEquipmentEnhancingDialog() {
  const [request, setRequest] = useState<EquipmentEnhancingDialogRequest | null>(
    null,
  );

  const openDialog = useCallback(
    (equipment: EquipmentInstance, itemId: EquipmentEnhancementItemId) => {
      setRequest(createEquipmentEnhancingDialogRequest(equipment, itemId));
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setRequest(null);
  }, []);

  return {
    request,
    openDialog,
    closeDialog,
  };
}
