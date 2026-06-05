import { Briefcase, GraduationCap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { ExperienceItem } from "@/types/experience"

export function ExperienceStatusBadge({ experience }: { experience: ExperienceItem }) {
  if (experience.type === "academica") {
    return experience.current ? (
      <Badge className="bg-[#D9EAF4] text-[#003A6C]">Cursando actualmente</Badge>
    ) : (
      <Badge className="bg-slate-100 text-slate-700">Concluido</Badge>
    )
  }

  return experience.current ? (
    <Badge className="bg-[#D9EAF4] text-[#003A6C]">Actual</Badge>
  ) : (
    <Badge className="bg-slate-100 text-slate-700">Finalizado</Badge>
  )
}

export function ExperienceTypeBadge({ type }: { type: ExperienceItem["type"] }) {
  return type === "academica" ? (
    <Badge className="bg-[#EEF5F9] text-[#003A6C]">
      <GraduationCap className="mr-1 size-3" />
      Formación Académica
    </Badge>
  ) : (
    <Badge className="bg-[#EEF5F9] text-[#003A6C]">
      <Briefcase className="mr-1 size-3" />
      Experiencia Laboral
    </Badge>
  )
}
