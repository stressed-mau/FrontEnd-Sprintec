import { Badge } from "@/components/ui/badge"
import type { ExperienceItem } from "@/types/experience"

export function ExperienceStatusBadge({ experience }: { experience: ExperienceItem }) {
  return experience.current ? (
    <Badge className="bg-[#D9EAF4] text-[#003A6C]">Actual</Badge>
  ) : (
    <Badge className="bg-slate-100 text-slate-700">Finalizado</Badge>
  )
}
