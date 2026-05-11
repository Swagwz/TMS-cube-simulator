import type {
  EquipmentEnhancementItemId,
  EquipmentFeature,
} from "@/domains/equipment/equipment.type";
import useActiveItem from "@/hooks/useActiveItem";
import type { EquipmentInstance } from "@/store/useEquipmentStore";
import EquipAvailableEhmList from "../../availableEhmList/EquipAvailableEhmList";
import PotentialArea from "../PotentialArea";
import { getEquipmentEnhancementItemsForFeature } from "../equipmentEnhancementItems";

type Props = {
  feature: EquipmentFeature;
  onOpenDialog: (
    equipment: EquipmentInstance,
    itemId: EquipmentEnhancementItemId,
  ) => void;
};

export default function PotentialTab({ feature, onOpenDialog }: Props) {
  const instanceData = useActiveItem();

  if (!instanceData || instanceData.entity !== "equipment") {
    return null;
  }

  const items = getEquipmentEnhancementItemsForFeature(instanceData, feature);

  return (
    <div className="flex flex-col gap-4">
      <PotentialArea feature={feature} />
      <EquipAvailableEhmList
        items={items}
        onSelect={(itemId) => onOpenDialog(instanceData, itemId)}
      />
    </div>
  );
}
