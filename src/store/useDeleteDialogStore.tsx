import type { EhmSystemType } from "@/domains/enhancement/enhancement.type";
import { create } from "zustand";

type State = {
  targetId: string | null;
  targetType: EhmSystemType | null;
};

type Actions = {
  openDeleteDialog: (id: string, type: EhmSystemType) => void;
  closeDeleteDialog: () => void;
};

export const useDeleteDialogStore = create<State & Actions>((set) => ({
  targetId: null,
  targetType: null,
  openDeleteDialog: (id, type) => set({ targetId: id, targetType: type }),
  closeDeleteDialog: () => set({ targetId: null, targetType: null }),
}));
