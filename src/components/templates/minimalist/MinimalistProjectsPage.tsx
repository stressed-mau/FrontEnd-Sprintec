import type { KeyboardEvent } from "react"
import type { MinimalistProject } from "@/types/minimalistPortfolio"

type MinimalistProjectsPageProps = {
  projects: MinimalistProject[]
  onProjectClick?: (projectId?: string | number) => void
}

export function MinimalistProjectsPage({ projects, onProjectClick }: MinimalistProjectsPageProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Proyectos</h2>
      <div className="flex flex-wrap gap-4 pt-2 overflow-y-auto max-h-[350px] pr-2">
        {projects.map((project) => <ProjectCard key={project.id} project={project} onProjectClick={onProjectClick} />)}
      </div>
    </div>
  )
}

function ProjectCard({ project, onProjectClick }: {
  project: MinimalistProject
  onProjectClick?: (projectId?: string | number) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onProjectClick?.(project.id)}
      onKeyDown={(event) => handleItemKeyDown(event, project.id, onProjectClick)}
      className="w-full cursor-pointer bg-stone-50/50 border border-stone-100 rounded-xl p-3 transition-all hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 group focus:outline-none focus:ring-2 focus:ring-zinc-900 md:w-64 md:max-w-full md:rounded-2xl md:p-4"
    >
      <h3 className="font-bold text-sm text-zinc-900 uppercase mb-1">{project.label}</h3>
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{project.role}</p>
      {project.technologies.length ? <ProjectTechnologies technologies={project.technologies} /> : null}
    </div>
  )
}

function ProjectTechnologies({ technologies }: { technologies: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {technologies.map((technology) => (
        <span key={technology} className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-stone-600 ring-1 ring-stone-200">
          {technology}
        </span>
      ))}
    </div>
  )
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, itemId: string, onItemClick?: (itemId?: string | number) => void) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
