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
import { EnhancementManager } from "@/domains/enhancement/enhancementManager";
import { useActiveStore } from "@/store/useActiveStore";
import Enhancer from "./Enhancer";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import type { EquipmentApplicableEhmId } from "@/domains/equipment/equipment.type";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import RankUpMultiplier from "./RankUpMultiplier";

type Props = {
  selectedEhmId: EquipmentApplicableEhmId | null;
  closeModal: () => void;
};

export default function EquipEnhancingDialog({
  selectedEhmId,
  closeModal,
}: Props) {
  const [localData, setLocalData] = useState<EquipmentInstance | null>(null);

  const equipId = useActiveStore((s) =>
    s.activeState.activeType === "equipment" ? s.activeState.id : null,
  );

  const title = selectedEhmId
    ? EnhancementManager.getItem(selectedEhmId).name
    : "";

  const poolData = useMemo(() => {
    if (!selectedEhmId || !localData) return undefined;

    const meta = EnhancementManager.getItem(selectedEhmId);
    const { subcategory, level } = localData;

    switch (meta.apply) {
      case "mainPot":
      case "additionalPot":
        return {
          feature: meta.apply,
          pools: CubeManager.getCubePotentialPools(selectedEhmId as CubeId, {
            subcategory,
            level,
          }),
        };
      case "soul":
        // TODO: SoulManager implementation
        return {
          feature: "soul" as const,
          pools: SoulManager.getPotPool(),
        };
      default:
        return undefined;
    }
  }, [selectedEhmId, localData?.level, localData?.subcategory]);

  // 開啟時,複製一份data
  useEffect(() => {
    // 有選取強化道具以及裝備的情況下 才有localData
    if (selectedEhmId && equipId) {
      setLocalData(
        structuredClone(useEquipmentStore.getState().instanceMap[equipId]),
      );
    }
  }, [selectedEhmId, equipId]);

  const open = !!(selectedEhmId && equipId && localData && poolData);

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
            selectedEhmId,
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
