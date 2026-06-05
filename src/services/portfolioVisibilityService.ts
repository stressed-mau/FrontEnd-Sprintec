import axios from 'axios';

import { api } from './api';

export type SectionKey =
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'certificates'
  | 'networks';

type VisibilityTable =
  | 'skills'
  | 'projects'
  | 'educations'
  | 'social_networks'
  | 'work_experiences'
  | 'certificates';


export interface VisibilityItem {
  id: number;
  label: string;
  sublabel: string;
  checked: boolean;
  sourceTable: VisibilityTable;
}

export type PortfolioVisibilityData = Record<SectionKey, VisibilityItem[]>;

const USER_INFORMATION_ENDPOINT = '/visibility';

type VisibilityItemDto = {
  id?: number;
  name?: string;
  title?: string;
  position?: string;
  degree?: string;
  label?: string;
  role?: string;
  rol?: string;
  company_name?: string;
  company?: string;
  institution?: string;
  institution_name?: string;
  organization?: string;
  project_rol?: string;
  type?: string;
  level_of_domain?: string;
  issuer?: string;
  platform?: string;
  url?: string;
  is_public?: unknown;
};

type VisibilityResponseDto = {
  data?: {
    projects?: VisibilityItemDto[];
    skills?: VisibilityItemDto[];
    work_experiences?: VisibilityItemDto[];
    educations?: VisibilityItemDto[];
    certificates?: VisibilityItemDto[];
    social_networks?: VisibilityItemDto[];
  };
};

type VisibilityPayload = NonNullable<VisibilityResponseDto['data']>;

function formatError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.message || error.message;
    return new Error(backendMessage || 'Error en la API.');
  }
  return new Error('Error inesperado.');
}

function asBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
  return value === undefined ? true : false;
}

function toText(value: string | undefined, fallback: string): string {
  return value && value.trim().length > 0 ? value : fallback;
}

function normalizeProjects(data: VisibilityPayload) {
  return (data.projects || []).map((item) => ({
    id: item.id ?? 0,
    label: toText(item.name, 'Proyecto'),
    sublabel: toText(item.project_rol ?? item.rol ?? item.role, 'Rol no especificado'),
    checked: asBoolean(item.is_public),
    sourceTable: 'projects' as const,
  }));
}

function normalizeSkills(data: VisibilityPayload) {
  return (data.skills || []).map((item) => ({
    id: item.id ?? 0,
    label: toText(item.name, 'Habilidad'),
    sublabel: item.type === 'tecnica' ? `Técnica (${toText(item.level_of_domain, 'Sin nivel')})` : 'Blanda',
    checked: asBoolean(item.is_public),
    sourceTable: 'skills' as const,
  }));
}

function normalizeWorkExperience(data: VisibilityPayload) {
  return (data.work_experiences || []).map((item) => ({
    id: item.id ?? 0,
    label: toText(item.role ?? item.rol, 'Experiencia laboral'),
    sublabel: toText(item.company_name ?? item.company, 'Sin empresa'),
    checked: asBoolean(item.is_public),
    sourceTable: 'work_experiences' as const,
  }));
}

function normalizeEducation(data: VisibilityPayload) {
  return (data.educations || []).map((item) => ({
    id: item.id ?? 0,
    label: toText(item.title ?? item.position ?? item.degree ?? item.name ?? item.label, 'Sin titulo'),
    sublabel: toText(
      item.institution ?? item.company ?? item.company_name ?? item.institution_name ?? item.organization,
      'Sin institucion'
    ),
    checked: asBoolean(item.is_public),
    sourceTable: 'educations' as const,
  }));
}

function normalizeCertificates(data: VisibilityPayload) {
  return (data.certificates || []).map((item) => ({
    id: item.id ?? 0,
    label: toText(item.name, 'Certificado'),
    sublabel: toText(item.issuer, 'Sin emisor'),
    checked: item.is_public !== undefined ? asBoolean(item.is_public) : true,
    sourceTable: 'certificates' as const,
  }));
}

function normalizeNetworks(data: VisibilityPayload) {
  return (data.social_networks || []).map((item) => ({
    id: item.id ?? 0,
    label: toText(item.name ?? item.platform, 'Red Social'),
    sublabel: toText(item.url, ''),
    checked: asBoolean(item.is_public),
    sourceTable: 'social_networks' as const,
  }));
}

// ---------------- API ----------------
export async function getPortfolioVisibilityDataService(): Promise<PortfolioVisibilityData> {
  try {
    const res = await api.get<VisibilityResponseDto>(USER_INFORMATION_ENDPOINT);
    const payload = res.data?.data ?? {};

    return {
      projects: normalizeProjects(payload),
      skills: normalizeSkills(payload),
      experience: normalizeWorkExperience(payload),
      education: normalizeEducation(payload),
      certificates: normalizeCertificates(payload),
      networks: normalizeNetworks(payload),
    };
  } catch (error) {
    throw formatError(error);
  }
}

export async function savePortfolioVisibilitySectionService(
  _section: SectionKey,
  items: VisibilityItem[],
  itemId?: number,
  sourceTable?: VisibilityTable,
): Promise<void> {
  const targetItems =
    itemId != null
      ? items.filter((i) => i.id === itemId && i.sourceTable === sourceTable)
      : items;

  try {
    await Promise.all(
      targetItems.map((item) =>
        api.put(
          `${USER_INFORMATION_ENDPOINT}/${item.id}?table=${item.sourceTable}`,
          { is_public: item.checked }
        )
      )
    );
  } catch (error) {
    throw formatError(error);
  }
}
