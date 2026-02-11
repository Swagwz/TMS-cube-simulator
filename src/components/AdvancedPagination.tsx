import React, { createContext, useContext, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// --- Context ---
type PaginationContextType = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  sibling: number;
};

const PaginationContext = createContext<PaginationContextType | null>(null);

function usePaginationContext() {
  const context = useContext(PaginationContext);
  if (!context)
    throw new Error(
      "Pagination components must be used within <PaginationRoot />",
    );
  return context;
}

type RootProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  sibling?: number;
  children: React.ReactNode;
};

function Root({ page, setPage, totalPages, sibling = 1, children }: RootProps) {
  const showLeftEllipsis = page > sibling + 1;
  const showRightEllipsis = page < totalPages - sibling;

  const contextValue = useMemo(
    () => ({ page, setPage, totalPages, sibling }),
    [page, setPage, totalPages, sibling],
  );

  return (
    <PaginationContext.Provider value={contextValue}>
      <div className="w-full">
        <Pagination>
          <PaginationContent>
            {showLeftEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {children}

            {showRightEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </PaginationContext.Provider>
  );
}

function PagenitionNumbers() {
  const { page, setPage, totalPages, sibling } = usePaginationContext();
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];

    const start = Math.max(1, page - sibling);
    const end = Math.min(totalPages, page + sibling);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [page, totalPages]);

  return (
    <>
      {pageNumbers.map((p) => (
        <PaginationItem key={p}>
          <Button
            variant={page === p ? "primary" : "ghost"}
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        </PaginationItem>
      ))}
    </>
  );
}

function PrevBtn() {
  const { setPage, page } = usePaginationContext();

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const isFirst = page === 1;

  return (
    <PaginationItem>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handlePrev}
        disabled={isFirst}
      >
        <ChevronLeft />
      </Button>
    </PaginationItem>
  );
}

function NextBtn() {
  const { setPage, totalPages, page } = usePaginationContext();
  const handleNext = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };
  const isLast = page === totalPages;
  return (
    <PaginationItem>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleNext}
        disabled={isLast}
      >
        <ChevronRight />
      </Button>
    </PaginationItem>
  );
}

function FirstBtn() {
  const { setPage, page } = usePaginationContext();
  const isFirst = page === 1;
  return (
    <PaginationItem>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setPage(1)}
        disabled={isFirst}
      >
        <ChevronsLeft />
      </Button>
    </PaginationItem>
  );
}

function LastBtn() {
  const { setPage, totalPages, page } = usePaginationContext();
  const isLast = page === totalPages;
  return (
    <PaginationItem>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setPage(totalPages)}
        disabled={isLast}
      >
        <ChevronsRight />
      </Button>
    </PaginationItem>
  );
}

export { Root, PagenitionNumbers, PrevBtn, NextBtn, FirstBtn, LastBtn };
