import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { createSkill, getSkills, removeSkill, updateSkill, type Skill,  type SkillType, } from '../services/skillsService';
import { AUTH_SESSION_CHANGED_EVENT, getAuthToken } from '@/services/auth/auth-storage';
import {  formatSkillName } from '@/utils/skills/skillUtils';
import { getSoftSkillValidationMessage,} from '@/utils/skills/skillValidation';
import {  sortTechnicalSkills,   sortSoftSkills,  filterSkills,  filterTechnicalSkills,  filterSoftSkills,} from '@/utils/skills/skillFilters';
import { validateSkillForm } from '@/utils/skills/skillFormValidation';
import { normalizeErrorMessage }from '@/utils/errorUtils';
import { toggleAllSkillSelection, toggleSkillSelection } from '@/utils/skills/skillSelectionUtils';
import { hasSkillChanges } from '@/utils/skills/skillEditUtils';
import { buildSkillPayload } from '@/utils/skills/skillPayloadUtils';

export type { Skill };

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
  canSaveSkill: boolean;
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

  const loadSkills = useCallback(async () => {
    if (!getAuthToken()) {
      setSkills([]);
      setPageError('');
      setIsLoading(false);
      return; }
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
  }, []);

  useEffect(() => {
    const handleAuthSessionChanged = () => {
      if (getAuthToken()) {
        void loadSkills();
        return;  }
      setSkills([]);
      setPageError('');
      setIsLoading(false); };

    handleAuthSessionChanged();
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleAuthSessionChanged);
    return () => window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleAuthSessionChanged);
  }, [loadSkills]);

  useEffect(() => {
    if (!pageError) return;
    const id = window.setTimeout(() => setPageError(''), 50000);
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
    } else {  resetForm(); }
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();};

  const handleSkillNameChange = (value: string) => {
    setSkillName(value);
    if (editingSkill?.type === 'blanda' || skillType === 'blanda') {
  const validationMessage =
    getSoftSkillValidationMessage(value);
  setErrorMessage(validationMessage ?? '');
} else {
  setErrorMessage('');
}};

  const handleSave = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (errorMessage.trim() || isSaving) return;
    setErrorMessage('');

    const validationError = validateSkillForm({  skillName, skillType, editingSkill, skills,});
    if (validationError) {
    setErrorMessage(validationError);
    return;
    }
    const formattedName = formatSkillName(skillName);

    if (editingSkill) {
        const hasChanges = hasSkillChanges({ editingSkill, formattedName, skillType, skillLevel,});

    if (!hasChanges) {
        setErrorMessage('No hay cambios para guardar.');
        return;
      }}

 const payload = buildSkillPayload(formattedName, skillType,  skillLevel);
 
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
    }};

const toggleSelectSkill = (id: string) => {
  setSelectedSkillIds((prev) =>
    toggleSkillSelection(prev, id)
  );};

  const toggleSelectAll = (
  visibleIds: string[]) => {
  setSelectedSkillIds((prev) =>
    toggleAllSkillSelection(prev, visibleIds)
  );};

const confirmDeleteSelected = async () => {
  if (isDeleting || selectedSkillIds.size === 0) return;
    try {
      setIsDeleting(true);
        await Promise.all(
        Array.from(selectedSkillIds).map((id) => removeSkill(id)));
      setSkills((prev) =>
        prev.filter((skill) => !selectedSkillIds.has(skill.id)));
      setSelectedSkillIds(new Set());
      setShowConfirmDelete(false);
      setSuccessMessage(
        selectedSkillIds.size > 1
          ? 'Habilidades eliminadas correctamente.'
          : 'Habilidad eliminada correctamente.'
    );
      setShowSuccessModal(true);
      await loadSkills();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No se pudieron eliminar las habilidades.';
      setPageError(normalizeErrorMessage(message));
  } finally {
    setIsDeleting(false);
  }};

  const technicalSkills = useMemo(
  () => sortTechnicalSkills(skills),
  [skills]);

  const softSkills = useMemo(
  () => sortSoftSkills(skills),
  [skills]);

  const canSaveSkill = useMemo(() => {
    if (isSaving || errorMessage.trim() || !skillName.trim()) { return false; }
    if (!editingSkill) { return true; }

   const formattedName = formatSkillName(skillName);
    return hasSkillChanges({  editingSkill,  formattedName,  skillType,  skillLevel,});
    }, [editingSkill, errorMessage, isSaving, skillLevel, skillName, skillType]);

  const filteredSkills = useMemo(() => {
    return filterSkills(skills, searchQuery);
  }, [skills, searchQuery]);

  const filteredTechnicalSkills = useMemo(() => {
    return filterTechnicalSkills(technicalSkills, searchQuery);
  }, [technicalSkills, searchQuery]);

  const filteredSoftSkills = useMemo(() => {
    return filterSoftSkills(softSkills, searchQuery);
  }, [softSkills, searchQuery]);

  const value: SkillsManagerContextValue = {
    isModalOpen,  skills, editingSkill, skillType,  skillName,  skillLevel, errorMessage,  successMessage, showSuccessModal, pageError, isLoading,isSaving, canSaveSkill, isDeleting,  technicalSkills, 
    softSkills, filteredSkills, filteredTechnicalSkills, filteredSoftSkills, showConfirmEdit, showConfirmDelete, skillToDelete, selectedSkillIds, searchQuery,
    setSkillType, setSkillName, setSkillLevel, setSearchQuery, handleSkillNameChange, setShowConfirmEdit, setShowSuccessModal, closeSuccessModal, setShowConfirmDelete,openModal, closeModal, 
    handleSave,  requestDelete, cancelDelete, confirmDelete,  toggleSelectSkill, toggleSelectAll, confirmDeleteSelected, setPageError,  };
  return createElement(SkillsManagerContext.Provider, { value }, children);
}

export function useSkillsManager() {
  const context = useContext(SkillsManagerContext);
  if (!context) {
    throw new Error('useSkillsManager must be used within SkillsProvider'); }
  return context;
}