import type { KeyboardEvent } from "react"
import type { ModernExperience } from "@/types/modernPortfolio"

type ModernExperienceSectionProps = {
  experience: ModernExperience[]
  onExperienceClick?: (experienceId?: string | number) => void
}

export function ModernExperienceSection({ experience, onExperienceClick }: ModernExperienceSectionProps) {
  if (!experience.length) return null

  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <div className="h-1 w-12 bg-[#ee8e3b]"></div>
        <h3 className="text-4xl font-black uppercase tracking-tighter">Experiencias</h3>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {experience.map((item) => (
          <ExperienceCard key={item.key} item={item} onExperienceClick={onExperienceClick} />
        ))}
      </div>
    </div>
  )
}

function ExperienceCard({ item, onExperienceClick }: {
  item: ModernExperience
  onExperienceClick?: (experienceId?: string | number) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onExperienceClick?.(item.id)}
      onKeyDown={(event) => handleItemKeyDown(event, item.id, onExperienceClick)}
      className="relative cursor-pointer border-l-2 border-[#7d959e]/30 pb-4 pl-10 outline-none transition hover:border-[#ee8e3b] focus:ring-2 focus:ring-[#ee8e3b]"
    >
      <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-[#ee8e3b] shadow-[0_0_10px_#ee8e3b]"></div>
      <h4 className="text-2xl font-bold leading-tight">{item.company}</h4>
      <p className="text-[#2f606b] font-semibold mt-1">{item.position}</p>
    </div>
  )
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, itemId: string, onItemClick?: (itemId?: string | number) => void) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
