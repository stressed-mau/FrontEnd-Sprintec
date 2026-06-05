import type { KeyboardEvent } from "react"
import type { MinimalistExperience } from "@/types/minimalistPortfolio"

type MinimalistExperiencePageProps = {
  experiences: MinimalistExperience[]
  onExperienceClick?: (experienceId?: string | number) => void
}

export function MinimalistExperiencePage({ experiences, onExperienceClick }: MinimalistExperiencePageProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Experiencias</h2>
      <div className="space-y-6 pt-2">
        {experiences.map((experience) => (
          <ExperienceCard key={experience.key} experience={experience} onExperienceClick={onExperienceClick} />
        ))}
      </div>
    </div>
  )
}

function ExperienceCard({ experience, onExperienceClick }: {
  experience: MinimalistExperience
  onExperienceClick?: (experienceId?: string | number) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onExperienceClick?.(experience.id)}
      onKeyDown={(event) => handleItemKeyDown(event, experience.id, onExperienceClick)}
      className="flex cursor-pointer items-start gap-4 rounded-xl p-2 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 md:gap-6"
    >
      <div className="text-[10px] font-black text-stone-300 pt-1 uppercase tracking-tighter w-24">
        {experience.company}
      </div>
      <div>
        <h4 className="font-bold text-sm text-zinc-900 uppercase">{experience.position}</h4>
        <p className="text-xs text-stone-400 italic">{experience.description}</p>
      </div>
    </div>
  )
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, itemId: string, onItemClick?: (itemId?: string | number) => void) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
