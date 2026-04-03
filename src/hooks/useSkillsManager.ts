import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {createSkill,  getSkills, removeSkill, updateSkill,
  type Skill,
  type SkillType,
} from '../services/skillsService';

export type { Skill };

const technicalLevelPriority: Record<string, number> = {
  experto: 4,
  avanzado: 3,
  intermedio: 2,
  basico: 1,
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

  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      setPageError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('[useSkillsManager] Component montado, llamando loadSkills');
    void loadSkills();
  }, [loadSkills]);

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
  };

  const handleSkillNameChange = (value: string) => {
    setSkillName(value);

    if (value.length > 40) {
      setErrorMessage("El nombre de la habilidad no puede exceder los 40 caracteres.");
      return;
    }

    if (errorMessage === "El nombre de la habilidad no puede exceder los 40 caracteres.") {
      setErrorMessage("");
    }
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSaving) {
      return;
    }

    setErrorMessage("");
    // Validación 1: Campo obligatorio
    if (!skillName.trim()) {
      setErrorMessage("El campo Nombre de habilidad es obligatorio.");
      return;
    }
    // Validación 2: Máximo 40 caracteres
    if (skillName.length > 40) {
      setErrorMessage("El nombre de la habilidad no puede exceder los 40 caracteres.");
      return;
    }
    // Validación 3: No permitir duplicados
    const skillNameLower = skillName.trim().toLowerCase();
    const exists = skills.some(s => 
      s.name.toLowerCase() === skillNameLower && 
      (!editingSkill || s.id !== editingSkill.id)
    );
    if (exists) {
      setErrorMessage("Ya existe una habilidad registrada con ese nombre.");
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
        setSkills((currentSkills) =>
          currentSkills.map((currentSkill) => (currentSkill.id === editingSkill.id ? updatedSkill : currentSkill)),
        );
        setSuccessMessage("Habilidad actualizada correctamente.");
      } else {
        const createdSkill = await createSkill(payload);
        setSkills((currentSkills) => [...currentSkills, createdSkill]);
        setSuccessMessage("Habilidad agregada correctamente.");
      }

      setIsModalOpen(false);
      setEditingSkill(null);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar la habilidad.';
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeSkill(id);
      setSkills((currentSkills) => currentSkills.filter((skill) => skill.id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar la habilidad.';
      setPageError(message);
    }
  };

  const technicalSkills = skills
    .filter((skill) => skill.type === "tecnica")
    .sort((a, b) => {
      const aPriority = technicalLevelPriority[a.level ?? ''] ?? 0;
      const bPriority = technicalLevelPriority[b.level ?? ''] ?? 0;

      if (bPriority !== aPriority) {
        return bPriority - aPriority;
      }

      return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
    });

  const softSkills = skills
    .filter((skill) => skill.type === "blanda")
    .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

  return {
    // Estados
    isModalOpen,skills,editingSkill,skillType,skillName,skillLevel,errorMessage,successMessage,showSuccessModal,pageError,isLoading,isSaving,
    technicalSkills,softSkills,
    // Setters
    setSkillType,setSkillName, setSkillLevel, handleSkillNameChange,
    // Métodos
    openModal,closeModal,handleSave,handleDelete,
  };
};
