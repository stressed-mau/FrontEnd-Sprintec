import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCertificatesManager } from '../../hooks/useCertificatesManager';

export default function ViewCertificatesPage() {
  const { 
    paginatedCertificates, 
    pageError, 
    isLoading, 
    searchTerm, 
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredCertificates
  } = useCertificatesManager();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="mb-2 text-3xl font-bold text-[#003A6C]">Mis Certificados</h1>
            <p className="text-[#4B778D] mb-6">Visualiza todos tus certificados y credenciales profesionales.</p>

            {pageError && <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 text-red-900 rounded-2xl">{pageError}</div>}

            {/* Buscador */}
            {filteredCertificates.length > 0 && (
              <div className="mb-6 relative">
                <Search className="absolute left-4 top-3.5 size-5 text-[#4B778D]" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, emisor o ID de credencial..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#6DACBF]/30 bg-white text-[#003A6C] placeholder-[#4B778D] focus:ring-2 focus:ring-[#6DACBF] outline-none"
                />
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-10 text-[#4B778D]">Cargando certificados...</div>
            ) : filteredCertificates.length === 0 ? (
              <div className="text-center py-10 text-[#4B778D] bg-white rounded-2xl border-2 border-dashed border-[#6dacbf]">
                <p>{searchTerm ? 'No se encontraron certificados' : 'No hay certificados registrados'}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedCertificates.map(cert => (
                    <div key={cert.id} className="bg-white p-5 rounded-xl border border-[#6dacbf]/30 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#003A6C] text-base mb-1 line-clamp-2">{cert.name}</h3>
                        <p className="text-sm text-[#4B778D] font-semibold mb-2">{cert.issuer}</p>
                        
                        {cert.description && (
                          <p className="text-xs text-[#355468] mb-3 line-clamp-2">{cert.description}</p>
                        )}

                        <div className="space-y-1 text-xs text-[#6B7E8E] mb-3">
                          <p><span className="font-semibold">Emitido:</span> {new Date(cert.date_issued).toLocaleDateString('es-ES')}</p>
                          {cert.date_expired && (
                            <p><span className="font-semibold">Vencimiento:</span> {new Date(cert.date_expired).toLocaleDateString('es-ES')}</p>
                          )}
                          {cert.credential_id && (
                            <p><span className="font-semibold">ID:</span> {cert.credential_id}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-[#D7E6F2]">
                        {cert.file_bonus_url && (
                          <a href={cert.file_bonus_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs text-[#0E7D96] hover:text-[#003A6C] font-semibold py-1 px-2 rounded border border-[#6DACBF]/30 text-center hover:bg-[#EEF5F9]">
                            Archivo
                          </a>
                        )}
                        {cert.credential_url && (
                          <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs text-[#0E7D96] hover:text-[#003A6C] font-semibold py-1 px-2 rounded border border-[#6DACBF]/30 text-center hover:bg-[#EEF5F9]">
                            Credencial
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between gap-4">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#6DACBF]/30 text-[#003A6C] hover:bg-[#EEF5F9] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="size-4" /> Anterior
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                            currentPage === page
                              ? 'bg-[#003A6C] text-white'
                              : 'bg-white border border-[#6DACBF]/30 text-[#003A6C] hover:bg-[#EEF5F9]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#6DACBF]/30 text-[#003A6C] hover:bg-[#EEF5F9] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente <ChevronRight className="size-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
