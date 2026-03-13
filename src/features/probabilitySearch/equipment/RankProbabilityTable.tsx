import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import { cn } from "@/lib/utils";

type Props = {
  rank: EquipmentRank;
  cube: CubeId;
  selectedLine: number;
  onLineSelect: (index: number) => void;
};

export default function RankProbabilityTable({
  rank,
  cube,
  selectedLine,
  onLineSelect,
}: Props) {
  const lineRankArr = CubeManager.getItem(cube).lineRank[rank] || [];

  if (!lineRankArr.length)
    return <div className="title-error">此方塊不能套用該潛能階級</div>;

  return (
    <details className="mt-4">
      <summary className="text-muted-foreground cursor-pointer text-center text-sm">
        各排潛能階級機率
      </summary>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>同階級機率</TableHead>
            <TableHead>下一階級機率</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lineRankArr.map(([primeWeight, nonPrimeWeight], slotIndex) => (
            <TableRow
              key={slotIndex}
              onClick={() => onLineSelect(slotIndex)}
              className={cn(
                "cursor-pointer",
                selectedLine === slotIndex && "bg-primary/10",
              )}
            >
              <TableCell>第{slotIndex + 1}排</TableCell>
              <TableCell>{primeWeight}%</TableCell>
              <TableCell>{nonPrimeWeight}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </details>
  );
}
