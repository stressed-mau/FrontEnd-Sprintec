import { useEffect } from "react"
import { Eye, EyeOff, LockKeyhole, Mail, UserPlus, UserRound } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { useRegisterForm } from "@/hooks/useRegisterForm"
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility"
import { LOGIN_ROUTE, USER_HOME_ROUTE } from "@/routes/route-paths"
import { isAuthenticated } from "@/services/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { values, errors, emailSuggestion, isSubmitting, updateField, handleBlur, handleSubmit, applyEmailSuggestion } =
    useRegisterForm()
  const { isVisible: showPassword, toggleVisibility: togglePasswordVisibility } = usePasswordVisibility()
  const { isVisible: showConfirmPassword, toggleVisibility: toggleConfirmPasswordVisibility } = usePasswordVisibility()
  const idEntradaNombre = "registro-nombre-usuario"
  const idEntradaCorreo = "registro-correo"
  const idEntradaContrasena = "registro-contrasena"
  const idEntradaConfirmarContrasena = "registro-confirmar-contrasena"
  const idErrorNombre = "registro-error-nombre"
  const idErrorCorreo = "registro-error-correo"
  const idAyudaContrasena = "registro-ayuda-contrasena"
  const idErrorContrasena = "registro-error-contrasena"
  const idErrorConfirmarContrasena = "registro-error-confirmar-contrasena"
  const idErrorFormulario = "registro-error-formulario"

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(USER_HOME_ROUTE, { replace: true })
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col bg-[#C2DBED]">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-md">
          <Card className="border-[#9CC2DB] bg-white/95 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#E8DDF4] text-[#7C4AA6] shadow-sm">
                <UserPlus className="size-8" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-[#003A6C]">Crear cuenta</CardTitle>
                <CardDescription className="text-sm leading-6 text-[#4F6F88]">
                  Comienza a construir tu portafolio profesional.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={idEntradaNombre} className="text-[#003A6C]">
                    Nombre de usuario
                  </Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B88A0]" />
                    <Input
                      id={idEntradaNombre}
                      type="text"
                      placeholder="Tu nombre de usuario"
                      maxLength={30}
                      value={values.name}
                      onBlur={() => handleBlur("name")}
                      onChange={(event) => updateField("name", event.target.value)}
                      className="h-11 border-[#C2DBED] bg-white pl-10 text-[#003A6C] placeholder:text-[#7B98AF]"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? idErrorNombre : undefined}
                    />
                  </div>
                  {errors.name ? <p id={idErrorNombre} className="text-sm text-red-600">{errors.name}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={idEntradaCorreo} className="text-[#003A6C]">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B88A0]" />
                    <Input
                      id={idEntradaCorreo}
                      type="email"
                      placeholder="tu@email.com"
                      maxLength={60}
                      value={values.email}
                      onBlur={() => handleBlur("email")}
                      onChange={(event) => updateField("email", event.target.value)}
                      className="h-11 border-[#C2DBED] bg-white pl-10 text-[#003A6C] placeholder:text-[#7B98AF]"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? idErrorCorreo : undefined}
                    />
                  </div>
                  {errors.email ? <p id={idErrorCorreo} className="text-sm text-red-600">{errors.email}</p> : null}
                  {!errors.email && emailSuggestion ? (
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
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={idEntradaContrasena} className="text-[#003A6C]">
                    Contraseña
                  </Label>
                  <p id={idAyudaContrasena} className="text-xs leading-5 text-[#5E7D95]">
                    La contraseña debe contener entre 8 y 20 caracteres, e incluir al menos una letra mayúscula, un número y un carácter especial.
                  </p>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B88A0]" />
                    <Input
                      id={idEntradaContrasena}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      maxLength={20}
                      value={values.password}
                      onBlur={() => handleBlur("password")}
                      onChange={(event) => updateField("password", event.target.value)}
                      className="h-11 border-[#C2DBED] bg-white pl-10 pr-11 text-[#003A6C] placeholder:text-[#7B98AF]"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? `${idAyudaContrasena} ${idErrorContrasena}` : idAyudaContrasena}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B88A0] transition hover:text-[#003A6C]"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {errors.password ? <p id={idErrorContrasena} className="text-sm text-red-600">{errors.password}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={idEntradaConfirmarContrasena} className="text-[#003A6C]">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B88A0]" />
                    <Input
                      id={idEntradaConfirmarContrasena}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      maxLength={20}
                      value={values.confirmPassword}
                      onBlur={() => handleBlur("confirmPassword")}
                      onChange={(event) => updateField("confirmPassword", event.target.value)}
                      className="h-11 border-[#C2DBED] bg-white pl-10 pr-11 text-[#003A6C] placeholder:text-[#7B98AF]"
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? idErrorConfirmarContrasena : undefined}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B88A0] transition hover:text-[#003A6C]"
                      aria-label={showConfirmPassword ? "Ocultar confirmar contraseña" : "Mostrar confirmar contraseña"}
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword ? (
                    <p id={idErrorConfirmarContrasena} className="text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  ) : null}
                </div>

                {errors.form ? (
                  <div
                    id={idErrorFormulario}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {errors.form}
                  </div>
                ) : null}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 flex-1 bg-[#003A6C] text-white transition hover:bg-[#4982AD] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
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
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
