import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"

import { useProjectCatalogs } from "@/hooks/useProjectCatalogs"
import { useProjectImageInput } from "@/hooks/useProjectImageInput"
import { useProjectRemoval } from "@/hooks/useProjectRemoval"
import { validateProjectForm } from "@/lib/projectFormValidation"
import { buildProjectPayload, buildProjectUpdatePayload, getProjectFormValues } from "@/lib/projectPayload"
import { createProject, getProjects, updateProject } from "@/services/projectCrudService"
import { uploadImage } from "@/services/projectImageService"
import type { ProjectItem, ProjectPayload, ProjectTechnology } from "@/types/project"
import { EMPTY_PROJECT_FORM, type ProjectFormErrors, type ProjectFormValues } from "@/types/projectForm"
export type { ProjectFormErrors, ProjectFormValues, ProjectItem, ProjectTechnology }

export function useProjectsManager() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [formData, setFormData] = useState<ProjectFormValues>(EMPTY_PROJECT_FORM)
  const [selectedTechs, setSelectedTechs] = useState<ProjectTechnology[]>([])
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null)
  const [errors, setErrors] = useState<ProjectFormErrors>({})
  const { roleOptions, technologies } = useProjectCatalogs()
  const projectImage = useProjectImageInput(setErrors)
  const [pageError, setPageError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const currentValidationErrors = useMemo(
    () =>
      validateProjectForm({
        enforceRoleOption: !editingProject,
        form: formData,
        imageFile: projectImage.imageFile,
        originalProject: editingProject,
        projects,
        roleOptions,
        selectedTechs,
      }),
    [editingProject, formData, projectImage.imageFile, projects, roleOptions, selectedTechs],
  )
  const canSaveProject = !isSaving && Object.keys(currentValidationErrors).length === 0

  const loadProjects = useCallback(async () => {
    setIsLoading(true)
    setPageError("")

    try {
      setProjects(await getProjects())
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "No se pudieron cargar los proyectos.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])
  const projectRemoval = useProjectRemoval({
    loadProjects,
    setPageError,
    setSuccessMessage,
  })

  function updateField(field: keyof ProjectFormValues, value: string | boolean) {
    setFormData((current) => ({
      ...current,
      [field]: value,
      ...(field === "is_current" && value === true ? { fechaFin: "" } : {}),
      ...(field === "fechaFin" && typeof value === "string" && value.trim() ? { is_current: false } : {}),
    }))
    clearFieldError(field)
  }

  function clearFieldError(field: keyof ProjectFormValues) {
    setErrors((current) => {
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function addTechnology(technologyId: string) {
    const technology = technologies.find((item) => String(item.id) === technologyId)
    if (!technology || selectedTechs.some((item) => item.id === technology.id) || selectedTechs.length >= 10) return

    setSelectedTechs((current) => [...current, technology])
    setErrors((current) => {
      const next = { ...current }
      delete next.tecnologias
      return next
    })
  }

  function removeTechnology(id: number) {
    setSelectedTechs((current) => current.filter((item) => item.id !== id))
  }

  function startEdit(project: ProjectItem) {
    setEditingProject(project)
    setFormData(getProjectFormValues(project))
    setSelectedTechs(project.tecnologias)
    projectImage.loadExistingImage(project.image)
    setErrors({})
    setSuccessMessage("")
  }

  function resetForm() {
    setEditingProject(null)
    setFormData(EMPTY_PROJECT_FORM)
    setSelectedTechs([])
    projectImage.loadExistingImage(null)
    setErrors({})
    setSuccessMessage("")
  }

  async function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    return saveProject()
  }

  function validateProjectFormState() {
    setSuccessMessage("")
    const newErrors = validateProjectForm({
      enforceRoleOption: !editingProject,
      form: formData,
      imageFile: projectImage.imageFile,
      originalProject: editingProject,
      projects,
      roleOptions,
      selectedTechs,
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function saveProject() {
    setSuccessMessage("")
    if (!validateProjectFormState()) return false

    setIsSaving(true)

    try {
      await persistProject()
      await loadProjects()
      return true
    } catch (error) {
      setSaveError(error)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  async function persistProject() {
    const createPayload = await prepareProjectPayload()

    if (editingProject) {
      await persistProjectUpdate(createPayload)
      setSuccessMessage("Proyecto actualizado correctamente.")
      return
    }

    await createProject(createPayload)
    resetForm()
    setSuccessMessage("El proyecto ha sido registrado correctamente.")
  }

  async function prepareProjectPayload(): Promise<ProjectPayload> {
    const imageId = !editingProject && projectImage.imageFile ? await uploadImage(projectImage.imageFile) : undefined
    return buildProjectPayload({
      formData,
      imageId,
      selectedTechnologyIds: selectedTechs.map((item) => item.id),
    })
  }

  async function persistProjectUpdate(createPayload: ProjectPayload) {
    if (!editingProject) return

    const updatePayload = buildProjectUpdatePayload(createPayload, editingProject)
    if (Object.keys(updatePayload).length > 0) await updateProject(editingProject.id, updatePayload)
  }

  function setSaveError(error: unknown) {
    setErrors((current) => ({
      ...current,
      form: error instanceof Error ? error.message : "No se pudo guardar el proyecto.",
    }))
  }

  return {
    projects, technologies, roleOptions, formData, selectedTechs, editingProject,
    preview: projectImage.preview, errors, pageError, successMessage, isLoading, isSaving, isDeleting: projectRemoval.isDeleting,
    canSaveProject, updateField, addTechnology, removeTechnology, handleImageChange: projectImage.handleImageChange,
    removeImage: projectImage.removeImage, startEdit, resetForm, submitProject,
    validateProjectForm: validateProjectFormState,
    saveProject,
    removeProjects: projectRemoval.removeProjects,
  }
}
