import { useState } from 'react';

export interface Skill {
  id: string;
  name: string;
  type: "Habilidad técnica" | "Habilidad blanda";
  level?: string;
}

export const useSkillsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  // Estados del formulario del modal
  const [skillType, setSkillType] = useState<"Habilidad técnica" | "Habilidad blanda">("Habilidad técnica");
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("Intermedio");
  // Estados de validación y mensajes
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillType(skill.type);
      setSkillName(skill.name);
      setSkillLevel(skill.level || "Intermedio");
    } else {
      setEditingSkill(null);
      setSkillName("");
      setSkillType("Habilidad técnica");
      setSkillLevel("Intermedio");
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
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
    // Guardar habilidad
    if (editingSkill) {
      setSkills(skills.map(s => s.id === editingSkill.id 
        ? { ...s, name: skillName, type: skillType, level: skillType === "Habilidad técnica" ? skillLevel : undefined } 
        : s
      ));
    } else {
      const newSkill: Skill = {
        id: crypto.randomUUID(),
        name: skillName,
        type: skillType,
        level: skillType === "Habilidad técnica" ? skillLevel : undefined
      };
      setSkills([...skills, newSkill]);
    }
    // Mostrar mensaje de éxito y cerrar el formulario de edición
    setIsModalOpen(false);
    setEditingSkill(null);
    setSuccessMessage("Habilidad agregada correctamente.");
    setShowSuccessModal(true);

    // Cerrar modal de éxito después de 2 segundos
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  return {
    // Estados
    isModalOpen,
    skills,
    editingSkill,
    skillType,
    skillName,
    skillLevel,
    errorMessage,
    successMessage,
    showSuccessModal,
    // Setters
    setSkillType,
    setSkillName,
    setSkillLevel,
    handleSkillNameChange,
    // Métodos
    openModal,
    closeModal,
    handleSave,
    handleDelete,
  };
};
