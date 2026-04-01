import { useState } from "react"

import { findUserByEmail } from "@/lib/auth-storage"

export type LoginValues = {
  email: string
  password: string
}

export type LoginErrors = Partial<Record<keyof LoginValues, string>> & {
  form?: string
}

const INITIAL_VALUES: LoginValues = {
  email: "",
  password: "",
}

function validateLoginField(field: keyof LoginValues, values: LoginValues): string {
  const email = values.email.trim()
  const password = values.password

  if (field === "email") {
    if (!email) return "El campo Correo electrónico es obligatorio."
    if (email.length > 60) return "El campo Correo electrónico permite un máximo de 60 caracteres."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "El Correo electrónico debe tener un formato válido (ej. usuario@gmail.com)."
    }
  }

  if (field === "password" && !password) {
    return "El campo contraseña es obligatorio."
  }

  return ""
}

export function useLoginForm() {
  const [values, setValues] = useState<LoginValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [successMessage, setSuccessMessage] = useState("")

  function updateField(field: keyof LoginValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))

    if (errors[field] || errors.form) {
      const nextValues = { ...values, [field]: value }
      setErrors((current) => ({
        ...current,
        form: "",
        [field]: validateLoginField(field, nextValues),
      }))
    }
  }

  function handleBlur(field: keyof LoginValues) {
    setErrors((current) => ({
      ...current,
      [field]: validateLoginField(field, values),
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: LoginErrors = {
      email: validateLoginField("email", values),
      password: validateLoginField("password", values),
      form: "",
    }

    if (!nextErrors.email && !nextErrors.password) {
      const user = findUserByEmail(values.email)

      if (!user) {
        nextErrors.form = "El correo electrónico no está registrado."
      } else if (user.password !== values.password) {
        nextErrors.form = "La contraseña ingresada es incorrecta."
      }
    }

    setErrors(nextErrors)

    if (nextErrors.email || nextErrors.password || nextErrors.form) {
      setSuccessMessage("")
      return
    }

    setSuccessMessage("Validación exitosa.")
  }

  return {
    values,
    errors,
    successMessage,
    updateField,
    handleBlur,
    handleSubmit,
  }
}

