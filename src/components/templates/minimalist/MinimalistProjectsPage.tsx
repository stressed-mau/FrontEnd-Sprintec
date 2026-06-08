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
      <div className="grid gap-4 pt-2 sm:grid-cols-2">
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
      className="min-w-0 cursor-pointer rounded-xl border border-stone-100 bg-stone-50/50 p-3 transition-all hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 focus:outline-none focus:ring-2 focus:ring-zinc-900 md:rounded-2xl md:p-4"
    >
      <h3 className="mb-1 break-words text-sm font-bold uppercase text-zinc-900">{project.label}</h3>
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{project.role}</p>
    </div>
  )
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, itemId: string, onItemClick?: (itemId?: string | number) => void) {
  if (event.key !== "Enter" && event.key !== " ") return
  event.preventDefault()
  onItemClick?.(itemId)
}
