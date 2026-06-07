import { Button } from "@/components/ui/button"

type EducationPaginationProps = {
  currentPage: number
  totalPages: number
  startIndex?: number
  endIndex?: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function EducationPagination({ currentPage, totalPages, totalItems, onPageChange }: EducationPaginationProps) {
  if (totalItems === 0 || totalPages <= 1) return null

  return (
    <div className="flex justify-center text-sm text-[#355468]">
      <div className="flex flex-wrap justify-center gap-2">
        <PageButton label="Anterior" disabled={currentPage === 1} onClick={() => onPageChange(Math.max(1, currentPage - 1))} />
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <PageButton key={page} label={String(page)} active={currentPage === page} onClick={() => onPageChange(page)} />
        ))}
        <PageButton label="Siguiente" disabled={currentPage === totalPages} onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} />
      </div>
    </div>
  )
}

function PageButton({ label, active, disabled, onClick }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      disabled={disabled}
      className={active ? "bg-[#003A6C] text-white hover:bg-[#1a4f7a]" : "border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"}
    >
      {label}
    </Button>
  )
}
