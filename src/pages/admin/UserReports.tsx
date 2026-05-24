import React, { useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, UserPlus, Eye, Download } from 'lucide-react';
import Header from '../../components/HeaderUser'; 
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { Footer } from '@/components/Footer';
import { useReactToPrint } from 'react-to-print';
import { useUserReports } from "@/hooks/useUserReports";
import logo from "@/assets/logo/LogoPG.png";

const UserReports = () => {

  const [selectedPeriod, setSelectedPeriod] = useState<
    'Día' | 'Semana' | 'Mes' | 'Año'
  >('Mes');

  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 6;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;



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

  const currentUsers = userData.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = Math.ceil(userData.length / usersPerPage);
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
  contentRef: reportRef,
  documentTitle: 'Reporte-Usuarios',
  pageStyle: `
    @page {
      size: auto;
      margin: 20mm 12mm 20mm 12mm;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
      }

      table {
        page-break-inside: auto;
      }

      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }

      thead {
        display: table-header-group;
      }

      tfoot {
        display: table-footer-group;
      }
    }
  `,
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
            className="mx-auto max-w-6xl space-y-8 p-4 print:max-w-full print:px-2 print:pt-6 print:scale-[0.95] print:origin-top"
          >
          <div className="hidden print:flex items-center justify-between mb-4 border-b border-gray-300 pb-3">
            <div className="w-1/3 flex justify-start">
              <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
            </div>

            <div className="w-1/3 text-center">
              <h1 className="text-2xl font-bold text-[#003A6C] leading-tight">
                Reporte de Usuarios
              </h1>

              <p className="text-sm text-gray-500">
                Gestión y análisis de usuarios registrados
              </p>
            </div>

            <div className="w-1/3 flex justify-end">
              <div className="text-right">
                <p className="text-sm font-semibold text-[#003A6C]">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
            
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
                className="print:hidden h-11 flex items-center justify-center gap-2 px-5 rounded-xl bg-[#003A6C] text-white hover:bg-[#002d54] hover:text-white transition-colors"
              >
                <Download className="w-5 h-5" />
                Exportar a PDF
              </button>
            </div>
            <div className="mb-2 p-2 bg-[#E0F2FE] border border-[#7DD3FC] rounded-2xl w-fit">
              <span className="text-[#0369A1] font-bold text-sm italic">
                Reporte actualizado automáticamente
              </span>
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
              <div className="h-64 w-full overflow-hidden print:h-64 print:w-[950px]">
                <ResponsiveContainer width="99%" height="100%" debounce={0}>
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
                    margin={{
                      top: 10,
                      right: 20,
                      left: 10,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      minTickGap={20}
                      tickMargin={8}
                      padding={{ left: 20, right: 20 }}
                      tick={{
                        fill: '#4B778D',
                        fontSize: 11,
                      }}
                    />
                    <YAxis width={35} axisLine={false} tickLine={false} tick={{fill: '#4B778D', fontSize: 12}} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="registros" 
                      stroke="#22C55E" 
                      strokeWidth={3} 
                      isAnimationActive={false}
                      dot={{ r: 6, fill: '#22C55E', strokeWidth: 2, stroke: '#fff' }} 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Selectores de Tiempo (Estilo Figma) */}
              <div className="flex justify-center mt-6 print:hidden">
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
                    <Bar dataKey="registros" fill="#10B981" radius={[4, 4, 0, 0]} barSize={60} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="bg-white border border-[#A5C9D7] rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#E2E8F0]">
                <h2 className="text-xl font-bold text-[#003A6C]">Usuarios registrados ({stats?.totalUsers ?? 0})</h2>
              </div> 
              <div className="overflow-x-auto print:hidden">
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
                    {currentUsers.map((user, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{user.name}</td>
                        <td className="px-6 py-4 ">{user.email}</td>
                        <td className="px-6 py-4">{user.job}</td>
                        <td className="px-6 py-4 text-sm">{user.date}</td>
                        <td className="px-6 py-4 text-sm">{user.last}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="print:hidden flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-[#A5C9D7] text-[#003A6C] disabled:opacity-50"
                  >
                    ← Anterior
                  </button>

                  <span className="text-sm text-[#4B778D]">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-[#A5C9D7] text-[#003A6C] disabled:opacity-50"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
              <div className="hidden print:block">
                <table className="w-full text-left border-collapse mt-6">
                  <thead>
                    <tr className="text-[#4B778D] text-sm uppercase tracking-wider">
                      <th className="px-4 py-3 border-b">Nombre</th>
                      <th className="px-4 py-3 border-b">Correo</th>
                      <th className="px-4 py-3 border-b">Ocupación</th>
                      <th className="px-4 py-3 border-b">Fecha de registro</th>
                      <th className="px-4 py-3 border-b">Última conexión</th>
                    </tr>
                  </thead>

                  <tbody className="text-[#003A6C]">
                    {userData.map((user, idx) => (
                      <tr key={idx} className="border-b border-[#E2E8F0]">
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.job}</td>
                        <td className="px-4 py-3">{user.date}</td>
                        <td className="px-4 py-3">{user.last}</td>
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
  <div className="bg-white border border-[#C9E1F0] rounded-[2rem] p-5 shadow-sm transition-all hover:border-[#70A1B9] print:shadow-none">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-[#4B778D] font-semibold text-sm uppercase tracking-wide">
          {title}
        </p>

        <p className="text-4xl font-bold text-[#003A6C]">
          {value}
        </p>

        <p className="text-xs text-[#70A1B9] font-medium">
          {subtext}
        </p>
      </div>

      <div className="p-2 rounded-xl bg-[#F5FAFD]">
        <Icon
          className="w-5 h-5 text-[#003A6C]"
          strokeWidth={1.8}
        />
      </div>
    </div>
  </div>
);

export default UserReports;