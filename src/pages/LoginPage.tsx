import { LogIn, Mail } from "lucide-react"
import { Link } from "react-router-dom"

import { AuthCard } from "@/components/auth/AuthCard"
import { AuthMessage } from "@/components/auth/AuthMessages"
import { AuthPasswordField } from "@/components/auth/AuthPasswordField"
import { AuthTextField } from "@/components/auth/AuthTextField"
import { Button } from "@/components/ui/button"
import { useLoginForm } from "@/hooks/useLoginForm"
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility"
import { REGISTER_ROUTE } from "@/routes/route-paths"

export default function LoginPage() {
  const { values, errors, successMessage, isSubmitting, updateField, handleBlur, handleSubmit } = useLoginForm()
  const { isVisible: showPassword, toggleVisibility: togglePasswordVisibility } = usePasswordVisibility()
  const emailInputId = "inicio-sesion-correo"
  const passwordInputId = "inicio-sesion-contrasena"
  const emailErrorId = "inicio-sesion-error-correo"
  const passwordErrorId = "inicio-sesion-error-contrasena"
  const formErrorId = "inicio-sesion-error-formulario"
  const successMessageId = "inicio-sesion-mensaje-exito"

  return (
    <AuthCard
      title="Iniciar sesion"
      description="Accede a tu portafolio profesional."
      icon={LogIn}
      iconClassName="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#E3EEF7] text-[#003A6C] shadow-sm"
      cardClassName="border-[#C2DBED] bg-white/90 shadow-2xl backdrop-blur-sm"
    >
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        <AuthTextField
          id={emailInputId}
          type="text"
          icon={Mail}
          label="Tu usuario o correo electronico"
          placeholder="Tu usuario o tu correo electronico registrado"
          maxLength={60}
          value={values.user}
          onBlur={() => handleBlur("user")}
          onChange={(event) => updateField("user", event.target.value)}
          className="h-11 border-[#C2DBED] bg-white pl-10 text-[#003A6C] placeholder:text-[#7B98AF]"
          error={errors.user}
          errorId={emailErrorId}
          required
        />

        <AuthPasswordField
          id={passwordInputId}
          label="Contrasena"
          placeholder="••••••••"
          value={values.password}
          onBlur={() => handleBlur("password")}
          onChange={(event) => updateField("password", event.target.value)}
          error={errors.password}
          errorId={passwordErrorId}
          isVisible={showPassword}
          toggleVisibility={togglePasswordVisibility}
          visibilityLabel={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
          required
        />

        <AuthMessage id={formErrorId} message={errors.form} />
        <AuthMessage id={successMessageId} message={successMessage} type="success" />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full bg-[#003A6C] text-white transition hover:bg-[#4982AD] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Iniciando sesion..." : "Iniciar sesion"}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-3 text-center text-sm text-[#4F6F88]">
        <p>
          No tienes cuenta?{" "}
          <Link to={REGISTER_ROUTE} className="font-medium text-[#4982AD] transition hover:text-[#003A6C]">
            Registrate aqui
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
