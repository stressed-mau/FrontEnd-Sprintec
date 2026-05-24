import React, { useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Award, Link, FileText, CheckCircle, Download } from 'lucide-react';
import Header from '../../components/HeaderUser'; 
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { Footer } from '@/components/Footer';
import { useReactToPrint } from 'react-to-print';
import { useCertificateReports } from '@/hooks/useCertificateReports';
import logo from "@/assets/logo/LogoPG.png"
interface PieLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}
const CertificateReports = () => {
  const {data, loading, error, } = useCertificateReports();
  const stats = data?.stats || {
    totalCertificados: 0,
    conLink: 0,
    conArchivo: 0,
    conAmbos: 0,
  };
  const issuersData = data?.issuers || [];
  const formatData = data?.formatDist || [];
  const expirationData = data?.expirationDist || [];


  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: 'Reporte-Certificados',

    onBeforePrint: async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
    },
  });
  // Colores para las gráficas de pastel 
  const COLORS_FORMAT = ['#36A2EB', '#FFCE56', '#FF334B', '#4BC0C0'];
  const COLORS_EXPIRATION = ['#FF9F40', '#51db86'];
  const renderCustomizedLabel = ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
  }: PieLabelProps) => {
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#003A6C]">
        <p>Cargando reporte de certificados...</p>
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
            className="
              mx-auto
              max-w-6xl
              space-y-8
              p-4
              print:max-w-full
              print:px-2
              print:pt-6
              print:scale-[0.92]
              print:origin-top
            "
          >
            <div className="hidden print:flex items-center justify-between mb-4 border-b border-gray-300 pb-3">
            <div className="w-1/3 flex justify-start">
              <img
                src={logo}
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
            </div>

            <div className="w-1/3 text-center">
              <h1 className="text-2xl font-bold text-[#003A6C] leading-tight">
                Reporte de Certificados
              </h1>

              <p className="text-sm text-gray-500">
                Plataforma Portfolio Gen
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
            
            {/* Header del Reporte */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">           
              <div className="text-left">
                <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl">
                  Gestión de Certificados
                </h1>
                <p className="mt-1 text-sm text-[#4B778D] md:text-base">
                  Panel de reportes y análisis de certificaciones
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="
                  print:hidden
                  h-11
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  rounded-xl
                  bg-[#003A6C]
                  text-white
                  hover:bg-[#002d54]
                  transition-colors
                "
              >
                <Download className="w-5 h-5" />
                Exportar a PDF
              </button>
            </div>
            <div className="mb-5 p-2 bg-[#E0F2FE] border border-[#7DD3FC] rounded-2xl w-fit">
              <span className="text-[#0369A1] font-bold text-sm italic">
                Reporte actualizado automáticamente
              </span>
            </div>

            {/* Tarjetas de Métricas (Imagen 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total de Certificados" value={stats.totalCertificados} subtext="Certificados en el sistema" Icon={Award} />
              <StatCard title="Certificados con link" value={stats.conLink} subtext="Con URL de credencial" Icon={Link} />
              <StatCard title="Certificados con archivo" value={stats.conArchivo} subtext="PDF, PNG, etc." Icon={FileText} />
              <StatCard title="Certificados con link y archivo" value={stats.conAmbos} subtext="Ambos respaldos" Icon={CheckCircle} />
            </div>

            {/* Gráfica de Top Emisores (Imagen 2) */}
            <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#003A6C]">Top 10 Emisores</h2>
                <p className="text-sm text-[#4B778D]">Organizaciones con más certificados emitidos</p>
              </div>
              <div
                className="w-full"
                style={{
                  height: `${Math.max(issuersData.length * 60, 250)}px`,
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={issuersData} layout="vertical" margin={{ left: 40, right: 40, bottom: 30  }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#4B778D'}} label={{
                      value: 'Cantidad de certificados emitidos',
                      position: 'insideBottom',
                      offset: -15,
                      style: {
                        fill: '#70A1B9',
                        fontSize: 12,
                        fontWeight: 500,
                      },
                    }}/>
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={120} tick={{fill: '#003A6C', fontSize: 13, fontWeight: 500}} />
                    <Tooltip cursor={{fill: '#F8FAFC'}} />
                    <Bar dataKey="cantidad" fill="#4A6CF7" radius={[0, 4, 4, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
              {/* Pastel: Distribución por Formato */}
              <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid print:mt-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#003A6C]">Distribución por formato</h2>
                  <p className="text-sm text-[#4B778D]">Tipos de archivo de respaldo</p>
                </div>
                <div className="h-64 flex items-center justify-center print:justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomizedLabel}
                      >
                        {formatData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_FORMAT[index % COLORS_FORMAT.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pastel: Certificados con Vencimiento */}
              <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid print:mt-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#003A6C]">Certificados con vencimiento</h2>
                  <p className="text-sm text-[#4B778D]">Estado de vigencia de certificados</p>
                </div>
                <div className="h-72 flex items-center justify-center print:h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expirationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomizedLabel}
                      >
                        {expirationData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_EXPIRATION[index % COLORS_EXPIRATION.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

// --- Subcomponente de Tarjeta de Estadística ---
interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  Icon: React.ElementType; 
}

const StatCard = ({
  title,
  value,
  subtext,
  Icon,
}: StatCardProps) => (
  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#D6E6EE] shadow-sm transition-all hover:shadow-md hover:border-[#70A1B9]">

    <div className="flex items-start justify-between">

      <div className="space-y-2">
        <p className="text-[#4B778D] font-semibold text-sm leading-tight">
          {title}
        </p>

        <p className="text-4xl font-bold text-[#003A6C]">
          {value}
        </p>

        <p className="text-xs text-[#70A1B9] font-medium">
          {subtext}
        </p>
      </div>

      <div className="p-2 rounded-xl bg-[#F1F7F9]">
        <Icon
          className="w-5 h-5 text-[#003A6C]"
          strokeWidth={1.7}
        />
      </div>

    </div>
  </div>
)

export default CertificateReports;