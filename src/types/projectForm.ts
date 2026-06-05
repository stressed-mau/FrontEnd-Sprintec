import type { ProjectItem, ProjectTechnology } from "@/types/project"

export type ProjectFormValues = {
  nombre: string
  descripcion: string
  rol: string
  fechaInicio: string
  fechaFin: string
  is_current: boolean
  github: string
  demo: string
}

export type ProjectFormErrors = Partial<Record<keyof ProjectFormValues | "tecnologias" | "image" | "form", string>>

export const EMPTY_PROJECT_FORM: ProjectFormValues = {
  nombre: "",
  descripcion: "",
  rol: "",
  fechaInicio: "",
  fechaFin: "",
  is_current: false,
  github: "",
  demo: "",
}

export type ProjectValidationInput = {
  enforceRoleOption: boolean
  form: ProjectFormValues
  imageFile: File | null
  originalProject?: ProjectItem | null
  projects: ProjectItem[]
  roleOptions: string[]
  selectedTechs: ProjectTechnology[]
}
