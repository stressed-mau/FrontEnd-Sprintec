import { useMemo, useState } from "react";

export const DEFAULT_ITEMS_PER_PAGE = 5;

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
  initialPage?: number;
}

export function usePagination<T>({ items, itemsPerPage = DEFAULT_ITEMS_PER_PAGE, initialPage = 1 }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(() => Math.max(1, initialPage));

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);

  const currentData = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [endIndex, items, startIndex]);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const next = () => goToPage(safeCurrentPage + 1);
  const prev = () => goToPage(safeCurrentPage - 1);

  return {
    currentData,
    currentPage: safeCurrentPage,
    endIndex,
    items: currentData,
    startIndex,
    totalPages,
    goToPage,
    next,
    prev,
    setCurrentPage,
  };
}
