import { useEffect, useMemo, useState } from "react"
import { ChartColumnIncreasing, LoaderCircle, TrendingUp } from "lucide-react"
import { Footer } from '@/components/Footer';
import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { api } from "@/services/api"

type TemplateTrendStat = {
  template_name?: string
  read_time?: string | number
  interest_rate?: string | number
  variation?: string | number
  footerBadge?: string
  footerColor?: string
  isCurrent?: boolean
}

function normalizeStats(value: unknown): TemplateTrendStat[] {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.filter((item): item is TemplateTrendStat => Boolean(item && typeof item === "object"))
  }

  if (typeof value === "object") {
    const payload = value as { stats?: unknown; data?: unknown }
    if (Array.isArray(payload.stats)) return normalizeStats(payload.stats)
    if (Array.isArray(payload.data)) return normalizeStats(payload.data)
  }

  return []
}

const formatMetric = (metric: string | number | undefined) => {
  if (metric === undefined || metric === null || metric === "") return "No disponible"
  return String(metric)
}

const TendenciaPlantillasPage = () => {
  const [stats, setStats] = useState<TemplateTrendStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadStats = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await api.get("/trends/templates")
        const nextStats = normalizeStats(response.data?.stats ?? response.data?.data?.stats ?? response.data?.data ?? response.data)

        if (isMounted) {
          setStats(nextStats)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : "No se pudo cargar la información de tendencias.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadStats()

    return () => {
      isMounted = false
    }
  }, [])

  const topStat = useMemo(() => stats[0] ?? null, [stats])

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-[#C2DBED] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4B778D]">Reportes</p>
                <h1 className="mt-2 text-3xl font-black text-[#003A6C] md:text-4xl">Tendencia de Plantillas</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">
                  Vista de lectura rápida sobre el uso de plantillas. Si el backend devuelve datos, se muestran aquí sin alterar el resto de la navegación.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#EBF5FF] px-4 py-3 text-[#003A6C] shadow-sm">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-semibold">Endpoint /trends/templates</span>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}

            {loading ? (
              <div className="flex items-center justify-center rounded-3xl border border-[#C2DBED] bg-white py-16 text-[#003A6C] shadow-sm">
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Cargando tendencias...
                </div>
              </div>
            ) : null}

            {!loading && stats.length === 0 && !error ? (
              <div className="rounded-3xl border border-dashed border-[#C2DBED] bg-white px-6 py-14 text-center text-sm text-gray-500 shadow-sm">
                No hay tendencias disponibles por el momento.
              </div>
            ) : null}

            {!loading && stats.length > 0 ? (
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {stats.map((item, index) => (
                  <article key={`${item.template_name ?? "template"}-${index}`} className="overflow-hidden rounded-[2rem] border border-[#C9E1F0] bg-white shadow-sm">
                    <div className="border-b border-[#EEF5F9] px-6 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-bold text-[#003A6C]">{item.template_name || "Plantilla sin nombre"}</h2>
                        {item.isCurrent ? (
                          <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold text-white">TU PLANTILLA</span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-[#4B778D]">{item.footerBadge || "Tendencia registrada"}</p>
                    </div>

                    <div className="grid gap-4 p-6 sm:grid-cols-3">
                      <div className="rounded-2xl bg-[#F8FBFD] p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Lectura</p>
                        <p className="mt-2 text-2xl font-black text-[#003A6C]">{formatMetric(item.read_time)}</p>
                      </div>
                      <div className="rounded-2xl bg-[#F8FBFD] p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Interés</p>
                        <p className="mt-2 text-2xl font-black text-[#003A6C]">{formatMetric(item.interest_rate)}</p>
                      </div>
                      <div className="rounded-2xl bg-[#F8FBFD] p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Variación</p>
                        <p className="mt-2 text-2xl font-black text-[#003A6C]">{formatMetric(item.variation)}</p>
                      </div>
                    </div>

                    <div className="border-t border-[#EEF5F9] px-6 py-4 text-sm text-gray-600">
                      {item.footerColor ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#EBF5FF] px-3 py-1 text-[#003A6C]">
                          <ChartColumnIncreasing className="h-4 w-4" />
                          {item.footerColor}
                        </span>
                      ) : (
                        "Se muestran métricas recibidas del backend."
                      )}
                    </div>
                  </article>
                ))}
              </section>
            ) : null}

            {topStat ? (
              <div className="rounded-3xl border border-[#C2DBED] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#003A6C]">Resumen rápido</h2>
                <p className="mt-2 text-sm text-gray-600">
                  {topStat.template_name || "La plantilla principal"} concentra la lectura de referencia. Mantuvimos esta vista aislada para no afectar el resto de pantallas existentes.
                </p>
              </div>
            ) : null}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default TendenciaPlantillasPage