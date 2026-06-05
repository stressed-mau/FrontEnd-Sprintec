import { getRegisterValidationErrors } from "@/services/auth/registerErrorService"
import { mapApiErrors } from "@/services/auth/registerErrorMapperService"
import { registerUser, type RegisterRequest } from "@/services/auth"

export async function probeDuplicateRegisterField(payload: RegisterRequest, field: "name" | "email") {
  try {
    await registerUser(buildDuplicateProbePayload(payload, field))
  } catch (error) {
    return mapApiErrors(getRegisterValidationErrors(error))
  }

  return {}
}

function buildDuplicateProbePayload(payload: RegisterRequest, field: "name" | "email"): RegisterRequest {
  const uniqueSuffix = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`

  return {
    username: field === "name" ? payload.username : `probe${uniqueSuffix}`.slice(0, 30),
    email: field === "email" ? payload.email : `probe-${uniqueSuffix}@example.com`,
    password: payload.password,
    password_confirmation: `${payload.password}_probe_mismatch`,
  }
}
