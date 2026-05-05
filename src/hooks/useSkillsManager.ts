import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { createSkill, getSkills, removeSkill, updateSkill, type Skill,  type SkillType, } from '../services/skillsService';

export type { Skill };

const technicalLevelPriority: Record<string, number> = {
  basico: 1,
  intermedio: 2,
  avanzado: 3,
  experto: 4,
};

function formatSkillName(value: string): string {
  const lowercaseWords = ['de', 'la', 'el', 'en', 'y', 'con', 'para', 'por'];

  return value
    .toLowerCase()
    .trim()
    .split(' ')
    .map((word, index) => {
      if (index !== 0 && lowercaseWords.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function normalizeSkillName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }

  return dp[m][n];
}

function isSimilarToOriginal(original: string, newName: string): boolean {
  const orig = normalizeText(original);
  const next = normalizeText(newName);

  if (!next) return false;

  const prefixLength = Math.min(3, orig.length);
  if (next.startsWith(orig.slice(0, prefixLength))) return true;

  if (next.includes(orig) || orig.includes(next)) return true;

  return levenshtein(orig, next) <= 3;
}

interface SkillsManagerContextValue {
  isModalOpen: boolean;
  skills: Skill[];
  editingSkill: Skill | null;
  skillType: SkillType;
  skillName: string;
  skillLevel: string;
  errorMessage: string;
  successMessage: string;
  showSuccessModal: boolean;
  pageError: string;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  technicalSkills: Skill[];
  softSkills: Skill[];
  filteredSkills: Skill[];
  filteredTechnicalSkills: Skill[];
  filteredSoftSkills: Skill[];
  showConfirmEdit: boolean;
  showConfirmDelete: boolean;
  skillToDelete: Skill | null;
  selectedSkillIds: Set<string>;
  searchQuery: string;
  setSkillType: (value: SkillType) => void;
  setSkillName: (value: string) => void;
  setSkillLevel: (value: string) => void;
  setSearchQuery: (value: string) => void;
  handleSkillNameChange: (value: string) => void;
  setShowConfirmEdit: (value: boolean) => void;
  setShowSuccessModal: (value: boolean) => void;
  closeSuccessModal: () => void;
  setShowConfirmDelete: (value: boolean) => void;
  openModal: (skill?: Skill) => void;
  closeModal: () => void;
  handleSave: (e?: FormEvent<HTMLFormElement>) => Promise<void>;
  requestDelete: (skill: Skill) => void;
  cancelDelete: () => void;
  confirmDelete: () => Promise<void>;
  toggleSelectSkill: (id: string) => void;
  toggleSelectAll: (visibleIds: string[]) => void;
  confirmDeleteSelected: () => Promise<void>;
  setPageError: (value: string) => void;
}

const SkillsManagerContext = createContext<SkillsManagerContextValue | null>(null);

export function SkillsProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillType, setSkillType] = useState<SkillType>('tecnica');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('basico');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(new Set());
  const [pageError, setPageError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeErrorMessage = useCallback((message: string) => {
    return message.replace(/infoemacion/gi, 'información').replace(/informacion/gi, 'información');
  }, []);

  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    setPageError('');

    try {
      const remoteSkills = await getSkills();
      setSkills(remoteSkills);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar las habilidades.';
      setPageError(normalizeErrorMessage(message));
    } finally {
      setIsLoading(false);
    }
  }, [normalizeErrorMessage]);

  useEffect(() => {
    void loadSkills();
  }, [loadSkills]);

  useEffect(() => {
    if (!pageError) return;

    const id = window.setTimeout(() => setPageError(''), 5000);
    return () => window.clearTimeout(id);
  }, [pageError]);

  const resetForm = useCallback(() => {
    setEditingSkill(null);
    setSkillType('tecnica');
    setSkillName('');
    setSkillLevel('basico');
    setErrorMessage('');
    setShowConfirmEdit(false);
    setIsModalOpen(false);
  }, []);

  const closeSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
    resetForm();
  }, [resetForm]);

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillType(skill.type);
      setSkillName(skill.name);
      setSkillLevel(skill.level ?? 'basico');
    } else {
      resetForm();
    }

    setErrorMessage('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSkillNameChange = (value: string) => {
    setSkillName(value);

    if (editingSkill?.type === 'blanda' || skillType === 'blanda') {
      const hasNumbers = /\d/.test(value);
      const hasSpecial = /[^a-zA-ZÀ-ÿ\s]/.test(value);

      if (hasNumbers) {
        setErrorMessage('El Nombre de la habilidad contiene números. Solo se permiten letras.');
      } else if (hasSpecial) {
        setErrorMessage(
          'El Nombre de la habilidad contiene caracteres especiales. Solo se permiten letras.'
        );
      } else {
        setErrorMessage('');
      }
    } else if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSave = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (errorMessage.trim() || isSaving) return;

    setErrorMessage('');

    if (!skillName.trim()) {
      setErrorMessage('El campo Nombre de la habilidad es obligatorio.');
      return;
    }

    if (skillType === 'blanda') {
      const onlyLetters = /^[a-zA-ZÀ-ÿ\s]+$/;

      if (!onlyLetters.test(skillName.trim())) {
        const hasNumbers = /\d/.test(skillName);
        setErrorMessage(
          hasNumbers
            ? 'El Nombre de la habilidad contiene números. Solo se permiten letras.'
            : 'El Nombre de la habilidad contiene caracteres especiales. Solo se permiten letras.'
        );
        return;
      }
    }

    if (editingSkill && editingSkill.type === 'blanda') {
      if (!isSimilarToOriginal(editingSkill.name, skillName.trim())) {
        setErrorMessage('No se puede cambiar el nombre de la habilidad, solo se permiten correcciones.');
        return;
      }
    }

    const formattedName = formatSkillName(skillName);
    const normalizedName = normalizeSkillName(formattedName);
    
    const exists = skills.some(
      (skill) =>
        normalizeSkillName(skill.name) === normalizedName &&
        (!editingSkill || skill.id !== editingSkill.id)
    );

    if (exists) {
      setErrorMessage('Ya existe una habilidad registrada con ese nombre.');
      return;
    }

    if (editingSkill) {
        const sameName =
        normalizeSkillName(editingSkill.name) === normalizeSkillName(formattedName);
        const sameType = editingSkill.type === skillType;
        const sameLevel = (editingSkill.level ?? '').toLowerCase() === (skillLevel ?? '').toLowerCase();
        const noChanges =
    sameName &&
    sameType &&
    (skillType === 'blanda' || sameLevel);

  if (noChanges) {
  setErrorMessage('No hay cambios para guardar.');
  return;
}
}

const payload = {
  name: formattedName,
  type: skillType,
  level: skillType === 'tecnica' ? skillLevel.toLowerCase() : undefined,
};

    try {
      setIsSaving(true);

      if (editingSkill) {
        const updated = await updateSkill(editingSkill.id, payload);
        setSkills((prev) => prev.map((skill) => (skill.id === editingSkill.id ? updated : skill)));
        setSuccessMessage('La habilidad se ha actualizado correctamente.');
      } else {
        const created = await createSkill(payload);
        setSkills((prev) => [...prev, created]);
        setSuccessMessage('La habilidad se ha registrado correctamente.');
      }

      await loadSkills();
      setIsModalOpen(false);
      setShowConfirmEdit(false);
      setShowSuccessModal(true);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar la habilidad.';
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (skill: Skill) => {
    if (isDeleting) return;

    setSkillToDelete(skill);
    setShowConfirmDelete(true);
    setPageError('');
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setSkillToDelete(null);
  };

  const confirmDelete = async () => {
    if (!skillToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      await removeSkill(skillToDelete.id);
      setSkills((prev) => prev.filter((skill) => skill.id !== skillToDelete.id));
      setSelectedSkillIds((prev) => {
        const next = new Set(prev);
        next.delete(skillToDelete.id);
        return next;
      });
      setShowConfirmDelete(false);
      setSkillToDelete(null);
      setSuccessMessage('Habilidad eliminada correctamente.');
      setShowSuccessModal(true);
      await loadSkills();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar la habilidad.';
      setPageError(normalizeErrorMessage(message));
    } finally {
      setIsDeleting(false);
    }
  };

 const toggleSelectSkill = (id: string) => {
  setSelectedSkillIds((prev) => {
    if (prev.has(id)) {
      return new Set();
    }
    return new Set([id]);
  });
};

  const toggleSelectAll = (visibleIds: string[]) => {
    const allSelected = visibleIds.every((id) => selectedSkillIds.has(id));

    if (allSelected) {
      setSelectedSkillIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.delete(id));
        return next;
      });
      return;
    }

    setSelectedSkillIds((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => next.add(id));
      return next;
    });
  };

