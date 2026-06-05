import { Button } from "@/components/ui/button"

interface ProjectPaginationProps {
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function ProjectPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}: ProjectPaginationProps) {
  if (totalItems === 0 || totalPages <= 1) return null

  return (
    <div className="flex flex-col gap-3 px-2 text-sm text-gray-700 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Mostrando {startIndex + 1} a {endIndex} de {totalItems} resultados
      </span>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
          Anterior
        </Button>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button key={page} type="button" variant={currentPage === page ? "default" : "outline"} onClick={() => onPageChange(page)} className={getPageButtonClassName(currentPage === page)}>
              {page}
            </Button>
          ))}
        </div>
        <Button type="button" variant="outline" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
          Siguiente
        </Button>
      </div>
    </div>
  )
}

function getPageButtonClassName(isCurrentPage: boolean) {
  if (isCurrentPage) return "bg-[#003A6C] text-white hover:bg-[#4982AD]"

  return "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
}
