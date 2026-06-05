import { hasAuthTokens, shouldLoginAfterRegisterError } from "@/services/auth/registerErrorService"
import { WELCOME_MESSAGE, type RegisterValues } from "@/types/registerForm"
import { clearAuthSession, loginUser, registerUser, saveAuthSession, type AuthResponse, type RegisterRequest } from "@/services/auth"

type LoginPayload = {
  user: string
  password: string
}

export function buildRegisterPayload(normalizedValues: RegisterValues, normalizedEmail: string): RegisterRequest {
  return {
    username: normalizedValues.name.trim(),
    email: normalizedEmail,
    password: normalizedValues.password,
    password_confirmation: normalizedValues.confirmPassword,
  }
}

export async function submitRegister(registerPayload: RegisterRequest, loginPayload: LoginPayload) {
  clearAuthSession()

  let response: AuthResponse

  try {
    response = await registerUser(registerPayload)
  } catch (error) {
    if (!shouldLoginAfterRegisterError(error)) throw error
    response = await loginUser(loginPayload)
  }

  if (!hasAuthTokens(response)) response = await loginUser(loginPayload)

  saveAuthSession(response)
  saveWelcomeEmail(loginPayload.user)
}

function saveWelcomeEmail(normalizedEmail: string) {
  window.localStorage.setItem(
    "portfolio_last_welcome_email",
    JSON.stringify({
      to: normalizedEmail,
      subject: "¡Te damos la bienvenida a Portafolio Gen!",
      body: WELCOME_MESSAGE,
    }),
  )
}
