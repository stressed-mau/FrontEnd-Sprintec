import axios from "axios";
import { api } from "@/services/api";

const publicApi = axios.create({
  baseURL: (api.defaults.baseURL ?? "http://localhost:5173/api").replace(/\/+$/, ""),
  timeout: 30_000,
  headers: {
    Accept: "application/json",
  },
});

interface SkillApiDto {
  id?: number | string;
  name?: string;
  level_of_domain?: string;
  type?: string;
  is_public?: boolean;
}

interface PortfolioApiDto {
  id?: number | string;
  user_id?: number | string;
  slug?: string;
  photo?: string;
  name?: string;
  occupation?: string;
  location?: string;
  description?: string;
  projects_count?: number;
  skills_count?: number;
  skills?: SkillApiDto[];
}

interface PortfoliosResponseDto {
  success?: boolean;
  data?: {
    count?: number;
    current_page?: number;
    per_page?: number;
    portfolios?: PortfolioApiDto[];
  };
}

const DEFAULT_EXPLORE_PORTFOLIOS_PER_PAGE = 12;

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

function normalizePortfolio(dto: PortfolioApiDto, index: number): ExplorePortfolioCard {
  const skills = Array.isArray(dto.skills) ? dto.skills : [];
  const topSkills = skills
    .map((skill) => toStringValue(skill.name))
    .filter(Boolean);

  return {
    id: toStringValue(dto.user_id ?? dto.id ?? index),
    slug: toStringValue(dto.slug),
    fullName: toStringValue(dto.name, "Sin nombre"),
    occupation: toStringValue(dto.occupation, "Sin cargo"),
    profileImage: toStringValue(dto.photo, ""),
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

function buildQueryString(filters: ExplorePortfoliosFilters = {}) {
  const searchParams = new URLSearchParams();

  if (filters.search?.trim()) {
    searchParams.set("search", filters.search.trim());
  }

  filters.roles?.filter(Boolean).forEach((role) => {
    searchParams.append("roles[]", role);
  });

  filters.technologies?.filter(Boolean).forEach((technology) => {
    searchParams.append("technologies[]", technology);
  });

  if (typeof filters.minProjects === "number" && Number.isFinite(filters.minProjects)) {
    searchParams.set("min_projects", String(filters.minProjects));
  }

  if (typeof filters.minSkills === "number" && Number.isFinite(filters.minSkills)) {
    searchParams.set("min_skills", String(filters.minSkills));
  }

  if (typeof filters.page === "number" && filters.page > 1) {
    searchParams.set("page", String(filters.page));
  }

  if (typeof filters.perPage === "number" && Number.isFinite(filters.perPage)) {
    searchParams.set("per_page", String(filters.perPage));
  }

  return searchParams.toString();
}

function normalizeResponse(responseData: unknown, pageFallback = 1): ExplorePortfoliosResponse {
  const payload = (responseData && typeof responseData === "object"
    ? (responseData as { data?: PortfoliosResponseDto["data"] })
    : null)?.data ?? responseData;

  const record = payload && typeof payload === "object" ? (payload as PortfoliosResponseDto["data"] & Record<string, unknown>) : {};
  const portfoliosSource = Array.isArray(record.portfolios) ? record.portfolios : [];
  const currentPage = Number(record.current_page ?? pageFallback);
  const perPage = Number(record.per_page ?? DEFAULT_EXPLORE_PORTFOLIOS_PER_PAGE);
  const total = Number(record.count ?? portfoliosSource.length);
  const totalPages = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1;

  return {
    portfolios: portfoliosSource.map(normalizePortfolio),
    meta: {
      currentPage,
      perPage,
      total,
      totalPages,
    },
  };
}

export async function getExplorePortfolios(filters: ExplorePortfoliosFilters = {}): Promise<ExplorePortfoliosResponse> {
  try {
    const queryString = buildQueryString(filters);
    const response = await publicApi.get<PortfoliosResponseDto>(queryString ? `/portfolios?${queryString}` : "/portfolios");
    return normalizeResponse(response.data, filters.page ?? 1);
  } catch (error) {
    throw formatError(error);
  }
}


