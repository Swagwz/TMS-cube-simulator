import { useActiveStore } from "@/store/useActiveStore";
import EquipEnhancement from "./equipment/EquipEnhancement";
import MoeEnhancement from "./moe/MoeEnhancement";

export default function Enhancement() {
  const activeType = useActiveStore((s) => s.activeState.activeType);
  switch (activeType) {
    case "moe":
      return <MoeEnhancement />;
    case "equipment":
      return <EquipEnhancement />;
    default:
      return null;
  }
}
