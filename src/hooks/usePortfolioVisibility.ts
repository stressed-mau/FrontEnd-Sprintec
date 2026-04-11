import { useCallback, useEffect, useState } from 'react';
import {
  getPortfolioVisibilityData,
  savePortfolioVisibilitySection,
  type PortfolioVisibilityData,
  type SectionKey,
  type VisibilityItem,
} from '../services/portfolioVisibilityService';

type OpenSections = Record<SectionKey, boolean>;

const initialData: PortfolioVisibilityData = {
  projects: [],
  skills: [],
  experience: [],
  networks: [],
};

const initialOpenSections: OpenSections = {
  projects: false,
  skills: false,
  experience: false,
  networks: false,
};

const sectionsArray: { key: SectionKey; title: string }[] = [
  { key: 'projects', title: 'Proyectos' },
  { key: 'skills', title: 'Habilidades' },
  { key: 'experience', title: 'Experiencia' },
  { key: 'networks', title: 'Redes profesionales' },
];

export const usePortfolioVisibility = () => {
  const [data, setData] = useState<PortfolioVisibilityData>(initialData);
  const [openSections, setOpenSections] = useState<OpenSections>(initialOpenSections);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageError, setPageError] = useState('');

  const loadVisibilityData = useCallback(async () => {
    setIsLoading(true);
    setPageError('');

    try {
      const remoteData = await getPortfolioVisibilityData();
      setData(remoteData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo cargar la visibilidad del portafolio.';
      setPageError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVisibilityData();
  }, [loadVisibilityData]);

  const toggleSection = (sectionKey: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const persistSection = useCallback(
    async (sectionKey: SectionKey, nextItems: VisibilityItem[], previousItems: VisibilityItem[]) => {
      try {
        setIsSaving(true);
        setPageError('');
        await savePortfolioVisibilitySection(sectionKey, nextItems);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo guardar la configuración de visibilidad.';
        setPageError(message);
        setData((prev) => ({ ...prev, [sectionKey]: previousItems }));
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const handleItemCheck = async (sectionKey: SectionKey, itemId: number) => {
    const previousItems = data[sectionKey];
    const nextItems = previousItems.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item,
    );

    setData((prev) => ({ ...prev, [sectionKey]: nextItems }));
    await persistSection(sectionKey, nextItems, previousItems);
  };

  const handleBulkSelect = async (sectionKey: SectionKey, selectAll: boolean) => {
    const previousItems = data[sectionKey];
    const nextItems = previousItems.map((item) => ({ ...item, checked: selectAll }));

    setData((prev) => ({ ...prev, [sectionKey]: nextItems }));
    await persistSection(sectionKey, nextItems, previousItems);
  };

  const getVisibleCountText = (sectionKey: SectionKey): string => {
    const items = data[sectionKey];
    const visibleCount = items.filter((item) => item.checked).length;
    return `${visibleCount} de ${items.length} visibles`;
  };

  return {
    data, openSections, sectionsArray, isLoading, isSaving, pageError, 
    toggleSection, handleItemCheck, handleBulkSelect, getVisibleCountText, reloadVisibilityData: loadVisibilityData,
  };
};