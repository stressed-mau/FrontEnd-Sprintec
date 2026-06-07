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
      <div className="grid gap-4 pt-2 sm:grid-cols-2">
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
      className="min-w-0 cursor-pointer rounded-xl border border-stone-100 bg-stone-50 p-3 transition-all hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-900 md:rounded-2xl md:p-4"
    >
      <div className="text-[10px] font-black text-stone-300 uppercase tracking-tighter">
        {item.institution}
      </div>
      <div className="mt-2 min-w-0">
        <h4 className="break-words text-sm font-bold uppercase text-zinc-900">{item.title}</h4>
      </div>
    </div>
  )
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, itemId: string, onItemClick?: (itemId?: string | number) => void) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
