import { Download } from "lucide-react"

import { SectionHeader } from "@/components/sections/SectionHeader"
import { Button } from "@/components/ui/button"

interface PortfolioViewsReportHeaderProps {
  loading: boolean
  onExportPDF: () => void
}

export function PortfolioViewsReportHeader({ loading, onExportPDF }: PortfolioViewsReportHeaderProps) {
  return (
    <SectionHeader
      title="Visualizaciones"
      description="Consulta el rendimiento de tu portafolio publicado y revisa cuantas personas lo han visitado."
      actions={
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
      }
    />
  )
}
