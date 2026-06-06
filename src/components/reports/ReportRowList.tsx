import {ChevronRight,FileText, Briefcase,} from "lucide-react";
import type { ReportItem } from "@/types/report";
import {formatPeriodLabel, getBadge,} from "@/utils/reports/reportUtils";

export default function ReportRowList({ report, index, onClick }: {
  report: ReportItem; index: number; onClick: () => void
}) {
  const badge = getBadge(index)
  return (
    <button
      onClick={onClick}
      className="group w-full grid items-center gap-4 px-5 py-3.5 border-b border-slate-100
                 last:border-none hover:bg-sky-50/50 transition-colors text-left"
      style={{ gridTemplateColumns: "2fr 1fr 1fr 40px" }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-[#E0F2FE] p-2 rounded-lg shrink-0">
          <FileText className="text-[#0369A1] w-4 h-4" />
        </div>
        <span className="text-[13.5px] font-semibold text-[#003A6C]">
          {formatPeriodLabel(report.period_start, report.period_end)}
        </span>
      </div>
      <span className="text-[13px] text-[#4B778D] flex items-center gap-1.5">
        <Briefcase className="w-3.5 h-3.5" />
        {report.total_portfolios}
      </span>
      <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider w-fit ${badge.className}`}>
        {badge.label}
      </span>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#003A6C] group-hover:translate-x-0.5 transition-all" />
    </button>
  )
}