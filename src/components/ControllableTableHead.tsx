import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export type SortConfig<T> = {
  key: T | null;
  direction: SortDirection;
};

type Props<T extends string> = {
  sortKey: T;
  children: ReactNode;
  sortConfig: SortConfig<T>;
  onSort: (key: T) => void;
  className?: string;
};

export default function ControllableTableHead<T extends string>({
  sortKey,
  children,
  sortConfig,
  onSort,
  className,
}: Props<T>) {
  return (
    <TableHead
      className={cn("cursor-pointer select-none", className)}
      onClick={() => onSort(sortKey)}
    >
      {children}
      <span className={cn("ml-1", sortConfig.key !== sortKey && "opacity-0")}>
        {sortConfig.key === sortKey && sortConfig.direction === "asc"
          ? "▲"
          : "▼"}
      </span>
    </TableHead>
  );
}
