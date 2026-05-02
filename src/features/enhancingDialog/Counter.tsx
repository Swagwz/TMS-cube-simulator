import type { CompanionItemId } from "@/domains/cube/type";
import MonoCounter from "../workbench/enhancement/availableEhmList/MonoCounter";
import { EnhancementManager } from "@/domains/enhancement/enhancementManager";
import type { EnhancementItemId } from "@/domains/shared/types";

type Props = {
  itemId: Exclude<EnhancementItemId, CompanionItemId>;
  count: number;
  companions: {
    itemId: CompanionItemId;
    count: number;
  }[];
};

export default function Counter({ itemId, count, companions }: Props) {
  return (
    <div className="bg-glass-lighter flex flex-row gap-2 rounded-lg p-2">
      <MonoCounter item={EnhancementManager.getItem(itemId)} count={count} />
      {companions.map((related) => (
        <MonoCounter
          key={related.itemId}
          item={EnhancementManager.getItem(related.itemId)}
          count={related.count}
        />
      ))}
    </div>
  );
}
