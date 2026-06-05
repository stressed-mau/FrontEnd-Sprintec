import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

interface PortfolioViewsReportHeaderProps {
  loading: boolean
  onExportPDF: () => void
}

export function PortfolioViewsReportHeader({ loading, onExportPDF }: PortfolioViewsReportHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-[#003A6C]">Visualizaciones</h1>
        <p className="text-[#4B778D]">Consulta el rendimiento de tu portafolio publicado y revisa cuantas personas lo han visitado.</p>
      </div>

      <div className="flex flex-col items-start gap-2 sm:items-end">
        <div className="print:hidden">
          <Button
            type="button"
            onClick={onExportPDF}
            disabled={loading}
            className="bg-[#003A6C] text-white shadow-sm transition-colors hover:bg-[#4982AD]"
          >
            <Download className="mr-2 h-4 w-4" />
            Generar PDF
          </Button>
        </div>
        <p className="print:hidden text-sm font-medium text-[#4B778D]">
          {loading ? "Cargando reporte..." : "Descarga una copia del reporte actual."}
        </p>
      </div>
    </div>
  )
}
