import { api } from "@/services/api"
import { formatProjectError } from "@/services/projectErrorService"
import { extractProjectList, normalizeProject } from "@/services/projectNormalizeService"
import type { ProjectPayload, ProjectUpdatePayload } from "@/types/project"

export async function createProject(data: ProjectPayload) {
  try {
    const response = await api.post("/projects", data)
    assertSuccessfulResponse(response.data, "Error al crear proyecto")
    return response.data
  } catch (error) {
    throw formatProjectError(error, "Error al crear proyecto")
  }
}

export async function getProjects() {
  try {
    const response = await api.get("/projects")
    assertSuccessfulResponse(response.data, "Error al obtener proyectos")

    const list = extractProjectList(response.data)
    return list ? list.map(normalizeProject) : []
  } catch (error) {
    throw formatProjectError(error, "Error al obtener proyectos")
  }
}

export async function updateProject(id: number, data: ProjectUpdatePayload) {
  try {
    const response = await api.put(`/projects/${id}`, data)
    assertSuccessfulResponse(response.data, "Error al actualizar proyecto")
    return response.data
  } catch (error) {
    throw formatProjectError(error, "Error al actualizar proyecto")
  }
}

export async function deleteProject(id: number) {
  try {
    const response = await api.delete(`/projects/${id}`)
    assertSuccessfulResponse(response.data, "Error al eliminar proyecto")
    return response.data
  } catch (error) {
    throw formatProjectError(error, "Error al eliminar proyecto")
  }
}

function assertSuccessfulResponse(data: unknown, fallback: string) {
  if (!isRecord(data) || data.success !== false) return

  const message = typeof data.message === "string" && data.message.trim() ? data.message : fallback
  throw new Error(message)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}
