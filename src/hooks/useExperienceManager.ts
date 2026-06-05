import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"

import { EMPTY_EXPERIENCE_FORM } from "@/constants/experienceFormConstants"
import { createExperience, getExperiences, getWorkOptions, removeExperience, updateExperience } from "@/services/experienceService"
import type { ExperienceItem, ExperiencePayload, ExperienceType, WorkOptions } from "@/types/experience"
import { formatExperienceDate, normalizeExperienceFormDate } from "@/utils/experienceDateUtils"
import { buildExperiencePayload, hasExperienceChanges, toExperienceFormValues } from "@/utils/experienceFormPayloadUtils"
import { normalizeExperienceText, sanitizeExperienceCompany, validateExperienceField, validateExperienceForm, validateExperienceImageFile } from "@/utils/experienceValidationUtils"

export type { ExperienceItem, ExperienceType } from "@/types/experience"; export { formatExperienceDate }

export type ExperienceFormValues = Omit<ExperienceItem, "id">
export type ExperienceFormErrors = Partial<Record<keyof ExperienceFormValues, string>>

export function useExperienceManager() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [formData, setFormData] = useState<ExperienceFormValues>(EMPTY_EXPERIENCE_FORM)
  const [errors, setErrors] = useState<ExperienceFormErrors>({})
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null)
  const [originalEditingValues, setOriginalEditingValues] = useState<ExperienceFormValues | null>(null)
  const [pendingEditPayload, setPendingEditPayload] = useState<ExperiencePayload | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const [successTitle, setSuccessTitle] = useState("Éxito")
  const [successMessage, setSuccessMessage] = useState("")
  const [duplicateMessage, setDuplicateMessage] = useState("")
  const [pageError, setPageError] = useState("")
  const [workOptions, setWorkOptions] = useState<WorkOptions>({ roles: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const certificateInputRef = useRef<HTMLInputElement | null>(null)

  const laboralExperiences = useMemo(() => experiences.filter((item) => item.type === "laboral"), [experiences])
  const currentPayload = useMemo(() => buildExperiencePayload(formData, selectedImageFile), [formData, selectedImageFile])
  const currentValidationErrors = useMemo(
    () => validateExperienceForm(formData, selectedImageFile, workOptions.roles),
    [formData, selectedImageFile, workOptions.roles],
  )
  const hasCurrentFormChanges = !editingExperience || hasExperienceChanges(currentPayload, originalEditingValues)
  const canSaveExperience = !isSaving && hasCurrentFormChanges && !Object.values(currentValidationErrors).some(Boolean)
  const canRemoveImage = Boolean(selectedImageFile) || Boolean(formData.image)

  const reloadExperiences = useCallback(async () => {
    setIsLoading(true)
    try {
      setExperiences(await getExperiences())
      setPageError("")
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "No se pudieron cargar las experiencias.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => void reloadExperiences(), [reloadExperiences])

  useEffect(() => void loadWorkOptions(setWorkOptions), [])

  function prepareCreateForm(initialType: ExperienceType = "laboral") { void initialType
    resetForm()
    setFormData(EMPTY_EXPERIENCE_FORM)
  }

  function openCreateModal(initialType: ExperienceType = "laboral") {
    prepareCreateForm(initialType)
    setIsModalOpen(true)
  }

  function openEditModal(experience: ExperienceItem) {
    const values = normalizeLoadedValues(toExperienceFormValues(experience))
    clearFeedback()
    setEditingExperience(experience)
    setOriginalEditingValues(values)
    setSelectedImageFile(null)
    setFormData(values)
    setErrors({})
    setIsModalOpen(true)
    resetFileInput()
  }

  function closeModal() {
    resetForm(); setIsModalOpen(false)
  }

  function updateField(field: keyof ExperienceFormValues, value: string | boolean) {
    if (isLockedField(field)) return

    const nextValues = buildNextValues(field, value)
    setFormData(nextValues)
    setErrors((currentErrors) => buildNextErrors(currentErrors, field, nextValues))
  }

  function handleBlur(field: keyof ExperienceFormValues) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateExperienceField(field, formData, workOptions.roles),
      endDate: field === "startDate" ? validateExperienceField("endDate", formData) : currentErrors.endDate,
    }))
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    const imageError = validateExperienceImageFile(file)

    if (imageError || !file) {
      return applyImageError(imageError)
    }

    setSelectedImageFile(file)
    readImagePreview(file)
  }

  function removeImage() {
    if (editingExperience?.image) return false
    setSelectedImageFile(null)
    setFormData((current) => ({ ...current, image: "" }))
    setErrors((current) => ({ ...current, image: "" }))
    resetFileInput()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()
    closeDuplicateModal()

    const nextErrors = validateExperienceForm(formData, selectedImageFile, workOptions.roles)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean) || isSaving) return
    if (!editingExperience && showDuplicateIfNeeded()) return
    if (editingExperience && !hasExperienceChanges(currentPayload, originalEditingValues)) return showSuccessModal("No hay cambios para guardar.", "Sin cambios")
    if (editingExperience) return openConfirmEditModal(currentPayload)

    await persistExperience(currentPayload)
  }

  async function confirmEditSave() {
    if (!pendingEditPayload || !editingExperience || isSaving) return
    await persistExperience(pendingEditPayload)
  }

  async function handleDelete(id: string) {
    try {
      await removeExperience(id)
      await reloadExperiences()
      setFeedbackMessage("Experiencia eliminada correctamente.")
      setFeedbackType("success")
      return true
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "No se pudo eliminar la experiencia.")
      return false
    }
  }

  return {
    formData, errors, isModalOpen, isEditing: Boolean(editingExperience), originalEditingValues,
    isConfirmEditModalOpen, feedbackMessage, feedbackType, isDuplicateModalOpen, isSuccessModalOpen,
    duplicateMessage, successTitle, successMessage, pageError, educationOptions: { titles: [], fields: [] },
    workOptions, isLoading, isSaving, canSaveExperience, canRemoveImage, canRemoveCertificate: false,
    pendingEditPayload, laboralExperiences, academicExperiences: [], fileInputRef, certificateInputRef,
    openCreateModal, prepareCreateForm, openEditModal, closeModal, closeConfirmEditModal, closeDuplicateModal,
    closeSuccessModal, confirmEditSave, updateField, handleBlur, handleImageChange,
    handleCertificateChange: () => undefined, removeImage, removeCertificate: () => undefined,
    handleSubmit, handleDelete, reloadExperiences,
  }

  function resetForm() {
    clearFeedback(); closeConfirmEditModal(); closeDuplicateModal(); resetFileInput()
    setEditingExperience(null); setOriginalEditingValues(null); setSelectedImageFile(null); setFormData(EMPTY_EXPERIENCE_FORM)
    setErrors({})
  }

  function clearFeedback() {
    setFeedbackMessage(""); setFeedbackType(""); setPageError("")
  }

  function closeConfirmEditModal() {
    setPendingEditPayload(null); setIsConfirmEditModalOpen(false)
  }

  function closeSuccessModal() {
    setIsSuccessModalOpen(false); setSuccessTitle("Éxito"); setSuccessMessage("")
  }

  function closeDuplicateModal() {
    setIsDuplicateModalOpen(false); setDuplicateMessage("")
  }

  function openConfirmEditModal(payload: ExperiencePayload) {
    setPendingEditPayload(payload); setIsConfirmEditModalOpen(true)
  }

  function showSuccessModal(message: string, title = "Éxito") {
    setSuccessTitle(title); setSuccessMessage(message); setIsSuccessModalOpen(true)
  }

  async function persistExperience(payload: ExperiencePayload) {
    setIsSaving(true)
    try {
      await saveExperience(payload)
      closeModal()
      closeConfirmEditModal()
      await reloadExperiences()
      showSuccessModal(editingExperience ? "Experiencia actualizada correctamente." : "Experiencia registrada correctamente.")
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "No se pudo guardar la experiencia.")
      setFeedbackType("error")
    } finally {
      setIsSaving(false)
    }
  }

  async function saveExperience(payload: ExperiencePayload) {
    if (editingExperience) {
      await updateExperience(editingExperience.id, payload)
      return
    }

    await createExperience(payload)
  }

  function isLockedField(field: keyof ExperienceFormValues) {
    if (!editingExperience) return false
    return ["type", "company", "email", "position", "startDate", "current"].includes(field)
  }

  function buildNextValues(field: keyof ExperienceFormValues, value: string | boolean) {
    const normalizedValue = normalizeFieldValue(field, value)
    const nextValues = { ...formData, [field]: normalizedValue } as ExperienceFormValues
    if (field === "current" && value === true) nextValues.endDate = ""
    if (field === "endDate" && typeof normalizedValue === "string" && normalizedValue.trim()) nextValues.current = false
    return nextValues
  }

  function buildNextErrors(currentErrors: ExperienceFormErrors, field: keyof ExperienceFormValues, values: ExperienceFormValues) {
    return {
      ...currentErrors,
      [field]: validateExperienceField(field, values, workOptions.roles),
      endDate: shouldRefreshEndDate(field) ? validateExperienceField("endDate", values) : currentErrors.endDate,
    }
  }

  function normalizeFieldValue(field: keyof ExperienceFormValues, value: string | boolean) {
    if (field === "company" && typeof value === "string") return sanitizeExperienceCompany(value)
    if (field === "email" && typeof value === "string") return value.slice(0, 60)
    return value
  }

  function applyImageError(imageError: string) {
    setSelectedImageFile(null); resetFileInput()
    setFormData((current) => ({ ...current, image: editingExperience?.image ?? "" }))
    setErrors((current) => ({ ...current, image: imageError }))
  }

  function readImagePreview(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((current) => ({ ...current, image: typeof reader.result === "string" ? reader.result : "" }))
      setErrors((current) => ({ ...current, image: "" }))
    }
    reader.readAsDataURL(file)
  }

  function showDuplicateIfNeeded() {
    const duplicate = laboralExperiences.find((item) => normalizeExperienceText(item.position) === normalizeExperienceText(formData.position))
    if (!duplicate) return false

    setDuplicateMessage("Ya existe una experiencia laboral registrada con ese nombre. Ingrese un nombre diferente."); setIsDuplicateModalOpen(true)
    return true
  }

  function resetFileInput() {
    if (fileInputRef.current) fileInputRef.current.value = ""
  }
}
function normalizeLoadedValues(values: ExperienceFormValues) {
  return {
    ...values,
    type: "laboral" as const,
    startDate: normalizeExperienceFormDate(values.startDate),
    endDate: normalizeExperienceFormDate(values.endDate),
  }
}
function shouldRefreshEndDate(field: keyof ExperienceFormValues) {
  return field === "startDate" || field === "endDate" || field === "current"
}

async function loadWorkOptions(setWorkOptions: (options: WorkOptions) => void) {
  try {
    setWorkOptions(await getWorkOptions())
  } catch {
    setWorkOptions({ roles: [] })
  }
}
