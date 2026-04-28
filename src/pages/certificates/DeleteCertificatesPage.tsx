import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Trash2, AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCertificatesManager } from '../../hooks/useCertificatesManager';

export default function DeleteCertificatesPage() {
  const {
    paginatedCertificates,
    filteredCertificates,
    requestDelete,
    showConfirmDelete,
    cancelDelete,
    certificateToDelete,
    confirmDelete,
    isDeleting,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useCertificatesManager();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-[#003A6C]">Eliminar Certificados</h1>
              <span className="bg-red-100 text-red-600 p-1.5 rounded-full">
                <AlertCircle size={20} />
              </span>
            </div>
            <p className="text-[#4B778D] mb-6">Selecciona un certificado para eliminarlo permanentemente.</p>
            <p className="text-[#4B778D] mb-6">Selecciona un certificado para eliminarlo permanentemente.</p>

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

            {filteredCertificates.length === 0 ? (
              <div className="text-center py-10 text-[#4B778D] bg-white rounded-2xl border-2 border-dashed border-[#6dacbf]">
                <p>{searchTerm ? 'No se encontraron certificados' : 'No hay certificados registrados'}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedCertificates.map(cert => (
                    <div
                      key={cert.id}
                      className="bg-white p-5 rounded-xl border border-red-200 flex flex-col h-full shadow-sm hover:shadow-md hover:border-red-400 transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-[#003A6C] text-base mb-1 line-clamp-2">{cert.name}</p>
                        <p className="text-sm text-[#4B778D] font-semibold mb-2">{cert.issuer}</p>
                        {cert.description && (
                          <p className="text-xs text-[#355468] line-clamp-2 mb-3">{cert.description}</p>
                        )}
                        <div className="text-xs text-[#6B7E8E] space-y-1 mb-3">
                          <p><span className="font-semibold">Emitido:</span> {new Date(cert.date_issued).toLocaleDateString('es-ES')}</p>
                          {cert.credential_id && <p><span className="font-semibold">ID:</span> {cert.credential_id}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => requestDelete(cert)}
                        className="w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white font-semibold transition-colors flex items-center justify-center gap-2 text-sm border border-red-200 hover:border-red-500"
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
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

      {/* Modal de Confirmación */}
      {showConfirmDelete && certificateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#003A6C] mb-2">¿Estás seguro?</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Esta acción eliminará permanentemente el certificado{' '}
              <span className="font-bold text-red-600">"{certificateToDelete.name}"</span>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => void confirmDelete()}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
