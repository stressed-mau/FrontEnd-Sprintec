import axios from "axios";
import { api } from "@/services/api";

const publicApi = axios.create({
  baseURL: (api.defaults.baseURL ?? "http://localhost:5173/api").replace(/\/+$/, ""),
  timeout: 30_000,
  headers: {
    Accept: "application/json",
  },
});

export interface ExplorePortfoliosFilters {
  search?: string;
  roles?: string[];
  technologies?: string[];
  minProjects?: number;
  minSkills?: number;
  page?: number;
  perPage?: number;
}

export interface ExplorePortfoliosMeta {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ExplorePortfoliosResponse {
  portfolios: ExplorePortfolioCard[];
  meta: ExplorePortfoliosMeta;
}

export interface ExplorePortfolioCard {
  id: string;
  slug: string;
  username: string;
  fullName: string;
  occupation: string;
  profileImage: string;
  projectsCount: number;
  skillsCount: number;
  topSkills: string[];
}

function toStringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : value == null ? fallback : String(value);
}

interface PortfolioCardApiDto {
  username: string;
  fullname: string | null;
  occupation: string | null;
  skills_count: number;
  projects_count: number;
  skills: string[];
}

interface CardsResponseDto {
  success?: boolean;
  data?: PortfolioCardApiDto[];
}

function normalizeCard(dto: PortfolioCardApiDto, index: number): ExplorePortfolioCard {
  const skills = Array.isArray(dto.skills) ? dto.skills : [];
  const topSkills = skills
    .map((s) => toStringValue(s))
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    id: toStringValue(dto.username ?? index),
    slug: toStringValue(dto.username ?? index),
    username: toStringValue(dto.username ?? index),
    fullName: toStringValue(dto.fullname, ""),
    occupation: toStringValue(dto.occupation, "Sin cargo"),
    // La API /api/cards no incluye foto; la UI maneja fallback con iniciales.
    profileImage: "",
    projectsCount: Number(dto.projects_count ?? 0),
    skillsCount: Number(dto.skills_count ?? topSkills.length),
    topSkills: topSkills.length ? topSkills : ["Sin habilidades"],
  };
}

function formatError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const backendMessage =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;

    return new Error(backendMessage || "No se pudieron cargar los portafolios.");
  }

  return new Error("No se pudieron cargar los portafolios.");
}

export async function getExplorePortfolios(filters: ExplorePortfoliosFilters = {}): Promise<ExplorePortfoliosResponse> {
  try {
    // Nota: el endpoint /api/cards no soporta paginación ni filtros del lado servidor.
    // Ignoramos `filters` y devolvemos el listado completo para filtrado/paginación en cliente.
    void filters;
    const response = await publicApi.get<CardsResponseDto>("/cards");
    const cards = Array.isArray(response.data?.data) ? response.data.data : [];

    const portfolios = cards.map(normalizeCard);
    return {
      portfolios,
      meta: {
        currentPage: 1,
        perPage: portfolios.length,
        total: portfolios.length,
        totalPages: portfolios.length > 0 ? 1 : 0,
      },
    };
  } catch (error) {
    throw formatError(error);
  }
}


