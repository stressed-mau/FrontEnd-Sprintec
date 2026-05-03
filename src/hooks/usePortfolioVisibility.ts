import { useCallback, useEffect, useState } from 'react';
import { getPortfolioVisibilityData, savePortfolioVisibilitySection,
  type PortfolioVisibilityData,
  type SectionKey,
  type VisibilityItem,
} from '../services/portfolioVisibilityService';

const initialData: PortfolioVisibilityData = {
  projects: [],
  skills: [],
  experience: [],
  education: [],
  certificates: [],
  networks: [],
};

const MIN_VISIBLE_MESSAGE =
  'Debe mantener al menos un elemento visible en el portafolio.';

export const usePortfolioVisibility = () => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageError, setPageError] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPortfolioVisibilityData();
      setData(res);
    } catch (e: any) {
      setPageError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const persist = async (
    section: SectionKey,
    next: VisibilityItem[],
    prev: VisibilityItem[],
    itemId?: number,
    sourceTable?: VisibilityItem['sourceTable']
  ) => {
    try {
      setIsSaving(true);
      await savePortfolioVisibilitySection(section, next, itemId, sourceTable);
    } catch (e: any) {
      setPageError(e.message);
      setData((p) => ({ ...p, [section]: prev }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleItemCheck = async (
    section: SectionKey,
    id: number,
    sourceTable?: VisibilityItem['sourceTable']
  ) => {
    const prev = data[section];

    const totalChecked = Object.values(data)
      .flat()
      .filter((i) => i.checked).length;

    const target = prev.find(
      (i) => i.id === id && i.sourceTable === sourceTable
    );

    if (!target) return;

    if (totalChecked === 1 && target.checked) {
      setPageError(MIN_VISIBLE_MESSAGE);
      return;
    }

    const next = prev.map((i) =>
      i.id === id && i.sourceTable === sourceTable
        ? { ...i, checked: !i.checked }
        : i
    );

    setData((p) => ({ ...p, [section]: next }));
    await persist(section, next, prev, id, sourceTable);
  };

  const handleBulkSelect = async (
    section: SectionKey,
    selectAll: boolean
  ) => {
    const prev = data[section];
    const next = prev.map((i) => ({ ...i, checked: selectAll }));

    if (!selectAll) {
      const totalChecked = Object.values(data)
        .flat()
        .filter((i) => i.checked).length;

      const sectionChecked = prev.filter((i) => i.checked).length;

      if (totalChecked - sectionChecked <= 0) {
        setPageError(MIN_VISIBLE_MESSAGE);
        return;
      }
    }

    setData((p) => ({ ...p, [section]: next }));
    await persist(section, next, prev);
  };

  return {
    data, isLoading, isSaving,  pageError,
    handleItemCheck,  handleBulkSelect, reload: load,
  };
};