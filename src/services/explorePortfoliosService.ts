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
    portfolios?: PortfolioApiDto[];
  };
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

function extractPortfolios(payload: unknown): PortfolioApiDto[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const parsed = payload as PortfoliosResponseDto;

  if (Array.isArray(parsed.data?.portfolios)) {
    return parsed.data.portfolios;
  }

  return [];
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

export async function getExplorePortfolios(): Promise<ExplorePortfolioCard[]> {
  try {
    const response = await publicApi.get<PortfoliosResponseDto>("/portfolios");
    const list = extractPortfolios(response.data);
    return list.map(normalizePortfolio);
  } catch (error) {
    throw formatError(error);
  }
}


