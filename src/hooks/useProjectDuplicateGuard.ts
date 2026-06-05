import { useState } from "react"

import { normalizeProjectName } from "@/lib/projectFormValidation"
import type { ProjectItem } from "@/types/project"

const DUPLICATE_PROJECT_MESSAGE = "Ya existe un proyecto registrado con ese nombre. Ingresa un nombre diferente."

export function useProjectDuplicateGuard(projects: ProjectItem[]) {
  const [duplicateMessage, setDuplicateMessage] = useState("")

  function clearDuplicateMessage() {
    setDuplicateMessage("")
  }

  function validateUniqueProjectName(projectName: string) {
    clearDuplicateMessage()
    if (!hasDuplicateProject(projects, projectName)) return true

    setDuplicateMessage(DUPLICATE_PROJECT_MESSAGE)
    return false
  }

  return {
    clearDuplicateMessage,
    duplicateMessage,
    validateUniqueProjectName,
  }
}

function hasDuplicateProject(projects: ProjectItem[], projectName: string) {
  const normalizedName = normalizeProjectName(projectName)
  if (!normalizedName) return false

  return projects.some((project) => normalizeProjectName(project.nombre) === normalizedName)
}
