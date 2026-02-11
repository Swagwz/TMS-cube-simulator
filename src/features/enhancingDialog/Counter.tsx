import type { EhmId } from "@/domains/enhancement/enhancement.type";
import EhmCell from "../workbench/enhancement/availableEhmList/EhmCell";
import { EnhancementManager } from "@/domains/enhancement/enhancementManager";

type Props = {
  itemId: EhmId;
  count: number;
  relatedItems?: { itemId: EhmId; count: number }[];
};

export default function Counter({ itemId, count, relatedItems }: Props) {
  return (
    <div className="bg-glass-lighter flex flex-row gap-2 rounded-lg p-2">
      <EhmCell item={EnhancementManager.getItem(itemId)} count={count} />
      {relatedItems &&
        relatedItems.map((related) => (
          <EhmCell
            key={related.itemId}
            item={EnhancementManager.getItem(related.itemId)}
            count={related.count}
          />
        ))}
    </div>
  );
}
