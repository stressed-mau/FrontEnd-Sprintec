import { BarChart3, BellRing, CheckCircle2, LayoutTemplate, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"

import { Footer } from '@/components/Footer';
import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { getAuthSession } from "@/services/auth"

const AnaliticaPage = () => {
  const session = getAuthSession()
  const displayName = session?.user?.username || "Usuario"

  const insights = [
    {
      label: "Estado del perfil",
      value: "Activo",
      detail: "Tu sesión y portafolio siguen disponibles.",
      icon: CheckCircle2,
    },
    {
      label: "Analítica general",
      value: "Lista",
      detail: "Usa los reportes para revisar tendencias de plantillas.",
      icon: BarChart3,
    },
    {
      label: "Visibilidad",
      value: "Controlada",
      detail: "Puedes revisar qué secciones están públicas.",
      icon: ShieldCheck,
    },
  ]

  const quickActions = [
    { label: "Ver mi portafolio", href: "/portafolio" },
    { label: "Configurar visibilidad", href: "/configuracion-visibilidad" },
    { label: "Abrir plantillas", href: "/plantillas" },
  ]

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-[#C2DBED] bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4B778D]">Analítica</p>
                <h1 className="mt-2 text-3xl font-black text-[#003A6C] md:text-4xl">Bienvenido, {displayName}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">
                  Este espacio concentra accesos rápidos y una vista general para seguir trabajando sin perder el flujo actual.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#EBF5FF] px-4 py-3 text-[#003A6C] shadow-sm">
                <BellRing className="h-5 w-5" />
                <span className="text-sm font-semibold">Panel nuevo, navegación intacta</span>
              </div>
            </div>

            <section className="grid gap-4 md:grid-cols-3">
              {insights.map((item) => {
                const Icon = item.icon

                return (
                  <article key={item.label} className="rounded-3xl border border-[#D7E6F2] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between text-[#4B778D]">
                      <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-2xl font-black text-[#003A6C]">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{item.detail}</p>
                  </article>
                )
              })}
            </section>

            <section className="rounded-3xl border border-[#C2DBED] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#D9EAF4] text-[#003A6C]">
                  <LayoutTemplate className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#003A6C]">Accesos rápidos</h2>
                  <p className="text-sm text-gray-500">Vuelve al flujo habitual desde aquí sin cambiar la estructura existente.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    to={action.href}
                    className="rounded-2xl border border-[#D7E6F2] bg-[#F8FBFD] px-4 py-4 text-sm font-semibold text-[#003A6C] transition-colors hover:border-[#77b6e6] hover:bg-[#EEF5F9]"
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default AnaliticaPage