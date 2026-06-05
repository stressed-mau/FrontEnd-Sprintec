import { GraduationCap } from "lucide-react"
import type { KeyboardEvent } from "react"
import type { ModernEducation } from "@/types/modernPortfolio"

type ModernEducationSectionProps = {
  education: ModernEducation[]
  onEducationClick?: (educationId?: string | number) => void
}

export function ModernEducationSection({ education, onEducationClick }: ModernEducationSectionProps) {
  if (!education.length) return null

  return (
    <div className="bg-white p-6 rounded-[1.75rem] shadow-xl border border-[#7d959e]/10 md:p-10 md:rounded-[2.5rem]">
      <div className="flex items-center gap-3 mb-8">
        <GraduationCap className="text-[#ee8e3b]" size={32} />
        <h3 className="text-2xl font-black uppercase">Formación</h3>
      </div>
      <div className="space-y-8">
        {education.map((item) => <EducationCard key={item.key} item={item} onEducationClick={onEducationClick} />)}
      </div>
    </div>
  )
}

function EducationCard({ item, onEducationClick }: {
  item: ModernEducation
  onEducationClick?: (educationId?: string | number) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onEducationClick?.(item.id)}
      onKeyDown={(event) => handleItemKeyDown(event, item.id, onEducationClick)}
      className="group cursor-pointer rounded-xl p-2 outline-none transition hover:bg-[#fcecd4]/45 focus:ring-2 focus:ring-[#ee8e3b]"
    >
      <span className="text-[#ee8e3b] font-black text-lg">/ Formación</span>
      <h4 className="text-xl font-bold group-hover:text-[#2f606b] transition-colors">{item.title}</h4>
      <p className="text-sm text-[#7d959e] font-medium">{item.institution}</p>
    </div>
  )
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, itemId: string, onItemClick?: (itemId?: string | number) => void) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
