import type { KeyboardEvent } from "react"
import type { ModernProject } from "@/types/modernPortfolio"

type ModernProjectsSectionProps = {
  projects: ModernProject[]
  onProjectClick?: (projectId?: string | number) => void
}

export function ModernProjectsSection({ projects, onProjectClick }: ModernProjectsSectionProps) {
  if (!projects.length) return null

  return (
    <section className="py-24 px-6 md:px-20 bg-[#173b61]">
      <div className="max-w-6xl mx-auto">
        <ProjectsHeader />
        <div className="flex flex-wrap gap-5 lg:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.key} project={project} onProjectClick={onProjectClick} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 md:mb-16">
      <div>
        <h2 className="text-6xl font-black text-[#fcecd4]">PROYECTOS</h2>
        <p className="text-[#ee8e3b] font-bold mt-2 uppercase tracking-[0.3em]">Muestra de trabajo</p>
      </div>
    </div>
  )
}

function ProjectCard({ project, onProjectClick }: {
  project: ModernProject
  onProjectClick?: (projectId?: string | number) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onProjectClick?.(project.id)}
      onKeyDown={(event) => handleItemKeyDown(event, project.id, onProjectClick)}
      className="group relative min-h-40 w-full cursor-pointer overflow-hidden rounded-[1.5rem] bg-[#2f606b] focus:outline-none focus:ring-2 focus:ring-[#ee8e3b] sm:min-h-48 sm:w-80 sm:max-w-full sm:rounded-[2rem]"
    >
      <div className="absolute inset-0 bg-linear-to-t from-[#173b61] via-transparent to-transparent opacity-100 p-5 flex flex-col justify-end sm:p-8">
        <h4 className="text-[#fcecd4] text-2xl font-black">{project.name}</h4>
        <p className="text-[#ee8e3b] font-bold text-sm mt-2">{project.role}</p>
      </div>
    </div>
  )
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, itemId: string, onItemClick?: (itemId?: string | number) => void) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
