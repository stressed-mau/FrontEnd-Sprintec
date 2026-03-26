import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Award, Briefcase, ChevronsLeftRight, FolderGit2, Sparkles } from "lucide-react"
import Foto from "@/assets/images/fotoEscritorio.png"

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#F2EBDF] to-[#4982AD] flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-extrabold tracking-tight text-[#003A6C] sm:text-6xl">
              Construye tu portafolio profesional de software
            </h1>
            <p className="text-lg leading-relaxed text-[#4982AD]">
              Crea, gestiona y comparte tus proyectos, habilidades y experiencia en una plataforma profesional
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-[#003A6C] px-6 py-6 text-lg shadow-lg transition-all hover:bg-[#4982AD]">
                <Sparkles className="ml-2 size-5" />
                Crear mi portafolio
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video overflow-hidden rounded-xl border-4 border-[#C2DBED] bg-slate-200 shadow-2xl">
              <img src={Foto} alt="Vista del sistema" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 size-32 rounded-full bg-[#F7F0E1] blur-2xl" />
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-[#003A6C]">Funcionalidades principales</h2>
              <p className="text-lg leading-relaxed text-[#4982AD]">Todo lo que necesitas para destacar profesionalmente</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<div className="rounded-lg bg-[#77B6E6] p-3"><FolderGit2 className="text-[#003A6C]" /></div>}
                title="Crear portafolio profesional"
                description="Diseña tu portafolio personalizado con una interfaz moderna e intuitiva."
              />
              <FeatureCard
                icon={<div className="rounded-lg bg-[#C4A57C] p-3"><ChevronsLeftRight className="text-white" /></div>}
                title="Publicar proyectos de software"
                description="Muestra tus proyectos con descripciones, tecnologías y enlaces a GitHub."
              />
              <FeatureCard
                icon={<div className="rounded-lg bg-[#3fbb1f] p-3"><Award className="text-[#003A6C]" /></div>}
                title="Mostrar habilidades técnicas"
                description="Destaca tus habilidades y nivel de experiencia en cada tecnología."
              />
              <FeatureCard
                icon={<div className="rounded-lg bg-[#ea9f09] p-3"><Briefcase className="text-[#003A6C]" /></div>}
                title="Compartir experiencia laboral"
                description="Registra tu trayectoria profesional y académica de forma estructurada."
              />
              <FeatureCard
                icon={<div className="rounded-lg bg-[#24292F] p-3 text-white"><GitHubIcon className="size-6" /></div>}
                title="Conectar con GitHub"
                description="Vincula tus perfiles de GitHub y muestra tu actividad de desarrollo."
              />
              <FeatureCard
                icon={<div className="rounded-lg bg-[#0A66C2] p-3 text-white"><LinkedInIcon className="size-6" /></div>}
                title="Conectar con LinkedIn"
                description="Integra tu perfil de LinkedIn y amplía tu red profesional."
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-[#0e6db6] bg-[#F8FAFC] p-8 transition-shadow hover:shadow-md">
      <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-white shadow-sm">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-[#003A6C]">{title}</h3>
      <p className="leading-relaxed text-[#4982AD]">{description}</p>
    </div>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.08 1.83 2.82 1.3 3.5 1 .11-.79.42-1.3.76-1.6-2.67-.3-5.48-1.33-5.48-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.88.12 3.18.78.84 1.24 1.91 1.24 3.22 0 4.61-2.82 5.62-5.5 5.92.43.37.82 1.1.82 2.23v3.3c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1.01 1.84-2.07 3.79-2.07 4.05 0 4.8 2.66 4.8 6.11V21h-4v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95V21h-4V9Z" />
    </svg>
  )
}
