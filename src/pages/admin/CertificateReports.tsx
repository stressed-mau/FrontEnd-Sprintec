import React, { useEffect, useRef, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Award, Link, FileText, CheckCircle, Download } from 'lucide-react';
import Header from '../../components/HeaderUser'; 
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { Footer } from '@/components/Footer';
import { useReactToPrint } from 'react-to-print';

// --- Interfaces ---
interface IssuerData {
  name: string;
  cantidad: number;
}

interface PieChartData {
  name: string;
  value: number;
}
interface PieLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}
interface Stats {
  totalCertificados: number;
  conLink: number;
  conArchivo: number;
  conAmbos: number;
}

interface ResponseData {
  stats: Stats;
  issuers: IssuerData[];
  formatDist: PieChartData[];
  expirationDist: PieChartData[];
}

const CertificateReports = () => {
  const [stats, setStats] = useState<Stats>({
    totalCertificados: 0,
    conLink: 0,
    conArchivo: 0,
    conAmbos: 0,
  });
  
  const [issuersData, setIssuersData] = useState<IssuerData[]>([]);
  const [formatData, setFormatData] = useState<PieChartData[]>([]);
  const [expirationData, setExpirationData] = useState<PieChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: 'Reporte-Certificados',
  });
  // Colores para las gráficas de pastel (según imagen)
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
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={13}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulación de carga
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response: ResponseData = {
          stats: {
            totalCertificados: 1248,
            conLink: 890,
            conArchivo: 1104,
            conAmbos: 672,
          },
          issuers: [
            { name: 'AWS', cantidad: 145 },
            { name: 'Coursera', cantidad: 132 },
            { name: 'Universidad X', cantidad: 118 },
            { name: 'Google', cantidad: 105 },
            { name: 'Platzi', cantidad: 98 },
            { name: 'LinkedIn Learning', cantidad: 85 },
            { name: 'Cisco', cantidad: 75 },
            { name: 'Microsoft', cantidad: 68 },
            { name: 'edX', cantidad: 52 },
            { name: 'IBM', cantidad: 45 },
          ],
          formatDist: [
            { name: 'PDF', value: 40 },
            { name: 'Imágenes', value: 30 },
            { name: 'Solo URL', value: 15 },
            { name: 'Ambos', value: 15 },
          ],
          expirationDist: [
            { name: 'Con vencimiento', value: 35 },
            { name: 'Sin vencimiento', value: 65 },
          ]
        };

        setStats(response.stats);
        setIssuersData(response.issuers);
        setFormatData(response.formatDist);
        setExpirationData(response.expirationDist);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //useEffect(() => {
    //const fetchData = async () => {
      //try {
        //setLoading(true);

        //const response = await fetch(
          //'http://localhost:8000/api/admin/certificate-reports'
        //);

        //if (!response.ok) {
          //throw new Error('Error al obtener reportes');
        //}

        //const data: ResponseData = await response.json();

        //setStats(data.stats);
        //setIssuersData(data.issuers);
        //setFormatData(data.formatDist);
        //setExpirationData(data.expirationDist);

      //} catch (error) {
        //console.error(error);
      //} finally {
        //setLoading(false);
      //}
    //};

    //fetchData();
  //}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#003A6C]">
        <p>Cargando reporte de certificados...</p>
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
                className="h-11 flex items-center justify-center gap-2 px-5 rounded-xl bg-[#003A6C] text-white hover:bg-[#002d54] hover:text-white transition-colors"
              >
                <Download className="w-5 h-5" />
                Exportar a PDF
              </button>
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
              <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={issuersData} layout="vertical" margin={{ left: 40, right: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#4B778D'}} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={120} tick={{fill: '#003A6C', fontSize: 13, fontWeight: 500}} />
                    <Tooltip cursor={{fill: '#F8FAFC'}} />
                    <Bar dataKey="cantidad" fill="#4A6CF7" radius={[0, 4, 4, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pastel: Distribución por Formato */}
              <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#003A6C]">Distribución por Formato</h2>
                  <p className="text-sm text-[#4B778D]">Tipos de archivo de respaldo</p>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatData}
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
              <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#003A6C]">Certificados con vencimiento</h2>
                  <p className="text-sm text-[#4B778D]">Estado de vigencia de certificados</p>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expirationData}
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

const StatCard = ({ title, value, subtext, Icon }: StatCardProps) => (
  <div className="bg-white border border-[#A5C9D7] rounded-3xl p-5 shadow-sm relative transition-all hover:border-[#70A1B9]">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-[#003A6C] font-semibold text-sm leading-tight">
          {title}
        </p>
        <p className="text-3xl font-bold text-[#003A6C]">
          {value}
        </p>

        <p className="text-xs text-[#4B778D] font-medium">
          {subtext}
        </p>
      </div>
      <div>
        <Icon
          className="w-4 h-4 text-[#003A6C]"
          strokeWidth={2}
        />
      </div>
    </div>
  </div>
);

export default CertificateReports;