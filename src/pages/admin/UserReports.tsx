import React, { useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, UserPlus, Eye, Download } from 'lucide-react';
import Header from '../../components/HeaderUser'; 
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { Footer } from '@/components/Footer';
import { useReactToPrint } from 'react-to-print';
import { useUserReports } from "@/hooks/useUserReports";


const UserReports = () => {

  const [selectedPeriod, setSelectedPeriod] = useState<
    'Día' | 'Semana' | 'Mes' | 'Año'
  >('Mes');

  const rangeMap = {
    Día: "day",
    Semana: "week",
    Mes: "month",
    Año: "year",
  } as const;

  const {
    data,
    loading,
    error,
  } = useUserReports(rangeMap[selectedPeriod]);

  const stats = data?.stats || {
    totalUsers: 0,
    newUsers: 0,
    totalVisitors: 0,
  };

  const dailyData = data?.dailyData || [];
  const weeklyData = data?.weeklyData || [];
  const monthlyData = data?.monthlyData || [];
  const yearlyData = data?.yearlyData || [];
  const loginData = data?.loginData || [];
  const userData = data?.users || [];

  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: 'Reporte-Usuarios',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#003A6C]">
        <p>Cargando reporte...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-red-500">
        <p>{error}</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col font-sans">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div
            ref={reportRef}
            className="mx-auto max-w-6xl space-y-8 p-4"
          >
            
            {/* Título y Subtítulo */}
            {/* Título + Botón */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">           
              <div className="text-left">
                <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl">
                  Gestión de Usuarios
                </h1>
                <p className="mt-1 text-sm text-[#4B778D] md:text-base">
                  Panel de reportes y administración de usuarios
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="h-11 flex items-center justify-center gap-2 px-5 rounded-xl bg-[#003A6C] text-white hover:bg-[#002d54] hover:text-white transition-colors"
              >
                <Download className="w-5 h-5" />
                Exportar a PDF
              </button>
            </div>
            {/* Tarjetas de Métricas Superiores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total de usuarios" value={stats?.totalUsers ?? 0} subtext="Usuarios registrados en el sistema" Icon={Users} /> 
              <StatCard title="Usuarios nuevos este mes" value={stats?.newUsers ?? 0} subtext="Registros en el mes actual" Icon={UserPlus} />
              <StatCard title="Total de visitantes" value={stats?.totalVisitors ?? 0} subtext="Visitas totales a la plataforma" Icon={Eye} />
            </div>

            {/* Gráfica de Crecimiento Temporal */}
            <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#003A6C]">Crecimiento temporal</h2>
                <p className="text-sm text-[#4B778D]">
                  {selectedPeriod === 'Día' && 'Registros por hora (últimas 24 horas)'}
                  {selectedPeriod === 'Semana' && 'Registros por día (últimos 7 días)'}
                  {selectedPeriod === 'Mes' && 'Registros por semana (último mes)'}
                  {selectedPeriod === 'Año' && 'Registros por mes (últimos 12 meses)'}
                </p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={
                      selectedPeriod === 'Día'
                        ? dailyData
                        : selectedPeriod === 'Semana'
                        ? weeklyData
                        : selectedPeriod === 'Mes'
                        ? monthlyData
                        : yearlyData
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={35} tickMargin={10} tick={{fill: '#4B778D', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#4B778D', fontSize: 12}} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="registros" 
                      stroke="#22C55E" 
                      strokeWidth={3} 
                      dot={{ r: 6, fill: '#22C55E', strokeWidth: 2, stroke: '#fff' }} 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Selectores de Tiempo (Estilo Figma) */}
              <div className="flex justify-center mt-6">
                <div className="inline-flex bg-[#D1E3EB] p-1 rounded-xl">
                  {['Día', 'Semana', 'Mes', 'Año'].map((period) => (
                    <button 
                      key={period}
                      onClick={() => setSelectedPeriod(period as 'Día' | 'Semana' | 'Mes' | 'Año')}
                      className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-[#003A6C] text-white'
                        : 'text-[#4B778D] hover:bg-[#B8D4E0]'
                    }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gráfica de Inicios de Sesión (Barras) */}
            <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#003A6C]">Inicios de sesión por día</h2>
                <p className="text-sm text-[#4B778D]">Actividad de la última semana</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={loginData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4B778D', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#4B778D', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#F1F5F9'}} />
                    <Bar dataKey="registros" fill="#10B981" radius={[4, 4, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="bg-white border border-[#A5C9D7] rounded-3xl overflow-hidden shadow-sm break-inside-avoid">
              <div className="p-6 border-b border-[#E2E8F0]">
                <h2 className="text-xl font-bold text-[#003A6C]">Usuarios registrados ({stats?.totalUsers ?? 0})</h2>
              </div> 
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[#4B778D] text-sm uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold border-b border-[#E2E8F0]">Nombre</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#E2E8F0]">Correo</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#E2E8F0]">Ocupación</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#E2E8F0]">Fecha de registro</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#E2E8F0]">Última conexión</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#003A6C] divide-y divide-[#E2E8F0]">
                    {userData.map((user, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{user.name}</td>
                        <td className="px-6 py-4 text-[#4B778D]">{user.email}</td>
                        <td className="px-6 py-4">{user.job}</td>
                        <td className="px-6 py-4 text-sm">{user.date}</td>
                        <td className="px-6 py-4 text-sm">{user.last}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  Icon: React.ElementType; 
}

const StatCard = ({ title, value, subtext, Icon }: StatCardProps) => (
  <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm relative overflow-hidden">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-[#4B778D] font-medium text-sm">{title}</p>
        <p className="text-4xl font-bold text-[#003A6C]">{value}</p>
        <p className="text-xs text-[#70A1B9]">{subtext}</p>
      </div>
      <div className="p-2 bg-[#F1F7F9] rounded-lg">
        <Icon className="w-6 h-6 text-[#003A6C]" strokeWidth={1.5} />
      </div>
    </div>
  </div>
);

export default UserReports;