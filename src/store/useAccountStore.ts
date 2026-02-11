import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { EquipmentRank } from "@/domains/potential/potential.type";

type State = {
  shinyPity: Record<EquipmentRank, number>;
  rankUpMultiplier: number;
  userConfig: Record<string, any>;
};

type Actions = {
  incrementShinyPity: (rank: EquipmentRank) => void;
  resetShinyPity: (rank: EquipmentRank) => void;
  setRankUpMultiplier: (rate: number) => void;
  setShowRankUpProb: (value: boolean) => void;
};

export const useAccountStore = create<State & Actions>()(
  immer((set) => ({
    shinyPity: {
      rare: 0,
      epic: 0,
      unique: 0,
      legendary: 0,
    },
    userConfig: {
      showRankUpProb: true,
    },
    rankUpMultiplier: 1,
    incrementShinyPity: (rank) =>
      set((state) => {
        if (rank === "legendary") return;
        state.shinyPity[rank] = (state.shinyPity[rank] || 0) + 1;
      }),
    resetShinyPity: (rank) =>
      set((state) => {
        if (rank === "legendary") return;
        state.shinyPity[rank] = 0;
      }),
    setRankUpMultiplier: (rate) =>
      set((state) => {
        state.rankUpMultiplier = rate;
      }),
    setShowRankUpProb: (value) =>
      set((state) => {
        state.userConfig.showRankUpProb = value;
      }),
  })),
);
