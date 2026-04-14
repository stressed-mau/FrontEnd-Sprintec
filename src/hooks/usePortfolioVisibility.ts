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
    setOpenSections((prev) => {
      const next = { ...prev };
      next[sectionKey] = !prev[sectionKey];
      return next;
    });
  };

  const persistSection = useCallback(
    async (
      sectionKey: SectionKey,
      nextItems: VisibilityItem[],
      previousItems: VisibilityItem[],
      itemId?: number,
      sourceTable?: VisibilityItem['sourceTable'],
    ) => {
      try {
        setIsSaving(true);
        setPageError('');
        await savePortfolioVisibilitySection(sectionKey, nextItems, itemId, sourceTable);
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

  const handleItemCheck = async (sectionKey: SectionKey, itemId: number, sourceTable?: VisibilityItem['sourceTable']) => {
    const previousItems = data[sectionKey];
    const clickedItem = previousItems.find(
      (item) => item.id === itemId && (sourceTable ? item.sourceTable === sourceTable : true),
    );
    if (!clickedItem) return;
    const totalChecked = Object.values(data).flat().filter((item) => item.checked).length;
    const targetItem = previousItems.find(
      (item) => item.id === itemId && item.sourceTable === clickedItem.sourceTable,
    );
    if (totalChecked === 1 && targetItem?.checked) {alert("Acción no permitida: El portafolio debe tener al menos un elemento visible.");
    return;}
    if (!targetItem) return;
    const nextItems = previousItems.map((item) =>
      (item.id === itemId && item.sourceTable === clickedItem.sourceTable) 
        ? { ...item, checked: !item.checked } 
        : item,
    );
    
    setData((prev) => ({ ...prev, [sectionKey]: nextItems }));
    await persistSection(sectionKey, nextItems, previousItems, itemId, clickedItem.sourceTable);
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