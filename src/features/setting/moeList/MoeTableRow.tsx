import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";

import { useActiveStore } from "@/store/useActiveStore";
import { useMoeStore } from "@/store/useMoeStore";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";
import MoeItemMenu from "../MoeItemMenu";

type Props = {
  index: number;
  id: string;
};

export default function MoeTableRow({ index, id }: Props) {
  const item = useMoeStore((s) => s.getInstanceById(id));
  const toggleActive = useActiveStore((s) => s.toggleActive);
  const isActive = useActiveStore((s) => s.activeState.id === id);

  const handleClick = () => toggleActive(id, "moe");

  if (!item) return null;

  const { subcategory, potIds } = item;
  const cardType = MoeManager.getCardMetadata(subcategory).name;
  const summaryText = MoeManager.getSummary(potIds);

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
      <TableCell className="truncate font-medium">{cardType}</TableCell>
      <TableCell>{summaryText}</TableCell>
      <TableCell
        className="flex cursor-auto items-center justify-end"
        onClick={(e) => e.stopPropagation()}
      >
        <MoeItemMenu id={id} />
      </TableCell>
    </TableRow>
  );
}
