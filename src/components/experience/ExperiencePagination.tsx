import { Button } from "@/components/ui/button"

interface ExperiencePaginationProps {
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function ExperiencePagination(props: ExperiencePaginationProps) {
  if (props.totalItems === 0 || props.totalPages <= 1) return null

  return (
    <div className="flex flex-col gap-3 text-sm text-[#355468] sm:flex-row sm:items-center sm:justify-between">
      <p>
        Mostrando {props.startIndex + 1} a {Math.min(props.endIndex, props.totalItems)} de {props.totalItems} resultados
      </p>
      <div className="flex flex-wrap gap-2">
        <PaginationButton disabled={props.currentPage === 1} onClick={() => props.onPageChange(Math.max(1, props.currentPage - 1))}>
          Anterior
        </PaginationButton>
        {Array.from({ length: props.totalPages }, (_, index) => index + 1).map((page) => (
          <PageNumberButton key={page} page={page} currentPage={props.currentPage} onPageChange={props.onPageChange} />
        ))}
        <PaginationButton disabled={props.currentPage === props.totalPages} onClick={() => props.onPageChange(Math.min(props.totalPages, props.currentPage + 1))}>
          Siguiente
        </PaginationButton>
      </div>
    </div>
  )
}

function PaginationButton({ children, disabled, onClick }: { children: string; disabled: boolean; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={disabled} className="border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]">
      {children}
    </Button>
  )
}

function PageNumberButton({ page, currentPage, onPageChange }: { page: number; currentPage: number; onPageChange: (page: number) => void }) {
  const isCurrent = currentPage === page

  return (
    <Button
      type="button"
      variant={isCurrent ? "default" : "outline"}
      onClick={() => onPageChange(page)}
      className={isCurrent ? "bg-[#003A6C] text-white hover:bg-[#1a4f7a]" : "border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"}
    >
      {page}
    </Button>
  )
}
