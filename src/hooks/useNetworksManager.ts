import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { MutableRefObject } from "react"

import { buildConnectedProfessionalNetworks, getProfessionalNetworkLabel } from "@/components/networks/ProfessionalNetworksCatalog"
import { fetchOAuthUrl, getUserSocialNetworks, removeSocialNetwork, updateSocialNetwork } from "@/services/socialNetworksService"
import type { SocialNetwork } from "@/types/socialNetworks"
import { validateNetworkField, validateNetworkForm } from "@/utils/networkValidationUtils"

export type NetworkItem = SocialNetwork

export type NetworkFormValues = {
  name: string
  url: string
}

export type NetworkFormErrors = Partial<Record<keyof NetworkFormValues, string>>

const EMPTY_FORM: NetworkFormValues = { name: "", url: "" }

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
  const [connectingNetwork, setConnectingNetwork] = useState<string | null>(null)
  const oauthResultHandledRef = useRef(false)

  const connectedNetworks = useMemo(
    () => buildConnectedProfessionalNetworks(networks, connectingNetwork),
    [connectingNetwork, networks],
  )

  const showFeedback = useCallback((message: string, type: "success" | "error") => {
    setFeedbackMessage(message)
    setFeedbackType(type)
  }, [])

  const showError = useCallback((error: unknown, fallbackMessage: string) => {
    const message = error instanceof Error ? error.message : fallbackMessage
    showFeedback(message, "error")
  }, [showFeedback])

  const loadNetworks = useCallback(async () => {
    setIsLoading(true)

    try {
      setNetworks(await getUserSocialNetworks())
    } catch (error) {
      showError(error, "No se pudieron cargar las redes sociales.")
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  useEffect(() => {
    void loadNetworks()
  }, [loadNetworks])

  useEffect(
    () => handleOAuthResult(oauthResultHandledRef, showFeedback, loadNetworks),
    [loadNetworks, showFeedback],
  )

  async function handleDelete(id: string) {
    clearFeedback()

    try {
      await removeSocialNetwork(id)
      setNetworks((current) => current.filter((network) => network.id !== id))
      showFeedback("Red desconectada correctamente.", "success")
    } catch (error) {
      showError(error, "No se pudo eliminar la red.")
    }
  }

  function openEditModal(network: NetworkItem) {
    clearFeedback()
    setEditingId(network.id)
    setFormData({ name: network.name, url: network.url })
    setErrors({})
    setIsModalOpen(true)
  }

  function closeModal() {
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setErrors({})
    setIsModalOpen(false)
  }

  function updateField(field: keyof NetworkFormValues, value: string) {
    const nextValues = { ...formData, [field]: value }
    setFormData(nextValues)
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validateNetworkField(field, nextValues) }))
  }

  function handleBlur(field: keyof NetworkFormValues) {
    setErrors((current) => ({ ...current, [field]: validateNetworkField(field, formData) }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()

    const nextErrors = validateNetworkForm(formData)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean) || !editingId || isSaving) return

    await saveNetwork()
  }

  async function handleOAuthConnect(provider: string) {
    setConnectingNetwork(provider)

    try {
      window.location.href = await fetchOAuthUrl(provider)
    } catch (error) {
      setConnectingNetwork(null)
      showError(error, "Error al conectar")
    }
  }

  function clearFeedback() {
    setFeedbackMessage("")
    setFeedbackType("")
  }

  function closeSuccessModal() {
    setIsSuccessModalOpen(false)
    setSuccessMessage("")
  }

  async function saveNetwork() {
    setIsSaving(true)
    try {
      const updatedNetwork = await updateSocialNetwork(editingId ?? "", toNetworkPayload(formData))
      setNetworks((current) => current.map((network) => (network.id === editingId ? updatedNetwork : network)))
      closeModal()
      setSuccessMessage("Red actualizada correctamente.")
      setIsSuccessModalOpen(true)
    } catch (error) {
      showError(error, "No se pudo actualizar la red.")
    } finally {
      setIsSaving(false)
    }
  }

  return {
    networks,
    connectedNetworks,
    formData,
    errors,
    feedbackMessage,
    feedbackType,
    isModalOpen,
    isSuccessModalOpen,
    connectingNetwork,
    successMessage,
    isLoading,
    isSaving,
    isEditing: Boolean(editingId),
    openEditModal,
    closeModal,
    closeSuccessModal,
    updateField,
    handleBlur,
    handleSubmit,
    handleDelete,
    handleOAuthConnect,
    loadNetworks,
    showFeedback,
  }
}

function toNetworkPayload(values: NetworkFormValues) {
  return {
    name: values.name.trim().toLowerCase(),
    url: values.url.trim(),
  }
}

function handleOAuthResult(
  resultHandledRef: MutableRefObject<boolean>,
  showFeedback: (message: string, type: "success" | "error") => void,
  loadNetworks: () => Promise<void>,
) {
  if (resultHandledRef.current) return undefined

  const urlParams = new URLSearchParams(window.location.search)
  const status = urlParams.get("social_status")
  const provider = urlParams.get("social_provider")
  const message = urlParams.get("social_message")
  if (!status) return undefined

  resultHandledRef.current = true
  window.history.replaceState({}, document.title, window.location.pathname)
  if (status === "success" && provider) return handleOAuthSuccess(provider, showFeedback, loadNetworks)
  if (status === "error" && provider) showOAuthError(provider, message, showFeedback)
  return undefined
}

function handleOAuthSuccess(
  provider: string,
  showFeedback: (message: string, type: "success" | "error") => void,
  loadNetworks: () => Promise<void>,
) {
  const timer = setTimeout(() => {
    const providerLabel = getProfessionalNetworkLabel(provider)
    showFeedback(`Conexion exitosa con ${providerLabel}. Tu perfil esta ahora conectado.`, "success")
    void loadNetworks()
  }, 500)

  return () => clearTimeout(timer)
}

function showOAuthError(provider: string, message: string | null, showFeedback: (message: string, type: "success" | "error") => void) {
  const providerLabel = getProfessionalNetworkLabel(provider)
  const errorMessage = message ? `Error: ${message}` : `No se pudo conectar con ${providerLabel}`
  showFeedback(errorMessage, "error")
}
