import { createContext, useContext } from "react";
import type { EquipmentPotentialSlot } from "@/domains/equipment/equipment.type";
import type { CubeDefinition } from "@/domains/enhancement/cube/cube.type";
import type {
  CubeRollOutput,
  CubeSession,
} from "@/domains/enhancement/cube/cubeSession.type";
import type { EquipmentInstance } from "@/store/useEquipmentStore";

export type EquipmentCubeSessionController = {
  session: CubeSession<EquipmentInstance>;
  cube: CubeDefinition;
  slot: EquipmentPotentialSlot;
  working: EquipmentInstance;
  pendingRoll: CubeRollOutput | null;
  commitAndClose: () => void;
  rollDirectAndApply: () => void;
};

export const EquipmentCubeSessionContext =
  createContext<EquipmentCubeSessionController | null>(null);

export function useOptionalEquipmentCubeSession() {
  return useContext(EquipmentCubeSessionContext);
}

export function useEquipmentCubeSessionContext() {
  const context = useContext(EquipmentCubeSessionContext);
  if (!context) {
    throw new Error(
      "useEquipmentCubeSessionContext must be used within EquipmentCubeSessionContext",
    );
  }
  return context;
}
