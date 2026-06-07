import type { KeyboardEvent } from "react"
import type { CorporateExperienceItem } from "@/types/corporatePortfolio"

type CorporateExperienceSectionProps = {
  experience: CorporateExperienceItem[]
  isActive?: boolean
  mode: "mobile" | "desktop"
  onExperienceClick?: (experienceId?: string | number) => void
}

export function CorporateExperienceSection({ experience, isActive = false, mode, onExperienceClick }: CorporateExperienceSectionProps) {
  const isDesktop = mode === "desktop"
  const sectionClassName = getSectionClassName(isDesktop, isActive)
  const titleClassName = isDesktop ? "text-4xl font-black tracking-[-0.05em]" : "text-3xl font-bold"

  if (!experience.length && isDesktop) return null

  return (
    <section id={isDesktop ? "corporate-experience" : undefined} className={sectionClassName}>
      <h3 className={titleClassName}>Experiencia</h3>
      {experience.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {experience.map((item, index) => (
            <ExperienceCard
              key={item.id}
              item={item}
              index={index}
              desktop={isDesktop}
              onExperienceClick={onExperienceClick}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 text-sm text-gray-500">No hay experiencia registrada.</div>
      )}
    </section>
  )
}

function ExperienceCard({ item, index, desktop, onExperienceClick }: {
  item: CorporateExperienceItem
  index: number
  desktop: boolean
  onExperienceClick?: (experienceId?: string | number) => void
}) {
  const cardClassName = desktop
    ? "w-full cursor-pointer rounded-[1.25rem] border border-black/10 bg-[linear-gradient(180deg,#FFFFFF_0%,#FBF8F2_100%)] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#8C6E46] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-[#8C6E46] lg:rounded-[1.6rem] lg:p-5"
    : "w-full cursor-pointer rounded-[1.35rem] border border-black/10 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-[#111111] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-[#8C6E46] sm:rounded-[1.6rem] sm:p-5"

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onExperienceClick?.(item.id)}
      onKeyDown={(event) => handleItemKeyDown(event, item.id, onExperienceClick)}
      className={cardClassName}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6E46]">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-xl font-bold">{item.title}</h4>
          <p className="mt-1 text-sm font-medium text-[#5E6670]">{item.organization}</p>
        </div>
        {item.period.trim() ? <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7C8791]">{item.period}</span> : null}
      </div>
      {item.description.trim() ? <p className="mt-4 text-sm leading-7 text-[#47515B]">{item.description}</p> : null}
    </article>
  )
}

function getSectionClassName(isDesktop: boolean, isActive: boolean) {
  if (!isDesktop) return ""
  const activeClassName = "border-[#8FA4B7] bg-[#D6E0E9] text-[#111111]"
  const inactiveClassName = "border-black/10 bg-[#EFE8DE] text-[#111111]"
  return `mt-6 rounded-[1.5rem] border p-4 transition-colors duration-300 lg:mt-8 lg:rounded-[2rem] lg:p-6 ${
    isActive ? activeClassName : inactiveClassName
  }`
}

function handleItemKeyDown(
  event: KeyboardEvent<HTMLElement>,
  itemId: string,
  onItemClick?: (itemId?: string | number) => void,
) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
