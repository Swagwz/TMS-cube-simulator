import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { proxy } from "valtio";

import { useActiveStore } from "./useActiveStore";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import type {
  EquipmentSubcategory,
  PotentialFeature,
} from "@/domains/equipment/equipment.type";
import {
  BaseEquipment,
  type PotentialGroup,
} from "@/domains/equipment/BaseEquipment";

// 使用 Valtio 的 proxy 型別作為 Store 存儲對象
export type ProxiedEnhancementItem = ReturnType<typeof proxy<BaseEquipment>>;

// 為了相容性，保留 EquipmentInstance 型別別名
export type EquipmentInstance = ProxiedEnhancementItem;

export interface EquipData {
  subcategory: EquipmentSubcategory;
  level: number;
  mainPot: PotentialGroup;
  additionalPot: PotentialGroup;
  soul: string | null;
}

type State = {
  instanceIds: string[];
  instanceMap: Record<string, ProxiedEnhancementItem>;
};

type Actions = {
  getInstanceById: (id: string) => ProxiedEnhancementItem | undefined;
  newInstance: (equipData: EquipData) => ProxiedEnhancementItem;
  deleteEquipment: (id: string) => void;
  addEquipment: (item: ProxiedEnhancementItem) => void;
  zeroingCount: (id: string) => void;
  resetEquipment: (id: string) => void;

  // 下面這些會逐漸被 Class Method 取代，暫時保留以維持相容性
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
  syncInstance: (instance: ProxiedEnhancementItem) => void;
};

export const useEquipmentStore = create<State & Actions>()(
  subscribeWithSelector((set, get) => ({
    instanceIds: [],
    instanceMap: {},

    newInstance: (equipData) => {
      // 透過 Class Method 建立 Proxy
      const item = BaseEquipment.createProxy(equipData);
      return item;
    },

    getInstanceById: (id) => {
      return get().instanceMap[id];
    },

    deleteEquipment: (targetId) => {
      const { [targetId]: _, ...restMap } = get().instanceMap;
      set({
        instanceMap: restMap,
        instanceIds: get().instanceIds.filter((id) => id !== targetId),
      });
      useActiveStore.getState().clearIfMatches(targetId);
    },

    addEquipment: (item) => {
      set((state) => ({
        instanceMap: { ...state.instanceMap, [item.id]: item },
        instanceIds: state.instanceIds.includes(item.id)
          ? state.instanceIds
          : [...state.instanceIds, item.id],
      }));
    },

    zeroingCount: (id) => {
      const item = get().instanceMap[id];
      if (item) {
        item.clearStatistics(); // 使用 Class Method
      }
    },

    resetEquipment: (id) => {
      const item = get().instanceMap[id];
      if (item) {
        item.reset(); // 使用 Class Method
      }
    },

    // 暫時保留的 Legacy Actions
    updateInstance: (id, changes) => {
      const item = get().instanceMap[id];
      if (item) {
        Object.assign(item, changes);
      }
    },

    updatePotLine: (id, potType, index, newPotId) => {
      const item = get().instanceMap[id];
      if (item) {
        item[potType].potIds[index] = newPotId;
      }
    },

    updatePotTier: (id, potType, tier) => {
      const item = get().instanceMap[id];
      if (item) {
        item[potType].tier = tier;
      }
    },

    syncInstance: (instance) => {
      set((state) => ({
        instanceMap: { ...state.instanceMap, [instance.id]: instance },
      }));
    },
  })),
);
