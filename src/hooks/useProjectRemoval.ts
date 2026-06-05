import { useState } from "react"

import { deleteProject } from "@/services/projectCrudService"

interface ProjectRemovalOptions {
  loadProjects: () => Promise<void>
  setPageError: (message: string) => void
  setSuccessMessage: (message: string) => void
}

export function useProjectRemoval(options: ProjectRemovalOptions) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function removeProjects(ids: number[]) {
    if (ids.length === 0) return false
    setIsDeleting(true)
    options.setPageError("")

    try {
      await Promise.all(ids.map((id) => deleteProject(id)))
      options.setSuccessMessage(ids.length > 1 ? "Proyectos eliminados correctamente." : "Proyecto eliminado correctamente.")
      await options.loadProjects()
      return true
    } catch (error) {
      options.setPageError(error instanceof Error ? error.message : "No se pudieron eliminar los proyectos.")
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    isDeleting,
    removeProjects,
  }
}