const confirmDeleteSelected = async () => {
  if (isDeleting || selectedSkillIds.size !== 1) return;
  try {    setIsDeleting(true);
    const id = Array.from(selectedSkillIds)[0];
    await removeSkill(id);
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
    setSelectedSkillIds(new Set());
    setShowConfirmDelete(false);
    setSuccessMessage('Habilidad eliminada correctamente.');
    setShowSuccessModal(true);
    await loadSkills();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No se pudo eliminar la habilidad.';

    setPageError(normalizeErrorMessage(message));
  } finally {
    setIsDeleting(false);
  }
};

  const technicalSkills = useMemo(() => {
    return skills
      .filter((skill) => skill.type === 'tecnica')
      .sort((a, b) => {
        const aPriority = technicalLevelPriority[a.level?.toLowerCase() ?? ''] ?? 0;
        const bPriority = technicalLevelPriority[b.level?.toLowerCase() ?? ''] ?? 0;

        if (bPriority !== aPriority) return aPriority - bPriority;
        return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      });
  }, [skills]);

  const softSkills = useMemo(() => {
    return skills
      .filter((skill) => skill.type === 'blanda')
      .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }, [skills]);

  const filteredSkills = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return skills;

    return skills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(query) ||
        (skill.level ?? '').toLowerCase().includes(query) ||
        skill.type.toLowerCase().includes(query)
    );
  }, [skills, searchQuery]);

  const filteredTechnicalSkills = useMemo(
    () => filteredSkills.filter((skill) => skill.type === 'tecnica'),
    [filteredSkills]
  );

  const filteredSoftSkills = useMemo(
    () => filteredSkills.filter((skill) => skill.type === 'blanda'),
    [filteredSkills]
  );

  const value: SkillsManagerContextValue = {
    isModalOpen,  skills, editingSkill, skillType,  skillName,  skillLevel, errorMessage,  successMessage,
    showSuccessModal, pageError, isLoading,isSaving, isDeleting,  technicalSkills, softSkills, filteredSkills,
    filteredTechnicalSkills, filteredSoftSkills, showConfirmEdit, showConfirmDelete, skillToDelete, selectedSkillIds, searchQuery,
    setSkillType, setSkillName, setSkillLevel, setSearchQuery, handleSkillNameChange, setShowConfirmEdit, setShowSuccessModal,
    closeSuccessModal, setShowConfirmDelete,openModal, closeModal,  handleSave,  requestDelete, cancelDelete, confirmDelete,  toggleSelectSkill,
    toggleSelectAll, confirmDeleteSelected, setPageError,
  };
  return createElement(SkillsManagerContext.Provider, { value }, children);
}

export function useSkillsManager() {
  const context = useContext(SkillsManagerContext);
  if (!context) {
    throw new Error('useSkillsManager must be used within SkillsProvider'); }
  return context;
}
