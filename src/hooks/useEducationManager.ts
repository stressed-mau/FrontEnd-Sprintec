import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"

import { createEducation, getEducation, getEducationOptions, removeEducation, updateEducation } from "@/services/educationService"
import type { EducationFormErrors, EducationFormValues, EducationItem, EducationOptions, EducationPayload } from "@/types/education"

const EMPTY_FORM: EducationFormValues = {
  type: "academica",
  company: "",
  email: "",
  position: "",
  location: "",
  fieldOfStudy: "",
  description: "",
  startDate: "",
  endDate: "",
  current: false,
  image: "",
  certificate: "",
}

const MAX_CERTIFICATE_SIZE_BYTES = 2 * 1024 * 1024
const ALLOWED_CERTIFICATE_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
const ALLOWED_CERTIFICATE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"]

export function useEducationManager() {
  const [education, setEducation] = useState<EducationItem[]>([])
  const [formData, setFormData] = useState<EducationFormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<EducationFormErrors>({})
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null)
  const [pendingPayload, setPendingPayload] = useState<EducationPayload | null>(null)
  const [educationOptions, setEducationOptions] = useState<EducationOptions>({ titles: [], fields: [] })
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const [pageError, setPageError] = useState("")
  const [successTitle, setSuccessTitle] = useState("Éxito")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [selectedCertificateFile, setSelectedCertificateFile] = useState<File | null>(null)
  const certificateInputRef = useRef<HTMLInputElement | null>(null)
  const canRemoveCertificate = useMemo(() => Boolean(selectedCertificateFile) || Boolean(formData.certificate), [formData.certificate, selectedCertificateFile])
  const canEditEndDate = useMemo(() => !editingEducation || editingEducation.current, [editingEducation])

  const reloadEducation = useCallback(async () => {
    setIsLoading(true)
    try {
      setEducation(await getEducation())
      setPageError("")
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "No se pudo cargar la Formación Académica.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void reloadEducation()
  }, [reloadEducation])

  useEffect(() => {
    void loadEducationOptions(setEducationOptions)
  }, [])

  function prepareCreateForm() {
    resetForm()
    setFormData(EMPTY_FORM)
  }

  function openEditModal(educationItem: EducationItem) {
    resetForm()
    setEditingEducation(educationItem)
    setFormData(toFormValues(educationItem))
    setIsModalOpen(true)
  }

  function closeModal() {
    resetForm()
    setIsModalOpen(false)
  }

  function updateField(field: keyof EducationFormValues, value: string | boolean) {
    if (field === "endDate" && !canEditEndDate) return

    const nextValues = { ...formData, [field]: normalizeFieldValue(field, value) } as EducationFormValues
    if (field === "current" && value === true) nextValues.endDate = ""
    if (field === "endDate" && typeof value === "string" && value.trim()) nextValues.current = false
    setFormData(nextValues)
    setErrors((current) => ({ ...current, [field]: validateField(field, nextValues) }))
  }

  function handleBlur(field: keyof EducationFormValues) {
    setErrors((current) => ({ ...current, [field]: validateField(field, formData) }))
  }

  function handleCertificateChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    const certificateError = validateCertificateFile(file)
    if (certificateError) {
      setErrors((current) => ({ ...current, certificate: certificateError }))
      if (certificateInputRef.current) certificateInputRef.current.value = ""
      return
    }
    if (!file) return

    setSelectedCertificateFile(file)
    const reader = new FileReader()
    reader.onload = () => setFormData((current) => ({ ...current, certificate: typeof reader.result === "string" ? reader.result : "" }))
    reader.readAsDataURL(file)
    setErrors((current) => ({ ...current, certificate: "" }))
  }

  function removeCertificate() {
    setSelectedCertificateFile(null)
    setFormData((current) => ({ ...current, certificate: "" }))
    setErrors((current) => ({ ...current, certificate: "" }))
    if (certificateInputRef.current) certificateInputRef.current.value = ""
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const submittedValues = getSubmittedValues(formData, event.currentTarget)
    const nextErrors = validateForm(submittedValues, selectedCertificateFile)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean) || isSaving) return

    const payload = buildPayload(submittedValues, selectedCertificateFile, canEditEndDate)
    if (editingEducation) return openConfirmEditModal(payload)
    await saveEducation(payload)
  }

  async function confirmEditSave() {
    if (!pendingPayload || !editingEducation || isSaving) return
    await saveEducation(pendingPayload, editingEducation.id)
  }

  async function handleDelete(id: string) {
    try {
      await removeEducation(id)
      await reloadEducation()
      return true
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "No se pudo eliminar la Formación Académica.")
      return false
    }
  }

  return {
    education,
    formData,
    errors,
    feedbackMessage,
    feedbackType,
    pageError,
    educationOptions,
    isLoading,
    isSaving,
    isModalOpen,
    isConfirmEditModalOpen,
    isDuplicateModalOpen: false,
    isSuccessModalOpen,
    duplicateMessage: "",
    successTitle,
    successMessage,
    canRemoveCertificate,
    canEditEndDate,
    certificateInputRef,
    prepareCreateForm,
    openEditModal,
    closeModal,
    closeConfirmEditModal: () => setIsConfirmEditModalOpen(false),
    closeDuplicateModal: () => undefined,
    closeSuccessModal: () => setIsSuccessModalOpen(false),
    confirmEditSave,
    updateField,
    handleBlur,
    handleCertificateChange,
    removeCertificate,
    handleSubmit,
    handleDelete,
    reloadEducation,
  }

  function resetForm() {
    setEditingEducation(null)
    setPendingPayload(null)
    setSelectedCertificateFile(null)
    setErrors({})
    setFeedbackMessage("")
    setFeedbackType("")
    if (certificateInputRef.current) certificateInputRef.current.value = ""
  }

  function openConfirmEditModal(payload: EducationPayload) {
    setPendingPayload(payload)
    setIsConfirmEditModalOpen(true)
  }

  async function saveEducation(payload: EducationPayload, id?: string) {
    setIsSaving(true)
    try {
      if (id) {
        await updateEducation(id, payload)
      } else {
        await createEducation(payload)
      }
      setSuccessTitle("Éxito")
      setSuccessMessage(id ? "Formación académica actualizada correctamente." : "La formación académica ha sido registrada correctamente.")
      setIsSuccessModalOpen(true)
      setIsConfirmEditModalOpen(false)
      setIsModalOpen(false)
      resetForm()
      await reloadEducation()
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "No se pudo guardar la Formación Académica.")
      setFeedbackType("error")
    } finally {
      setIsSaving(false)
    }
  }
}

