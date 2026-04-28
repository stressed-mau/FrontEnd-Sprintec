import axios from 'axios';
import { api } from './api';

export type SectionKey = 'projects' | 'skills' | 'experience' | 'networks';
type VisibilityTable = 'skills' | 'projects' | 'educations' | 'social_networks' | 'work_experiences';

export interface VisibilityItem {
  id: number;
  label: string;
  sublabel: string;
  checked: boolean;
  sourceTable?: VisibilityTable;
}

const USER_INFORMATION_ENDPOINT = '/visibility';

// --- FUNCIONES DE UTILIDAD REFINADAS ---

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
  return false;
}

// --- NORMALIZADORES BASADOS EN TU JSON ---

function normalizeProjects(data: any): VisibilityItem[] {
  const list = data?.projects || [];
  return list.map((item: any) => ({
    id: item.id,
    label: item.name || item.title || 'Proyecto sin título',
    sublabel: item.role || item.description || '',
    checked: asBoolean(item.is_public),
    sourceTable: 'projects',
  }));
}

function normalizeSkills(data: any): VisibilityItem[] {
  const list = data?.skills || [];
  return list.map((item: any) => ({
    id: item.id,
    label: item.name || 'Habilidad',
    sublabel: item.type === 'blanda' ? 'Habilidad Blanda' : (item.level_of_domain || 'Técnica'),
    checked: asBoolean(item.is_public),
    sourceTable: 'skills',
  }));
}

function normalizeExperience(data: any): VisibilityItem[] {
  const workList = data?.work_experiences || [];
  const eduList = data?.educations || [];

  const workItems = workList.map((item: any) => ({
    id: item.id,
    label: item.role || 'Cargo no especificado',
    sublabel: `${item.company_name || 'Empresa'} - Laboral`,
    checked: asBoolean(item.is_public),
    sourceTable: 'work_experiences',
  }));

  const eduItems = eduList.map((item: any) => ({
    id: item.id,
    label: item.degree || item.title || 'Título académico',
    sublabel: `${item.institution_name || item.university || 'Institución'} - Académica`,
    checked: asBoolean(item.is_public),
    sourceTable: 'educations',
  }));

  return [...workItems, ...eduItems];
}

function normalizeNetworks(data: any): VisibilityItem[] {
  const list = data?.social_networks || [];
  return list.map((item: any) => ({
    id: item.id,
    label: item.name || item.platform || 'Red Social',
    sublabel: item.url || item.link || '',
    checked: asBoolean(item.is_public),
    sourceTable: 'social_networks',
  }));
}

// --- FUNCIONES PRINCIPALES ---

export async function getPortfolioVisibilityData(): Promise<Record<SectionKey, VisibilityItem[]>> {
  try {
    // CAMBIO CLAVE: Ya no enviamos el ID en la URL. 
    // Laravel ahora debería identificar al usuario por el Bearer Token.
    const response = await api.get(USER_INFORMATION_ENDPOINT);
    
    // Accedemos a response.data.data porque tu JSON viene envuelto en "data"
    const payload = response.data?.data || {};

    return {
      projects: normalizeProjects(payload),
      skills: normalizeSkills(payload),
      experience: normalizeExperience(payload),
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
  
  // Filtramos el item que queremos actualizar
  const targetItems = itemId != null 
    ? items.filter((item) => item.id === itemId && item.sourceTable === sourceTable) 
    : items;

  try {
    await Promise.all(
      targetItems.map((item) =>
        api.put(
          // El PUT sigue usando el ID del recurso (skill, proyecto, etc.) y la tabla por query param
          `${USER_INFORMATION_ENDPOINT}/${item.id}?table=${item.sourceTable ?? section}`,
          { 
            // NO mandamos el ID en el body, solo el estado
            is_public: item.checked 
          }
        )
      )
    );
  } catch (error) {
    throw formatError(error);
  }
}