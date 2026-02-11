import { useEquipmentStore } from "@/store/useEquipmentStore";

import { EquipmentTable } from "./EquipmentTable";
import EmptyList from "../EmptyList";

export default function EquipmentList() {
  const isEmpty = useEquipmentStore((s) => s.instanceIds.length === 0);

  if (isEmpty) return <EmptyList type="equipment" />;
  return <EquipmentTable />;
}
