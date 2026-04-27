import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Award } from 'lucide-react';
import { useCertificatesManager } from '../../hooks/useCertificatesManager';

export default function ViewCertificatesPage() {
  const { certificates, pageError, isLoading } = useCertificatesManager();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="mb-2 text-3xl font-bold text-[#003A6C]">Mis Certificados</h1>
            <p className="text-[#4B778D] mb-8">Visualiza todos tus certificados y credenciales profesionales.</p>

            {pageError && <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 text-red-900 rounded-2xl">{pageError}</div>}

            {isLoading ? (
              <div className="text-center py-10 text-[#4B778D]">Cargando certificados...</div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-10 text-[#4B778D] bg-white rounded-2xl border-2 border-dashed border-[#6dacbf]">
                <Award className="size-12 mx-auto mb-2 opacity-50" />
                <p>No hay certificados registrados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="bg-white p-6 rounded-2xl border border-[#6dacbf]/30 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex size-14 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C] shrink-0">
                        <Award className="size-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#003A6C] text-lg">{cert.name}</h3>
                        <p className="text-[#4B778D]">{cert.issuer}</p>
                        {cert.description && (
                          <p className="text-sm text-[#355468] mt-2">{cert.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#6B7E8E]">
                          <span>Emitido: {new Date(cert.date_issued).toLocaleDateString('es-ES')}</span>
                          {cert.date_expired && (
                            <span>Vencimiento: {new Date(cert.date_expired).toLocaleDateString('es-ES')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
