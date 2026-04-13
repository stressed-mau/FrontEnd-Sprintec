import { useState } from "react"

import { useNavigate } from "react-router-dom"

import { USER_HOME_ROUTE } from "@/routes/route-paths"
import { AuthServiceError, loginUser, saveAuthSession } from "@/services/auth"

export type LoginValues = {
  user: string
  password: string
}

export type LoginErrors = Partial<Record<keyof LoginValues, string>> & {
  form?: string
}

const INITIAL_VALUES: LoginValues = {
  user: "",
  password: "",
}

const EMOJI_REGEX = /\p{Extended_Pictographic}/u

function validateLoginField(field: keyof LoginValues, values: LoginValues): string {
  const user = values.user.trim()
  const password = values.password

  if (field === "user") {
    if (!user) return "El campo Usuario o correo electrónico es obligatorio."
    if (EMOJI_REGEX.test(values.user)) return "El campo Usuario o correo electrónico no permite emoticones."
    if (user.length > 60) return "El campo Usuario o correo electrónico permite un máximo de 60 caracteres."
  }

  if (field === "password") {
    if (!password) return "El campo Contraseña es obligatorio."
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres."
  }

  return ""
}

export function useLoginForm() {
  const navigate = useNavigate()
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
      user: validateLoginField("user", values),
      password: validateLoginField("password", values),
      form: "",
    }

    setErrors(nextErrors)

    if (nextErrors.user || nextErrors.password || nextErrors.form) {
      setSuccessMessage("")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await loginUser({
        user: values.user.trim(),
        password: values.password,
      })

      saveAuthSession(response)
      setErrors({})
      setSuccessMessage(response.message || "Inicio de sesión exitoso")
      navigate(USER_HOME_ROUTE, { replace: true })
    } catch (error) {
      setSuccessMessage("")

      if (error instanceof AuthServiceError) {
        setErrors({
          user:
            error.validationErrors?.user?.[0] ??
            error.validationErrors?.email?.[0] ??
            error.validationErrors?.username?.[0] ??
            error.validationErrors?.login?.[0] ??
            "",
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
