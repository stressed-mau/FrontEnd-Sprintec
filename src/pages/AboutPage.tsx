import { Award, Code, Target, Users } from "lucide-react"

import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const infoCards = [
  {
    title: "Nuestro objetivo",
    description:
      "Fortalecer el perfil profesional de desarrolladores y estudiantes, ayudándolos a presentar su experiencia de forma clara, profesional y accesible.",
    icon: Target,
    iconClassName: "bg-[#C2DBED] text-[#003A6C]",
  },
  {
    title: "¿Para quién?",
    description:
      "Para desarrolladores de software, estudiantes de informática y profesionales tecnológicos que buscan mejorar su presencia digital.",
    icon: Users,
    iconClassName: "bg-[#F5E6F7] text-[#8B4AA1]",
  },
  {
    title: "Funcionalidades",
    description:
      "Gestión de proyectos, registro de habilidades técnicas, experiencia laboral y académica, y enlaces profesionales en un solo perfil.",
    icon: Code,
    iconClassName: "bg-[#DDEFD6] text-[#2E7D32]",
  },
  {
    title: "Beneficios",
    description:
      "Centraliza tu información, fortalece tu marca personal, aumenta tus oportunidades y comparte tu perfil con facilidad.",
    icon: Award,
    iconClassName: "bg-[#F8E5D1] text-[#C47A2C]",
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-[#F2EBDF] via-[#ECF4F9] to-[#4982AD]">
      <Header />
      <main className="flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#4982AD]">Sobre la plataforma</p>
            <h1 className="text-4xl font-bold tracking-tight text-[#003A6C] sm:text-5xl">
              PortfolioGen impulsa tu presencia profesional
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-[#355B7A] sm:text-lg">
              Diseñamos una plataforma para que usuarios puedan organizar, mostrar y
              compartir su experiencia de manera moderna, profesional y accesible.
            </p>
          </section>

          <Card className="border-[#C2DBED] bg-white/85 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-3 border-b border-[#D7E6F2]">
              <CardTitle className="text-2xl font-bold text-[#003A6C] sm:text-3xl">
                ¿Qué es PortfolioGen?
              </CardTitle>
              <p className="max-w-3xl text-sm leading-6 text-[#4F6F88] sm:text-base">
                PortfolioGen es un sistema web generador de portafolios digitales pensado específicamente para
                quienes quieren destacar su perfil técnico con una presentación ordenada y atractiva.
              </p>
            </CardHeader>
            <CardContent className="space-y-5 py-6 text-sm leading-7 text-[#355B7A] sm:py-8 sm:text-base">
              <p>
                La plataforma permite crear, gestionar y compartir un portafolio profesional en el que se
                integran proyectos, habilidades, experiencia laboral y formación académica dentro de un solo
                espacio centralizado.
              </p>
              <p>
                El objetivo es simplificar la construcción de una presencia digital sólida, facilitando que cada
                usuario pueda mostrar su trayectoria con mayor claridad ante reclutadores, empresas o redes
                profesionales.
              </p>
            </CardContent>
          </Card>

          <section className="grid gap-5 md:grid-cols-2">
            {infoCards.map(({ title, description, icon: Icon, iconClassName }) => (
              <Card key={title} className="border-[#CFE0EC] bg-white/85 shadow-lg backdrop-blur-sm">
                <CardHeader className="space-y-4">
                  <div className={`flex size-12 items-center justify-center rounded-2xl ${iconClassName}`}>
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-xl font-bold text-[#003A6C]">{title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6 text-sm leading-7 text-[#4F6F88] sm:text-base">
                  <p>{description}</p>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
