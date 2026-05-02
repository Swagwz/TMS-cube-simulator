import { useEnhancingContext } from "@/contexts/useEnhancingContext";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import Counter from "../Counter";

export default function EquipCounter() {
  const { localData, selectedEhmId } = useEnhancingContext();

  if (!localData) {
    return null;
  }

  return (
    <Counter
      itemId={selectedEhmId}
      count={localData.statistics.counts[selectedEhmId] || 0}
      companions={CubeManager.getRelatedItems(selectedEhmId).map(({ id }) => ({
        itemId: id,
        count: localData.statistics.counts[id] || 0,
      }))}
    />
  );
}
