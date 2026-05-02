import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { proxy, useSnapshot } from "valtio";

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
import EquipCounter from "./EquipCounter";
import type { EquipmentApplicableEhmId } from "@/domains/equipment/equipment.type";
import RankUpMultiplier from "./RankUpMultiplier";

import { BaseEquipment } from "@/domains/equipment/BaseEquipment";
import { EnhancementFactory } from "@/domains/enhancement/EnhancementFactory";

type Props = {
  selectedEhmId: EquipmentApplicableEhmId | null;
  closeModal: () => void;
};

const EMPTY_PROXY = proxy({});

export default function EquipEnhancingDialog({
  selectedEhmId,
  closeModal,
}: Props) {
  const [localData, setLocalData] = useState<EquipmentInstance | null>(null);

  // 建立唯讀且響應式的快照，用於 UI 渲染
  const snap = useSnapshot(
    localData || (EMPTY_PROXY as any),
  ) as EquipmentInstance;

  const equipId = useActiveStore((s) =>
    s.activeState.activeType === "equipment" ? s.activeState.id : null,
  );

  // 1. 透過工廠建立領域物件 (BaseCube 或 SoulOrb)
  const item = useMemo(() => {
    if (!selectedEhmId) return null;
    return EnhancementFactory.create(selectedEhmId);
  }, [selectedEhmId]);

  // 2. 獲取潛能池 (由領域物件決定)
  const pools = useMemo(() => {
    if (!item || !localData) return null;
    return item.getPools(localData);
  }, [item, localData]);

  // 初始化裝備實例 (沙盒模式)
  useEffect(() => {
    if (selectedEhmId && equipId) {
      const storeItem = useEquipmentStore.getState().instanceMap[equipId];
      if (storeItem) {
        // 從 Store 中「克隆」出一份新的 Proxy，達成沙盒效果
        const sandboxItem = BaseEquipment.createProxy(storeItem);
        setLocalData(sandboxItem);
      }
    }
  }, [selectedEhmId, equipId]);

  const open = !!(selectedEhmId && equipId && localData && item && pools);

  if (!open) return null;

  return (
    <Dialog open={open}>
      <DialogContent
        className={cn(
          "data-[state=open]:zoom-in-100! data-[state=open]:slide-in-from-bottom-20 data-[state=open]:duration-300",
          "text-glass-foreground border-none bg-transparent shadow-none sm:max-w-md",
          "bg-secondary-darker/70",
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>

        <EnhancingContext.Provider
          value={{
            item,
            localData,
            snap,
            pools,
            closeModal,
            selectedEhmId,
          }}
        >
          <EquipCounter />
          <RankUpMultiplier />
          <Enhancer />
        </EnhancingContext.Provider>
      </DialogContent>
    </Dialog>
  );
}
