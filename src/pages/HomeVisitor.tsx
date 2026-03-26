import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Sparkles,FolderGit2,ChevronsLeftRight,Award,Briefcase,} from "lucide-react"
import Foto from "@/assets/images/fotoEscritorio.png"
import IconoG from "@/assets/images/iGithub.png"
import IconoL from "@/assets/images/iLinkedin.png"

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#F2EBDF] to-[#4982AD] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section para el Visitador */}
        <section className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-extrabold tracking-tight text-[#003A6C] sm:text-6xl">
              Construye tu portafolio profesional de software
            </h1>
            <p className="text-lg text-[#4982AD] leading-relaxed ">
              Crea, gestiona y comparte tus proyectos, habilidades y experiencia en una plataforma profesional
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="px-6 py-6 text-lg bg-[#003A6C] shadow-lg hover:bg-[#4982AD] transition-all">
                <Sparkles className="ml-2 size-5" />Crear mi portafolio 
              </Button>
              <Button size="lg" variant="outline" className="px-6 py-6 text-lg border-[#4982AD] text-[#003A6C] hover:bg-[#C2DBED] hover:text-[#003A6C]">
                Explorar portafolios
              </Button>
            </div>
          </div>

          {/* Espacio para la Imagen*/}
          <div className="relative">
            <div className="aspect-video rounded-xl bg-slate-200 border-4 border-[#C2DBED] shadow-2xl overflow-hidden">
              <img src={Foto} alt="Vista del sistema" className="h-full w-full object-cover" />
            </div>
            {/* Posicion de la imagen */}
            <div className="absolute -bottom-6 -left-6 size-32 bg-[#F7F0E1] rounded-full -z-10 blur-2xl" />
          </div>
        </section>

        {/* --- SECCIÓN Funcionalidades */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#003A6C] mb-4">Funcionalidades principales</h2>
              <p className="text-lg text-[#4982AD] leading-relaxed ">Todo lo que necesitas para destacar profesionalmente </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<div className="bg-[#77B6E6] p-3 rounded-lg"><FolderGit2 className="text-[#003A6C] "/></div>}
                title="Crear portafolio profesional"
                description="Diseña tu portafolio personalizado con una interfaz moderna e intuitiva."
              />
              <FeatureCard 
                icon={<div className="bg-[#C4A57C] p-3 rounded-lg"><ChevronsLeftRight className="text-white" /></div>}
                title="Publicar proyectos de software"
                description="Muestra tus proyectos con descripciones, tecnologías y enlaces a GitHub."
              />
              <FeatureCard 
                icon={<div className="bg-[#3fbb1f] p-3 rounded-lg"><Award className="text-[#003A6C]" /></div>}
                title="Mostrar habilidades técnicas"
                description="Destaca tus habilidades y nivel de experiencia en cada tecnología"
              />
              <FeatureCard 
                icon={<div className="bg-[#ea9f09] p-3 rounded-lg"><Briefcase className="text-[#003A6C]" /></div>}
                title="Compartir experiencia laboral"
                description="Registra tu trayectoria profesional y académica de forma estructurada"
              />
              <FeatureCard 
                icon={<div className="rounded-lg"><img src={IconoG} alt="GitHub" className="w-full h-full object-contain" /></div>}
                title="Conectar con GitHub"
                description="Vincula tus perfiles de GitHub y muestra tu actividad de desarrollo."
              />
              <FeatureCard 
                icon={<div className="rounded-lg"><img src={IconoL} alt="LinkedIn" className="w-full h-full object-contain" /></div>}
                title="Conectar con LinkedIn"
                description="Integra tu perfil de LinkedIn y amplía tu red profesional"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl border border-[#0e6db6] bg-[#F8FAFC] hover:shadow-md transition-shadow">
      <div className="size-12 bg-white rounded-lg shadow-sm flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#003A6C] mb-3">{title}</h3>
      <p className="text-[#4982AD] leading-relaxed">{description}</p>
    </div>
  )
}