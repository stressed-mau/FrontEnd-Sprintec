import { Button } from "@/components/ui/button"

type ExperiencePaginationProps = {
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
      <p>Mostrando {props.startIndex + 1} a {Math.min(props.endIndex, props.totalItems)} de {props.totalItems} resultados</p>
      <div className="flex flex-wrap gap-2">
        <PageButton label="Anterior" disabled={props.currentPage === 1} onClick={() => props.onPageChange(Math.max(1, props.currentPage - 1))} />
        {Array.from({ length: props.totalPages }, (_, index) => index + 1).map((page) => (
          <PageButton key={page} label={String(page)} active={props.currentPage === page} onClick={() => props.onPageChange(page)} />
        ))}
        <PageButton label="Siguiente" disabled={props.currentPage === props.totalPages} onClick={() => props.onPageChange(Math.min(props.totalPages, props.currentPage + 1))} />
      </div>
    </div>
  )
}

function PageButton({ label, active, disabled, onClick }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <Button type="button" variant={active ? "default" : "outline"} disabled={disabled} onClick={onClick} className={active ? "bg-[#003A6C] text-white hover:bg-[#1a4f7a]" : "border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"}>
      {label}
    </Button>
  )
}
