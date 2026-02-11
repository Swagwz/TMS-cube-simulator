import { useMemo } from "react";
import { cn } from "@/lib/utils";
import EhmGrid from "./EhmGrid";
import EhmCell from "./EhmCell";
import type { EhmMetadata } from "@/domains/enhancement/enhancement.type";
import useActiveItem from "@/hooks/useActiveItem";
import type {
  EquipmentApplicableEhmId,
  EquipmentFeature,
} from "@/domains/equipment/equipment.type";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import { SOUL_LIST } from "@/domains/enhancement/soul/soul.config";

type AvailableCubesListProps = {
  feature: EquipmentFeature;
  selectedId: EquipmentApplicableEhmId | null;
  onSelect: (id: EquipmentApplicableEhmId) => void;
};

export default function EquipAvailableEhmList({
  feature,
  selectedId,
  onSelect,
}: AvailableCubesListProps) {
  const activeItem = useActiveItem();

  if (!activeItem || activeItem.entity !== "equipment") {
    return null;
  }

  const availableList: EhmMetadata[] = useMemo(() => {
    switch (feature) {
      case "mainPot":
        return CubeManager.getApplicableCubes(
          "mainPot",
          activeItem.mainPot.tier,
        );
      case "additionalPot":
        return CubeManager.getApplicableCubes(
          "additionalPot",
          activeItem.additionalPot.tier,
        );
      case "soul":
        return SOUL_LIST;
    }
  }, [feature, activeItem]);

  const countMap = activeItem.statistics.counts as Record<string, number>;

  return (
    <EhmGrid>
      {availableList.map((Ehm) => (
        <EhmCell
          key={Ehm.id}
          item={Ehm}
          count={countMap[Ehm.id] || 0}
          onClick={() => onSelect(Ehm.id as EquipmentApplicableEhmId)}
          className={cn(
            "cursor-pointer rounded-md border-2 border-transparent p-1 transition-all",
          )}
          isSelected={selectedId === Ehm.id}
        />
      ))}
    </EhmGrid>
  );
}
