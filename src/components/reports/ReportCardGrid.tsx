import {ChevronRight,FileText,Briefcase,} from "lucide-react";
import type { ReportItem } from "@/types/report";
import {formatPeriodLabel, getBadge,} from "@/utils/reports/reportUtils";

export default function ReportCardGrid({ report, index, onClick }: {
  report: ReportItem; index: number; onClick: () => void
}) {
  const badge = getBadge(index)
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start bg-white rounded-2xl p-5 border border-[#C9E1F0]
                 hover:border-[#003A6C] hover:shadow-md transition-all text-left w-full"
    >
      <div className="w-full flex justify-between items-start mb-4">
        <div className="bg-[#E0F2FE] p-2.5 rounded-xl">
          <FileText className="text-[#0369A1] w-5 h-5" />
        </div>
        <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${badge.className}`}>
          {badge.label}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold text-[#003A6C] mb-2 leading-snug">
        {formatPeriodLabel(report.period_start, report.period_end)}
      </h3>
      <div className="flex items-center gap-1.5 text-[12.5px] text-[#4B778D] mb-5">
        <Briefcase className="w-3.5 h-3.5" />
        <span>{report.total_portfolios} portafolios analizados</span>
      </div>
      <div className="w-full mt-auto flex items-center justify-between text-[#003A6C]
                      font-semibold text-[12.5px] border-t border-slate-100 pt-3.5
                      group-hover:text-[#0E7D96] transition-colors">
        <span>Ver reporte detallado</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  )
}