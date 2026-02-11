import { useActiveStore } from "@/store/useActiveStore";
import EmptyDetail from "./EmptyDetail";
import MoeDetail from "./moe/MoeDetail";
import EquipmentDetail from "./equipment/EquipmentDetail";

export default function Detail() {
  const activeType = useActiveStore((s) => s.activeState.activeType);
  switch (activeType) {
    case "moe":
      return <MoeDetail />;
    case "equipment":
      return <EquipmentDetail />;
    default:
      return <EmptyDetail />;
  }
}
