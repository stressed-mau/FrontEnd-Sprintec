import { ExternalLink, FolderGit2, GitBranch, X } from "lucide-react"
import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatProjectDate } from "@/lib/projectListUtils"
import type { ProjectItem } from "@/types/project"

export function ProjectDetailsModal({ project, onClose }: { project: ProjectItem | null; onClose: () => void }) {
  if (!project) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-white p-6 shadow-2xl sm:rounded-3xl">
        <ProjectDetailsHeader onClose={onClose} />
        <div className="space-y-6">
          <ProjectSummary project={project} />
          <ProjectDetailsGrid project={project} />
          <DetailItem label="Descripción" value={project.descripcion || "No especificada"} />
          <ProjectLinks project={project} />
        </div>
      </div>
    </div>
  )
}

function ProjectDetailsHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-[#003A6C]">Detalle de proyecto</h2>
        <p className="mt-1 text-sm text-[#4B778D]">Información completa del proyecto seleccionado.</p>
      </div>
      <button type="button" onClick={onClose} className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]" aria-label="Cerrar detalle de proyecto">
        <X className="size-5" />
      </button>
    </div>
  )
}

function ProjectSummary({ project }: { project: ProjectItem }) {
  return (
    <div className="flex items-start gap-4">
      <ProjectImage project={project} />
      <div>
        <p className="text-xl font-semibold text-[#003A6C]">{project.nombre}</p>
        <p className="text-[#4B778D]">{project.rol || "Rol no especificado"}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge className={project.is_current ? "bg-[#D9EAF4] text-[#003A6C]" : "bg-slate-100 text-slate-700"}>{project.is_current ? "En curso" : "Finalizado"}</Badge>
          {project.tecnologias.slice(0, 3).map((technology) => (
            <Badge key={technology.id} className="bg-[#EEF5F9] text-[#003A6C]">{technology.name}</Badge>
          ))}
          {project.tecnologias.length > 3 ? <Badge className="bg-[#EEF5F9] text-[#003A6C]">+{project.tecnologias.length - 3}</Badge> : null}
        </div>
      </div>
    </div>
  )
}

function ProjectImage({ project }: { project: ProjectItem }) {
  if (!project.image) {
    return (
      <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
        <FolderGit2 className="size-8" />
      </div>
    )
  }

  return (
    <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-[#D7E6F2] bg-white p-1 shadow-sm">
      <img src={project.image} alt={project.nombre} className="h-full w-full rounded-md object-cover" />
    </div>
  )
}

function ProjectDetailsGrid({ project }: { project: ProjectItem }) {
  const technologies = project.tecnologias.length
    ? project.tecnologias.map((technology) => technology.name).join(", ")
    : "No especificadas"

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DetailItem label="Inicio" value={formatProjectDate(project.fechaInicio)} />
      <DetailItem label="Fin" value={project.is_current ? "Actualidad" : formatProjectDate(project.fechaFin)} />
      <DetailItem label="Rol" value={project.rol || "No especificado"} />
      <DetailItem label="Tecnologías" value={technologies} />
    </div>
  )
}

function ProjectLinks({ project }: { project: ProjectItem }) {
  if (!project.github && !project.demo) return null

  return (
    <Detail label="Enlaces">
      <div className="flex flex-wrap gap-3">
        {project.github ? (
          <Button type="button" variant="outline" className="border-[#A5D7E8] bg-white text-[#003A6C]" onClick={() => window.open(project.github, "_blank")}>
            <GitBranch className="size-4" />
            Repositorio
          </Button>
        ) : null}
        {project.demo ? (
          <Button type="button" variant="outline" className="border-[#A5D7E8] bg-white text-[#003A6C]" onClick={() => window.open(project.demo, "_blank")}>
            <ExternalLink className="size-4" />
            Demo
          </Button>
        ) : null}
      </div>
    </Detail>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-[#6B7E8E]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#003A6C]">{value}</p>
    </div>
  )
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-[#4982AD]">{label}</p>
      <div>{children}</div>
    </div>
  )
}
