import axios from "axios";
import { api } from "@/services/api";

const publicApi = axios.create({
  baseURL: (api.defaults.baseURL ?? "http://localhost:5173/api").replace(/\/+$/, ""),
  timeout: 30_000,
  headers: {
    Accept: "application/json",
  },
});

interface ProfileData {
  name?: string;
  occupation?: string;
  bio?: string;
  image?: string;
  phone?: string;
  email?: string;
  nacionality?: string;
}

interface SkillData {
  name?: string;
  level_of_domain?: string;
  type?: string;
}

interface ProjectData {
  title?: string;
  description?: string;
  url_to_project?: string;
  url_to_deploy?: string;
}

interface EducationData {
  title?: string;
  institution?: string;
  description?: string;
  logo_url?: string;
}

interface SocialNetworkData {
  name?: string;
  url?: string;
}

interface WorkExperienceData {
  company_name?: string;
  rol?: string;
  description?: string;
  company_email?: string;
  logo_url?: string;
}

interface ConfigData {
  slug?: string;
  template?: string;
}

interface PortfolioDetailResponseDto {
  success?: boolean;
  message?: string;
  data?: {
    profile?: ProfileData;
    config?: ConfigData;
    skills?: SkillData[];
    projects?: ProjectData[];
    educations?: EducationData[];
    social_networks?: SocialNetworkData[];
    work_experiences?: WorkExperienceData[];
  };
}

export interface PortfolioDetail {
  profile: ProfileData;
  config: ConfigData;
  skills: SkillData[];
  projects: ProjectData[];
  educations: EducationData[];
  socialNetworks: SocialNetworkData[];
  workExperiences: WorkExperienceData[];
}

function formatError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const backendMessage =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;

    return new Error(backendMessage || "No se pudo cargar el portafolio.");
  }

  return new Error("No se pudo cargar el portafolio.");
}

export async function getPortfolioDetail(
  idOrSlug: string | number
): Promise<PortfolioDetail> {
  try {
    const response = await publicApi.get<PortfolioDetailResponseDto>(
      `/portfolio/${idOrSlug}`
    );

    if (!response.data?.success || !response.data?.data) {
      throw new Error(response.data?.message || "Portafolio no encontrado");
    }

    const { data } = response.data;

    return {
      profile: data.profile || {},
      config: data.config || {},
      skills: data.skills || [],
      projects: data.projects || [],
      educations: data.educations || [],
      socialNetworks: data.social_networks || [],
      workExperiences: data.work_experiences || [],
    };
  } catch (error) {
    throw formatError(error);
  }
}
