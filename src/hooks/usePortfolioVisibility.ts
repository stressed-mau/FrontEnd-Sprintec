import { useState } from 'react';

export type SectionKey = 'projects' | 'skills' | 'experience' | 'networks';

export interface VisibilityItem {
  id: number;
  label: string;
  sublabel: string;
  checked: boolean;
}

type PortfolioVisibilityData = Record<SectionKey, VisibilityItem[]>;
type OpenSections = Record<SectionKey, boolean>;

const initialData: PortfolioVisibilityData = {
  projects: [
    { id: 1, label: 'E-Commerce Platform', sublabel: 'Full Stack Developer', checked: true },
    { id: 2, label: 'Task Management App', sublabel: 'Frontend Developer', checked: true },
  ],
  skills: [
    { id: 1, label: 'React', sublabel: 'Experto', checked: true },
    { id: 2, label: 'Node.js', sublabel: 'Avanzado', checked: true },
    { id: 3, label: 'PostgreSQL', sublabel: 'Intermedio', checked: true },
  ],
  experience: [
    { id: 1, label: 'Full Stack Developer', sublabel: 'Tech Solutions SA - Laboral', checked: true },
    { id: 2, label: 'Ingeniería Informática', sublabel: 'Universidad Politécnica - Académica', checked: true },
  ],
  networks: [
    { id: 1, label: 'GitHub', sublabel: 'https://github.com/mariagarcia', checked: true },
    { id: 2, label: 'LinkedIn', sublabel: 'https://linkedin.com/in/mariagarcia', checked: true },
  ],
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

  const toggleSection = (sectionKey: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const handleItemCheck = (sectionKey: SectionKey, itemId: number) => {
    setData((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item,
      ),
    }));
  };

  const handleBulkSelect = (sectionKey: SectionKey, selectAll: boolean) => {
    setData((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((item) => ({ ...item, checked: selectAll })),
    }));
  };

  const getVisibleCountText = (sectionKey: SectionKey): string => {
    const items = data[sectionKey];
    const visibleCount = items.filter((item) => item.checked).length;
    return `${visibleCount} de ${items.length} visibles`;
  };

  return { data,openSections,sectionsArray,
    toggleSection,handleItemCheck, handleBulkSelect, getVisibleCountText,
  };
};