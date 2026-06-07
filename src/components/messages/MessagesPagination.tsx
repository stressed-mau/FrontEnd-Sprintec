import { ExperiencePagination } from "@/components/experience/ExperiencePagination";

type MessagesPaginationProps = {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export function MessagesPagination(props: MessagesPaginationProps) {
  return <ExperiencePagination {...props} />;
}
