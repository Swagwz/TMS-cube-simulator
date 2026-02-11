import { memo } from "react";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";

import { EquipManager } from "@/domains/equipment/equipManager";
import { useActiveStore } from "@/store/useActiveStore";
import { useEquipmentStore } from "@/store/useEquipmentStore";
import RankBadge from "@/components/potential/RankBadge";
import EquipmentItemMenu from "../EquipmentItemMenu";

type Props = {
  id: string;
  index: number;
};

function EquipTableRow({ id, index }: Props) {
  const item = useEquipmentStore((s) => s.getInstanceById(id));
  const toggleActive = useActiveStore((s) => s.toggleActive);
  const isActive = useActiveStore((s) => s.activeState.id === id);

  const handleClick = () => toggleActive(id, "equipment");

  if (!item) return null;

  const { subcategory, level, mainPot, additionalPot } = item;
  const equipmentName = EquipManager.getEquipmentMetadata(subcategory).name;

  return (
    <TableRow
      className={cn(
        "text-primary-lightest-foreground bg-primary-lightest cursor-pointer",
        "hover:bg-accent-light hover:text-accent-light-foreground",
        isActive &&
          "bg-accent-main text-accent-main-foreground hover:bg-accent-dark hover:text-accent-dark-foreground",
      )}
      onClick={handleClick}
    >
      <TableCell className="font-mono">{index + 1}</TableCell>
      <TableCell className="truncate font-medium">{equipmentName}</TableCell>
      <TableCell className="font-mono">{level}</TableCell>
      <TableCell>
        <div className="flex flex-row gap-2">
          <RankBadge rank={mainPot.tier} />
          <RankBadge rank={additionalPot.tier} />
        </div>
      </TableCell>
      <TableCell
        className="flex cursor-auto items-center justify-end"
        onClick={(e) => e.stopPropagation()}
      >
        <EquipmentItemMenu id={id} />
      </TableCell>
    </TableRow>
  );
}

export default memo(EquipTableRow);
