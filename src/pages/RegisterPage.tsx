import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, LockKeyhole, Mail, UserPlus, UserRound, X } from "lucide-react"

import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { findUserByEmail, registerStoredUser } from "@/lib/auth-storage"

type RegisterValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>

const initialValues: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

const WELCOME_MESSAGE = `¡Te damos la bienvenida a Portafolio Gen!

Tu registro se ha completado exitosamente. Ya puedes acceder a tu cuenta y comenzar a explorar todas las funcionalidades que tenemos para ti.`

function validateRegisterField(field: keyof RegisterValues, values: RegisterValues): string {
  const name = values.name.trim()
  const email = values.email.trim()
  const password = values.password
  const confirmPassword = values.confirmPassword

  if (field === "name") {
    if (!name) return "El campo Nombre usuario es obligatorio."
    if (name.length > 30) return "El campo Nombre de usuario no permite un máximo de 30 caracteres."
    if (/\d/.test(name)) {
      return "El Nombre de Usuario contiene caracteres numéricos. Sólo se permiten letras."
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)) {
      return "El Nombre de usuario contiene caracteres especiales. Solo se permiten letras."
    }
  }

  if (field === "email") {
    if (!email) return "El campo Correo electrónico es obligatorio."
    if (email.length > 60) return "El campo Correo electrónico permite un máximo de 60 caracteres."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "El Correo electrónico debe tener un formato válido (ej. usuario@gmail.com)."
    }
    if (findUserByEmail(email)) {
      return "El correo electrónico ya está registrado."
    }
  }

  if (field === "password") {
    if (!password) return "El campo contraseña es obligatorio."
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres"
    if (password.length > 20) return "La contraseña permite un máximo de 20 caracteres."
    if (/\s/.test(password)) return "La contraseña no permite espacios en blanco."
    if (!/[A-Z]/.test(password)) return "La contraseña debe contener al menos una letra mayúscula."
    if (!/\d/.test(password)) return "La contraseña debe contener al menos un número."
    if (!/[!@#$%^&*(),.?\":{}|<>_\-\\[\]/+=;'`~]/.test(password)) {
      return "La contraseña debe contener al menos un carácter especial."
    }
  }

  if (field === "confirmPassword") {
    if (!confirmPassword) return "El campo confirmar contraseña es obligatorio."
    if (confirmPassword !== password) return "Las contraseñas no coinciden."
  }

  return ""
}

export default function RegisterPage() {
  const [values, setValues] = useState<RegisterValues>(initialValues)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const idEntradaNombre = "registro-nombre-usuario"
  const idEntradaCorreo = "registro-correo"
  const idEntradaContrasena = "registro-contrasena"
  const idEntradaConfirmarContrasena = "registro-confirmar-contrasena"
  const idErrorNombre = "registro-error-nombre"
  const idErrorCorreo = "registro-error-correo"
  const idAyudaContrasena = "registro-ayuda-contrasena"
  const idErrorContrasena = "registro-error-contrasena"
  const idErrorConfirmarContrasena = "registro-error-confirmar-contrasena"
  const idTituloModalExito = "registro-titulo-modal-exito"

  function updateField(field: keyof RegisterValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))

    if (errors[field]) {
      const nextValues = { ...values, [field]: value }
      setErrors((current) => ({
        ...current,
        [field]: validateRegisterField(field, nextValues),
      }))
    }
  }

  function handleBlur(field: keyof RegisterValues) {
    setErrors((current) => ({
      ...current,
      [field]: validateRegisterField(field, values),
    }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const nextErrors: RegisterErrors = {
      name: validateRegisterField("name", values),
      email: validateRegisterField("email", values),
      password: validateRegisterField("password", values),
      confirmPassword: validateRegisterField("confirmPassword", values),
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    registerStoredUser({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    })

    window.localStorage.setItem(
      "portfolio_last_welcome_email",
      JSON.stringify({
        to: values.email.trim().toLowerCase(),
        subject: "¡Te damos la bienvenida a Portafolio Gen!",
        body: WELCOME_MESSAGE,
      }),
    )

    setShowSuccessModal(true)
  }

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
                      onChange={(e) => updateField("name", e.target.value)}
                      className="h-11 border-[#C2DBED] bg-white pl-10 text-[#003A6C] placeholder:text-[#7B98AF]"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? idErrorNombre : undefined}
                    />
                  </div>
                  {errors.name ? (
                    <p id={idErrorNombre} className="text-sm text-red-600">
                      {errors.name}
                    </p>
                  ) : null}
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
                  <Label htmlFor={idEntradaContrasena} className="text-[#003A6C]">
                    Contraseña
                  </Label>
                  <p id={idAyudaContrasena} className="text-xs leading-5 text-[#5E7D95]">
                    Debe tener entre 8 y 20 caracteres, incluir una mayúscula, un número y un carácter especial.
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
                      onChange={(e) => updateField("password", e.target.value)}
                      className="h-11 border-[#C2DBED] bg-white pl-10 pr-11 text-[#003A6C] placeholder:text-[#7B98AF]"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? `${idAyudaContrasena} ${idErrorContrasena}` : idAyudaContrasena}
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
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      className="h-11 border-[#C2DBED] bg-white pl-10 pr-11 text-[#003A6C] placeholder:text-[#7B98AF]"
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? idErrorConfirmarContrasena : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
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

                <div className="flex gap-3">
                  <Button type="submit" className="h-11 flex-1 bg-[#003A6C] text-white transition hover:bg-[#4982AD]">
                    Crear cuenta
                  </Button>
                </div>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#D7E6F2]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-[#6B88A0]">O regístrate con</span>
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
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/login" className="font-medium text-[#4982AD] transition hover:text-[#003A6C]">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      {showSuccessModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#003A6C]/45 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={idTituloModalExito}
            className="relative w-full max-w-lg rounded-3xl border border-[#C2DBED] bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-[#6B88A0] transition hover:bg-[#EEF4F8] hover:text-[#003A6C]"
              aria-label="Cerrar modal"
            >
              <X className="size-5" />
            </button>
            <h2 id={idTituloModalExito} className="text-2xl font-bold text-[#003A6C]">
              Registro exitoso. Tu cuenta ha sido creada correctamente.
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#4F6F88]">{WELCOME_MESSAGE}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
