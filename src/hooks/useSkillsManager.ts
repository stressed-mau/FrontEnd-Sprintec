import { useCallback, useEffect, useState, useMemo} from 'react';
import type { FormEvent } from 'react';
import {createSkill,  getSkills, removeSkill, updateSkill,
  type Skill,
  type SkillType,
} from '../services/skillsService';

export type { Skill };

const technicalLevelPriority: Record<string, number> = {
  basico: 1,
  intermedio: 2,
  avanzado: 3,
  experto: 4,
};

export const useSkillsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  // Estados del formulario del modal
  const [skillType, setSkillType] = useState<SkillType>("tecnica");
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("basico");
  // Estados de validación y mensajes
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
//Modal de confirmacion
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const normalizeErrorMessage = useCallback((message: string) => {
    return message
      .replace(/infoemacion/gi, 'información')
      .replace(/informacion/gi, 'información');
  }, []);

  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    setPageError("");
    console.log('[loadSkills] Iniciando carga de habilidades');

    try {
      const remoteSkills = await getSkills();
      console.log('[loadSkills] Habilidades cargadas exitosamente:', remoteSkills);
      setSkills(remoteSkills);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar las habilidades.';
      console.error('[loadSkills] Error al cargar habilidades:', message);
      setPageError(normalizeErrorMessage(message));
    } finally {
      setIsLoading(false);
    }
  }, [normalizeErrorMessage]);

  useEffect(() => {
    console.log('[useSkillsManager] Component montado, llamando loadSkills');
    void loadSkills();
  }, [loadSkills]);

  useEffect(() => {
    if (!pageError) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPageError('');
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pageError]);

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillType(skill.type);
      setSkillName(skill.name);
      setSkillLevel(skill.level || "basico");
    } else {
      setEditingSkill(null);
      setSkillName("");
      setSkillType("tecnica");
      setSkillLevel("basico");
    }
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setErrorMessage('');
  };

const handleSkillNameChange = (value: string) => {
  setSkillName(value);
  if (skillType === "blanda") {
    const hasNumbers = /\d/.test(value);
    const hasSpecialChars = /[^a-zA-ZÀ-ÿ\s]/.test(value);
    if (hasNumbers) {
      setErrorMessage("El Nombre de la habilidad contiene numeros. Solo se permiten letras.");
    } else if (hasSpecialChars) {
      setErrorMessage("El Nombre de la habilidad contiene caracteres especiales. Solo se permiten letras.");
    } else {
      setErrorMessage("");
    }
  } else {
    if (errorMessage) setErrorMessage("");
  }
};

  const handleSave = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (errorMessage) return;
    if (isSaving) return;
    setErrorMessage("");  
    // Validación 1: Campo obligatorio
    if (!skillName.trim()) {
      setErrorMessage("El campo Nombre de habilidad es obligatorio.");
      return;
    }
if (skillType === "blanda") {
   const onlyLettersRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  if (!onlyLettersRegex.test(skillName.trim())) {
   const hasNumbers = /\d/.test(skillName);
    if (hasNumbers) {setErrorMessage("El Nombre de la habilidad contiene números. Solo se permiten letras.");
    } else { setErrorMessage("El Nombre de la habilidad contiene caracteres especiales. Solo se permiten letras."); }
    return;
  }
}
    // Validación 2: No permitir duplicados
    const skillNameLower = skillName.trim().toLowerCase();
    const exists = skills.some(s => 
      s.name.toLowerCase() === skillNameLower && 
      (!editingSkill || s.id !== editingSkill.id)
    );
    if (exists) {
      setErrorMessage("Ya existe una habilidad registrada con ese nombre.");
      return;
    }
    if (editingSkill && !showConfirmEdit) {
      setShowConfirmEdit(true);
      return; 
    }
    const payload = {
      name: skillName.trim(),
      type: skillType,
      level: skillType === "tecnica" ? skillLevel.toLowerCase() : undefined,
    };

    try {
      setIsSaving(true);

      if (editingSkill) {
        const updatedSkill = await updateSkill(editingSkill.id, payload);
        setSkills(prev => prev.map(s => s.id === editingSkill.id ? updatedSkill : s));
        setSuccessMessage("Habilidad actualizada correctamente.");
      } else {
        const createdSkill = await createSkill(payload);
        setSkills(prev => [...prev, createdSkill]);
        setSuccessMessage("Habilidad agregada correctamente.");
      }

      setIsModalOpen(false);
      setShowConfirmEdit(false);
      setShowSuccessModal(true);
      setEditingSkill(null);
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
    if (!skillToDelete || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      await removeSkill(skillToDelete.id);
      setSkills((currentSkills) => currentSkills.filter((skill) => skill.id !== skillToDelete.id));
      setPageError('');
      setShowConfirmDelete(false);
      setSkillToDelete(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar la habilidad.';
      setPageError(normalizeErrorMessage(message));
    } finally {
      setIsDeleting(false);
    }
  };

const technicalSkills = useMemo(() => {
  console.log('[useMemo] Recalculando habilidades técnicas');
  return skills
    .filter((skill) => skill.type === "tecnica")
    .sort((a, b) => {
      const aP = technicalLevelPriority[a.level?.toLowerCase() ?? ''] ?? 0;
      const bP = technicalLevelPriority[b.level?.toLowerCase() ?? ''] ?? 0;
      // Si tienen distinto nivel, ordena por nivel (Experto a Basico)
      if (bP !== aP) return aP - bP; 
      return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
    });
}, [skills]);

const softSkills = useMemo(() => {
  return skills
    .filter((skill) => skill.type === "blanda")
    .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
}, [skills]);

  return {
    isModalOpen,skills,editingSkill,skillType,skillName,skillLevel,errorMessage,successMessage,showSuccessModal,pageError,isLoading,isSaving,isDeleting,technicalSkills,softSkills,showConfirmEdit,showConfirmDelete,skillToDelete,// Estados
    setSkillType,setSkillName, setSkillLevel, handleSkillNameChange,setShowConfirmEdit,setShowSuccessModal,setShowConfirmDelete,// Setters
    openModal,closeModal,handleSave,requestDelete,cancelDelete,confirmDelete,// Métodos
  };
  
};
