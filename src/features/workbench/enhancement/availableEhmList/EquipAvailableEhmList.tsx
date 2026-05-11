import type { EquipmentEnhancementItemId } from "@/domains/equipment/equipment.type";
import type { EquipmentEnhancementListItem } from "../equipment/equipmentEnhancementItems";
import EhmCell from "./EhmCell";
import EhmGrid from "./EhmGrid";
import { cn } from "@/lib/utils";

type AvailableCubesListProps = {
  items: EquipmentEnhancementListItem[];
  onSelect: (id: EquipmentEnhancementItemId) => void;
};

export default function EquipAvailableEhmList({
  items,
  onSelect,
}: AvailableCubesListProps) {
  return (
    <EhmGrid>
      {items.map((item) => (
        <EhmCell
          key={item.id}
          name={item.name}
          imagePath={item.imagePath}
          count={item.count}
          onClick={() => !item.disabled && onSelect(item.id)}
          className={cn(
            "rounded-md border-2 border-transparent p-1",
            item.disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer transition-all",
          )}
        />
      ))}
    </EhmGrid>
  );
}
