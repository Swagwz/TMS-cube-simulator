import { useEffect, useMemo, useState } from "react";

const ITEM_PER_PAGE = 10;

export default function useListPagination<T>(list: T[]) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(list.length / ITEM_PER_PAGE);

  const currentPageIds = useMemo(() => {
    return list.slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page);
  }, [list, page]);

  useEffect(() => {
    if (!currentPageIds.length) setPage((prev) => Math.max(1, prev - 1));
  }, [currentPageIds]);

  return { page, setPage, totalPages, currentPageIds };
}
