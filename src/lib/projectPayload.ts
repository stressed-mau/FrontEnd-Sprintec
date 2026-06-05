import type { ProjectItem, ProjectPayload, ProjectUpdatePayload } from "@/types/project"
import type { ProjectFormValues } from "@/types/projectForm"

type ProjectPayloadInput = {
  formData: ProjectFormValues
  imageId?: number
  selectedTechnologyIds: number[]
}

export function getProjectFormValues(project: ProjectItem): ProjectFormValues {
  return {
    nombre: project.nombre,
    descripcion: project.descripcion,
    rol: project.rol,
    fechaInicio: project.fechaInicio,
    fechaFin: project.fechaFin ?? "",
    is_current: project.is_current,
    github: project.github ?? "",
    demo: project.demo ?? "",
  }
}

export function buildProjectPayload(input: ProjectPayloadInput): ProjectPayload {
  return {
    title: input.formData.nombre.trim(),
    description: input.formData.descripcion.trim(),
    initial_date: input.formData.fechaInicio,
    final_date: input.formData.fechaFin || null,
    url_to_project: input.formData.github.trim() || null,
    url_to_deploy: input.formData.demo.trim() || null,
    project_rol: input.formData.rol,
    is_current: input.formData.is_current,
    technologies: input.selectedTechnologyIds,
    ...(input.imageId ? { image_id: input.imageId } : {}),
  }
}

export function buildProjectUpdatePayload(createPayload: ProjectPayload, project: ProjectItem): ProjectUpdatePayload {
  const updatePayload: ProjectUpdatePayload = {}
  const currentGithub = project.github?.trim() || null
  const currentDemo = project.demo?.trim() || null
  const currentFinalDate = project.fechaFin || null

  if (createPayload.description.trim() && createPayload.description.trim() !== project.descripcion.trim()) {
    updatePayload.description = createPayload.description
  }
  if (createPayload.is_current !== project.is_current) updatePayload.is_current = createPayload.is_current
  if (createPayload.url_to_project !== currentGithub) updatePayload.url_to_project = createPayload.url_to_project
  if (createPayload.url_to_deploy !== currentDemo) updatePayload.url_to_deploy = createPayload.url_to_deploy
  if (createPayload.is_current || createPayload.final_date !== currentFinalDate) {
    updatePayload.final_date = createPayload.is_current ? null : createPayload.final_date
  }

  return updatePayload
}
