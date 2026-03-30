import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import Header from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Edit,
  GraduationCap,
  ImagePlus,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type ExperienceType = "laboral" | "academica";

type ExperienceItem = {
  id: number;
  type: ExperienceType;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  image: string;
};

type FormValues = Omit<ExperienceItem, "id">;

type FormErrors = Partial<Record<keyof FormValues, string>>;

const emptyForm: FormValues = {
  type: "laboral",
  company: "",
  position: "",
  description: "",
  startDate: "",
  endDate: "",
  current: false,
  image: "",
};

const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

const parseDate = (value: string) => {
  const trimmedValue = value.trim();
  const matches = DATE_PATTERN.exec(trimmedValue);

  if (!matches) {
    return null;
  }

  const day = Number(matches[1]);
  const month = Number(matches[2]);
  const year = Number(matches[3]);
  const parsedDate = new Date(year, month - 1, day);

  const isSameDate =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day;

  if (!isSameDate) {
    return null;
  }

  parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};

const isFutureDate = (value: string) => {
  const parsedDate = parseDate(value);

  if (!parsedDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return parsedDate.getTime() > today.getTime();
};

const formatDateLabel = (value: string) => {
  const parsedDate = parseDate(value);

  if (!parsedDate) {
    return value;
  }

  return parsedDate.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const validateExperienceField = (
  field: keyof FormValues,
  values: FormValues,
): string => {
  const company = values.company.trim();
  const position = values.position.trim();
  const description = values.description.trim();
  const startDate = values.startDate.trim();
  const endDate = values.endDate.trim();

  if (field === "company") {
    if (!company) {
      return "El campo empresa o institución es obligatorio.";
    }

    if (company.length > 100) {
      return "El nombre de la empresa no puede exceder los 100 caracteres.";
    }
  }

  if (field === "position") {
    if (!position) {
      return "El campo cargo es obligatorio.";
    }

    if (position.length > 80) {
      return "El cargo no puede exceder los 80 caracteres.";
    }
  }

  if (field === "description" && description.length > 300) {
    return "La descripción no puede exceder los 300 caracteres.";
  }

  if (field === "startDate") {
    if (!startDate) {
      return "El campo Fecha de inicio es obligatorio.";
    }

    if (!parseDate(startDate)) {
      return "La fecha debe tener un formato válido (dd/mm/aaaa).";
    }

    if (isFutureDate(startDate)) {
      return "La fecha no puede ser mayor a la fecha actual.";
    }
  }

  if (field === "endDate") {
    if (values.current) {
      return "";
    }

    if (!endDate) {
      return "El campo Fecha de fin es obligatorio.";
    }

    if (!parseDate(endDate)) {
      return "La fecha debe tener un formato válido (dd/mm/aaaa).";
    }

    if (isFutureDate(endDate)) {
      return "La fecha no puede ser mayor a la fecha actual.";
    }

    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);

    if (parsedStartDate && parsedEndDate && parsedEndDate < parsedStartDate) {
      return "La fecha de fin no puede ser anterior a la fecha de inicio.";
    }
  }

  return "";
};

const ExperiencePage = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const laboralExperiences = experiences.filter(
    (experience) => experience.type === "laboral",
  );
  const academicExperiences = experiences.filter(
    (experience) => experience.type === "academica",
  );

  const showFeedback = (message: string, type: "success" | "error") => {
    setFeedbackMessage(message);
    setFeedbackType(type);
  };

  const clearFeedback = () => {
    setFeedbackMessage("");
    setFeedbackType("");
  };

  const closeModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    clearFeedback();
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (experience: ExperienceItem) => {
    clearFeedback();
    setEditingId(experience.id);
    setFormData({
      type: experience.type,
      company: experience.company,
      position: experience.position,
      description: experience.description,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      image: experience.image,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const updateField = (field: keyof FormValues, value: string | boolean) => {
    const nextValues: FormValues = {
      ...formData,
      [field]: value,
    } as FormValues;

    if (field === "current" && value === true) {
      nextValues.endDate = "";
    }

    setFormData(nextValues);

    if (field === "current") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        endDate: validateExperienceField("endDate", nextValues),
      }));
      return;
    }

    if (errors[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validateExperienceField(field, nextValues),
      }));
    }

    if ((field === "startDate" || field === "endDate") && errors.endDate) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        endDate: validateExperienceField("endDate", nextValues),
      }));
    }
  };

  const handleBlur = (field: keyof FormValues) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateExperienceField(field, formData),
    }));

    if (field === "startDate" || field === "endDate") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validateExperienceField(field, formData),
        endDate: validateExperienceField("endDate", formData),
      }));
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({
        ...current,
        image: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((current) => ({ ...current, image: "" }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearFeedback();

    const nextErrors: FormErrors = {
      company: validateExperienceField("company", formData),
      position: validateExperienceField("position", formData),
      description: validateExperienceField("description", formData),
      startDate: validateExperienceField("startDate", formData),
      endDate: validateExperienceField("endDate", formData),
    };

    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      return;
    }

    const payload: ExperienceItem = {
      id: editingId ?? Date.now(),
      type: formData.type,
      company: formData.company.trim(),
      position: formData.position.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate.trim(),
      endDate: formData.current ? "" : formData.endDate.trim(),
      current: formData.current,
      image: formData.image,
    };

    if (isEditing) {
      setExperiences((current) =>
        current.map((experience) =>
          experience.id === editingId ? payload : experience,
        ),
      );
    } else {
      setExperiences((current) => [payload, ...current]);
    }

    showFeedback("Experiencia registrada correctamente.", "success");
    closeModal();
  };

  const handleDelete = (id: number) => {
    clearFeedback();
    setExperiences((current) =>
      current.filter((experience) => experience.id !== id),
    );
  };

  const renderExperienceSection = (
    title: string,
    emptyMessage: string,
    icon: ReactNode,
    items: ExperienceItem[],
  ) => {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#003A6C]">
          {icon}
          <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        </div>

        {items.length === 0 ? (
          <Card className="rounded-3xl border-2 border-dashed border-[#6dacbf] bg-white py-0 shadow-sm">
            <CardContent className="px-6 py-12 text-center sm:py-14">
              <p className="text-sm text-[#4B778D] sm:text-base">{emptyMessage}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {items.map((experience) => (
              <Card
                key={experience.id}
                className="rounded-3xl border border-[#A5D7E8] bg-white py-0 shadow-sm"
              >
                <CardHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        {experience.image ? (
                          <img
                            src={experience.image}
                            alt={`Logo de ${experience.company}`}
                            className="size-14 shrink-0 rounded-2xl border border-[#D7E6F2] object-cover sm:size-16"
                          />
                        ) : (
                          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#D9EAF4] text-[#003A6C] sm:size-16">
                            {experience.type === "laboral" ? (
                              <Briefcase className="size-7" />
                            ) : (
                              <GraduationCap className="size-7" />
                            )}
                          </div>
                        )}

                        <div className="min-w-0">
                          <CardTitle className="text-lg font-semibold text-[#003A6C]">
                            {experience.position}
                          </CardTitle>
                          <p className="mt-1 wrap-break-words text-sm font-medium text-[#4B778D] sm:text-base">
                            {experience.company}
                          </p>
                          <p className="mt-2 text-sm text-[#6B7E8E]">
                            {formatDateLabel(experience.startDate)} -{" "}
                            {experience.current
                              ? "Actual"
                              : formatDateLabel(experience.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 self-end sm:self-start">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(experience)}
                          className="border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(experience.id)}
                          className="border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FFF1F1]"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>

                    {experience.description ? (
                      <p className="text-sm leading-6 text-[#355468]">
                        {experience.description}
                      </p>
                    ) : null}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div id="pagina-experiencia" className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main id="contenido-principal-experiencia" className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-center sm:text-left">
                <h1
                  id="titulo-pagina-experiencia"
                  className="mb-2 text-3xl font-bold text-[#003A6C] md:text-4xl"
                >
                  Registro de experiencia
                </h1>
                <p
                  id="descripcion-pagina-experiencia"
                  className="text-sm text-[#4B778D] md:text-base"
                >
                  Gestiona tu experiencia laboral y académica desde una sola vista.
                </p>
              </div>

              <Button
                id="boton-agregar-experiencia"
                type="button"
                onClick={openCreateModal}
                className="h-11 bg-[#003A6C] px-5 text-white hover:bg-[#1a4f7a]"
              >
                <Plus className="mr-2 size-4" />
                Agregar experiencia
              </Button>
            </div>

            {feedbackMessage ? (
              <div
                id="mensaje-retroalimentacion-experiencia"
                className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                  feedbackType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {feedbackMessage}
              </div>
            ) : null}

            <div className="space-y-8">
              {renderExperienceSection(
                "Experiencia laboral",
                "No hay experiencia laboral registrada.",
                <Briefcase className="size-5" />,
                laboralExperiences,
              )}

              {renderExperienceSection(
                "Experiencia académica",
                "No hay experiencia académica registrada.",
                <GraduationCap className="size-5" />,
                academicExperiences,
              )}
            </div>
          </div>
        </main>
      </div>

      {isModalOpen ? (
        <div
          id="fondo-modal-experiencia"
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#003A6C]/45 px-3 sm:items-center sm:px-4"
        >
          <div
            id="contenedor-modal-experiencia"
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-[#A5D7E8] bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#D7E6F2] px-5 py-5 sm:px-6">
              <div>
                <h2
                  id="titulo-modal-experiencia"
                  className="text-2xl font-bold text-[#003A6C]"
                >
                  {isEditing ? "Editar experiencia" : "Nueva experiencia"}
                </h2>
                <p
                  id="descripcion-modal-experiencia"
                  className="mt-1 text-sm text-[#4B778D]"
                >
                  Completa los campos para registrar una experiencia laboral o académica.
                </p>
              </div>

              <button
                id="boton-cerrar-modal-experiencia"
                type="button"
                onClick={closeModal}
                className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]"
                aria-label="Cerrar formulario de experiencia"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              id="formulario-experiencia"
              noValidate
              onSubmit={handleSubmit}
              className="space-y-5 px-5 py-5 sm:px-6 sm:py-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label
                    id="experience-type-label"
                    htmlFor="experience-type"
                    className="text-[#003A6C]"
                  >
                    Tipo de experiencia
                  </Label>
                  <select
                    id="experience-type"
                    value={formData.type}
                    onChange={(event) => updateField("type", event.target.value)}
                    className="h-11 w-full rounded-md border border-[#A5D7E8] bg-white px-3 text-sm text-[#003A6C] outline-none focus:ring-2 focus:ring-[#A5D7E8]"
                    aria-labelledby="experience-type-label"
                  >
                    <option value="laboral">Experiencia laboral</option>
                    <option value="academica">Experiencia académica</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label
                    id="experience-company-label"
                    htmlFor="experience-company"
                    className="text-[#003A6C]"
                  >
                    Empresa o institución
                  </Label>
                  <Input
                    id="experience-company"
                    maxLength={100}
                    value={formData.company}
                    onBlur={() => handleBlur("company")}
                    onChange={(event) => updateField("company", event.target.value)}
                    placeholder="Ej: Empresa ABC o Universidad XYZ"
                    className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                    aria-invalid={Boolean(errors.company)}
                    aria-labelledby="experience-company-label"
                    aria-describedby={
                      errors.company ? "experience-company-error" : "experience-company-help"
                    }
                  />
                  {errors.company ? (
                    <p id="experience-company-error" className="text-sm text-red-600">
                      {errors.company}
                    </p>
                  ) : (
                    <p id="experience-company-help" className="text-xs text-[#6B7E8E]">
                      Máximo 100 caracteres.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    id="experience-position-label"
                    htmlFor="experience-position"
                    className="text-[#003A6C]"
                  >
                    Cargo
                  </Label>
                  <Input
                    id="experience-position"
                    maxLength={80}
                    value={formData.position}
                    onBlur={() => handleBlur("position")}
                    onChange={(event) => updateField("position", event.target.value)}
                    placeholder="Ej: Analista, docente, investigador"
                    className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                    aria-invalid={Boolean(errors.position)}
                    aria-labelledby="experience-position-label"
                    aria-describedby={
                      errors.position
                        ? "experience-position-error"
                        : "experience-position-help"
                    }
                  />
                  {errors.position ? (
                    <p id="experience-position-error" className="text-sm text-red-600">
                      {errors.position}
                    </p>
                  ) : (
                    <p id="experience-position-help" className="text-xs text-[#6B7E8E]">
                      Máximo 80 caracteres.
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label
                    id="experience-description-label"
                    htmlFor="experience-description"
                    className="text-[#003A6C]"
                  >
                    Descripción
                  </Label>
                  <Textarea
                    id="experience-description"
                    rows={4}
                    maxLength={300}
                    value={formData.description}
                    onBlur={() => handleBlur("description")}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Describe brevemente tus funciones, logros o actividades."
                    className="resize-none border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                    aria-invalid={Boolean(errors.description)}
                    aria-labelledby="experience-description-label"
                    aria-describedby={
                      errors.description
                        ? "experience-description-error"
                        : "experience-description-help"
                    }
                  />
                  {errors.description ? (
                    <p id="experience-description-error" className="text-sm text-red-600">
                      {errors.description}
                    </p>
                  ) : (
                    <p id="experience-description-help" className="text-xs text-[#6B7E8E]">
                      Opcional. Máximo 300 caracteres.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    id="experience-start-date-label"
                    htmlFor="experience-start-date"
                    className="text-[#003A6C]"
                  >
                    Fecha de inicio
                  </Label>
                  <Input
                    id="experience-start-date"
                    inputMode="numeric"
                    value={formData.startDate}
                    onBlur={() => handleBlur("startDate")}
                    onChange={(event) => updateField("startDate", event.target.value)}
                    placeholder="dd/mm/aaaa"
                    className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                    aria-invalid={Boolean(errors.startDate)}
                    aria-labelledby="experience-start-date-label"
                    aria-describedby={
                      errors.startDate
                        ? "experience-start-date-error"
                        : "experience-start-date-help"
                    }
                  />
                  {errors.startDate ? (
                    <p id="experience-start-date-error" className="text-sm text-red-600">
                      {errors.startDate}
                    </p>
                  ) : (
                    <p id="experience-start-date-help" className="text-xs text-[#6B7E8E]">
                      Usa el formato dd/mm/aaaa.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    id="experience-end-date-label"
                    htmlFor="experience-end-date"
                    className="text-[#003A6C]"
                  >
                    Fecha de fin
                  </Label>
                  <Input
                    id="experience-end-date"
                    inputMode="numeric"
                    value={formData.endDate}
                    disabled={formData.current}
                    onBlur={() => handleBlur("endDate")}
                    onChange={(event) => updateField("endDate", event.target.value)}
                    placeholder="dd/mm/aaaa"
                    className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                    aria-invalid={Boolean(errors.endDate)}
                    aria-labelledby="experience-end-date-label"
                    aria-describedby={
                      errors.endDate
                        ? "experience-end-date-error"
                        : "experience-end-date-help"
                    }
                  />
                  {errors.endDate ? (
                    <p id="experience-end-date-error" className="text-sm text-red-600">
                      {errors.endDate}
                    </p>
                  ) : (
                    <p id="experience-end-date-help" className="text-xs text-[#6B7E8E]">
                      {formData.current
                        ? "Este campo no es obligatorio si actualmente trabajas o estudias aquí."
                        : "Usa el formato dd/mm/aaaa."}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-[#D7E6F2] bg-[#F8FBFD] px-4 py-3">
                    <input
                      id="experience-current"
                      type="checkbox"
                      checked={formData.current}
                      onChange={(event) =>
                        updateField("current", event.target.checked)
                      }
                      className="mt-1 size-4 rounded border-[#A5D7E8] text-[#003A6C] focus:ring-[#A5D7E8]"
                    />
                    <div>
                      <Label
                        id="experience-current-label"
                        htmlFor="experience-current"
                        className="cursor-pointer text-[#003A6C]"
                      >
                        Actualmente trabajo/estudio aquí
                      </Label>
                      <p className="mt-1 text-xs text-[#6B7E8E]">
                        Si activas esta opción, la fecha de fin deja de ser obligatoria.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label
                    id="experience-image-label"
                    htmlFor="experience-image"
                    className="text-[#003A6C]"
                  >
                    Logo de la empresa o institución
                  </Label>

                  <input
                    id="experience-image"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      id="boton-subir-logo"
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
                    >
                      <ImagePlus className="mr-2 size-4" />
                      Subir logo
                    </Button>

                    {formData.image ? (
                      <Button
                        id="boton-eliminar-logo"
                        type="button"
                        variant="outline"
                        onClick={removeImage}
                        className="h-11 border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FFF1F1]"
                      >
                        <X className="mr-2 size-4" />
                        Quitar imagen 
                      </Button>
                    ) : null}
                  </div>

                  {formData.image ? (
                    <div className="rounded-2xl border border-[#D7E6F2] bg-[#F8FBFD] p-4">
                      <img
                        src={formData.image}
                        alt="Vista previa del logo"
                        className="size-24 rounded-2xl object-cover"
                      />
                    </div>
                  ) : (
                    <p
                      id="experience-image-help"
                      className="text-xs text-[#6B7E8E]"
                    >
                      Este campo es opcional.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  id="boton-guardar-experiencia"
                  type="submit"
                  className="h-11 flex-1 bg-[#003A6C] text-white hover:bg-[#1a4f7a]"
                >
                  Guardar
                </Button>
                <Button
                  id="boton-cancelar-experiencia"
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="h-11 flex-1 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExperiencePage;
