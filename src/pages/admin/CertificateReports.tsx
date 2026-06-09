import { useEffect, useRef, useState } from 'react';
import { Award, Link, FileText, CheckCircle, Download, Eye } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Footer } from '@/components/Footer';
import StatCard from "@/components/reports/StatCard";
import PrintHeader from "@/components/reports/PrintHeader";
import Header from '../../components/HeaderUser'; 
import AdminSidebar from '../../components/Admin/AdminSidebar';
import TopIssuersChart from "@/components/reports/TopIssuersChart";
import FormatDistributionChart from "@/components/reports/FormatDistributionChart";
import ExpirationChart from "@/components/reports/ExpirationChart";

import { useCertificateReports } from '@/hooks/useCertificateReports';
const CertificateReports = () => {
  const {data, loading, error, } = useCertificateReports();
  const stats = data?.stats || {
    totalCertificados: 0,
    conLink: 0,
    conArchivo: 0,
    conAmbos: 0,
  };
  const hasCertificates = stats.totalCertificados > 0;
  const issuersData = data?.issuers || [];
  const formatData = data?.formatDist || [];
  const expirationData = data?.expirationDist || [];
  const hasIssuersData =
    issuersData.length > 0 &&
    issuersData.some(item => item.cantidad > 0);

  const hasFormatData =
    formatData.length > 0 &&
    formatData.some(item => item.value > 0);

  const hasExpirationData =
    expirationData.length > 0 &&
    expirationData.some(item => item.value > 0);

  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: 'Reporte-Certificados',
    pageStyle: `
    @page {
      size: auto;
      margin: 15mm 12mm 15mm 12mm;
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const [isPrinting, setIsPrinting] = useState(false);
  const isCompact = isMobile && !isPrinting;

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
        <main className="flex-1 overflow-x-hidden p-3 sm:p-6 md:p-10">
          <div
            ref={reportRef}
            className="
              mx-auto
              w-full
              max-w-6xl
              space-y-6
              p-2
              sm:p-4
              md:p-6
              print:max-w-full
              print:px-2
              print:pt-6
              print:scale-[0.92]
              print:origin-top
            "
          >
            <PrintHeader />    
            {/* Header del Reporte */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">           
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003A6C] break-words">
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
                  w-full
                  sm:w-auto
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
                Generar PDF
              </button>
            </div>
            <div className="mb-5 p-2 bg-[#E0F2FE] border border-[#7DD3FC] rounded-2xl w-fit">
              <span className="text-[#0369A1] font-bold text-sm italic">
                Reporte actualizado automáticamente
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total de Certificados" value={stats.totalCertificados} subtext="Certificados en el sistema" Icon={Award} />
              <StatCard title="Certificados con link" value={stats.conLink} subtext="Con URL de credencial" Icon={Link} />
              <StatCard title="Certificados con Archivo" value={stats.conArchivo} subtext="PDF, PNG, etc." Icon={FileText} />
              <StatCard title="Certificados con Link y Archivo" value={stats.conAmbos} subtext="Ambos respaldos" Icon={CheckCircle} />
            </div>
            {!hasCertificates && (
              <div className="bg-white border border-[#A5C9D7] rounded-3xl p-10 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center">
                  <Eye
                    className="w-14 h-14 text-gray-300 mb-4"
                    strokeWidth={1.5}
                  />

                  <p className="text-lg font-medium text-[#4B5563]">
                    No existen certificados registrados actualmente.
                  </p>
                </div>
              </div>
            )}
              <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[#003A6C]">
                    Top 10 Emisores
                  </h2>
                  <p className="text-sm text-[#4B778D]">
                    Organizaciones con más certificados emitidos
                  </p>
                </div>

                <TopIssuersChart
                  data={issuersData}
                  isCompact={isCompact}
                  isMobile={isMobile}
                  hasData={hasIssuersData}
                />
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
              <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid print:mt-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#003A6C']">
                    Distribución por Formato
                  </h2>
                  <p className="text-sm text-[#4B778D]">
                    Tipos de archivo de respaldo
                  </p>
                </div>

                <FormatDistributionChart
                  data={formatData}
                  isCompact={isCompact}
                  hasData={hasFormatData}
                />
              </div>
              <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid print:mt-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#003A6C]">
                    Certificados con Vencimiento
                  </h2>
                  <p className="text-sm text-[#4B778D]">
                    Estado de vigencia de certificados
                  </p>
                </div>

                <ExpirationChart
                  data={expirationData}
                  isCompact={isCompact}
                  hasData={hasExpirationData}
                />
              </div>
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CertificateReports;
