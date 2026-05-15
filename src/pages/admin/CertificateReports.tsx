import Header from '../../components/HeaderUser'; 
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { Footer } from '@/components/Footer';
const CertificateReports = () => {
  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl">Gestión de Certificados</h1>
              <p className="mt-2 text-sm text-[#4B778D] md:text-base">Visualiza y gestiona los certificados emitidos</p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};


export default CertificateReports;