import type { Dispatch, SetStateAction } from "react"

import {
  getRegisterErrorMessage,
  getRegisterValidationErrors,
  isRegisterHandledError,
} from "@/services/auth/registerErrorService"
import { probeDuplicateRegisterField } from "@/services/auth/registerDuplicateService"
import { mapApiErrors, mapTopLevelRegisterError } from "@/services/auth/registerErrorMapperService"
import type { RegisterFormErrors } from "@/types/registerForm"
import type { RegisterRequest } from "@/services/auth"

export function useRegisterErrorHandler(setErrors: Dispatch<SetStateAction<RegisterFormErrors>>) {
  async function handleRegisterError(error: unknown, registerPayload: RegisterRequest) {
    if (!isRegisterHandledError(error)) {
      setErrors({ form: "No se pudo completar el registro." })
      return
    }

    const initialFieldErrors = getInitialFieldErrors(error)
    const duplicateProbeErrors = await getDuplicateProbeErrors(initialFieldErrors, registerPayload)
    const mergedFieldErrors = mergeDuplicateErrors(initialFieldErrors, duplicateProbeErrors)
    const remainingTopLevelErrors = getRemainingTopLevelErrors(error, mergedFieldErrors)

    setErrors({
      ...mergedFieldErrors,
      ...remainingTopLevelErrors,
      form: remainingTopLevelErrors.form || "",
    })
  }

  return { handleRegisterError }
}

function getInitialFieldErrors(error: unknown): RegisterFormErrors {
  const fieldErrors = mapApiErrors(getRegisterValidationErrors(error))
  const topLevelErrors = mapTopLevelRegisterError(getRegisterErrorMessage(error))

  return {
    ...fieldErrors,
    name: fieldErrors.name || topLevelErrors.name,
    email: fieldErrors.email || topLevelErrors.email,
  }
}

async function getDuplicateProbeErrors(initialErrors: RegisterFormErrors, registerPayload: RegisterRequest) {
  const duplicateProbePromises: Promise<RegisterFormErrors>[] = []

  if (initialErrors.name && !initialErrors.email) {
    duplicateProbePromises.push(probeDuplicateRegisterField(registerPayload, "email"))
  }

  if (initialErrors.email && !initialErrors.name) {
    duplicateProbePromises.push(probeDuplicateRegisterField(registerPayload, "name"))
  }

  return (await Promise.all(duplicateProbePromises)).reduce<RegisterFormErrors>(
    (nextErrors, probeErrors) => ({
      ...nextErrors,
      name: nextErrors.name || probeErrors.name,
      email: nextErrors.email || probeErrors.email,
    }),
    {},
  )
}

function mergeDuplicateErrors(initialErrors: RegisterFormErrors, duplicateProbeErrors: RegisterFormErrors) {
  return {
    ...initialErrors,
    name: initialErrors.name || duplicateProbeErrors.name,
    email: initialErrors.email || duplicateProbeErrors.email,
  }
}

function getRemainingTopLevelErrors(error: unknown, mergedFieldErrors: RegisterFormErrors) {
  const hasSpecificDuplicateError = Boolean(mergedFieldErrors.email || mergedFieldErrors.name)
  return hasSpecificDuplicateError ? {} : mapTopLevelRegisterError(getRegisterErrorMessage(error))
}
