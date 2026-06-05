import type { ChangeEvent, FormEvent } from "react"

import type { ProjectTechnology } from "@/types/project"
import type { ProjectFormErrors, ProjectFormValues } from "@/types/projectForm"

export type ProjectFormTone = "page" | "modal"

export interface ProjectFormProps {
  formData: ProjectFormValues
  errors: ProjectFormErrors
  technologies: ProjectTechnology[]
  roleOptions: string[]
  selectedTechs: ProjectTechnology[]
  preview: string | null
  isSaving: boolean
  canSave?: boolean
  submitLabel: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  onFieldChange: (field: keyof ProjectFormValues, value: string | boolean) => void
  onTechnologyAdd: (technologyId: string) => void
  onTechnologyRemove: (id: number) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onImageRemove: () => void
  tone?: ProjectFormTone
  readOnlyFields?: boolean
  canEditGithub?: boolean
  canEditDemo?: boolean
  canEditEndDate?: boolean
}

export interface ProjectFieldClassNames {
  input: (hasError?: boolean) => string
  disabledInput: string
}
