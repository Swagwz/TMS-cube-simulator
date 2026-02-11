import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { useActiveStore } from "./useActiveStore";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import type {
  EquipmentApplicableEhmId,
  EquipmentSubcategory,
  PotentialFeature,
} from "@/domains/equipment/equipment.type";
import type { RelationItemId } from "@/domains/enhancement/cube/cube.type";

type PotentialGroup = {
  tier: EquipmentRank;
  potIds: string[];
};

type EquipmentStatus = {
  mainPot: PotentialGroup;
  additionalPot: PotentialGroup;
  soul: string | null;
};

export type EquipmentInstance = EquipmentStatus & {
  id: string;
  entity: "equipment";
  subcategory: EquipmentSubcategory;
  level: number;

  _origin: EquipmentStatus;

  statistics: {
    counts: Partial<Record<EquipmentApplicableEhmId | RelationItemId, number>>;
  };
};

export type EquipData = Omit<
  EquipmentInstance,
  "_origin" | "statistics" | "entity" | "id"
>;

type State = {
  instanceIds: string[];
  instanceMap: Record<string, EquipmentInstance>;
};

type Actions = {
  getInstanceById: (id: string) => EquipmentInstance | undefined;
  newInstance: (equipData: EquipData) => EquipmentInstance;
  deleteEquipment: (id: string) => void;
  addEquipment: (item: EquipmentInstance) => void;
  zeroingCount: (id: string) => void;
  resetEquipment: (id: string) => void;

  updateInstance: (id: string, changes: Partial<EquipData>) => void;
  updatePotLine: (
    id: string,
    potType: PotentialFeature,
    index: number,
    newPotId: string,
  ) => void;
  updatePotTier: (
    id: string,
    potType: PotentialFeature,
    tier: EquipmentRank,
  ) => void;
  syncInstance: (instance: EquipmentInstance) => void;
};

export const useEquipmentStore = create<State & Actions>()(
  immer((set, get) => ({
    instanceIds: [],
    instanceMap: {},
    newInstance: (equipData) => {
      const { mainPot, additionalPot } = equipData;

      let { soul } = equipData;
      soul = soul || null; // 若soul為"" 改為null
      const origin = structuredClone({ mainPot, additionalPot, soul }); // Deep clone for safety

      const eqpInst: EquipmentInstance = {
        ...equipData,
        soul,
        _origin: origin,
        statistics: {
          counts: {},
        },
        entity: "equipment",
        id: crypto.randomUUID(),
      };
      return eqpInst;
    },
    getInstanceById: (id) => {
      return get().instanceMap[id];
    },
    deleteEquipment: (targetId) => {
      set((state) => {
        delete state.instanceMap[targetId];
        state.instanceIds = state.instanceIds.filter((id) => id !== targetId);

        useActiveStore.getState().clearIfMatches(targetId);
      });
    },
    addEquipment: (item) => {
      set((state) => {
        const { id } = item;
        state.instanceMap[id] = item;
        if (!state.instanceIds.includes(id)) {
          state.instanceIds.push(id);
        }
      });
    },
    zeroingCount: (id) => {
      set((state) => {
        const target = state.instanceMap[id];
        if (target) {
          target.statistics = { counts: {} };
        }
      });
    },
    resetEquipment: (id) => {
      set((state) => {
        const target = state.instanceMap[id];
        if (target) {
          target.mainPot = structuredClone(target._origin.mainPot);
          target.additionalPot = structuredClone(target._origin.additionalPot);
          target.soul = target._origin.soul;

          target.statistics = { counts: {} };
        }
      });
    },
    updateInstance: (id, changes) => {
      set((state) => {
        const target = state.instanceMap[id];
        if (target) Object.assign(target, changes);
      });
    },
    updatePotLine: (id, potType, index, newPotId) => {
      set((state) => {
        const target = state.instanceMap[id];
        if (target) {
          target[potType].potIds[index] = newPotId;
        }
      });
    },
    updatePotTier: (id, potType, tier) => {
      set((state) => {
        const target = state.instanceMap[id];
        if (target) {
          target[potType].tier = tier;
        }
      });
    },
    syncInstance: (instance) => {
      set((state) => {
        state.instanceMap[instance.id] = instance;
      });
    },
  })),
);
