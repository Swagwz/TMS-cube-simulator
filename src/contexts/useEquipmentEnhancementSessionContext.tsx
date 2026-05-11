import { createContext, useContext } from "react";
import type { EquipmentPotentialSlot } from "@/domains/equipment/equipment.type";
import type { CubeDefinition } from "@/domains/enhancement/cube/cube.type";
import type {
  CubeRollOutput,
  CubeSession,
} from "@/domains/enhancement/cube/cubeSession.type";
import type {
  SoulRollOutput,
  SoulSession,
} from "@/domains/enhancement/soul/soulSession.type";
import type { SoulItem } from "@/domains/enhancement/soul/soul.type";
import type { EquipmentInstance } from "@/store/useEquipmentStore";

export type EquipmentCubeSessionController = {
  session: CubeSession<EquipmentInstance>;
  cube: CubeDefinition;
  slot: EquipmentPotentialSlot;
  working: EquipmentInstance;
  pendingRoll: CubeRollOutput | null;
  commitAndClose: () => void;
  rollDirectAndApply: () => void;
  rollRestore: (fixedIndex: number) => void;
  applyRestore: (side: "before" | "after") => void;
  rollHexa: () => void;
  applyHexa: (selectedIndices: [number, number, number]) => void;
  rollCombine: (targetIndex: number) => void;
  applyCombine: (applyRolledLine: boolean) => void;
  discardPendingRoll: () => void;
};

export type EquipmentSoulSessionController = {
  session: SoulSession<EquipmentInstance>;
  soul: SoulItem;
  working: EquipmentInstance;
  pendingRoll: SoulRollOutput | null;
  commitAndClose: () => void;
  rollSoulAndApply: () => void;
};

export type EquipmentEnhancementNavigatorResult =
  | {
      kind: "cube";
      workflow: CubeDefinition["workflow"];
      controller: EquipmentCubeSessionController;
    }
  | {
      kind: "soul";
      controller: EquipmentSoulSessionController;
    }
  | null;

export const EquipmentEnhancementSessionContext =
  createContext<EquipmentEnhancementNavigatorResult>(null);

export function useEquipmentEnhancementNavigator() {
  return useContext(EquipmentEnhancementSessionContext);
}

export function useRequiredCubeEnhancementController() {
  const navigator = useContext(EquipmentEnhancementSessionContext);
  if (!navigator || navigator.kind !== "cube") {
    throw new Error(
      "useRequiredCubeEnhancementController must be used within a cube enhancement session",
    );
  }
  return navigator.controller;
}

export function useRequiredSoulEnhancementController() {
  const navigator = useContext(EquipmentEnhancementSessionContext);
  if (!navigator || navigator.kind !== "soul") {
    throw new Error(
      "useRequiredSoulEnhancementController must be used within a soul enhancement session",
    );
  }
  return navigator.controller;
}
