import { useCallback, useEffect, useMemo, useState } from "react"

import {
  getUserSocialNetworks,
  removeSocialNetwork,
  updateSocialNetwork,
  type SocialNetwork,
} from "@/services/socialNetworksService"

export type NetworkItem = SocialNetwork

export type NetworkFormValues = {
  name: string
  url: string
}

export type NetworkFormErrors = Partial<Record<keyof NetworkFormValues, string>>

const EMPTY_FORM: NetworkFormValues = {
  name: "",
  url: "",
}

function validateNetworkField(field: keyof NetworkFormValues, values: NetworkFormValues): string {
  const name = values.name.trim()
  const url = values.url.trim()

  if (field === "name") {
    if (!name) {
      return "El campo Nombre de la red es obligatorio."
    }

    if (name.length > 40) {
      return "El campo Nombre de la red permite un máximo de 40 caracteres."
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)) {
      return "El campo Nombre de la red contiene caracteres no válidos. Solo se permiten letras."
    }
  }

  if (field === "url") {
    if (!url) {
      return "El campo URL es obligatorio."
    }

    if (url.length > 255) {
      return "El campo URL permite un máximo de 255 caracteres."
    }

    let parsedUrl: URL

    try {
      parsedUrl = new URL(url)
    } catch {
      return "Ingrese una URL válida."
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return "Ingrese una URL válida."
    }
  }

  return ""
}

export function useNetworksManager() {
  const [networks, setNetworks] = useState<NetworkItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<NetworkFormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<NetworkFormErrors>({})
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const isEditing = useMemo(() => editingId !== null, [editingId])

  const loadNetworks = useCallback(async () => {
    setIsLoading(true)

    try {
      const remoteNetworks = await getUserSocialNetworks()
      setNetworks(remoteNetworks)
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudieron cargar las redes sociales."
      setFeedbackMessage(message)
      setFeedbackType("error")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadNetworks()
  }, [loadNetworks])

  const showFeedback = useCallback((message: string, type: "success" | "error") => {
    setFeedbackMessage(message)
    setFeedbackType(type)
  }, [])

  function clearFeedback() {
    setFeedbackMessage("")
    setFeedbackType("")
  }

  function showSuccessModal(message: string) {
    setSuccessMessage(message)
    setIsSuccessModalOpen(true)
  }

  function resetForm() {
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setErrors({})
  }

  function openEditModal(network: NetworkItem) {
    clearFeedback()
    setEditingId(network.id)
    setFormData({ name: network.name, url: network.url })
    setErrors({})
    setIsModalOpen(true)
  }

  function closeModal() {
    resetForm()
    setIsModalOpen(false)
  }

  function updateField(field: keyof NetworkFormValues, value: string) {
    setFormData((current) => ({ ...current, [field]: value }))

    if (errors[field]) {
      const nextValues = { ...formData, [field]: value }
      setErrors((current) => ({
        ...current,
        [field]: validateNetworkField(field, nextValues),
      }))
    }
  }

  function handleBlur(field: keyof NetworkFormValues) {
    setErrors((current) => ({
      ...current,
      [field]: validateNetworkField(field, formData),
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()

    const nextErrors: NetworkFormErrors = {
      name: validateNetworkField("name", formData),
      url: validateNetworkField("url", formData),
    }

    setErrors(nextErrors)

    if (nextErrors.name || nextErrors.url || !editingId) {
      return
    }

    try {
      setIsSaving(true)
      const updatedNetwork = await updateSocialNetwork(editingId, {
        name: formData.name.trim().toLowerCase(),
        url: formData.url.trim(),
      })

      setNetworks((current) =>
        current.map((network) => (network.id === editingId ? updatedNetwork : network)),
      )

      closeModal()
      showSuccessModal("Red actualizada correctamente.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar la red."
      showFeedback(message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string) {
    clearFeedback()

    try {
      await removeSocialNetwork(id)
      setNetworks((current) => current.filter((network) => network.id !== id))
      showFeedback("Red desconectada correctamente.", "success")
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo eliminar la red."
      showFeedback(message, "error")
    }
  }

  function closeSuccessModal() {
    setIsSuccessModalOpen(false)
    setSuccessMessage("")
  }

  return {
    networks,
    formData,
    errors,
    feedbackMessage,
    feedbackType,
    isModalOpen,
    isSuccessModalOpen,
    isEditing,
    successMessage,
    isLoading,
    isSaving,
    openEditModal,
    closeModal,
    closeSuccessModal,
    updateField,
    handleBlur,
    handleSubmit,
    handleDelete,
    loadNetworks,
    showFeedback,
  }
}
