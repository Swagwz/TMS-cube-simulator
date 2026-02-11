import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMoeStore, type MoeInstance } from "@/store/useMoeStore";

import { EnhancementManager } from "@/domains/enhancement/enhancementManager";
import { useActiveStore } from "@/store/useActiveStore";
import { MoeEnhancingContext } from "@/contexts/useMoeEnhancingContext";
import MoeEnhancer from "./MoeEnhancer";
import type { MoeCubeId } from "@/domains/enhancement/moe/moe.type";

type Props = {
  selectedItemId: MoeCubeId | null;
  closeModal: () => void;
};

export default function MoeEnhancingDialog({
  selectedItemId,
  closeModal,
}: Props) {
  const [localData, setLocalData] = useState<MoeInstance | null>(null);
  const moeCardId = useActiveStore((s) =>
    s.activeState.activeType === "moe" ? s.activeState.id : null,
  );

  const open = !!(selectedItemId && localData);

  const handleClose = useCallback(() => {
    if (!localData) return;
    useMoeStore.getState().syncInstance(localData);
    closeModal();
  }, [localData, closeModal]);

  // 開啟時,複製一份data
  useEffect(() => {
    if (selectedItemId && moeCardId) {
      const instance = structuredClone(
        useMoeStore.getState().instanceMap[moeCardId],
      );
      setLocalData(structuredClone(instance));
    }
  }, [selectedItemId, moeCardId]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={closeModal}>
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
          <DialogTitle>
            {EnhancementManager.getItem(selectedItemId).name}
          </DialogTitle>
        </DialogHeader>

        <MoeEnhancingContext.Provider
          value={{
            localData,
            setLocalData,
            selectedItemId,
            handleClose,
          }}
        >
          <MoeEnhancer />
        </MoeEnhancingContext.Provider>
      </DialogContent>
    </Dialog>
  );
}
