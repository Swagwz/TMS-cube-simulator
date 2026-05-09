import { useCallback, useState } from "react";
import useActiveItem from "@/hooks/useActiveItem";
import PotentialArea from "./PotentialArea";
import type { MoeCubeId } from "@/domains/enhancement/moe/moe.type";
import InfoPopover from "@/components/InfoPopover";
import MoeAvailableEhmList from "../availableEhmList/MoeAvailableEhmList";
import MoeEnhancingDialog from "@/features/enhancingDialog/moe/MoeEnhancingDialog";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";

export default function MoeEnhancement() {
  const [selected, setSelected] = useState<MoeCubeId | null>(null);
  const instanceData = useActiveItem();

  const toggleSelected = (id: MoeCubeId) => {
    setSelected(id === selected ? null : id);
  };

  const closeModal = useCallback(() => {
    setSelected(null);
  }, []);

  if (!instanceData || instanceData.entity !== "moe") {
    return null;
  }

  const selectedItem = selected
    ? MoeManager.getMoeCubeMetadata(selected)
    : null;

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* potential display */}
        <PotentialArea />

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
        <MoeAvailableEhmList selectedId={selected} onSelect={toggleSelected} />
      </div>
      <MoeEnhancingDialog selectedItemId={selected} closeModal={closeModal} />
    </>
  );
}
