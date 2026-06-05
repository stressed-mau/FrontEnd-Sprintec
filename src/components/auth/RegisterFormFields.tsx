import type { RefObject } from "react"
import { Mail, UserRound } from "lucide-react"

import { AuthPasswordField } from "@/components/auth/AuthPasswordField"
import { AuthTextField } from "@/components/auth/AuthTextField"
import type { RegisterErrors, RegisterValues } from "@/types/registerForm"

type EmailSuggestion = {
  full: string
}

type RegisterFormFieldsProps = {
  applyEmailSuggestion: (suggestedEmail: string) => void
  confirmPasswordInputRef: RefObject<HTMLInputElement | null>
  emailInputRef: RefObject<HTMLInputElement | null>
  emailSuggestion?: EmailSuggestion | null
  errors: RegisterErrors
  handleBlur: (field: keyof RegisterValues) => void
  ids: Record<string, string>
  nameInputRef: RefObject<HTMLInputElement | null>
  passwordInputRef: RefObject<HTMLInputElement | null>
  showConfirmPassword: boolean
  showPassword: boolean
  toggleConfirmPasswordVisibility: () => void
  togglePasswordVisibility: () => void
  updateField: (field: keyof RegisterValues, value: string) => void
  values: RegisterValues
}

export function RegisterFormFields(props: RegisterFormFieldsProps) {
  const { errors, ids, values } = props

  return (
    <>
      <AuthTextField
        inputRef={props.nameInputRef}
        id={ids.usernameInputId}
        type="text"
        icon={UserRound}
        label="Nombre de usuario"
        placeholder="Tu nombre de usuario"
        pattern="[A-Za-z0-9]*"
        maxLength={30}
        value={values.name}
        onBlur={() => props.handleBlur("name")}
        onChange={(event) => props.updateField("name", event.target.value)}
        className="h-11 border-[#C2DBED] bg-white pl-10 text-[#003A6C] placeholder:text-[#7B98AF]"
        error={errors.name}
        errorId={ids.usernameErrorId}
        required
      />

      <AuthTextField
        inputRef={props.emailInputRef}
        id={ids.emailInputId}
        type="email"
        icon={Mail}
        label="Correo electrónico"
        placeholder="tu@email.com"
        maxLength={60}
        value={values.email}
        onBlur={() => props.handleBlur("email")}
        onChange={(event) => props.updateField("email", event.target.value)}
        className="h-11 border-[#C2DBED] bg-white pl-10 text-[#003A6C] placeholder:text-[#7B98AF]"
        error={errors.email}
        errorId={ids.emailErrorId}
        required
      />

      <EmailSuggestionHint {...props} />

      <AuthPasswordField
        inputRef={props.passwordInputRef}
        id={ids.passwordInputId}
        label="Contraseña"
        placeholder="••••••••"
        maxLength={20}
        value={values.password}
        onBlur={() => props.handleBlur("password")}
        onChange={(event) => props.updateField("password", event.target.value)}
        error={errors.password}
        errorId={ids.passwordErrorId}
        help={<PasswordHelp id={ids.passwordHelpId} />}
        helpId={ids.passwordHelpId}
        isVisible={props.showPassword}
        toggleVisibility={props.togglePasswordVisibility}
        visibilityLabel={props.showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        required
      />

      <AuthPasswordField
        inputRef={props.confirmPasswordInputRef}
        id={ids.confirmPasswordInputId}
        label="Confirmar contraseña"
        placeholder="••••••••"
        maxLength={20}
        value={values.confirmPassword}
        onBlur={() => props.handleBlur("confirmPassword")}
        onChange={(event) => props.updateField("confirmPassword", event.target.value)}
        error={errors.confirmPassword}
        errorId={ids.confirmPasswordErrorId}
        isVisible={props.showConfirmPassword}
        toggleVisibility={props.toggleConfirmPasswordVisibility}
        visibilityLabel={props.showConfirmPassword ? "Ocultar confirmar contraseña" : "Mostrar confirmar contraseña"}
        required
      />
    </>
  )
}

function PasswordHelp({ id }: { id: string }) {
  return (
    <p id={id} className="text-xs leading-5 text-[#5E7D95]">
      La contraseña debe contener entre 8 y 20 caracteres, e incluir al menos una letra mayúscula, un número y un carácter especial.
    </p>
  )
}

function EmailSuggestionHint({ applyEmailSuggestion, emailSuggestion, errors }: RegisterFormFieldsProps) {
  if (errors.email || !emailSuggestion) return null

  return (
    <p className="text-sm text-amber-700">
      ¿Quisiste decir{" "}
      <a
        href={`mailto:${emailSuggestion.full}`}
        className="font-medium underline underline-offset-2 transition hover:text-amber-900"
        onClick={(event) => {
          event.preventDefault()
          applyEmailSuggestion(emailSuggestion.full)
        }}
      >
        {emailSuggestion.full}
      </a>
      ?
    </p>
  )
}
