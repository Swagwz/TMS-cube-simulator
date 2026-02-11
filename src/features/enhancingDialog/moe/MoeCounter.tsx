import { useMoeEnhancingContext } from "@/contexts/useMoeEnhancingContext";
import Counter from "../Counter";

export default function MoeCounter() {
  const { localData, selectedItemId } = useMoeEnhancingContext();

  return (
    <Counter
      itemId={selectedItemId}
      count={localData.statistics.counts[selectedItemId] || 0}
    />
  );
}
