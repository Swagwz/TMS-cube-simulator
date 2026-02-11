import { useCallback, useState } from "react";
import useActiveItem from "@/hooks/useActiveItem";
import PotentialArea from "./PotentialArea";
import type { MoeCubeId } from "@/domains/enhancement/moe/moe.type";
import { EnhancementManager } from "@/domains/enhancement/enhancementManager";
import InfoPopover from "@/components/InfoPopover";
import MoeAvailableEhmList from "../availableEhmList/MoeAvailableEhmList";
import MoeEnhancingDialog from "@/features/enhancingDialog/moe/MoeEnhancingDialog";

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

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* potential display */}
        <PotentialArea />

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
        <MoeAvailableEhmList selectedId={selected} onSelect={toggleSelected} />
      </div>
      <MoeEnhancingDialog selectedItemId={selected} closeModal={closeModal} />
    </>
  );
}
