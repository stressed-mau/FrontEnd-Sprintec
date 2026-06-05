import type { KeyboardEvent } from "react"
import type { MinimalistEducation } from "@/types/minimalistPortfolio"

type MinimalistEducationPageProps = {
  education: MinimalistEducation[]
  onEducationClick?: (educationId?: string | number) => void
}

export function MinimalistEducationPage({ education, onEducationClick }: MinimalistEducationPageProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Educación</h2>
      <div className="flex flex-wrap gap-4 pt-2">
        {education.map((item) => <EducationCard key={item.id} item={item} onEducationClick={onEducationClick} />)}
      </div>
    </div>
  )
}

function EducationCard({ item, onEducationClick }: {
  item: MinimalistEducation
  onEducationClick?: (educationId?: string | number) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onEducationClick?.(item.id)}
      onKeyDown={(event) => handleItemKeyDown(event, item.id, onEducationClick)}
      className="w-full cursor-pointer rounded-xl border border-stone-100 bg-stone-50 p-3 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-900 md:w-64 md:max-w-full md:rounded-2xl md:p-4"
    >
      <div className="text-[10px] font-black text-stone-300 pt-1 uppercase tracking-tighter w-16">
        {item.institution}
      </div>
      <div>
        <h4 className="font-bold text-sm text-zinc-900 uppercase">{item.title}</h4>
        <p className="text-xs text-stone-400 italic">{item.institution}</p>
      </div>
    </div>
  )
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, itemId: string, onItemClick?: (itemId?: string | number) => void) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
