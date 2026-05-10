import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useEquipmentStore,
  type EquipmentInstance,
} from "@/store/useEquipmentStore";
import { EnhancingContext } from "@/contexts/useEnhancingContext";
import { useActiveStore } from "@/store/useActiveStore";
import Enhancer from "./Enhancer";
import type { EquipmentEnhancementItemId } from "@/domains/equipment/equipment.type";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import { getCubeDefinition } from "@/domains/enhancement/cube/cube.registry";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import RankUpMultiplier from "./RankUpMultiplier";
import { EquipmentCubeSessionContext } from "@/contexts/useEquipmentCubeSessionContext";
import { useEquipmentCubeSession } from "@/hooks/useEquipmentCubeSession";

type Props = {
  selectedItemId: EquipmentEnhancementItemId | null;
  closeModal: () => void;
};

export default function EquipEnhancingDialog({
  selectedItemId,
  closeModal,
}: Props) {
  // TODO: replace localData/context working copy with EquipmentEnhancementSession after cube workflows move to reducers.
  const [localData, setLocalData] = useState<EquipmentInstance | null>(null);

  const equipId = useActiveStore((s) =>
    s.activeState.activeType === "equipment" ? s.activeState.id : null,
  );

  const title = selectedItemId
    ? selectedItemId === "wuGongJewel"
      ? SoulManager.getItem(selectedItemId).name
      : getCubeDefinition(selectedItemId as CubeId).name
    : "";

  const poolData = useMemo(() => {
    if (!selectedItemId || !localData) return undefined;

    if (selectedItemId === "wuGongJewel") {
      return {
        feature: "soul" as const,
        pools: SoulManager.getPotPool(),
      };
    }
  }, [selectedItemId, localData]);

  const cubeSession = useEquipmentCubeSession({
    selectedItemId,
    localData,
    closeModal,
  });

  // Open dialog with a working copy of the selected equipment.
  useEffect(() => {
    if (selectedItemId && equipId) {
      setLocalData(
        structuredClone(useEquipmentStore.getState().instanceMap[equipId]),
      );
    }
  }, [selectedItemId, equipId]);

  const open = !!(
    selectedItemId &&
    equipId &&
    localData &&
    (selectedItemId === "wuGongJewel" ? poolData : cubeSession)
  );

  if (!open) return null;

  return (
    <Dialog open={open}>
      <DialogContent
        className={cn(
          "data-[state=open]:zoom-in-100! data-[state=open]:slide-in-from-bottom-20 data-[state=open]:duration-300",
          "text-glass-foreground border-none bg-transparent shadow-none sm:max-w-md",
          "bg-secondary-darker/70",
        )}
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <EquipmentCubeSessionContext.Provider value={cubeSession}>
          <EnhancingContext.Provider
            value={{
              localData,
              setLocalData,
              selectedItemId,
              closeModal,
              poolData,
            }}
          >
            <RankUpMultiplier />
            <Enhancer />
          </EnhancingContext.Provider>
        </EquipmentCubeSessionContext.Provider>
      </DialogContent>
    </Dialog>
  );
}
