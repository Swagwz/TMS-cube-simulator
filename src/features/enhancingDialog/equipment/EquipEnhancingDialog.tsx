import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EquipmentEnhancementSessionContext } from "@/contexts/useEquipmentEnhancementSessionContext";
import { useEquipmentEnhancementNavigator } from "@/hooks/useEquipmentEnhancementNavigator";
import type { EquipmentEnhancingDialogRequest } from "@/hooks/useEquipmentEnhancingDialog";
import { useEquipmentStore } from "@/store/useEquipmentStore";
import Enhancer from "./Enhancer";
import RankUpMultiplier from "./RankUpMultiplier";

type Props = {
  request: EquipmentEnhancingDialogRequest | null;
  closeModal: () => void;
};

export default function EquipEnhancingDialog({ request, closeModal }: Props) {
  const baseInstance = useEquipmentStore((s) =>
    request ? s.instanceMap[request.equipmentId] : null,
  );

  const navigator = useEquipmentEnhancementNavigator({
    request,
    baseInstance,
    closeModal,
  });

  const title = navigator
    ? navigator.kind === "soul"
      ? navigator.controller.soul.name
      : navigator.controller.cube.name
    : "";
  const open = !!(request && baseInstance && navigator);

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

        <EquipmentEnhancementSessionContext.Provider value={navigator}>
          <RankUpMultiplier />
          <Enhancer />
        </EquipmentEnhancementSessionContext.Provider>
      </DialogContent>
    </Dialog>
  );
}
