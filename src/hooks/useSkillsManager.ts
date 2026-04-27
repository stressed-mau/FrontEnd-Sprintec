import { useCallback, useEffect, useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import {  createSkill, getSkills, removeSkill, updateSkill, type Skill, type SkillType } from '../services/skillsService';

export type { Skill };

const technicalLevelPriority: Record<string, number> = {
  basico: 1,
  intermedio: 2,
  avanzado: 3,
  experto: 4,
};

// ─── Utilidad: similitud entre dos strings ────────────────────────────────────
// Criterios 30-32: el nuevo nombre debe contener o empezar igual que el original
function isSimilarToOriginal(original: string, newName: string): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const orig = normalize(original);
  const next = normalize(newName);

  if (next === '') return false;

  // Empieza igual (al menos los primeros 3 caracteres del original)
  const prefixLength = Math.min(3, orig.length);
  if (next.startsWith(orig.slice(0, prefixLength))) return true;

  // El nuevo contiene el original o viceversa
  if (next.includes(orig) || orig.includes(next)) return true;

  // Distancia de edición pequeña (Levenshtein ≤ 3)
  return levenshtein(orig, next) <= 3;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

export const useSkillsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Estados del formulario
  const [skillType, setSkillType] = useState<SkillType>('tecnica');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('basico');

  // Mensajes y estados UI
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Confirmaciones
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  // Selección múltiple para delete page
  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(new Set());

  // Errores de página y carga
  const [pageError, setPageError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // ─── Buscador ──────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeErrorMessage = useCallback((message: string) => {
    return message
      .replace(/infoemacion/gi, 'información')
      .replace(/informacion/gi, 'información');
  }, []);

  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    setPageError('');
    try {
      const remoteSkills = await getSkills();
      setSkills(remoteSkills);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudieron cargar las habilidades.';
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

  // ─── Modal ──────────────────────────────────────────────────────────────────
  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillType(skill.type);
      setSkillName(skill.name);
      setSkillLevel(skill.level ?? 'basico');
    } else {
      setEditingSkill(null);
      setSkillName('');
      setSkillType('tecnica');
      setSkillLevel('basico');
    }
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setShowConfirmEdit(false);
    setErrorMessage('');
  };

  // ─── Validación en tiempo real del nombre ───────────────────────────────────
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
    } else {
      if (errorMessage) setErrorMessage('');
    }
  };

  // ─── Guardar (agregar o editar) ─────────────────────────────────────────────
  const handleSave = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (errorMessage || isSaving) return;

    setErrorMessage('');

    // Criterio 2 y 3: campo obligatorio / solo espacios
    if (!skillName.trim()) {
      setErrorMessage('El campo Nombre de la habilidad es obligatorio.');
      return;
    }

    // Criterio 8 y 9: solo letras para blandas
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

    // Criterios 30-32: editar blanda — verificar similitud con nombre original
    if (editingSkill && editingSkill.type === 'blanda') {
      if (!skillName.trim()) {
        setErrorMessage('Este campo no puede quedar vacío.');
        return;
      }
      if (!isSimilarToOriginal(editingSkill.name, skillName.trim())) {
        setErrorMessage(
          'No se puede cambiar el nombre de la habilidad, solo se permiten correcciones.'
        );
        return;
      }
    }

    // Criterio duplicados
    const skillNameLower = skillName.trim().toLowerCase();
    const exists = skills.some(
      (s) =>
        s.name.toLowerCase() === skillNameLower &&
        (!editingSkill || s.id !== editingSkill.id)
    );
    if (exists) {
      setErrorMessage('Ya existe una habilidad registrada con ese nombre.');
      return;
    }

    // Confirmación antes de editar
    if (editingSkill && !showConfirmEdit) {
      setShowConfirmEdit(true);
      return;
    }

    const payload = {
      name: skillName.trim(),
      type: skillType,
      level: skillType === 'tecnica' ? skillLevel.toLowerCase() : undefined,
    };

    try {
      setIsSaving(true);
      if (editingSkill) {
        const updated = await updateSkill(editingSkill.id, payload);
        setSkills((prev) => prev.map((s) => (s.id === editingSkill.id ? updated : s)));
        setSuccessMessage('La habilidad se ha actualizado correctamente.');
      } else {
        const created = await createSkill(payload);
        setSkills((prev) => [...prev, created]);
        setSuccessMessage('La habilidad se ha registrado correctamente.');
      }
      setIsModalOpen(false);
      setShowConfirmEdit(false);
      setShowSuccessModal(true);
      setEditingSkill(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo guardar la habilidad.';
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Eliminar (individual — usado en DeleteSkillsPage botón por fila) ───────
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
      setSkills((prev) => prev.filter((s) => s.id !== skillToDelete.id));
      setSelectedSkillIds((prev) => {
        const next = new Set(prev);
        next.delete(skillToDelete.id);
        return next;
      });
      setShowConfirmDelete(false);
      setSkillToDelete(null);
      setSuccessMessage('Habilidad eliminada correctamente.');
      setShowSuccessModal(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo eliminar la habilidad.';
      setPageError(normalizeErrorMessage(message));
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Selección múltiple (DeleteSkillsPage) ───────────────────────────────────
  const toggleSelectSkill = (id: string) => {
    setSelectedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
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
    } else {
      setSelectedSkillIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const confirmDeleteSelected = async () => {
    if (isDeleting || selectedSkillIds.size === 0) return;
    try {
      setIsDeleting(true);
      const ids = Array.from(selectedSkillIds);
      await Promise.all(ids.map((id) => removeSkill(id)));
      setSkills((prev) => prev.filter((s) => !selectedSkillIds.has(s.id)));
      setSelectedSkillIds(new Set());
      setShowConfirmDelete(false);
      setSuccessMessage('Habilidad eliminada correctamente.');
      setShowSuccessModal(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudieron eliminar las habilidades.';
      setPageError(normalizeErrorMessage(message));
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Habilidades filtradas/ordenadas ────────────────────────────────────────
  const technicalSkills = useMemo(() => {
    return skills
      .filter((s) => s.type === 'tecnica')
      .sort((a, b) => {
        const aP = technicalLevelPriority[a.level?.toLowerCase() ?? ''] ?? 0;
        const bP = technicalLevelPriority[b.level?.toLowerCase() ?? ''] ?? 0;
        if (bP !== aP) return aP - bP;
        return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      });
  }, [skills]);

  const softSkills = useMemo(() => {
    return skills
      .filter((s) => s.type === 'blanda')
      .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }, [skills]);

  // ─── Buscador: filtra sobre TODAS las habilidades ───────────────────────────
  const filteredSkills = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.level ?? '').toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
    );
  }, [skills, searchQuery]);

  const filteredTechnicalSkills = useMemo(
    () => filteredSkills.filter((s) => s.type === 'tecnica'),
    [filteredSkills]
  );

  const filteredSoftSkills = useMemo(
    () => filteredSkills.filter((s) => s.type === 'blanda'),
    [filteredSkills]
  );

  return {
    // Estado
    isModalOpen,
    skills,
    editingSkill,
    skillType,
    skillName,
    skillLevel,
    errorMessage,
    successMessage,
    showSuccessModal,
    pageError,
    isLoading,
    isSaving,
    isDeleting,
    technicalSkills,
    softSkills,
    filteredSkills,
    filteredTechnicalSkills,
    filteredSoftSkills,
    showConfirmEdit,
    showConfirmDelete,
    skillToDelete,
    selectedSkillIds,
    searchQuery,
    // Setters
    setSkillType,
    setSkillName,
    setSkillLevel,
    setSearchQuery,
    handleSkillNameChange,
    setShowConfirmEdit,
    setShowSuccessModal,
    setShowConfirmDelete,
    // Métodos
    openModal,
    closeModal,
    handleSave,
    requestDelete,
    cancelDelete,
    confirmDelete,
    toggleSelectSkill,
    toggleSelectAll,
    confirmDeleteSelected,
  };
};