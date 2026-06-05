import { useEffect, useRef } from "react"
import { UserPlus } from "lucide-react"
import { Link } from "react-router-dom"

import { AuthCard } from "@/components/auth/AuthCard"
import { AuthMessage } from "@/components/auth/AuthMessages"
import { RegisterFormFields } from "@/components/auth/RegisterFormFields"
import ConfirmationModal from "@/components/modals/ConfirmationModal"
import { Button } from "@/components/ui/button"
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility"
import { useRegisterForm } from "@/hooks/useRegisterForm"
import { LOGIN_ROUTE } from "@/routes/route-paths"

const registerFieldIds = {
  usernameInputId: "registro-nombre-usuario",
  emailInputId: "registro-correo",
  passwordInputId: "registro-contrasena",
  confirmPasswordInputId: "registro-confirmar-contrasena",
  usernameErrorId: "registro-error-nombre",
  emailErrorId: "registro-error-correo",
  passwordHelpId: "registro-ayuda-contrasena",
  passwordErrorId: "registro-error-contrasena",
  confirmPasswordErrorId: "registro-error-confirmar-contrasena",
}

export default function RegisterPage() {
  const form = useRegisterForm()
  const { isVisible: showPassword, toggleVisibility: togglePasswordVisibility } = usePasswordVisibility()
  const { isVisible: showConfirmPassword, toggleVisibility: toggleConfirmPasswordVisibility } = usePasswordVisibility()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null)
  const formErrorId = "registro-error-formulario"

  useEffect(() => {
    const firstErrorField =
      (form.errors.name && nameInputRef.current) ||
      (form.errors.email && emailInputRef.current) ||
      (form.errors.password && passwordInputRef.current) ||
      (form.errors.confirmPassword && confirmPasswordInputRef.current) ||
      null

    if (!firstErrorField) return

    firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" })
    firstErrorField.focus({ preventScroll: true })
  }, [form.errors.name, form.errors.email, form.errors.password, form.errors.confirmPassword])

  return (
    <AuthCard
      title="Crear cuenta"
      description="Comienza a construir tu portafolio profesional."
      icon={UserPlus}
      iconClassName="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#E8DDF4] text-[#7C4AA6] shadow-sm"
      cardClassName="border-[#9CC2DB] bg-white/95 shadow-2xl backdrop-blur-sm"
    >
      <form noValidate onSubmit={form.handleSubmit} className="space-y-4">
        <RegisterFormFields
          {...form}
          ids={registerFieldIds}
          nameInputRef={nameInputRef}
          emailInputRef={emailInputRef}
          passwordInputRef={passwordInputRef}
          confirmPasswordInputRef={confirmPasswordInputRef}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
        />

        <AuthMessage id={formErrorId} message={form.errors.form} />

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={form.isSubmitting}
            className="h-11 flex-1 bg-[#003A6C] text-white transition hover:bg-[#4982AD] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {form.isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </div>
      </form>

      <div className="flex flex-col items-center gap-3 text-center text-sm text-[#4F6F88]">
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link to={LOGIN_ROUTE} className="font-medium text-[#4982AD] transition hover:text-[#003A6C]">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <ConfirmationModal
        isOpen={form.registrationComplete}
        title="Éxito"
        message="Registro en el sistema completado correctamente."
        buttonText="Continuar"
        onClose={form.continueAfterRegistration}
      />
    </AuthCard>
  )
}
