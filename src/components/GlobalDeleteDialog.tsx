import { useDeleteDialogStore } from "@/store/useDeleteDialogStore";
import { useEquipmentStore } from "@/store/useEquipmentStore";
import { useMoeStore } from "@/store/useMoeStore";
import ConfirmModal from "@/components/ConfirmModal";
import type { EhmSystemType } from "@/domains/enhancement/enhancement.type";

const DIALOG_CONFIG: Record<
  EhmSystemType,
  { title: string; description: string; deleteFn: (id: string) => void }
> = {
  equipment: {
    title: "刪除裝備",
    description: "確定要刪除此裝備嗎？",
    deleteFn: useEquipmentStore.getState().deleteEquipment,
  },
  moe: {
    title: "刪除萌獸",
    description: "確定要刪除此萌獸嗎？",
    deleteFn: useMoeStore.getState().deleteMoe,
  },
};

export default function GlobalDeleteDialog() {
  const { targetId, targetType, closeDeleteDialog } = useDeleteDialogStore();
  const isOpen = !!targetId;

  const handleConfirm = () => {
    if (!targetId || !targetType) return;

    DIALOG_CONFIG[targetType].deleteFn(targetId);
    closeDeleteDialog();
  };

  const { title, description } = targetType
    ? DIALOG_CONFIG[targetType]
    : { title: "", description: "" };

  return (
    <ConfirmModal
      open={isOpen}
      onOpenChange={(open) => !open && closeDeleteDialog()}
      title={title}
      description={description}
      onConfirm={handleConfirm}
    />
  );
}
