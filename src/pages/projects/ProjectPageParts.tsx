import { Edit3, ExternalLink, FolderGit2, GitBranch, Plus, Search, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from "@/components/Footer";
import Header from "@/components/HeaderUser";
import Sidebar from "@/components/Sidebar";
import type { ProjectFormErrors, ProjectFormValues, ProjectItem, ProjectTechnology } from "@/hooks/useProjectsManager";

const ITEMS_PER_PAGE = 10;
const MAX_PROJECT_NAME_LENGTH = 60;
const MAX_PROJECT_DESCRIPTION_LENGTH = 250;
const MAX_PROJECT_URL_LENGTH = 50;
const inputClassName = (hasError?: boolean) =>
  hasError
    ? "border-red-500 bg-white focus-visible:border-red-500 focus-visible:ring-red-200"
    : "border-[#A5D7E8] bg-white focus-visible:border-[#003A6C] focus-visible:ring-[#A5D7E8]";
const modalInputClassName = (hasError?: boolean) =>
  hasError
    ? "border-red-500 bg-white focus-visible:border-red-500 focus-visible:ring-red-200"
    : "border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30";

function selectClassName(hasError?: boolean, tone: "page" | "modal" = "page") {
  if (hasError) {
    return "h-9 w-full rounded-md border border-red-500 bg-white px-2.5 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-3 focus:ring-red-200";
  }

  return tone === "modal"
    ? "h-9 w-full rounded-md border border-gray-300 bg-white px-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/30"
    : "h-9 w-full rounded-md border border-[#A5D7E8] bg-white px-2.5 text-sm text-[#003A6C] outline-none focus:border-[#003A6C] focus:ring-3 focus:ring-[#A5D7E8]";
}

export function filterProjects(projects: ProjectItem[], searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return projects;

  return projects.filter((project) => {
    return (
      project.nombre.toLowerCase().includes(normalizedSearch) ||
      project.rol.toLowerCase().includes(normalizedSearch) ||
      project.tecnologias.some((technology) => technology.name.toLowerCase().includes(normalizedSearch))
    );
  });
}

export function paginateProjects(projects: ProjectItem[], currentPage: number) {
  const totalPages = Math.max(1, Math.ceil(projects.length / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, projects.length);

  return {
    items: projects.slice(startIndex, endIndex),
    currentPage: safePage,
    totalPages,
    startIndex,
    endIndex,
  };
}

export function formatProjectDate(date?: string) {
  if (!date) return "-";
  const isoDate = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) {
    return new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3])).toLocaleDateString("es-ES", {
      month: "short",
      year: "numeric",
    });
  }

  return new Date(date).toLocaleDateString("es-ES", { month: "short", year: "numeric" });
}

