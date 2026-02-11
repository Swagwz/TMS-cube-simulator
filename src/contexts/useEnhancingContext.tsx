import type {
  EquipmentApplicableEhmId,
  PotentialFeature,
} from "@/domains/equipment/equipment.type";
import type { PotentialRank } from "@/domains/potential/potential.type";
import type { EquipmentInstance } from "@/store/useEquipmentStore";
import React, { createContext, useContext } from "react";

/**
 * Context for EnhancingDialog to share state across components
 */
type EnhancingContextValue = {
  selectedEhmId: EquipmentApplicableEhmId;
  closeModal: () => void;
  poolData:
    | {
        feature: PotentialFeature;
        pools: Record<PotentialRank, { id: string; weight: number }[]>;
      }
    | {
        feature: "soul";
        pools: { id: string; weight: number }[];
      };
  localData: EquipmentInstance;
  setLocalData: React.Dispatch<React.SetStateAction<EquipmentInstance | null>>;
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
