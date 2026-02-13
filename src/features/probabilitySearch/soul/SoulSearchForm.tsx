import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SoulTypeSelect from "@/components/form/SoulTypeSelect";
import FormField from "@/components/FormField";
import type { SoulId } from "@/domains/enhancement/soul/soul.type";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import { Input } from "@/components/ui/input";
import { EquipManager } from "@/domains/equipment/equipManager";
import ControllableTableHead, {
  type SortConfig,
  type SortDirection,
} from "@/components/ControllableTableHead";

type SortKey = "display" | "weight" | "prob";

export default function SoulSearchForm() {
  const [soulType, setSoulType] = useState<SoulId>("wuGongJewel");
  const [level, setLevel] = useState(250);
  const [sortConfig, setSortConfig] = useState<SortConfig<SortKey>>({
    key: "prob",
    direction: "desc",
  });

  const handleSoulTypeSelect = (val: string) => {
    setSoulType(val as SoulId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseInt(value) || 0;
    const level = Math.min(Math.max(parsed, 0), EquipManager.maxLevel);
    setLevel(level);
  };

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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField label="寶珠種類">
        <SoulTypeSelect value={soulType} onValueChange={handleSoulTypeSelect} />
      </FormField>
      <FormField label="等級">
        <Input
          type="number"
          inputMode="numeric"
          className="text-center"
          value={level}
          onFocus={(e) => e.target.select()}
          onChange={handleChange}
        />
      </FormField>

      <details className="col-span-1 mt-4 md:col-span-2">
        <summary className="text-muted-foreground cursor-pointer text-center text-sm">
          各潛能出現機率
        </summary>
        <Table>
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
              <TableRow key={item.id}>
                <TableCell>{item.display}</TableCell>
                <TableCell>{item.weight}</TableCell>
                <TableCell>{item.prob.toFixed(4)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>總計</TableCell>
              <TableCell>{totalWeight}</TableCell>
              <TableCell>{totalProb.toFixed(4)}%</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </details>
    </div>
  );
}
