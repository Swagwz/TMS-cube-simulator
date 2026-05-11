import { useMemo, useState } from "react";
import ControllableTableHead, {
  type SortConfig,
  type SortDirection,
} from "@/components/ControllableTableHead";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";

type SortKey = "display" | "weight" | "prob";

type FormData = {
  level: number;
};

export default function SoulProbTable({ level }: FormData) {
  const [sortConfig, setSortConfig] = useState<SortConfig<SortKey>>({
    key: "prob",
    direction: "desc",
  });
  const data = useMemo(() => {
    const pool = SoulManager.getPotPool();
    return pool.map((item) => ({
      ...item,
      display: SoulManager.getLine(item.id, level),
    }));
  }, [level]);

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedList = useMemo(() => {
    const list = [...data];
    if (sortConfig.key) {
      const key = sortConfig.key;
      list.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
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
    }
    return list;
  }, [data, sortConfig]);

  const totalWeight = useMemo(
    () => data.reduce((acc, curr) => acc + curr.weight, 0),
    [data],
  );
  const totalProb = useMemo(
    () => data.reduce((acc, curr) => acc + curr.prob, 0),
    [data],
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <ControllableTableHead
            sortKey="display"
            sortConfig={sortConfig}
            onSort={handleSort}
          >
            {"\u6f5b\u80fd"}
          </ControllableTableHead>
          <ControllableTableHead
            sortKey="weight"
            sortConfig={sortConfig}
            onSort={handleSort}
          >
            {"\u6b0a\u91cd"}
          </ControllableTableHead>
          <ControllableTableHead
            sortKey="prob"
            sortConfig={sortConfig}
            onSort={handleSort}
          >
            {"\u6a5f\u7387"}
          </ControllableTableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedList.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.display}</TableCell>
            <TableCell>{item.weight}</TableCell>
            <TableCell>{item.prob.toFixed(4)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>{"\u7e3d\u8a08"}</TableCell>
          <TableCell>{totalWeight}</TableCell>
          <TableCell>{totalProb.toFixed(4)}%</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
