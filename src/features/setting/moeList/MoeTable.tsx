import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateMoeContextProvider } from "@/contexts/useCreateMoeContext";
import { useMoeStore } from "@/store/useMoeStore";
import CreateMoeModal from "./createMoeModal/CreateMoeModal";
import * as Pagination from "@/components/AdvancedPagination";

import useListPagination from "@/hooks/useListPagination";
import MoeTableRow from "./MoeTableRow";

export default function MoeTable() {
  const list = useMoeStore((s) => s.instanceIds);
  const { page, setPage, totalPages, currentPageIds } = useListPagination(list);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <CreateMoeContextProvider>
            <CreateMoeModal />
          </CreateMoeContextProvider>
        </div>
        <div className="overflow-hidden rounded-md">
          <Table className="w-full table-fixed">
            <TableHeader className="bg-primary-dark">
              <TableRow>
                <TableHead className="w-[15%]">#</TableHead>
                <TableHead className="w-[35%]">分類</TableHead>
                <TableHead className="w-[35%]">潛能</TableHead>
                <TableHead className="w-[15%]" />
              </TableRow>
            </TableHeader>
            <TableBody className="bg-primary-main">
              {currentPageIds.map((id, i) => (
                <MoeTableRow id={id} index={i} key={id} />
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
    </>
  );
}
