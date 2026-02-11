import { useState } from "react";
import type {
  EquipmentApplicableEhmId,
  EquipmentFeature,
} from "@/domains/equipment/equipment.type";
import { EnhancementManager } from "@/domains/enhancement/enhancementManager";
import useActiveItem from "@/hooks/useActiveItem";
import PotentialArea from "../PotentialArea";
import EquipAvailableEhmList from "../../availableEhmList/EquipAvailableEhmList";
import InfoPopover from "@/components/InfoPopover";
import EquipEnhancingDialog from "@/features/enhancingDialog/equipment/EquipEnhancingDialog";

type Props = {
  feature: EquipmentFeature;
};

export default function PotentialTab({ feature }: Props) {
  const [selected, setSelected] = useState<EquipmentApplicableEhmId | null>(
    null,
  );
  const instanceData = useActiveItem();

  const closeModal = () => setSelected(null);

  const toggleSelected = (id: EquipmentApplicableEhmId) => {
    setSelected(id === selected ? null : id);
  };

  if (!instanceData || instanceData.entity !== "equipment") {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* potential display */}
        <PotentialArea feature={feature} />

        {/* selected name display */}
        <div className="bg-glass-light rounded-xl p-2 text-center">
          {selected ? (
            <p className="flex items-center justify-center">
              {EnhancementManager.getItem(selected).name}
              <InfoPopover>
                <p>{EnhancementManager.getItem(selected).description}</p>
              </InfoPopover>
            </p>
          ) : (
            <p>尚未選取</p>
          )}
        </div>

        {/* available enhancement list */}
        <EquipAvailableEhmList
          feature={feature}
          selectedId={selected}
          onSelect={toggleSelected}
        />
      </div>
      <EquipEnhancingDialog selectedEhmId={selected} closeModal={closeModal} />
    </>
  );
}
