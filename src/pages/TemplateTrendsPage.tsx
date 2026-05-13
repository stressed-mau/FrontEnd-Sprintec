import Header from '@/components/HeaderUser'
import Sidebar from '@/components/Sidebar'
import { Footer } from '@/components/Footer'
import { ChevronLeft, ChevronRight, Users, Clock, MousePointer2 } from 'lucide-react'
import { useTemplateTrends } from '@/hooks/useTemplateTrends'
import { type TrendStats } from '@/services/templateTrendsService'

const TemplateTrendsPage = () => {
  const { stats } = useTemplateTrends();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-6xl">
            {/* Header de Reporte */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#003A6C]">Tendencia de Plantillas</h1>
                <p className="text-[#4B778D]">Qué plantillas prefieren los reclutadores esta semana.</p>
              </div>
              <div className="flex items-center bg-white border border-[#0E7D96]/20 rounded-xl px-4 py-2 gap-4 shadow-sm">
                <button className="text-[#003A6C] hover:bg-gray-100 p-1 rounded-lg transition-colors"><ChevronLeft size={20}/></button>
                <span className="text-sm font-bold text-[#003A6C]">Semana del 5 al 11 de mayo, 2026</span>
                <button className="text-[#003A6C] hover:bg-gray-100 p-1 rounded-lg transition-colors"><ChevronRight size={20}/></button>
              </div>
            </div>

            {/* Banner Informativo */}
            <div className="mb-10 p-4 bg-[#E0F2FE] border border-[#7DD3FC] rounded-2xl w-fit">
              <span className="text-[#0369A1] font-bold text-sm italic">Tu plantilla actual: Moderna</span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <KPICard label="Plantilla Líder" value="Moderna" change="+12%" icon={<Users size={18}/>}/>
              <KPICard label="Tiempo lectura" value="4 min 32 seg" change="+8%" icon={<Clock size={18}/>}/>
              <KPICard label="Tasa interés" value="Corporativa" change="-3%" icon={<MousePointer2 size={18}/>} isNegative/>
              <KPICard label="Portafolios" value="1,284" change="+5%" icon={<Users size={18}/>}/>
            </div>

            {/* Cards de Comparación */}
            <h2 className="text-xl font-bold text-[#003A6C] mb-6">Comparativa de plantillas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {stats.map((item, idx) => (
                <TrendCard key={idx} {...item} />
              ))}
            </div>

            {/* Sección Gráfica Estilizada */}
            <div className="bg-white rounded-3xl border border-[#C9E1F0] p-8 shadow-sm">
              <h3 className="font-bold text-[#003A6C] mb-6">Evolución semanal de visitas</h3>
              <div className="h-64 flex items-end justify-between gap-2 border-b border-l pb-2 pl-2">
                {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
                  <div key={i} className="w-full flex flex-col items-center gap-2">
                    <div className="w-full max-w-10 bg-[#003A6C] rounded-t-lg transition-all hover:bg-[#002a50]" style={{ height: `${h}%` }}></div>
                    <span className="text-[10px] font-bold text-gray-400">Día {i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

const KPICard = ({ label, value, change, icon, isNegative }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex items-center gap-2 text-gray-400 mb-3">
      {icon} <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex justify-between items-end">
      <span className="text-2xl font-bold text-[#003A6C]">{value}</span>
      <span className={`text-xs font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>{change}</span>
    </div>
  </div>
)

const TrendCard = ({ template_name, read_time, interest_rate, variation, footerBadge, footerColor, isCurrent }: TrendStats) => (
  <div className="bg-white rounded-[2rem] border border-[#C9E1F0] overflow-hidden flex flex-col shadow-sm">
    <div className="p-8 flex-1">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-[#003A6C]">{template_name}</h3>
        {isCurrent && <span className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg font-bold">TU PLANTILLA</span>}
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm border-b pb-2"><span className="text-gray-400">Tiempo lectura</span><span className="font-bold text-[#003A6C]">{read_time}</span></div>
        <div className="flex justify-between text-sm border-b pb-2"><span className="text-gray-400">Tasa interés</span><span className="font-bold text-[#003A6C]">{interest_rate}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-400">Variación</span><span className="font-bold text-green-500">{variation}</span></div>
      </div>
    </div>
    <div className={`${footerColor} py-3 text-center text-white text-sm font-bold uppercase tracking-widest`}>
      {footerBadge}
    </div>
  </div>
)

export default TemplateTrendsPage;