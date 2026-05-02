import type { EquipmentApplicableEhmId } from "@/domains/equipment/equipment.type";
import type { EquipmentInstance } from "@/store/useEquipmentStore";
import { createContext, useContext } from "react";
import { BaseCube } from "@/domains/cube/BaseCube";
import { SoulOrb } from "@/domains/soul/SoulOrb";

/**
 * 強化項目的聯合型別
 */
export type EnhancementDomainItem = BaseCube | SoulOrb;

/**
 * EnhancingContext: 分享強化視窗內的狀態
 */
type EnhancingContextValue = {
  item: EnhancementDomainItem; // 領域模型實例 (Class)
  localData: EquipmentInstance; // 原始 Proxy (可變)
  snap: EquipmentInstance; // Valtio 快照 (響應式)
  pools: any; // 該道具對應的潛能池
  closeModal: () => void;
  selectedEhmId: EquipmentApplicableEhmId;
};

export const EnhancingContext = createContext<EnhancingContextValue | null>(
  null,
);

export const useEnhancingContext = () => {
  const context = useContext(EnhancingContext);
  if (!context) {
    throw new Error("useEnhancingContext must be used within EnhancingDialog");
  }
  return context;
};