async function loadEducationOptions(setEducationOptions: (options: EducationOptions) => void) {
  try {
    setEducationOptions(await getEducationOptions())
  } catch {
    setEducationOptions({ titles: [], fields: [] })
  }
}

function toFormValues(education: EducationItem): EducationFormValues {
  return {
    type: "academica",
    company: education.company,
    email: education.email,
    position: education.position,
    location: education.location,
    fieldOfStudy: education.fieldOfStudy,
    description: education.description,
    startDate: education.startDate,
    endDate: education.endDate,
    current: education.current,
    image: education.image,
    certificate: education.certificate,
  }
}

function normalizeFieldValue(field: keyof EducationFormValues, value: string | boolean) {
  if (field !== "company" || typeof value !== "string") return value
  return value.replace(/[^\p{L}0-9\s]/gu, "").slice(0, 100)
}

function validateForm(values: EducationFormValues, certificateFile: File | null) {
  return {
    company: validateField("company", values),
    position: validateField("position", values),
    fieldOfStudy: validateField("fieldOfStudy", values),
    description: validateField("description", values),
    endDate: validateField("endDate", values),
    certificate: validateCertificateFile(certificateFile),
  }
}

function validateField(field: keyof EducationFormValues, values: EducationFormValues) {
  if (field === "company" && !values.company.trim()) return "El campo Institución académica es obligatorio."
  if (field === "position" && !values.position.trim()) return "Se debe seleccionar un nivel de formación."
  if (field === "fieldOfStudy" && !values.fieldOfStudy.trim()) return "Se debe seleccionar un área de estudio."
  if (field === "description" && values.description.trim().length > 300) return "La descripción no puede exceder los 300 caracteres."
  return ""
}

function validateCertificateFile(file: File | null) {
  if (!file) return ""

  const fileName = file.name.trim().toLowerCase()
  const hasExtension = ALLOWED_CERTIFICATE_EXTENSIONS.some((extension) => fileName.endsWith(extension))
  const hasType = ALLOWED_CERTIFICATE_TYPES.includes(file.type.toLowerCase())
  if (!hasExtension && !hasType) return "El documento de formación solo permite subir archivos PDF, JPG, JPEG o PNG."
  if (file.size > MAX_CERTIFICATE_SIZE_BYTES) return "El archivo no debe superar los 2 MB."
  return ""
}

function buildPayload(values: EducationFormValues, certificateFile: File | null, canEditEndDate = true): EducationPayload {
  return {
    ...values,
    company: values.company.trim(),
    position: values.position.trim(),
    fieldOfStudy: values.fieldOfStudy.trim(),
    description: values.description.trim(),
    endDate: canEditEndDate ? values.endDate.trim() : values.endDate,
    certificateFile,
  }
}

function getSubmittedValues(values: EducationFormValues, form: HTMLFormElement): EducationFormValues {
  const currentInput = form.elements.namedItem("education-current") as HTMLInputElement | null
  const current = currentInput?.checked ?? values.current

  return {
    ...values,
    current,
    endDate: current ? "" : values.endDate,
  }
}
