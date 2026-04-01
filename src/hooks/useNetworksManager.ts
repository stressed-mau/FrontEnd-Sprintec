import { useMemo, useState } from "react"

export type NetworkItem = {
  id: number
  name: string
  url: string
}

export type NetworkFormValues = {
  name: string
  url: string
}

export type NetworkFormErrors = Partial<Record<keyof NetworkFormValues, string>>

const EMPTY_FORM: NetworkFormValues = {
  name: "",
  url: "",
}

const MAX_NETWORKS = 10

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

    if (url.length > 100) {
      return "El campo URL permite un máximo de 100 caracteres."
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

    const hostname = parsedUrl.hostname.trim()
    const hasValidDomain = /^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(hostname)

    if (!hasValidDomain) {
      return "La URL ingresada no es válida."
    }
  }

  return ""
}

export function useNetworksManager() {
  const [networks, setNetworks] = useState<NetworkItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<NetworkFormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<NetworkFormErrors>({})
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")

  const isEditing = useMemo(() => editingId !== null, [editingId])

  function showFeedback(message: string, type: "success" | "error") {
    setFeedbackMessage(message)
    setFeedbackType(type)
  }

  function clearFeedback() {
    setFeedbackMessage("")
    setFeedbackType("")
  }

  function resetForm() {
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setErrors({})
  }

  function openCreateModal() {
    clearFeedback()

    if (networks.length >= MAX_NETWORKS) {
      showFeedback("Ha alcanzado el límite máximo de 10 redes profesionales registradas.", "error")
      return
    }

    resetForm()
    setIsModalOpen(true)
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()

    const nextErrors: NetworkFormErrors = {
      name: validateNetworkField("name", formData),
      url: validateNetworkField("url", formData),
    }

    setErrors(nextErrors)

    if (nextErrors.name || nextErrors.url) {
      return
    }

    if (!isEditing && networks.length >= MAX_NETWORKS) {
      showFeedback("Ha alcanzado el límite máximo de 10 redes profesionales registradas.", "error")
      closeModal()
      return
    }

    if (isEditing) {
      setNetworks((current) =>
        current.map((network) =>
          network.id === editingId
            ? { ...network, name: formData.name.trim(), url: formData.url.trim() }
            : network,
        ),
      )
      showFeedback("Red actualizada correctamente.", "success")
    } else {
      setNetworks((current) => [
        {
          id: Date.now(),
          name: formData.name.trim(),
          url: formData.url.trim(),
        },
        ...current,
      ])
      showFeedback("Red agregada correctamente.", "success")
    }

    closeModal()
  }

  function handleDelete(id: number) {
    clearFeedback()
    setNetworks((current) => current.filter((network) => network.id !== id))
  }

  return {
    networks,
    formData,
    errors,
    feedbackMessage,
    feedbackType,
    isModalOpen,
    isEditing,
    openCreateModal,
    openEditModal,
    closeModal,
    updateField,
    handleBlur,
    handleSubmit,
    handleDelete,
  }
}
