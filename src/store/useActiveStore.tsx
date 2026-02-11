import type { EhmSystemType } from "@/domains/enhancement/enhancement.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ActiveState =
  | { activeType: "moe"; id: string }
  | { activeType: "equipment"; id: string }
  | { activeType: null; id: null };

type State = {
  activeState: ActiveState;
};

type Actions = {
  toggleActive: (id: string, activeType: EhmSystemType) => void;
  clear: () => void;
  clearIfMatches: (id: string) => void;
};

export const useActiveStore = create<State & Actions>()(
  immer((set) => ({
    activeState: { activeType: null, id: null },

    toggleActive: (id, activeType) => {
      set((state) => {
        if (state.activeState.activeType && state.activeState.id === id) {
          state.activeState = { activeType: null, id: null };
          return;
        }

        state.activeState = { activeType, id };
      });
    },

    clear: () => {
      set((state) => {
        state.activeState = { activeType: null, id: null };
      });
    },

    clearIfMatches: (id) => {
      set((state) => {
        if (state.activeState.id === id) {
          state.activeState = { activeType: null, id: null };
        }
      });
    },
  })),
);
