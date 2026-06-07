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
      <div className="grid gap-4 pt-2 sm:grid-cols-2">
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
      className="min-w-0 cursor-pointer rounded-xl border border-stone-100 bg-stone-50 p-3 transition hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-900 md:rounded-2xl md:p-4"
    >
      <div className="text-[10px] font-black text-stone-300 uppercase tracking-tighter">
        {experience.company}
      </div>
      <div className="mt-2 min-w-0">
        <h4 className="break-words text-sm font-bold uppercase text-zinc-900">{experience.position}</h4>
      </div>
    </div>
  )
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, itemId: string, onItemClick?: (itemId?: string | number) => void) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
