import type { KeyboardEvent } from "react"
import type { CorporateEducationItem } from "@/types/corporatePortfolio"

type CorporateEducationSectionProps = {
  education: CorporateEducationItem[]
  isActive?: boolean
  mode: "mobile" | "desktop"
  onEducationClick?: (educationId?: string | number) => void
}

export function CorporateEducationSection({ education, isActive = false, mode, onEducationClick }: CorporateEducationSectionProps) {
  const isDesktop = mode === "desktop"
  if (!education.length && isDesktop) return null

  return (
    <section id={isDesktop ? "corporate-education" : undefined} className={getSectionClassName(isDesktop, isActive)}>
      <div className={isDesktop ? "rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-4 lg:rounded-[1.7rem] lg:p-6" : ""}>
        <h3 className={isDesktop ? "text-3xl font-black tracking-[-0.04em] text-white" : "text-3xl font-bold text-white"}>Formacion</h3>
        {education.length ? <EducationList education={education} desktop={isDesktop} onEducationClick={onEducationClick} /> : <div className="mt-6 text-sm text-gray-400">No hay formación registrada.</div>}
      </div>
    </section>
  )
}

function EducationList({ education, desktop, onEducationClick }: {
  education: CorporateEducationItem[]
  desktop: boolean
  onEducationClick?: (educationId?: string | number) => void
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-4">
      {education.map((item) => (
        <article
          key={item.id}
          role="button"
          tabIndex={0}
          onClick={() => onEducationClick?.(item.id)}
          onKeyDown={(event) => handleItemKeyDown(event, item.id, onEducationClick)}
          className={getCardClassName(desktop)}
        >
          <div className={desktop ? "flex flex-col gap-2" : "flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between"}>
            <p className="text-lg font-bold text-white">{item.title}</p>
            {item.period.trim() ? <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/48">{item.period}</span> : null}
          </div>
          <p className="mt-2 text-sm text-white/68">{item.institution}</p>
        </article>
      ))}
    </div>
  )
}

function getSectionClassName(isDesktop: boolean, isActive: boolean) {
  if (!isDesktop) return ""
  return `rounded-[1.5rem] p-1 transition-colors duration-300 lg:rounded-[2rem] ${isActive ? "bg-[#2F3E4C]" : ""}`
}

function getCardClassName(desktop: boolean) {
  if (desktop) return "w-full cursor-pointer rounded-[1.2rem] border border-white/10 bg-white/3 p-4 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B]/60 hover:bg-[#1B1815] focus:outline-none focus:ring-2 focus:ring-[#D6A96B] sm:w-80 sm:max-w-full"
  return "w-full cursor-pointer rounded-[1.35rem] border border-white/10 bg-white/3 p-4 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B]/60 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-[#D6A96B] sm:w-80 sm:max-w-full sm:rounded-[1.6rem] sm:p-5"
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, itemId: string, onItemClick?: (itemId?: string | number) => void) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
