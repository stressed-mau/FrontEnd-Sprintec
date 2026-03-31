import { useState } from "react"

import { findUserByEmail, registerStoredUser } from "@/lib/auth-storage"

export type RegisterValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type RegisterErrors = Partial<Record<keyof RegisterValues, string>>

const INITIAL_VALUES: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export const WELCOME_MESSAGE = `¡Te damos la bienvenida a Portafolio Gen!

Tu registro se ha completado exitosamente. Ya puedes acceder a tu cuenta y comenzar a explorar todas las funcionalidades que tenemos para ti.`

function validateRegisterField(field: keyof RegisterValues, values: RegisterValues): string {
  const name = values.name.trim()
  const email = values.email.trim()
  const password = values.password
  const confirmPassword = values.confirmPassword

  if (field === "name") {
    if (!name) return "El campo Nombre usuario es obligatorio."
    if (name.length > 30) return "El campo Nombre de usuario no permite un máximo de 30 caracteres."
    if (/\d/.test(name)) {
      return "El Nombre de Usuario contiene caracteres numéricos. Sólo se permiten letras."
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)) {
      return "El Nombre de usuario contiene caracteres especiales. Solo se permiten letras."
    }
  }

  if (field === "email") {
    if (!email) return "El campo Correo electrónico es obligatorio."
    if (email.length > 60) return "El campo Correo electrónico permite un máximo de 60 caracteres."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "El Correo electrónico debe tener un formato válido (ej. usuario@gmail.com)."
    }
    if (findUserByEmail(email)) {
      return "El correo electrónico ya está registrado."
    }
  }

  if (field === "password") {
    if (!password) return "El campo contraseña es obligatorio."
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres"
    if (password.length > 20) return "La contraseña permite un máximo de 20 caracteres."
    if (/\s/.test(password)) return "La contraseña no permite espacios en blanco."
    if (!/[A-Z]/.test(password)) return "La contraseña debe contener al menos una letra mayúscula."
    if (!/\d/.test(password)) return "La contraseña debe contener al menos un número."
    if (!/[!@#$%^&*(),.?\":{}|<>_\-\\[\]/+=;'`~]/.test(password)) {
      return "La contraseña debe contener al menos un carácter especial."
    }
  }

  if (field === "confirmPassword") {
    if (!confirmPassword) return "El campo confirmar contraseña es obligatorio."
    if (confirmPassword !== password) return "Las contraseñas no coinciden."
  }

  return ""
}

export function useRegisterForm() {
  const [values, setValues] = useState<RegisterValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  function updateField(field: keyof RegisterValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))

    if (errors[field]) {
      const nextValues = { ...values, [field]: value }
      setErrors((current) => ({
        ...current,
        [field]: validateRegisterField(field, nextValues),
      }))
    }
  }

  function handleBlur(field: keyof RegisterValues) {
    setErrors((current) => ({
      ...current,
      [field]: validateRegisterField(field, values),
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: RegisterErrors = {
      name: validateRegisterField("name", values),
      email: validateRegisterField("email", values),
      password: validateRegisterField("password", values),
      confirmPassword: validateRegisterField("confirmPassword", values),
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    registerStoredUser({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    })

    window.localStorage.setItem(
      "portfolio_last_welcome_email",
      JSON.stringify({
        to: values.email.trim().toLowerCase(),
        subject: "¡Te damos la bienvenida a Portafolio Gen!",
        body: WELCOME_MESSAGE,
      }),
    )

    setShowSuccessModal(true)
  }

  function closeSuccessModal() {
    setShowSuccessModal(false)
  }

  return {
    values,
    errors,
    showSuccessModal,
    updateField,
    handleBlur,
    handleSubmit,
    closeSuccessModal,
  }
}

