import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react"

import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { findUserByEmail } from "@/lib/auth-storage"

type LoginValues = {
  email: string
  password: string
}

type LoginErrors = Partial<Record<keyof LoginValues, string>> & {
  form?: string
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
  }

  return ""
}

export default function LoginPage() {
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const idEntradaCorreo = "inicio-sesion-correo"
  const idEntradaContrasena = "inicio-sesion-contrasena"
  const idErrorCorreo = "inicio-sesion-error-correo"
  const idErrorContrasena = "inicio-sesion-error-contrasena"
  const idErrorFormulario = "inicio-sesion-error-formulario"
  const idMensajeExito = "inicio-sesion-mensaje-exito"

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const nextErrors: LoginErrors = {
      email: validateLoginField("email", values),
      password: validateLoginField("password", values),
      form: "",
    }

    if (!nextErrors.email && !nextErrors.password) {
      const user = findUserByEmail(values.email)

      if (!user) {
        nextErrors.form = "El correo electrónico no está registrado."
      } else if (user.password !== values.password) {
        nextErrors.form = "La contraseña ingresada es incorrecta."
      }
    }

    setErrors(nextErrors)

    if (nextErrors.email || nextErrors.password || nextErrors.form) {
      setSuccessMessage("")
      return
    }

    setSuccessMessage("Validación exitosa.")
  }


  return (
    <div className="flex min-h-screen flex-col bg-[#C2DBED]">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-md">
          <Card className="border-[#C2DBED] bg-white/90 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#E3EEF7] text-[#003A6C] shadow-sm">
                <LogIn className="size-8" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-[#003A6C]">Iniciar sesión</CardTitle>
                <CardDescription className="text-sm leading-6 text-[#4F6F88]">
                  Accede a tu portafolio profesional.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form noValidate onSubmit={handleSubmit} className="space-y-5">
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
                      onChange={(e) => updateField("email", e.target.value)}
                      className="h-11 border-[#C2DBED] bg-white pl-10 text-[#003A6C] placeholder:text-[#7B98AF]"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? idErrorCorreo : undefined}
                    />
                  </div>
                  {errors.email ? (
                    <p id={idErrorCorreo} className="text-sm text-red-600">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor={idEntradaContrasena} className="text-[#003A6C]">
                      Contraseña
                    </Label>
                    <button type="button" className="text-xs font-medium text-[#4982AD] transition hover:text-[#003A6C]">
                      ¿La olvidaste?
                    </button>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B88A0]" />
                    <Input
                      id={idEntradaContrasena}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={values.password}
                      onBlur={() => handleBlur("password")}
                      onChange={(e) => updateField("password", e.target.value)}
                      className="h-11 border-[#C2DBED] bg-white pl-10 pr-11 text-[#003A6C] placeholder:text-[#7B98AF]"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? idErrorContrasena : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B88A0] transition hover:text-[#003A6C]"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p id={idErrorContrasena} className="text-sm text-red-600">
                      {errors.password}
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

                {successMessage ? (
                  <div
                    id={idMensajeExito}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                  >
                    {successMessage}
                  </div>
                ) : null}

                <Button type="submit" className="h-11 w-full bg-[#003A6C] text-white transition hover:bg-[#4982AD]">
                  Iniciar sesión
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#D7E6F2]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-[#6B88A0]">O continúa con</span>
                </div>
              </div>
                <Button
                type="button"
                disabled
                className="flex h-11 w-full items-center justify-center gap-3 opacity-50 cursor-not-allowed"
                >
                Continuar con Google (próximamente)
                </Button>

              <div className="flex flex-col items-center gap-3 text-center text-sm text-[#4F6F88]">
                <p>
                  ¿No tienes cuenta?{" "}
                  <Link to="/register" className="font-medium text-[#4982AD] transition hover:text-[#003A6C]">
                    Regístrate aquí
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
