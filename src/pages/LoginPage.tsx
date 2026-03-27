import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, LockKeyhole, LogIn, Mail } from "lucide-react"

import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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
              <form className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#003A6C]">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B88A0]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 border-[#C2DBED] bg-white pl-10 text-[#003A6C] placeholder:text-[#7B98AF]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="password" className="text-[#003A6C]">
                      Contraseña
                    </Label>
                    <button type="button" className="text-xs font-medium text-[#4982AD] transition hover:text-[#003A6C]">
                      ¿La olvidaste?
                    </button>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B88A0]" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 border-[#C2DBED] bg-white pl-10 text-[#003A6C] placeholder:text-[#7B98AF]"
                    />
                  </div>
                </div>

                <Button type="button" className="h-11 w-full bg-[#003A6C] text-white transition hover:bg-[#4982AD]">
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
                className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-3 opacity-50"
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
