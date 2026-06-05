import type { NetworkFormErrors, NetworkFormValues } from "@/hooks/useNetworksManager"

export function validateNetworkForm(values: NetworkFormValues): NetworkFormErrors {
  return {
    name: validateNetworkField("name", values),
    url: validateNetworkField("url", values),
  }
}

export function validateNetworkField(field: keyof NetworkFormValues, values: NetworkFormValues): string {
  if (field === "name") return validateName(values.name)
  if (field === "url") return validateUrl(values.url)
  return ""
}

function validateName(value: string) {
  const name = value.trim()
  if (!name) return "El campo Nombre de la red es obligatorio."
  if (name.length > 40) return "El campo Nombre de la red permite un máximo de 40 caracteres."
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)) return "El campo Nombre de la red contiene caracteres no válidos. Solo se permiten letras."
  return ""
}

function validateUrl(value: string) {
  const url = value.trim()
  if (!url) return "El campo URL es obligatorio."
  if (url.length > 255) return "El campo URL permite un máximo de 255 caracteres."

  try {
    return isValidHttpUrl(new URL(url)) ? "" : "Ingrese una URL válida."
  } catch {
    return "Ingrese una URL válida."
  }
}

function isValidHttpUrl(url: URL) {
  return url.protocol === "http:" || url.protocol === "https:"
}
