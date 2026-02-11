import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as Pagination from "@/components/AdvancedPagination";

import { useEquipmentStore } from "@/store/useEquipmentStore";
import { CreateEquipmentProvider } from "@/contexts/useCreateEquipmentContext";
import CreateEquipmentModal from "./createEquipmentModal/CreateEquipmentModal";
import useListPagination from "@/hooks/useListPagination";
import EquipTableRow from "./EquipTableRow";

export function EquipmentTable() {
  const ids = useEquipmentStore((s) => s.instanceIds);
  const { page, setPage, totalPages, currentPageIds } = useListPagination(ids);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <CreateEquipmentProvider>
          <CreateEquipmentModal />
        </CreateEquipmentProvider>
      </div>
      <div className="overflow-hidden rounded-md">
        <Table className="w-full table-fixed">
          <TableHeader className="bg-primary-dark">
            <TableRow>
              <TableHead className="w-[15%]">#</TableHead>
              <TableHead className="w-[30%]">分類</TableHead>
              <TableHead className="w-[15%]">等級</TableHead>
              <TableHead className="w-[25%]">潛能</TableHead>
              <TableHead className="w-[15%]" />
            </TableRow>
          </TableHeader>
          <TableBody className="bg-primary-main">
            {currentPageIds.map((id, i) => (
              <EquipTableRow id={id} index={i} key={id} />
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination.Root
        {...{
          page,
          setPage,
          totalPages,
        }}
      >
        <Pagination.FirstBtn />
        <Pagination.PrevBtn />
        <Pagination.PagenitionNumbers />
        <Pagination.NextBtn />
        <Pagination.LastBtn />
      </Pagination.Root>
    </div>
  );
}
