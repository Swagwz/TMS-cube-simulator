import { useActiveStore } from "@/store/useActiveStore";
import { useEquipmentStore } from "@/store/useEquipmentStore";
import { useMoeStore } from "@/store/useMoeStore";

export default function useActiveItem() {
  const { activeType, id } = useActiveStore((s) => s.activeState);

  const equipItem = useEquipmentStore((s) =>
    activeType === "equipment" && id ? s.instanceMap[id] : null,
  );

  const moeItem = useMoeStore((s) =>
    activeType === "moe" && id ? s.instanceMap[id] : null,
  );

  return equipItem ?? moeItem ?? null;
}
