import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import { EquipManager } from "@/domains/equipment/equipManager";
import type { EquipmentSubcategory } from "@/domains/equipment/equipment.type";
import { PotManager } from "@/domains/potential/potManager";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import ControllableTableHead, {
  type SortConfig,
  type SortDirection,
} from "@/components/ControllableTableHead";

function formatPotentialList(
  cube: CubeId,
  level: number,
  ...params: Parameters<typeof EquipManager.getRawPotentialList>
) {
  const [subcategory] = params;
  const noProbList = EquipManager.getRawPotentialList(...params).map((item) => {
    const meta = PotManager.getPotentialMetadata(item.id);
    return {
      ...meta,
      ...item,
      minLevel: meta.values[0].minLevel,
      weight: item.weights[cube] || 0,
      display: PotManager.resolvePotential(meta.id, level, subcategory).display,
    };
  });

  return noProbList.filter((item) => level >= item.minLevel);
}
type Props = {
  cube: CubeId;
  rank: EquipmentRank;
  level: number;
  subcategory: EquipmentSubcategory;
  lineProbabilities: number[];
};

type SortKey = "display" | "rankName" | "minLevel" | "weight" | "prob";

export default function PotentialProbTable({
  cube,
  rank,
  level,
  subcategory,
  lineProbabilities,
}: Props) {
  const [sortConfig, setSortConfig] = useState<SortConfig<SortKey>>({
    key: "rankName", // Default sort by rank -> display name
    direction: "desc",
  });
  const prevRank = PotManager.getPrev(rank);
  const feature = CubeManager.getItem(cube).apply;

  const primeList = formatPotentialList(
    cube,
    level,
    subcategory,
    rank,
    feature,
  );

  const nonPrimeList = formatPotentialList(
    cube,
    level,
    subcategory,
    prevRank,
    feature,
  );

  const primeTotalWeight = primeList.reduce(
    (sum, item) => sum + item.weight,
    0,
  );
  const processedPrimeList = primeList
    .filter((item) => item.weight > 0)
    .map((item) => ({
      ...item,
      rankName: PotManager.rankToZh(rank),
      lineProb: lineProbabilities[0],
      prob:
        primeTotalWeight > 0
          ? (item.weight / primeTotalWeight) * lineProbabilities[0]
          : 0,
    }));

  const nonPrimeTotalWeight = nonPrimeList.reduce(
    (sum, item) => sum + item.weight,
    0,
  );
  const processedNonPrimeList = nonPrimeList
    .filter((item) => item.weight > 0)
    .map((item) => ({
      ...item,
      rankName: PotManager.rankToZh(prevRank),
      lineProb: lineProbabilities[1],
      prob:
        nonPrimeTotalWeight > 0
          ? (item.weight / nonPrimeTotalWeight) * lineProbabilities[1]
          : 0,
    }));

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = "desc";
    // If clicking the same key, toggle direction. Otherwise, default to desc.
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedList = useMemo(() => {
    const list = [...processedPrimeList, ...processedNonPrimeList];

    if (sortConfig.key) {
      const key = sortConfig.key; // Capture the non-null key
      list.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        // Special handling for rank sorting
        if (key === "rankName") {
          aValue = PotManager.getIndex(a.rank);
          bValue = PotManager.getIndex(b.rank);
        } else if (key === "weight") {
          aValue = a.weight * a.lineProb;
          bValue = b.weight * b.lineProb;
        } else {
          aValue = a[key];
          bValue = b[key];
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Default sort: Rank (desc) -> Display Name (asc)
      list.sort((a, b) => {
        const rankIndexA = PotManager.getIndex(a.rank);
        const rankIndexB = PotManager.getIndex(b.rank);
        if (rankIndexA !== rankIndexB) {
          return rankIndexB - rankIndexA;
        }
        return a.display.localeCompare(b.display);
      });
    }
    return list;
  }, [processedPrimeList, processedNonPrimeList, sortConfig]);

  const totalScaledWeight = useMemo(() => {
    const primeTotal = processedPrimeList.reduce(
      (acc, data) => acc + data.lineProb * data.weight,
      0,
    );
    const nonPrimeTotal = processedNonPrimeList.reduce(
      (acc, data) => acc + data.lineProb * data.weight,
      0,
    );
    return (primeTotal + nonPrimeTotal) / 100;
  }, [processedPrimeList, processedNonPrimeList]);

  const totalProb = useMemo(
    () => sortedList.reduce((acc, curr) => acc + curr.prob, 0),
    [sortedList],
  );

  if (sortedList.length === 0) {
    return null;
  }

  return (
    <details className="mt-4">
      <summary className="text-muted-foreground cursor-pointer text-center text-sm">
        各潛能出現機率 (選擇該排)
      </summary>
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <ControllableTableHead
              sortKey="display"
              sortConfig={sortConfig}
              onSort={handleSort}
            >
              潛能
            </ControllableTableHead>
            <ControllableTableHead
              sortKey="rankName"
              sortConfig={sortConfig}
              onSort={handleSort}
            >
              階級
            </ControllableTableHead>
            <ControllableTableHead
              sortKey="minLevel"
              sortConfig={sortConfig}
              onSort={handleSort}
            >
              需求等級
            </ControllableTableHead>
            <ControllableTableHead
              sortKey="weight"
              sortConfig={sortConfig}
              onSort={handleSort}
            >
              權重
            </ControllableTableHead>
            <ControllableTableHead
              sortKey="prob"
              sortConfig={sortConfig}
              onSort={handleSort}
            >
              機率
            </ControllableTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedList.map((item) => (
            <TableRow key={`${item.id}-${item.rankName}`}>
              <TableCell>{item.display}</TableCell>
              <TableCell>{item.rankName}</TableCell>
              <TableCell>{item.minLevel}</TableCell>
              <TableCell>
                {item.weight}*{item.lineProb}%
              </TableCell>
              <TableCell>{item.prob.toFixed(4)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>總計</TableCell>
            <TableCell>{totalScaledWeight.toFixed(4)}</TableCell>
            <TableCell>{totalProb.toFixed(4)}%</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </details>
  );
}
