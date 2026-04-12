import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import {Award,Briefcase,ChevronsLeftRight,FolderGit2,Sparkles,Share2,Users,TrendingUp,Palette} from "lucide-react"
import Foto from "@/assets/images/fotoEscritorio.png"
import FotoP from "@/assets/images/fotoPorque.jpeg"

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#F7F0E1] to-[#C2DBED] flex flex-col">
      <Header />
      <main id="principal-inicio-visitante" className="flex-1">
        <section
          id="seccion-principal-inicio"
          aria-labelledby="titulo-principal-inicio"
          className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:py-20 lg:grid-cols-2 lg:items-center"
        >
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <h1 id="titulo-principal-inicio" className="text-5xl font-extrabold tracking-tight text-[#003A6C] sm:text-6xl">
              Construye tu portafolio profesional de software
            </h1>
            <p className="text-base lg:text-lg leading-relaxed text-[#4982AD] max-w-xl mx-auto lg:mx-0">
              Crea, gestiona y comparte tus proyectos, habilidades y experiencia en una plataforma profesional
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button size="lg" className="bg-[#003A6C] px-8 py-6 text-lg shadow-lg transition-all hover:bg-[#4982AD] w-full sm:w-auto">
                <Sparkles className="mr-2 size-5" />
                Crear mi portafolio
              </Button>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="aspect-video overflow-hidden rounded-xl border-4 border-[#C2DBED] bg-slate-200 shadow-2xl">
              <img src={Foto} alt="Vista del sistema" className="h-full w-full object-cover" />
            </div>
            <div className="hidden sm:block absolute -bottom-6 -left-6 size-32 rounded-full bg-[#F7F0E1] blur-2xl" />
          </div>
        </section>

        <section id="seccion-funcionalidades-inicio" aria-labelledby="titulo-funcionalidades-inicio" className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 lg:mb-16 text-center">
              <h2 id="titulo-funcionalidades-inicio" className="mb-4 text-3xl lg:text-4xl font-bold text-[#003A6C]">Funcionalidades principales</h2>
              <p className="text-base lg:text-lg leading-relaxed text-[#4982AD]">Todo lo que necesitas para destacar profesionalmente</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                icon={<div className="rounded-lg bg-[#FC6D26] p-3 text-white"><GitLabIcon className="size-6" /></div>}
                title="Conectar con GitLab"
                description="Integra tu perfil de GitLab y muestra tu trabajo de desarrollo."
              />
            </div>
          </div>
        </section>

        <section id="seccion-beneficios-inicio" aria-labelledby="titulo-beneficios-inicio" className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
         <div className="relative h-64 sm:h-96 lg:h-full w-full order-2 lg:order-1">
         <img src={FotoP} alt="Equipo trabajando" className="h-full w-full object-cover rounded-[2rem] shadow-xl"/></div>
         <div className="space-y-8 lg:space-y-10 order-1 lg:order-2">
        <h2 id="titulo-beneficios-inicio" className="text-3xl lg:text-4xl font-extrabold text-[#003A6C] text-center lg:text-left">¿Por qué usar PortfolioGen?</h2>

          <div className="space-y-6 lg:space-y-8">
                <BenefitItem 
                  icon={<Share2 className="text-[#003A6C] size-6 lg:size-7" />} 
                  color="bg-[#C2DBED]"
                  title="Centraliza tu experiencia profesional"
                  description="Toda tu información en un solo lugar, fácil de mantener y actualizar."
                />
                <BenefitItem 
                  icon={<Users className="text-[#8B5CF6] size-6 lg:size-7" />} 
                  color="bg-[#dfd0fe]"
                  title="Comparte tus proyectos con reclutadores"
                  description="Aumenta tus oportunidades laborales mostrando tu trabajo de forma profesional."
                />
                <BenefitItem 
                  icon={<TrendingUp className="text-[#1fc65c] size-6 lg:size-7" />} 
                  color="bg-[#b1fad1]"
                  title="Construye tu marca personal"
                  description="Destaca en el mercado laboral con un portafolio profesional y atractivo."
                />
              </div>
            </div>
          </div>
</section>

<section id="seccion-plantillas-inicio" aria-labelledby="titulo-plantillas-inicio" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12 lg:mb-16 space-y-4">
          <h2 id="titulo-plantillas-inicio" className="text-3xl lg:text-4xl font-extrabold text-[#003A6C]"> Elige tu plantilla favorita</h2>
          <p className="text-base lg:text-lg text-[#4982AD] max-w-2xl mx-auto"> Diseños profesionales que se adaptan automáticamente a tu contenido</p>
          </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              <TemplateCard title="Plantilla Moderna" gradient="from-[#77B6E6] to-[#003A6C]" description="Diseño contemporáneo con gradientes y animaciones suaves" />
              <TemplateCard title="Plantilla Minimalista" bgColor="bg-[#2D3748]" description="Diseño limpio y elegante enfocado en el contenido" isFeatured={true} />
              <TemplateCard title="Plantilla Corporativa" gradient="from-[#4982AD] to-[#77B6E6]" description="Diseño profesional perfecto para empresas" />
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
      <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-white shadow-sm">{icon}</div>
      <h3 className="mb-3 text-xl font-bold text-[#003A6C]">{title}</h3>
      <p className="leading-relaxed text-[#4982AD]">{description}</p>
    </div>
  )
}

function BenefitItem({ icon, color, title, description }: { icon: React.ReactNode; color: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 lg:gap-6">
      <div className={`shrink-0 size-12 lg:size-14 ${color} rounded-2xl flex items-center justify-center shadow-sm`}> {icon} </div>
      <div>
        <h3 className="text-lg lg:text-xl font-bold text-[#003A6C] mb-1">{title}</h3>
        <p className="text-sm lg:text-base text-[#4982AD] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function TemplateCard({ title, description, gradient, bgColor, isFeatured }: { title: string; description: string; gradient?: string; bgColor?: string; isFeatured?: boolean }) {
  return (
    <div className={`bg-white rounded-3xl border ${isFeatured ? 'border-2 border-[#C2DBED] shadow-xl lg:scale-105' : 'border-[#C2DBED] shadow-sm'} flex flex-col overflow-hidden hover:shadow-2xl transition-all group hover:-translate-y-1`}>
      <div className={`h-48 lg:h-60 ${gradient ? `bg-linear-to-br ${gradient}` : bgColor} p-8 flex items-center justify-center`}>
        <Palette className="size-16 lg:size-20 text-white opacity-80" />
      </div>
      <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl lg:text-2xl font-bold text-[#003A6C]">{title}</h3>
          <p className="text-[#4982AD] text-sm lg:text-base leading-relaxed mt-2">{description}</p>
        </div>
      </div>
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

function GitLabIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="m22.84 14.73-.93-2.86-1.85-5.67a.48.48 0 0 0-.91 0l-1.57 4.84H6.42L4.85 6.2a.48.48 0 0 0-.91 0L2.09 11.87l-.93 2.86a.97.97 0 0 0 .35 1.08l10.14 7.37a.6.6 0 0 0 .7 0l10.14-7.37a.97.97 0 0 0 .35-1.08Z" />
    </svg>
  )
}
