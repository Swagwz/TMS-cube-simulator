import useActiveItem from "@/hooks/useActiveItem";
import EhmGrid from "./EhmGrid";
import MonoCounter from "./MonoCounter";
import { MOE_CUBE_LIST } from "@/domains/enhancement/moe/moe.config";
import type { MoeCubeId } from "@/domains/enhancement/moe/moe.type";
import { cn } from "@/lib/utils";

type Props = {
  selectedId: MoeCubeId | null;
  onSelect: (id: MoeCubeId) => void;
};

export default function MoeAvailableEhmList({ selectedId, onSelect }: Props) {
  const activeItem = useActiveItem();

  if (!activeItem || activeItem.entity !== "moe") {
    return null;
  }

  const countMap = activeItem.statistics.counts as Record<string, number>;

  return (
    <EhmGrid>
      {MOE_CUBE_LIST.map((Ehm) => (
        <MonoCounter
          key={Ehm.id}
          item={Ehm}
          count={countMap[Ehm.id] || 0}
          onClick={() => onSelect(Ehm.id)}
          className={cn(
            "cursor-pointer rounded-md border-2 border-transparent p-1 transition-all",
          )}
          isSelected={selectedId === Ehm.id}
        />
      ))}
    </EhmGrid>
  );
}
