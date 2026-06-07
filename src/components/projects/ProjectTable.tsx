import { Edit3, FolderGit2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatProjectDate } from "@/lib/projectListUtils"
import type { ProjectItem } from "@/types/project"

interface ProjectTableProps {
  projects: ProjectItem[]
  emptyMessage: string
  selectable?: boolean
  selectedIds?: Set<number>
  onToggleSelect?: (id: number, selected: boolean) => void
  onSelectAll?: (selected: boolean) => void
  onRowClick?: (project: ProjectItem) => void
  onEdit?: (project: ProjectItem) => void
  variant?: "default" | "edit"
}

interface ProjectTableHeaderProps {
  projects: ProjectItem[]
  selectable?: boolean
  selectedIds?: Set<number>
  onSelectAll?: (selected: boolean) => void
  onEdit?: (project: ProjectItem) => void
  isEditVariant: boolean
}

interface ProjectTableRowProps {
  project: ProjectItem
  selectable?: boolean
  selectedIds?: Set<number>
  onToggleSelect?: (id: number, selected: boolean) => void
  onRowClick?: (project: ProjectItem) => void
  onEdit?: (project: ProjectItem) => void
  isEditVariant: boolean
}

export function ProjectTable({ projects, emptyMessage, variant = "default", ...props }: ProjectTableProps) {
  const isEditVariant = variant === "edit"

  if (projects.length === 0) return <ProjectEmptyState emptyMessage={emptyMessage} isEditVariant={isEditVariant} />

  return (
    <div className={getTableWrapperClassName(isEditVariant)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-190 border-collapse text-left text-sm">
          <ProjectTableHeader projects={projects} isEditVariant={isEditVariant} {...props} />
          <tbody>
            {projects.map((project) => (
              <ProjectTableRow key={project.id} project={project} isEditVariant={isEditVariant} {...props} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProjectEmptyState({ emptyMessage, isEditVariant }: { emptyMessage: string; isEditVariant: boolean }) {
  const className = isEditVariant
    ? "rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm"
    : "rounded-2xl border-2 border-dashed border-[#6dacbf] bg-white px-6 py-14 text-center text-[#4B778D]"

  if (!isEditVariant) {
    return (
      <div className={className}>
        <FolderGit2 className="mx-auto mb-3 size-10 text-[#4982AD]" />
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
        <FolderGit2 className="size-8 text-gray-400" />
      </div>
      <h3 className="mb-1 text-sm font-medium text-gray-900">No hay proyectos</h3>
      <p className="text-sm text-gray-500">{emptyMessage}</p>
    </div>
  )
}

function ProjectTableHeader({ projects, selectable, selectedIds, onSelectAll, onEdit, isEditVariant }: ProjectTableHeaderProps) {
  const canSelectAll = Boolean(onSelectAll)
  const allSelected = canSelectAll && projects.length > 0 && projects.every((project) => selectedIds?.has(project.id))

  return (
    <thead className={isEditVariant ? "border-b border-gray-200 bg-gray-50/50 text-xs uppercase tracking-wide text-gray-700" : "bg-[#EEF5F9] text-xs uppercase text-[#003A6C]"}>
      <tr>
        {selectable ? <SelectAllHeader checked={allSelected} canSelectAll={canSelectAll} onSelectAll={onSelectAll} isEditVariant={isEditVariant} /> : null}
        <th className="px-4 py-3">Nombre</th>
        <th className="px-4 py-3">Rol</th>
        <th className="px-4 py-3">Tecnologías</th>
        <th className="px-4 py-3">Periodo</th>
        <th className="px-4 py-3">Estado</th>
        {onEdit ? <th className="px-4 py-3 text-right">Acciones</th> : null}
      </tr>
    </thead>
  )
}

function SelectAllHeader({ checked, canSelectAll, onSelectAll, isEditVariant }: { checked: boolean; canSelectAll: boolean; onSelectAll?: (selected: boolean) => void; isEditVariant: boolean }) {
  return (
    <th className="w-12 px-4 py-3">
      {canSelectAll ? (
        <input type="checkbox" checked={checked} onChange={(event) => onSelectAll?.(event.target.checked)} className={getCheckboxClassName(isEditVariant)} aria-label="Seleccionar todos los proyectos visibles" />
      ) : (
        <span>Sel.</span>
      )}
    </th>
  )
}

function ProjectTableRow({ project, selectable, selectedIds, onToggleSelect, onRowClick, onEdit, isEditVariant }: ProjectTableRowProps) {
  return (
    <tr key={project.id} onClick={() => onRowClick?.(project)} className={getRowClassName(isEditVariant, Boolean(onRowClick))}>
      {selectable ? <ProjectSelectCell project={project} selectedIds={selectedIds} onToggleSelect={onToggleSelect} isEditVariant={isEditVariant} /> : null}
      <td className="px-4 py-3"><ProjectIdentityCell project={project} isEditVariant={isEditVariant} /></td>
      <td className={isEditVariant ? "px-4 py-3 text-gray-600" : "px-4 py-3 text-[#355468]"}>{project.rol}</td>
      <td className="px-4 py-3"><ProjectTechnologyBadges project={project} isEditVariant={isEditVariant} /></td>
      <td className={isEditVariant ? "px-4 py-3 text-gray-600" : "px-4 py-3 text-[#4B778D]"}>{formatProjectDate(project.fechaInicio)} - {project.is_current ? (isEditVariant ? "Presente" : "Actualidad") : formatProjectDate(project.fechaFin)}</td>
      <td className="px-4 py-3"><ProjectStatusBadge project={project} isEditVariant={isEditVariant} /></td>
      {onEdit ? <ProjectEditCell project={project} onEdit={onEdit} isEditVariant={isEditVariant} /> : null}
    </tr>
  )
}

function ProjectIdentityCell({ project, isEditVariant }: { project: ProjectItem; isEditVariant: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {project.image ? (
        <img src={project.image} alt="" className={getProjectImageClassName(isEditVariant)} />
      ) : (
        <div className={getProjectIconClassName(isEditVariant)}>
          <FolderGit2 className="size-5" />
        </div>
      )}
      <p className={isEditVariant ? "min-w-0 break-words font-medium text-gray-900" : "min-w-0 break-words font-semibold text-[#003A6C]"}>
        {project.nombre}
      </p>
    </div>
  )
}

function ProjectSelectCell({ project, selectedIds, onToggleSelect, isEditVariant }: { project: ProjectItem; selectedIds?: Set<number>; onToggleSelect?: (id: number, selected: boolean) => void; isEditVariant: boolean }) {
  return (
    <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
      <input type="checkbox" checked={selectedIds?.has(project.id) ?? false} onChange={(event) => onToggleSelect?.(project.id, event.target.checked)} className={getCheckboxClassName(isEditVariant)} aria-label={`Seleccionar ${project.nombre}`} />
    </td>
  )
}

function ProjectTechnologyBadges({ project, isEditVariant }: { project: ProjectItem; isEditVariant: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {project.tecnologias.slice(0, 3).map((technology) => (
        <Badge key={technology.id} variant="secondary" className={getTechnologyBadgeClassName(isEditVariant)}>{technology.name}</Badge>
      ))}
      {project.tecnologias.length > 3 ? <Badge variant="secondary" className={getTechnologyBadgeClassName(isEditVariant)}>+{project.tecnologias.length - 3}</Badge> : null}
    </div>
  )
}

function ProjectStatusBadge({ project, isEditVariant }: { project: ProjectItem; isEditVariant: boolean }) {
  const className = isEditVariant
    ? project.is_current ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"
    : project.is_current ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"

  return <Badge className={className}>{project.is_current ? "En curso" : "Finalizado"}</Badge>
}

function ProjectEditCell({ project, onEdit, isEditVariant }: { project: ProjectItem; onEdit: (project: ProjectItem) => void; isEditVariant: boolean }) {
  return (
    <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>
      <Button type="button" variant="outline" onClick={() => onEdit(project)} className={isEditVariant ? "h-9 border-gray-300 bg-white text-gray-700 hover:bg-gray-50" : "h-9 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"}>
        <Edit3 className="size-4" />
        Editar
      </Button>
    </td>
  )
}

function getTableWrapperClassName(isEditVariant: boolean) {
  if (isEditVariant) return "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"

  return "overflow-x-auto rounded-2xl border border-[#A5D7E8] bg-white shadow-sm"
}

function getCheckboxClassName(isEditVariant: boolean) {
  return isEditVariant ? "size-4 rounded-none border-gray-300" : "size-4 rounded-none border-[#A5D7E8]"
}

function getRowClassName(isEditVariant: boolean, canClick: boolean) {
  if (isEditVariant) return `border-b border-gray-100 transition last:border-0 ${canClick ? "cursor-pointer hover:bg-gray-50" : ""}`

  return `border-t border-[#D7E6F2] transition ${canClick ? "cursor-pointer hover:bg-[#F7FBFD]" : ""}`
}

function getProjectImageClassName(isEditVariant: boolean) {
  return isEditVariant
    ? "size-10 shrink-0 rounded-lg border border-gray-200 bg-white object-contain p-1"
    : "size-10 shrink-0 rounded-lg border border-[#D7E6F2] bg-white object-contain p-1"
}

function getProjectIconClassName(isEditVariant: boolean) {
  return isEditVariant
    ? "flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500"
    : "flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]"
}

function getTechnologyBadgeClassName(isEditVariant: boolean) {
  return isEditVariant ? "bg-gray-100 text-gray-700 hover:bg-gray-100" : "bg-[#D9EAF4] text-[#003A6C]"
}
