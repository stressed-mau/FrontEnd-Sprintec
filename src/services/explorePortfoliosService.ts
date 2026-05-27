import axios from "axios";
import { api } from "@/services/api";
import { toAbsoluteAssetUrl } from "@/services/assetUrl";

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

interface PortfolioSkillApiDto {
  name?: string | null;
}

interface PortfolioCardApiDto {
  user_id?: string | number | null;
  slug?: string | null;
  username?: string | null;
  fullname?: string | null;
  name?: string | null;
  occupation?: string | null;
  image_url?: string | null;
  image?: string | null;
  photo?: string | null;
  avatar?: string | null;
  profile_image?: string | null;
  profileImage?: string | null;
  user?: {
    image_url?: string | null;
    image?: string | null;
    photo?: string | null;
    avatar?: string | null;
  } | null;
  user_information?: {
    image_url?: string | null;
    image?: string | null;
    photo?: string | null;
    avatar?: string | null;
  } | null;
  skills_count?: number | null;
  projects_count?: number | null;
  skills?: Array<string | PortfolioSkillApiDto>;
}

interface CardsResponseDto {
  success?: boolean;
  data?: PortfolioCardApiDto[] | {
    count?: number;
    portfolios?: PortfolioCardApiDto[];
  };
}

function normalizeCard(dto: PortfolioCardApiDto, index: number): ExplorePortfolioCard {
  const skills = Array.isArray(dto.skills) ? dto.skills : [];
  const topSkills = skills
    .map((s) => typeof s === "object" && s !== null ? toStringValue(s.name) : toStringValue(s))
    .map((s) => s.trim())
    .filter(Boolean);
  const slug = toStringValue(dto.slug ?? dto.username ?? dto.user_id ?? index);
  const username = toStringValue(dto.username ?? dto.slug ?? dto.user_id ?? index);

  return {
    id: toStringValue(dto.user_id ?? dto.slug ?? dto.username ?? index),
    slug,
    username,
    fullName: toStringValue(dto.fullname ?? dto.name, ""),
    occupation: toStringValue(dto.occupation, "Sin cargo"),
    profileImage: toAbsoluteAssetUrl(
      dto.photo ??
        dto.image_url ??
        dto.profile_image ??
        dto.profileImage ??
        dto.image ??
        dto.avatar ??
        dto.user_information?.image_url ??
        dto.user_information?.image ??
        dto.user_information?.photo ??
        dto.user_information?.avatar ??
        dto.user?.image_url ??
        dto.user?.image ??
        dto.user?.photo ??
        dto.user?.avatar,
    ),
    projectsCount: Number(dto.projects_count ?? 0),
    skillsCount: Number(dto.skills_count ?? topSkills.length),
    topSkills: topSkills.length ? topSkills : ["Sin habilidades"],
  };
}

function getCardsFromResponse(data: CardsResponseDto["data"]): PortfolioCardApiDto[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.portfolios)) {
    return data.portfolios;
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

export async function getExplorePortfolios(filters: ExplorePortfoliosFilters = {}): Promise<ExplorePortfoliosResponse> {
  try {
    // El endpoint publica el listado completo; los filtros y paginacion se aplican en cliente.
    void filters;
    const response = await publicApi.get<CardsResponseDto>("/portfolios");
    const cards = getCardsFromResponse(response.data?.data);

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


