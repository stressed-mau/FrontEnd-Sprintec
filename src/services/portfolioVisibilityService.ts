import axios from 'axios';
import { api } from './api';

export type SectionKey = 'projects' | 'skills' | 'experience' | 'education' | 'certificates' | 'networks';
type VisibilityTable = 'skills' | 'projects' | 'educations' | 'social_networks' | 'work_experiences' | 'certificates';

export interface VisibilityItem {
  id: number;
  label: string;
  sublabel: string;
  checked: boolean;
  sourceTable?: VisibilityTable;
}

export type PortfolioVisibilityData = Record<SectionKey, VisibilityItem[]>;

const USER_INFORMATION_ENDPOINT = '/visibility';

// --- UTILIDADES ---

function formatError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.message || error.message;
    return new Error(backendMessage || 'Error en la API de visibilidad.');
  }
  return new Error('Error inesperado.');
}

function asBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
  // Por defecto, si el campo no existe (como en tus certificados), lo ponemos como visible o falso según prefieras
  return value === undefined ? true : false; 
}

// --- NORMALIZADORES BASADOS EN TU JSON ---

const normalizeProjects = (data: any) => (data?.projects || []).map((item: any) => ({
  id: item.id,
  label: item.name || item.title || 'Proyecto',
  sublabel: item.role || item.description || '',
  checked: asBoolean(item.is_public),
  sourceTable: 'projects',
}));

const normalizeSkills = (data: any) => (data?.skills || []).map((item: any) => ({
  id: item.id,
  label: item.name || 'Habilidad',
  sublabel: item.type === 'tecnica' ? `Técnica (${item.level_of_domain})` : 'Blanda',
  checked: asBoolean(item.is_public),
  sourceTable: 'skills',
}));

const normalizeWorkExperience = (data: any) => (data?.work_experiences || []).map((item: any) => ({
  id: item.id,
  label: item.role || 'Cargo',
  sublabel: item.company_name || 'Empresa',
  checked: asBoolean(item.is_public),
  sourceTable: 'work_experiences',
}));

const normalizeEducation = (data: any) => (data?.educations || []).map((item: any) => ({
  id: item.id,
  label: item.title || 'Título',
  sublabel: item.institution || 'Institución',
  checked: asBoolean(item.is_public),
  sourceTable: 'educations',
}));

const normalizeCertificates = (data: any) => (data?.certificates || []).map((item: any) => ({
  id: item.id,
  label: item.name || 'Certificado',
  sublabel: item.issuer || 'Emisor',
  // Como en tu JSON los certificados no tienen is_public, usamos una lógica segura
  checked: item.is_public !== undefined ? asBoolean(item.is_public) : true,
  sourceTable: 'certificates',
}));

const normalizeNetworks = (data: any) => (data?.social_networks || []).map((item: any) => ({
  id: item.id,
  label: item.name || item.platform || 'Red Social',
  sublabel: item.url || '',
  checked: asBoolean(item.is_public),
  sourceTable: 'social_networks',
}));

// --- FUNCIONES EXPORTADAS ---

export async function getPortfolioVisibilityData(): Promise<PortfolioVisibilityData> {
  try {
    const response = await api.get(USER_INFORMATION_ENDPOINT);
    const payload = response.data?.data || {};

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

export async function savePortfolioVisibilitySection(
  section: SectionKey,
  items: VisibilityItem[],
  itemId?: number,
  sourceTable?: VisibilityTable,
): Promise<void> {
  const targetItems = itemId != null 
    ? items.filter((item) => item.id === itemId && item.sourceTable === sourceTable) 
    : items;

  try {
    await Promise.all(
      targetItems.map((item) =>
        api.put(
          `${USER_INFORMATION_ENDPOINT}/${item.id}?table=${item.sourceTable ?? section}`,
          { is_public: item.checked }
        )
      )
    );
  } catch (error) {
    throw formatError(error);
  }
}
