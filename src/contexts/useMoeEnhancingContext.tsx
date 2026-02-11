import type { MoeInstance } from "@/store/useMoeStore";
import type { MoeCubeId } from "@/domains/enhancement/moe/moe.type";
import React, { createContext, useContext } from "react";

/**
 * Context for EnhancingDialog to share state across components
 */
type EnhancingContextValue = {
  selectedItemId: MoeCubeId;
  handleClose: () => void;
  localData: MoeInstance;
  setLocalData: React.Dispatch<React.SetStateAction<MoeInstance | null>>;
};

export const MoeEnhancingContext = createContext<EnhancingContextValue | null>(
  null,
);

export const useMoeEnhancingContext = () => {
  const context = useContext(MoeEnhancingContext);
  if (!context) {
    throw new Error(
      "useMoeEnhancingContext must be used within EnhancingDialog",
    );
  }
  return context;
};
