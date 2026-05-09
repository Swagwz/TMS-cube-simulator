import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { useActiveStore } from "./useActiveStore";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import type {
  EquipmentSubcategory,
  EquipmentPotentialSlot,
} from "@/domains/equipment/equipment.type";
import type {
  AdditionalCubeId,
  CubeCompanionItemId,
  MainCubeId,
} from "@/domains/enhancement/cube/cube.type";
import type { SoulId } from "@/domains/enhancement/soul/soul.type";

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
    counts: {
      mainPot: Partial<Record<MainCubeId | CubeCompanionItemId, number>>;
      additionalPot: Partial<Record<AdditionalCubeId, number>>;
      soul: Partial<Record<SoulId, number>>;
    };
  };
};

const createEmptyEquipmentStatistics = (): EquipmentInstance["statistics"] => ({
  counts: {
    mainPot: {},
    additionalPot: {},
    soul: {},
  },
});

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
    potType: EquipmentPotentialSlot,
    index: number,
    newPotId: string,
  ) => void;
  updatePotTier: (
    id: string,
    potType: EquipmentPotentialSlot,
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
        statistics: createEmptyEquipmentStatistics(),
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
          target.statistics = createEmptyEquipmentStatistics();
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

          target.statistics = createEmptyEquipmentStatistics();
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
