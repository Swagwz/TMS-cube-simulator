import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { EquipmentRank } from "@/domains/potential/potential.type";

type ShinyPity = Record<Exclude<EquipmentRank, "legendary">, number>;

type State = {
  shinyPity: ShinyPity;
  rankUpMultiplier: number;
  userConfig: Record<string, any>;
};

type Actions = {
  incrementShinyPity: (rank: Exclude<EquipmentRank, "legendary">) => void;
  resetShinyPity: (rank: Exclude<EquipmentRank, "legendary">) => void;
  setRankUpMultiplier: (rate: number) => void;
  setShowRankUpProb: (value: boolean) => void;
};

export const useAccountStore = create<State & Actions>()(
  immer((set) => ({
    shinyPity: {
      rare: 0,
      epic: 0,
      unique: 0,
    },
    userConfig: {
      showRankUpProb: true,
    },
    rankUpMultiplier: 1,
    incrementShinyPity: (rank) =>
      set((state) => {
        state.shinyPity[rank] = (state.shinyPity[rank] || 0) + 1;
      }),
    resetShinyPity: (rank) =>
      set((state) => {
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
