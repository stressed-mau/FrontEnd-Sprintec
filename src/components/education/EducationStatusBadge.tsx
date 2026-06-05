import { Badge } from "@/components/ui/badge"
import type { EducationItem } from "@/types/education"

export function EducationStatusBadge({ education }: { education: EducationItem }) {
  return education.current ? (
    <Badge className="bg-[#D9EAF4] text-[#003A6C]">Cursando</Badge>
  ) : (
    <Badge className="bg-slate-100 text-slate-700">Finalizado</Badge>
  )
}
