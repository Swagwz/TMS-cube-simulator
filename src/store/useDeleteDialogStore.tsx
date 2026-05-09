import type { WorkbenchEntityType } from "@/domains/enhancement/enhancement.type";
import { create } from "zustand";

type State = {
  targetId: string | null;
  targetType: WorkbenchEntityType | null;
};

type Actions = {
  openDeleteDialog: (id: string, type: WorkbenchEntityType) => void;
  closeDeleteDialog: () => void;
};

export const useDeleteDialogStore = create<State & Actions>((set) => ({
  targetId: null,
  targetType: null,
  openDeleteDialog: (id, type) => set({ targetId: id, targetType: type }),
  closeDeleteDialog: () => set({ targetId: null, targetType: null }),
}));
