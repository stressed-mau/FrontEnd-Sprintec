export type RegisterValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type RegisterErrors = Partial<Record<keyof RegisterValues, string>>
export type RegisterFormErrors = RegisterErrors & {
  form?: string
}

export const INITIAL_REGISTER_VALUES: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export const WELCOME_MESSAGE = `¡Te damos la bienvenida a Portafolio Gen!

Tu registro se ha completado exitosamente. Ya puedes acceder a tu cuenta y comenzar a explorar todas las funcionalidades que tenemos para ti.`
