import { useState } from "react"

import { AuthServiceError, loginUser, saveAuthSession } from "@/services/auth"

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

  if (field === "password") {
    if (!password) return "El campo contraseña es obligatorio."
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres."
  }

  return ""
}

export function useLoginForm() {
  const [values, setValues] = useState<LoginValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: LoginErrors = {
      email: validateLoginField("email", values),
      password: validateLoginField("password", values),
      form: "",
    }

    setErrors(nextErrors)

    if (nextErrors.email || nextErrors.password || nextErrors.form) {
      setSuccessMessage("")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await loginUser({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })

      saveAuthSession(response)
      setErrors({})
      setSuccessMessage(response.message || "Inicio de sesión exitoso")
    } catch (error) {
      setSuccessMessage("")

      if (error instanceof AuthServiceError) {
        setErrors({
          email: error.validationErrors?.email?.[0] ?? "",
          password: error.validationErrors?.password?.[0] ?? "",
          form: error.message,
        })
        return
      }

      setErrors({ form: "No se pudo iniciar sesión." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    errors,
    successMessage,
    isSubmitting,
    updateField,
    handleBlur,
    handleSubmit,
  }
}
