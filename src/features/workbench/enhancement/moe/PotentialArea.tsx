import { useMemo } from "react";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";
import useActiveItem from "@/hooks/useActiveItem";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";

export default function PotentialArea() {
  const activeItem = useActiveItem();

  if (!activeItem || activeItem.entity !== "moe") {
    return null;
  }

  const { potIds } = activeItem;

  const lines = useMemo(() => {
    return potIds.map((id) => ({
      id,
      text: MoeManager.getLine(id),
    }));
  }, [potIds]);

  return (
    <div className="bg-glass/50 grid justify-center gap-2 rounded-xl p-4">
      {lines.map(({ text, id }, i) => (
        <PotentialLineBadge key={`${id}-${i}`} text={text} />
      ))}
    </div>
  );
}
