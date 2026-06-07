import type { KeyboardEvent } from "react"
import type { CorporateProjectItem } from "@/types/corporatePortfolio"

type CorporateProjectsSectionProps = {
  projects: CorporateProjectItem[]
  isActive?: boolean
  mode: "mobile" | "desktop"
  onProjectClick?: (projectId?: string | number) => void
}

export function CorporateProjectsSection({ projects, isActive = false, mode, onProjectClick }: CorporateProjectsSectionProps) {
  const isDesktop = mode === "desktop"
  if (!projects.length && isDesktop) return null

  return (
    <section id={isDesktop ? "corporate-projects" : undefined} className={getSectionClassName(isDesktop, isActive)}>
      <h3 className={isDesktop ? "text-4xl font-black tracking-[-0.05em]" : "text-3xl font-bold"}>Proyectos</h3>
      {projects.length ? (
        <div className={isDesktop ? "mt-5 grid gap-3 sm:grid-cols-2 lg:mt-8 lg:gap-4" : "mt-8 grid gap-4 sm:grid-cols-2"}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} desktop={isDesktop} onProjectClick={onProjectClick} />
          ))}
        </div>
      ) : (
        <div className="mt-6 text-sm text-gray-500">No hay proyectos disponibles.</div>
      )}
    </section>
  )
}

function ProjectCard({ project, index, desktop, onProjectClick }: {
  project: CorporateProjectItem
  index: number
  desktop: boolean
  onProjectClick?: (projectId?: string | number) => void
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onProjectClick?.(project.id)}
      onKeyDown={(event) => handleItemKeyDown(event, project.id, onProjectClick)}
      className={getCardClassName(desktop)}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6E46]">
        Proyecto {String(index + 1).padStart(2, "0")}
      </p>
      <h4 className="mt-2 break-words text-2xl font-bold leading-tight">{project.name}</h4>
      <p className="mt-3 break-words text-sm font-semibold text-[#8C6E46]">{project.role}</p>
    </article>
  )
}

function getSectionClassName(isDesktop: boolean, isActive: boolean) {
  if (!isDesktop) return ""
  const activeClassName = "border-[#8FA4B7] bg-[#D6E0E9]"
  const inactiveClassName = "border-black/10 bg-white/45"
  return `mt-6 rounded-[1.5rem] border p-4 transition-colors duration-300 lg:mt-10 lg:rounded-[2rem] lg:p-6 ${
    isActive ? activeClassName : inactiveClassName
  }`
}

function getCardClassName(desktop: boolean) {
  if (desktop) return "w-full cursor-pointer rounded-[1.35rem] border border-black/10 bg-[linear-gradient(180deg,#FFFFFF_0%,#FBF8F2_100%)] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#8C6E46] hover:shadow-[0_18px_36px_rgba(0,0,0,0.10)] focus:outline-none focus:ring-2 focus:ring-[#8C6E46] lg:rounded-[1.8rem] lg:p-5"
  return "w-full cursor-pointer rounded-[1.35rem] border border-black/10 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-[#111111] hover:shadow-[0_18px_36px_rgba(0,0,0,0.10)] focus:outline-none focus:ring-2 focus:ring-[#8C6E46] sm:rounded-[1.8rem] sm:p-5"
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, itemId: string, onItemClick?: (itemId?: string | number) => void) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
