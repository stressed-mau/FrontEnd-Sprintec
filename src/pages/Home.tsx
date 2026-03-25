import { ArrowRight, BarChart3, BriefcaseBusiness, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const highlights = [
  {
    icon: BriefcaseBusiness,
    title: "Portafolios claros",
    description: "Organiza proyectos, experiencia y avances en una vista simple y profesional.",
  },
  {
    icon: BarChart3,
    title: "Seguimiento rapido",
    description: "Prepara una base lista para crecer con modulos de progreso, reportes y paneles.",
  },
  {
    icon: Sparkles,
    title: "Interfaz moderna",
    description: "Construida con Vite, React, Tailwind 4 y componentes consistentes de shadcn/ui.",
  },
]

function Home() {
  return (
    <main className="relative overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.14),_transparent_55%)]" />
      <div className="absolute left-1/2 top-24 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-border bg-background/70 px-3 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur">
              Plataforma base de Sprintec
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Bienvenido a Sprintec con una base de interfaz mas solida.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                El proyecto ya esta alineado para trabajar con Vite, React, Tailwind 4 y shadcn/ui
                sin choques de configuracion, dejando una base limpia para tus pantallas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2">
                Explorar proyecto
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" size="lg">
                Ver componentes
              </Button>
            </div>
          </div>

          <Card className="border-border/70 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Stack verificado</CardTitle>
              <CardDescription>
                Integracion lista para seguir construyendo vistas de login, registro y dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-lg border border-border/80 bg-background/80 p-4 shadow-sm"
                >
                  <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="text-base font-medium">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

export default Home
