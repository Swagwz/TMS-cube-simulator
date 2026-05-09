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
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import type { EquipmentEnhancementItemId } from "@/domains/equipment/equipment.type";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import RankUpMultiplier from "./RankUpMultiplier";

type Props = {
  selectedItemId: EquipmentEnhancementItemId | null;
  closeModal: () => void;
};

export default function EquipEnhancingDialog({
  selectedItemId,
  closeModal,
}: Props) {
  const [localData, setLocalData] = useState<EquipmentInstance | null>(null);

  const equipId = useActiveStore((s) =>
    s.activeState.activeType === "equipment" ? s.activeState.id : null,
  );

  const title = selectedItemId
    ? selectedItemId === "wuGongJewel"
      ? SoulManager.getItem(selectedItemId).name
      : CubeManager.getCubeItem(selectedItemId as CubeId).name
    : "";

  const poolData = useMemo(() => {
    if (!selectedItemId || !localData) return undefined;

    const { subcategory, level } = localData;

    if (selectedItemId === "wuGongJewel") {
      return {
        feature: "soul" as const,
        pools: SoulManager.getPotPool(),
      };
    }

    const cube = CubeManager.getCubeItem(selectedItemId as CubeId);

    switch (cube.apply) {
      case "mainPot":
      case "additionalPot":
        return {
          feature: cube.apply,
          pools: CubeManager.getCubePotentialPools(selectedItemId as CubeId, {
            subcategory,
            level,
          }),
        };
      default:
        return undefined;
    }
  }, [selectedItemId, localData?.level, localData?.subcategory]);

  // ?��???複製一份data
  useEffect(() => {
    // ?�選?�強?��??�以?��??��??��?�??��?localData
    if (selectedItemId && equipId) {
      setLocalData(
        structuredClone(useEquipmentStore.getState().instanceMap[equipId]),
      );
    }
  }, [selectedItemId, equipId]);

  const open = !!(selectedItemId && equipId && localData && poolData);

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
      </DialogContent>
    </Dialog>
  );
}
