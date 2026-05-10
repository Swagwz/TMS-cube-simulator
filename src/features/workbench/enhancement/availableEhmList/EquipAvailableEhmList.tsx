import { useMemo } from "react";
import { cn } from "@/lib/utils";
import EhmGrid from "./EhmGrid";
import EhmCell from "./EhmCell";
import useActiveItem from "@/hooks/useActiveItem";
import type {
  EquipmentEnhancementItemId,
  EquipmentFeature,
} from "@/domains/equipment/equipment.type";
import { SOUL_LIST } from "@/domains/enhancement/soul/soul.config";
import type {
  AdditionalCubeId,
  CubeDefinition,
  MainCubeId,
} from "@/domains/enhancement/cube/cube.type";
import type { SoulItem } from "@/domains/enhancement/soul/soul.type";
import { getApplicableCubeDefinitions } from "@/domains/enhancement/cube/cube.registry";

type AvailableCubesListProps = {
  feature: EquipmentFeature;
  selectedId: EquipmentEnhancementItemId | null;
  onSelect: (id: EquipmentEnhancementItemId) => void;
};

export default function EquipAvailableEhmList({
  feature,
  selectedId,
  onSelect,
}: AvailableCubesListProps) {
  const activeItem = useActiveItem();

  const availableList: (CubeDefinition | SoulItem)[] = useMemo(() => {
    if (!activeItem || activeItem.entity !== "equipment") {
      return [];
    }

    switch (feature) {
      case "mainPot":
        return getApplicableCubeDefinitions("mainPot", activeItem.mainPot.tier);
      case "additionalPot":
        return getApplicableCubeDefinitions(
          "additionalPot",
          activeItem.additionalPot.tier,
        );
      case "soul":
        return SOUL_LIST;
    }
  }, [feature, activeItem]);

  if (!activeItem || activeItem.entity !== "equipment") {
    return null;
  }

  const getCount = (item: CubeDefinition | SoulItem) => {
    switch (item.apply) {
      case "mainPot":
        return activeItem.statistics.counts.mainPot[item.id as MainCubeId] || 0;
      case "additionalPot":
        return (
          activeItem.statistics.counts.additionalPot[
            item.id as AdditionalCubeId
          ] || 0
        );
      case "soul":
        return activeItem.statistics.counts.soul[item.id] || 0;
    }
  };

  return (
    <EhmGrid>
      {availableList.map((Ehm) => (
        <EhmCell
          key={Ehm.id}
          name={Ehm.name}
          imagePath={Ehm.imagePath}
          count={getCount(Ehm)}
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
