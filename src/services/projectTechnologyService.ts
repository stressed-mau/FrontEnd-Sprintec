import { api } from "@/services/api"
import { formatProjectError } from "@/services/projectErrorService"
import { normalizeTechnology } from "@/services/projectNormalizeService"
import type { ProjectTechnology, WorkOptions } from "@/types/project"

export async function getLanguages(search = "") {
  try {
    const response = await api.get("/languages", {
      params: search.trim() ? { search } : undefined,
    })

    assertSuccessfulResponse(response.data, "Error al obtener tecnologias")

    const list = extractLanguageList(response.data)
    if (!list) throw new Error("Formato de respuesta inesperado al listar tecnologias")

    return list.map(normalizeTechnology).filter((tech): tech is ProjectTechnology => Boolean(tech))
  } catch (error) {
    throw formatProjectError(error, "Error al obtener tecnologias")
  }
}

export async function getWorkOptions(): Promise<WorkOptions> {
  try {
    const response = await api.get("/work/options")
    const data = isRecord(response.data) && isRecord(response.data.data) ? response.data.data : {}

    return {
      roles: asStringArray(data.roles ?? data.positions ?? data.titles ?? data.cargos),
    }
  } catch (error) {
    throw formatProjectError(error, "Error al obtener roles")
  }
}

export async function createLanguage(name: string) {
  const response = await api.post("/languages", { name })
  assertSuccessfulResponse(response.data, "Error al crear tecnología")
  return response.data.data
}

export async function getRoles(search = "") {
  const response = await api.get(`/roles?search=${search}`)
  assertSuccessfulResponse(response.data, "Error al obtener roles")
  return response.data.data
}

export async function createRole(name: string) {
  const response = await api.post("/roles", { name })
  assertSuccessfulResponse(response.data, "Error al crear rol")
  return response.data.data
}

function extractLanguageList(body: unknown): unknown[] | null {
  if (Array.isArray(body)) return body
  if (!isRecord(body)) return null
  if (Array.isArray(body.data)) return body.data
  if (Array.isArray(body.languages)) return body.languages
  if (Array.isArray(body.technologies)) return body.technologies
  if (!isRecord(body.data)) return null
  if (Array.isArray(body.data.languages)) return body.data.languages
  if (Array.isArray(body.data.technologies)) return body.data.technologies
  return Array.isArray(body.data.data) ? body.data.data : null
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean)
}

function assertSuccessfulResponse(data: unknown, fallback: string) {
  if (isRecord(data) && data.success === false) {
    throw new Error(typeof data.message === "string" ? data.message : fallback)
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}