export function ProjectPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="mb-1 text-2xl font-semibold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export function FeedbackMessage({ message, type }: { message: string; type: "error" | "success" }) {
  if (!message) return null;

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"
      }`}
    >
      {message}
    </div>
  );
}

export function ProjectSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nombre, rol o tecnología..."
        className="h-11 border-gray-300 bg-white pl-10 text-gray-900 focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
      />
    </div>
  );
}

export function ProjectPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  if (totalItems === 0 || totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 px-2 text-sm text-gray-700 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Mostrando {startIndex + 1} a {endIndex} de {totalItems} resultados
      </span>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          Anterior
        </Button>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button
              key={page}
              type="button"
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page)}
              className={
                currentPage === page
                  ? "bg-[#003A6C] text-white hover:bg-[#4982AD]"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

export function ProjectTable({
  projects,
  emptyMessage,
  selectable,
  selectedIds,
  onToggleSelect,
  onRowClick,
  onEdit,
  variant = "default",
}: {
  projects: ProjectItem[];
  emptyMessage: string;
  selectable?: boolean;
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number, selected: boolean) => void;
  onRowClick?: (project: ProjectItem) => void;
  onEdit?: (project: ProjectItem) => void;
  variant?: "default" | "edit";
}) {
  const isEditVariant = variant === "edit";

  if (projects.length === 0) {
    return (
      <div
        className={
          isEditVariant
            ? "rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm"
            : "rounded-2xl border-2 border-dashed border-[#6dacbf] bg-white px-6 py-14 text-center text-[#4B778D]"
        }
      >
        {isEditVariant ? (
          <>
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
              <FolderGit2 className="size-8 text-gray-400" />
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-900">No hay proyectos</h3>
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </>
        ) : (
          <>
            <FolderGit2 className="mx-auto mb-3 size-10 text-[#4982AD]" />
            {emptyMessage}
          </>
        )}
      </div>
    );
  }

  return (
    <div className={isEditVariant ? "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" : "overflow-x-auto rounded-2xl border border-[#A5D7E8] bg-white shadow-sm"}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className={isEditVariant ? "border-b border-gray-200 bg-gray-50/50 text-xs uppercase tracking-wide text-gray-700" : "bg-[#EEF5F9] text-xs uppercase text-[#003A6C]"}>
          <tr>
            {selectable ? <th className="w-12 px-4 py-3">Sel.</th> : null}
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Rol</th>
            <th className="px-4 py-3">Tecnologías</th>
            <th className="px-4 py-3">Periodo</th>
            <th className="px-4 py-3">Estado</th>
            {onEdit ? <th className="px-4 py-3 text-right">Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              onClick={() => onRowClick?.(project)}
              className={
                isEditVariant
                  ? `border-b border-gray-100 transition last:border-0 ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`
                  : `border-t border-[#D7E6F2] transition ${onRowClick ? "cursor-pointer hover:bg-[#F7FBFD]" : ""}`
              }
            >
              {selectable ? (
                <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds?.has(project.id) ?? false}
                    onChange={(event) => onToggleSelect?.(project.id, event.target.checked)}
                    className={isEditVariant ? "size-4 rounded-none border-gray-300" : "size-4 rounded-none border-[#A5D7E8]"}
                    aria-label={`Seleccionar ${project.nombre}`}
                  />
                </td>
              ) : null}
              <td className={isEditVariant ? "px-4 py-3 font-medium text-gray-900" : "px-4 py-3 font-semibold text-[#003A6C]"}>{project.nombre}</td>
              <td className={isEditVariant ? "px-4 py-3 text-gray-600" : "px-4 py-3 text-[#355468]"}>{project.rol}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.tecnologias.slice(0, 3).map((technology) => (
                    <Badge key={technology.id} variant="secondary" className={isEditVariant ? "bg-gray-100 text-gray-700 hover:bg-gray-100" : "bg-[#D9EAF4] text-[#003A6C]"}>
                      {technology.name}
                    </Badge>
                  ))}
                  {project.tecnologias.length > 3 ? (
                    <Badge variant="secondary" className={isEditVariant ? "bg-gray-100 text-gray-700 hover:bg-gray-100" : "bg-[#D9EAF4] text-[#003A6C]"}>
                      +{project.tecnologias.length - 3}
                    </Badge>
                  ) : null}
                </div>
              </td>
              <td className={isEditVariant ? "px-4 py-3 text-gray-600" : "px-4 py-3 text-[#4B778D]"}>
                {formatProjectDate(project.fechaInicio)} - {project.is_current ? (isEditVariant ? "Presente" : "Actualidad") : formatProjectDate(project.fechaFin)}
              </td>
              <td className="px-4 py-3">
                <Badge className={isEditVariant ? (project.is_current ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100") : (project.is_current ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700")}>
                  {project.is_current ? "En curso" : "Finalizado"}
                </Badge>
              </td>
              {onEdit ? (
                <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onEdit(project)}
                    className={isEditVariant ? "h-9 border-gray-300 bg-white text-gray-700 hover:bg-gray-50" : "h-9 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"}
                  >
                    <Edit3 className="size-4" />
                    Editar
                  </Button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export function ProjectFormModal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-[#6DACBF] bg-[#C2DBED] shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#D7E6F2] px-5 pb-4 pt-5 sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-[#003A6C]">{title}</h2>
            <p className="mt-1 text-sm text-[#4B778D]">{description}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

export function ProjectDetailsModal({ project, onClose }: { project: ProjectItem | null; onClose: () => void }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#003A6C]">Detalle de proyecto</h2>
            <p className="mt-1 text-sm text-[#4B778D]">Información completa del proyecto seleccionado.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]"
            aria-label="Cerrar detalle de proyecto"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            {project.image ? (
            <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-[#D7E6F2] bg-white p-1 shadow-sm">
              <img
                src={project.image}
                alt={project.nombre}
                className="h-full w-full rounded-md object-cover"
              />
            </div>
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
                <FolderGit2 className="size-8" />
              </div>
            )}
            <div>
              <p className="text-xl font-semibold text-[#003A6C]">{project.nombre}</p>
              <p className="text-[#4B778D]">{project.rol || "Rol no especificado"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className={project.is_current ? "bg-[#D9EAF4] text-[#003A6C]" : "bg-slate-100 text-slate-700"}>
                  {project.is_current ? "En curso" : "Finalizado"}
                </Badge>
                {project.tecnologias.slice(0, 3).map((technology) => (
                  <Badge key={technology.id} className="bg-[#EEF5F9] text-[#003A6C]">
                    {technology.name}
                  </Badge>
                ))}
                {project.tecnologias.length > 3 ? (
                  <Badge className="bg-[#EEF5F9] text-[#003A6C]">+{project.tecnologias.length - 3}</Badge>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Inicio" value={formatProjectDate(project.fechaInicio)} />
            <DetailItem label="Fin" value={project.is_current ? "Actualidad" : formatProjectDate(project.fechaFin)} />
            <DetailItem label="Rol" value={project.rol || "No especificado"} />
            <DetailItem
              label="Tecnologías"
              value={project.tecnologias.length ? project.tecnologias.map((technology) => technology.name).join(", ") : "No especificadas"}
            />
          </div>

          <DetailItem label="Descripción" value={project.descripcion || "No especificada"} />

          {(project.github || project.demo) ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-[#6B7E8E]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#003A6C]">{value}</p>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-[#4982AD]">{label}</p>
      <div>{children}</div>
    </div>
  );
}

export function ProjectForm({
  formData,
  errors,
  technologies,
  roleOptions,
  selectedTechs,
  preview,
  isSaving,
  submitLabel,
  onSubmit,
  onCancel,
  onFieldChange,
  onTechnologyAdd,
  onTechnologyRemove,
  onImageChange,
  onImageRemove,
  tone = "page",
  readOnlyFields = false,
  canEditGithub = true,
  canEditDemo = true,
}: {
  formData: ProjectFormValues;
  errors: ProjectFormErrors;
  technologies: ProjectTechnology[];
  roleOptions: string[];
  selectedTechs: ProjectTechnology[];
  preview: string | null;
  isSaving: boolean;
  submitLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onFieldChange: (field: keyof ProjectFormValues, value: string | boolean) => void;
  onTechnologyAdd: (technologyId: string) => void;
  onTechnologyRemove: (id: number) => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  tone?: "page" | "modal";
  readOnlyFields?: boolean;
  canEditGithub?: boolean;
  canEditDemo?: boolean;
}) {
  const isModalTone = tone === "modal";
  const [technologySearch, setTechnologySearch] = useState("");
  const [showTechnologyDropdown, setShowTechnologyDropdown] = useState(false);
  const [activeTechnologyIndex, setActiveTechnologyIndex] = useState(0);
  const fieldInputClassName = isModalTone ? modalInputClassName : inputClassName;
  const disabledInputClassName = isModalTone
    ? "cursor-not-allowed border-[#D7E6F2] bg-[#EEF5F9] text-[#7F97AB] opacity-100"
    : "border-[#D7E6F2] bg-[#EEF5F9] text-[#6B7E8E]";
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  const filteredTechnologies = technologies.filter((technology) => {
    const search = technologySearch.trim().toLowerCase();
    return (
      search &&
      technology.name.toLowerCase().includes(search) &&
      !selectedTechs.some((selected) => selected.id === technology.id)
    );
  });

  function handleTechnologySelect(technologyId: number) {
    onTechnologyAdd(String(technologyId));
    setTechnologySearch("");
    setShowTechnologyDropdown(false);
    setActiveTechnologyIndex(0);
  }

  function handleTechnologyKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showTechnologyDropdown && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setShowTechnologyDropdown(true);
    }

    if (!filteredTechnologies.length) {
      if (event.key === "Escape") {
        setShowTechnologyDropdown(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveTechnologyIndex((current) => (current + 1) % filteredTechnologies.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveTechnologyIndex((current) => (current - 1 + filteredTechnologies.length) % filteredTechnologies.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleTechnologySelect(filteredTechnologies[activeTechnologyIndex]?.id ?? filteredTechnologies[0].id);
      return;
    }

    if (event.key === "Escape") {
      setShowTechnologyDropdown(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        isModalTone
          ? "space-y-6 rounded-2xl bg-[#C2DBED]"
          : "space-y-5 rounded-2xl border border-[#A5D7E8] bg-white p-5 shadow-sm sm:p-6"
      }
    >
      <FeedbackMessage message={errors.form ?? ""} type="error" />
      <div className={isModalTone ? "space-y-6" : "grid gap-4 md:grid-cols-3"}>
        <Field label="Nombre del proyecto" error={errors.nombre} required tone={tone}>
          <Input
            value={formData.nombre}
            onChange={(event) => onFieldChange("nombre", event.target.value)}
            disabled={readOnlyFields}
            className={readOnlyFields ? disabledInputClassName : fieldInputClassName(Boolean(errors.nombre))}
            maxLength={MAX_PROJECT_NAME_LENGTH}
            aria-invalid={Boolean(errors.nombre)}
          />
        </Field>
        <Field label="Tu rol en el proyecto" error={errors.rol} required tone={tone}>
          {readOnlyFields ? (
            <Input
              value={formData.rol}
              disabled
              className={disabledInputClassName}
              aria-invalid={Boolean(errors.rol)}
            />
          ) : (
            <select
              value={formData.rol}
              onChange={(event) => onFieldChange("rol", event.target.value)}
              className={selectClassName(Boolean(errors.rol), tone)}
              aria-invalid={Boolean(errors.rol)}
            >
              <option value="">Selecciona un rol</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Tecnologías" error={errors.tecnologias} required tone={tone}>
          {readOnlyFields ? (
            <Input
              value={selectedTechs.length > 0 ? selectedTechs.map((technology) => technology.name).join(", ") : "Sin tecnologías"}
              disabled
              className={disabledInputClassName}
              aria-invalid={Boolean(errors.tecnologias)}
            />
          ) : (
            <>
              <div className="relative">
                <Input
                  value={technologySearch}
                  onChange={(event) => {
                    setTechnologySearch(event.target.value);
                    setActiveTechnologyIndex(0);
                    setShowTechnologyDropdown(true);
                  }}
                  onFocus={() => setShowTechnologyDropdown(true)}
                  onKeyDown={handleTechnologyKeyDown}
                  onBlur={() => {
                    window.setTimeout(() => setShowTechnologyDropdown(false), 120);
                  }}
                  disabled={selectedTechs.length >= 10}
                  placeholder={selectedTechs.length >= 10 ? "Límite alcanzado (max 10)" : "Buscar tecnología..."}
                  className={fieldInputClassName(Boolean(errors.tecnologias))}
                  aria-invalid={Boolean(errors.tecnologias)}
                />
                {showTechnologyDropdown && technologySearch.trim() ? (
                  <div className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
                    {filteredTechnologies.length ? (
                      filteredTechnologies.map((technology) => (
                        <button
                          key={technology.id}
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            handleTechnologySelect(technology.id);
                          }}
                          onMouseEnter={() => setActiveTechnologyIndex(filteredTechnologies.findIndex((item) => item.id === technology.id))}
                          className={`block w-full px-3 py-2 text-left text-sm text-[#003A6C] transition-colors ${
                            filteredTechnologies[activeTechnologyIndex]?.id === technology.id ? "bg-blue-50" : "hover:bg-blue-50"
                          }`}
                        >
                          {technology.name}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-xs text-gray-400">No se encontró la tecnología</p>
                    )}
                  </div>
                ) : null}
              </div>
              {selectedTechs.length > 0 ? (
                <div className={`mt-3 flex flex-wrap gap-2 rounded-xl border p-3 ${isModalTone ? "border-gray-200 bg-gray-50" : "border-[#D7E6F2] bg-[#EEF5F9]"}`}>
                  {selectedTechs.map((technology) => (
                    <Badge key={technology.id} className={`gap-1 ${isModalTone ? "bg-gray-100 text-gray-700 hover:bg-gray-100" : "bg-[#D9EAF4] text-[#003A6C]"}`}>
                      {technology.name}
                      <button type="button" onClick={() => onTechnologyRemove(technology.id)} className={`rounded-full p-0.5 ${isModalTone ? "hover:bg-gray-200" : "hover:bg-[#A5D7E8]"}`}>
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </Field>
      </div>

      <Field label="Descripción" error={errors.descripcion} tone={tone}>
        <Textarea
          value={formData.descripcion}
          onChange={(event) => onFieldChange("descripcion", event.target.value)}
          rows={4}
          maxLength={MAX_PROJECT_DESCRIPTION_LENGTH}
          className={fieldInputClassName(Boolean(errors.descripcion))}
          aria-invalid={Boolean(errors.descripcion)}
        />
      </Field>

      <div className={isModalTone ? "grid gap-6 md:grid-cols-2" : "grid gap-4 md:grid-cols-3"}>
        <Field label="Fecha de inicio" error={errors.fechaInicio} required tone={tone}>
          <Input
            type="date"
            value={formData.fechaInicio}
            onChange={(event) => onFieldChange("fechaInicio", event.target.value)}
            disabled={readOnlyFields}
            max={today}
            className={readOnlyFields ? disabledInputClassName : fieldInputClassName(Boolean(errors.fechaInicio))}
            aria-invalid={Boolean(errors.fechaInicio)}
          />
        </Field>
        <Field label="Fecha de finalización" error={errors.fechaFin} required={!formData.is_current} tone={tone}>
          <Input
            type="date"
            value={formData.fechaFin}
            disabled={formData.is_current || (readOnlyFields && !isModalTone)}
            max={today}
            onChange={(event) => onFieldChange("fechaFin", event.target.value)}
            className={formData.is_current || (readOnlyFields && !isModalTone) ? disabledInputClassName : fieldInputClassName(Boolean(errors.fechaFin))}
            aria-invalid={Boolean(errors.fechaFin)}
          />
        </Field>
      </div>

      <label className={`flex items-center gap-2 text-sm font-medium ${isModalTone ? "text-gray-700" : "text-[#003A6C]"}`}>
        <input type="checkbox" checked={formData.is_current} onChange={(event) => onFieldChange("is_current", event.target.checked)} className={`size-4 rounded ${isModalTone ? "border-gray-300 accent-[#003A6C]" : "border-[#A5D7E8]"}`} />
        Proyecto en curso
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Enlace de GitHub" error={errors.github} tone={tone}>
          <Input
            type="url"
            value={formData.github}
            onChange={(event) => onFieldChange("github", event.target.value)}
            disabled={!canEditGithub}
            maxLength={MAX_PROJECT_URL_LENGTH}
            placeholder="https://github.com/usuario/proyecto"
            className={!canEditGithub ? disabledInputClassName : fieldInputClassName(Boolean(errors.github))}
            aria-invalid={Boolean(errors.github)}
          />
        </Field>
        <Field label="Enlace de la demo" error={errors.demo} tone={tone}>
          <Input
            type="url"
            value={formData.demo}
            onChange={(event) => onFieldChange("demo", event.target.value)}
            disabled={!canEditDemo}
            maxLength={MAX_PROJECT_URL_LENGTH}
            placeholder="https://proyecto-demo.com"
            className={!canEditDemo ? disabledInputClassName : fieldInputClassName(Boolean(errors.demo))}
            aria-invalid={Boolean(errors.demo)}
          />
        </Field>
      </div>

      <Field label="Imagen del proyecto" error={errors.image} tone={tone}>
        <div className="space-y-3">
          {preview ? <img src={preview} alt="Vista previa del proyecto" className="h-28 w-full max-w-xs rounded-lg object-cover shadow-sm" /> : null}
          <div className="flex flex-wrap items-center gap-3">
            <label className={`rounded-lg bg-[#C2DBED] px-4 py-2 text-sm font-medium text-[#003A6C] ${readOnlyFields ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-[#A5D7E8]"}`}>
              Seleccionar archivo
              <input type="file" accept="image/png,image/jpeg" onChange={onImageChange} disabled={readOnlyFields} className="hidden" />
            </label>
            {preview && !readOnlyFields ? (
              <Button type="button" variant="outline" onClick={onImageRemove} className={isModalTone ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50" : "border-[#A5D7E8] bg-white text-[#003A6C]"}>
                Quitar imagen
              </Button>
            ) : null}
            <span className={`text-xs ${isModalTone ? "text-gray-500" : "text-[#4B778D]"}`}>JPG o PNG, máximo 2 MB</span>
          </div>
        </div>
      </Field>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={isSaving} className="bg-[#003A6C] text-white shadow-sm hover:bg-[#4982AD]">
          {!isSaving ? <Plus className="size-4" /> : null}
          {isSaving ? "Guardando..." : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving} className={isModalTone ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50" : "border-[#A5D7E8] bg-white text-[#003A6C]"}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
  tone = "page",
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  tone?: "page" | "modal";
}) {
  return (
    <div className="space-y-2">
      <label className={`text-sm font-medium ${tone === "modal" ? "text-gray-700" : "text-[#003A6C]"}`}>
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
