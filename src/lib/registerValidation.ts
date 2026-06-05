import type { RegisterValues } from "@/types/registerForm"

const SPECIAL_CHARACTER_REGEX = /[^A-Za-z0-9]/

export function sanitizeUsernameInput(value: string) {
  return value.replace(/[^A-Za-z0-9]/g, "")
}

export function validateRegisterField(field: keyof RegisterValues, values: RegisterValues): string {
  const name = values.name.trim()
  const password = values.password
  const confirmPassword = values.confirmPassword

  if (field === "name") {
    if (!name) return "El campo Nombre usuario es obligatorio."
    if (/\s/.test(values.name)) return "El nombre de usuario no permite espacios."
    if (name.length > 30) return "El campo Nombre de usuario no permite un máximo de 30 caracteres."
  }

  if (field === "email") return ""

  if (field === "password") {
    if (!password) return "El campo Contraseña es obligatorio."
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres."
    if (password.length > 20) return "La contraseña permite un máximo de 20 caracteres."
    if (/\s/.test(password)) return "La contraseña no permite espacios en blanco."
    if (!/[A-Z]/.test(password)) return "La contraseña debe contener al menos una letra mayúscula."
    if (!/\d/.test(password)) return "La contraseña debe contener al menos un número."
    if (!SPECIAL_CHARACTER_REGEX.test(password)) return "La contraseña debe contener al menos un carácter especial."
  }

  if (field === "confirmPassword") {
    if (!confirmPassword) return "El campo Confirmar contraseña es obligatorio."
    if (confirmPassword !== password) return "Las contraseñas no coinciden."
  }

  return ""
}
