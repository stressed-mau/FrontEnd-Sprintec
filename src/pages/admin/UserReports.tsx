import { useRef, useState } from 'react';
import { Users, UserPlus, Eye, Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import StatCardUser from "@/components/reports/StatCardUser";
import PrintHeaderUser from "@/components/reports/PrintHeaderUser";
import UserGrowthChart from "@/components/reports/UserGrowthChart";
import UsersTable from "@/components/reports/UsersTable";
import LoginChart from "@/components/reports/LoginChart";
import { Footer } from '@/components/Footer';
import { useUserReports } from "@/hooks/useUserReports";
import Header from '../../components/HeaderUser'; 
import AdminSidebar from '../../components/Admin/AdminSidebar';

const UserReports = () => {

  const [selectedPeriod, setSelectedPeriod] = useState<
    'Día' | 'Semana' | 'Mes' | 'Año'
  >('Mes');

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
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
  const growthData =
    selectedPeriod === 'Día'
      ? dailyData
      : selectedPeriod === 'Semana'
      ? weeklyData
      : selectedPeriod === 'Mes'
      ? monthlyData
      : yearlyData;

  const hasGrowthData =
    growthData.length > 0 &&
    growthData.some(item => item.registros > 0);

  const hasLoginData =
    loginData.length > 0 &&
    loginData.some(item => item.registros > 0);

  const currentUsers = userData.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = Math.max(
    1,
    Math.ceil(userData.length / usersPerPage)
  );
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
    onBeforePrint: async () => {
    setIsPrinting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
  },

  onAfterPrint: () => {
    setIsPrinting(false);
  },
});
const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
const [isPrinting, setIsPrinting] = useState(false);
const isCompact = isMobile && !isPrinting;

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
            className=" mx-auto w-full max-w-6xl space-y-6 p-2 sm:p-4 md:p-6 lg:p-8 print:max-w-full print:px-2 print:pt-6 print:scale-[0.95] print:origin-top"
          >
          <PrintHeaderUser
            title="Reporte de Usuarios"
            subtitle="Gestión y análisis de usuarios registrados"
          />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">           
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003A6C] break-words">
                  Gestión de Usuarios
                </h1>
                <p className="mt-1 text-sm text-[#4B778D] md:text-base">
                  Panel de reportes y administración de usuarios
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="print:hidden w-full sm:w-auto h-11 flex items-center justify-center gap-2 px-5 rounded-xl bg-[#003A6C] text-white"
              >
                <Download className="w-5 h-5" />
                Generar PDF
              </button>
            </div>
            <div className="mb-2 p-2 bg-[#E0F2FE] border border-[#7DD3FC] rounded-2xl w-fit">
              <span className="text-[#0369A1] font-bold text-sm italic">
                Reporte actualizado automáticamente
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
              <StatCardUser title="Total de usuarios" value={stats?.totalUsers ?? 0} subtext="Usuarios registrados en el sistema" Icon={Users} /> 
              <StatCardUser title="Usuarios nuevos este mes" value={stats?.newUsers ?? 0} subtext="Registros en el mes actual" Icon={UserPlus} />
              <StatCardUser title="Total de visitantes" value={stats?.totalVisitors ?? 0} subtext="Visitas totales a la plataforma" Icon={Eye} />
            </div>

            <UserGrowthChart
              selectedPeriod={selectedPeriod}
              growthData={growthData}
              hasGrowthData={hasGrowthData}
              isPrinting={isPrinting}
              isCompact={isCompact}
              onPeriodChange={setSelectedPeriod}
            />
            <LoginChart
              loginData={loginData}
              hasLoginData={hasLoginData}
              isPrinting={isPrinting}
              isCompact={isCompact}
            />
            <UsersTable
              users={userData}
              currentUsers={currentUsers}
              currentPage={currentPage}
              totalPages={totalPages}
              totalUsers={stats?.totalUsers ?? 0}
              onPrev={() =>
                setCurrentPage(prev => Math.max(prev - 1, 1))
              }
              onNext={() =>
                setCurrentPage(prev =>
                  Math.min(prev + 1, totalPages)
                )
              }
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserReports;
