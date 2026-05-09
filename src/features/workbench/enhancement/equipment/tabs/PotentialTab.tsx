import { useState } from "react";
import type {
  EquipmentEnhancementItemId,
  EquipmentFeature,
} from "@/domains/equipment/equipment.type";
import useActiveItem from "@/hooks/useActiveItem";
import PotentialArea from "../PotentialArea";
import EquipAvailableEhmList from "../../availableEhmList/EquipAvailableEhmList";
import InfoPopover from "@/components/InfoPopover";
import EquipEnhancingDialog from "@/features/enhancingDialog/equipment/EquipEnhancingDialog";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";

type Props = {
  feature: EquipmentFeature;
};

export default function PotentialTab({ feature }: Props) {
  const [selected, setSelected] = useState<EquipmentEnhancementItemId | null>(
    null,
  );
  const instanceData = useActiveItem();

  const closeModal = () => setSelected(null);

  const toggleSelected = (id: EquipmentEnhancementItemId) => {
    setSelected(id === selected ? null : id);
  };

  if (!instanceData || instanceData.entity !== "equipment") {
    return null;
  }

  const selectedItem = selected
    ? selected === "wuGongJewel"
      ? SoulManager.getItem(selected)
      : CubeManager.getCubeItem(selected as CubeId)
    : null;

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* potential display */}
        <PotentialArea feature={feature} />

        {/* selected name display */}
        <div className="bg-glass-light rounded-xl p-2 text-center">
          {selectedItem ? (
            <p className="flex items-center justify-center">
              {selectedItem.name}
              <InfoPopover>
                <p>{selectedItem.description}</p>
              </InfoPopover>
            </p>
          ) : (
            <p>尚未?��?</p>
          )}
        </div>

        {/* available enhancement list */}
        <EquipAvailableEhmList
          feature={feature}
          selectedId={selected}
          onSelect={toggleSelected}
        />
      </div>
      <EquipEnhancingDialog selectedItemId={selected} closeModal={closeModal} />
    </>
  );
}
