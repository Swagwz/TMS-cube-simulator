import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useActiveStore } from "./useActiveStore";
import type { MoeCubeId } from "@/domains/enhancement/moe/moe.type";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";

type MoeStatus = { potIds: string[] };

export type MoeInstance = MoeStatus & {
  id: string;
  entity: "moe";
  subcategory: MoeCardSubcategory;

  _origin: MoeStatus;

  statistics: {
    counts: Partial<Record<MoeCubeId, number>>;
  };
};

export type MoeData = Omit<
  MoeInstance,
  "_origin" | "statistics" | "entity" | "id"
>;

type State = {
  instanceIds: string[];
  instanceMap: Record<string, MoeInstance>;
};

type Actions = {
  newInstance: (moeData: MoeData) => MoeInstance;
  getInstanceById: (id: string) => MoeInstance | undefined;
  deleteMoe: (targetId: string) => void;
  addMoe: (moe: MoeInstance) => void;
  zeroingCount: (id: string) => void;
  resetMoe: (id: string) => void;

  updateInstance: (id: string, changes: Partial<MoeData>) => void;
  updatePotLine: (id: string, index: number, newPotId: string) => void;

  syncInstance: (instance: MoeInstance) => void;
};

export const useMoeStore = create<State & Actions>()(
  immer((set, get) => ({
    instanceIds: [],
    instanceMap: {},
    newInstance: (moeData) => {
      const { potIds } = moeData;
      return {
        ...moeData,
        _origin: { potIds: structuredClone(potIds) }, // Clone array to prevent reference sharing
        statistics: {
          counts: {},
        },
        entity: "moe",
        id: crypto.randomUUID(),
      };
    },
    getInstanceById: (id) => {
      return get().instanceMap[id];
    },
    deleteMoe: (targetId) => {
      set((state) => {
        delete state.instanceMap[targetId];
        state.instanceIds = state.instanceIds.filter((id) => id !== targetId);

        useActiveStore.getState().clearIfMatches(targetId);
      });
    },
    addMoe: (moe) => {
      set((state) => {
        const { id } = moe;
        state.instanceMap[id] = moe;
        if (!state.instanceIds.includes(id)) {
          state.instanceIds.push(id);
        }
      });
    },
    zeroingCount: (id) => {
      set((state) => {
        const target = state.instanceMap[id];
        if (target) target.statistics.counts = {};
      });
    },
    resetMoe: (id) => {
      set((state) => {
        const target = state.instanceMap[id];
        if (target) {
          target.potIds = structuredClone(target._origin.potIds); // Clone back from origin
          target.statistics.counts = {};
        }
      });
    },
    updateInstance: (id, changes) => {
      set((state) => {
        const target = state.instanceMap[id];
        if (target) Object.assign(target, changes);
      });
    },
    updatePotLine: (id, index, newPotId) => {
      set((state) => {
        const target = state.instanceMap[id];
        if (target) {
          target.potIds[index] = newPotId;
        }
      });
    },
    syncInstance: (inst) => {
      set((state) => {
        state.instanceMap[inst.id] = inst;
      });
    },
  })),
);
