import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Trash2, AlertCircle, Search, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { useCertificatesManager } from '../../hooks/useCertificatesManager';

export default function DeleteCertificatesPage() {
  const {
    paginatedCertificates,
    filteredCertificates,
    showConfirmDelete,
    cancelDelete,
    certificateToDelete,
    confirmDelete,
    isDeleting,
    selectedCertificateIds,
    requestDeleteSelected,
    toggleSelectCertificate,
    toggleSelectAllCertificates,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useCertificatesManager();

  const visibleIds = paginatedCertificates.map((cert) => cert.id);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedCertificateIds.has(id));
  const someSelected = visibleIds.some((id) => selectedCertificateIds.has(id));
  const selectedCount = selectedCertificateIds.size;

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#003A6C]">Eliminar Certificados</h1>
                  <span className="rounded-full bg-red-100 p-1.5 text-red-600">
                    <AlertCircle size={20} />
                  </span>
                </div>
                <p className="text-[#4B778D]">
                  {selectedCount > 0
                    ? `${selectedCount} certificado${selectedCount > 1 ? 's' : ''} seleccionado${selectedCount > 1 ? 's' : ''}`
                    : 'Selecciona certificados para eliminarlos'}
                </p>
              </div>

              {selectedCount > 0 && (
                <button
                  type="button"
                  onClick={requestDeleteSelected}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 self-start rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="size-4" />
                  Eliminar ({selectedCount})
                </button>
              )}
            </div>

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

            {filteredCertificates.length === 0 ? (
              <div className="text-center py-10 text-[#4B778D] bg-white rounded-2xl border-2 border-dashed border-[#6dacbf]">
                <p>{searchTerm ? 'No se encontraron certificados' : 'No hay certificados registrados'}</p>
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
                  <div className="grid grid-cols-[auto_minmax(0,2.5fr)_minmax(180px,1.4fr)_140px] items-center gap-6 border-b border-red-100 px-6 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected && !allSelected;
                      }}
                      onChange={() => toggleSelectAllCertificates(visibleIds)}
                      className="h-4 w-4 cursor-pointer rounded accent-[#003A6C]"
                      aria-label="Seleccionar todos los certificados visibles"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4B778D]">Certificado</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4B778D]">Emisor</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4B778D]">Emisión</span>
                  </div>
                  {paginatedCertificates.map((cert, idx, arr) => (
                    <div
                      key={cert.id}
                      onClick={() => toggleSelectCertificate(cert.id)}
                      className={`grid cursor-pointer grid-cols-[auto_minmax(0,2.5fr)_minmax(180px,1.4fr)_140px] items-center gap-6 px-6 py-4 transition-colors ${
                        selectedCertificateIds.has(cert.id) ? 'bg-red-50/70' : 'hover:bg-red-50/50'
                      } ${
                        idx !== arr.length - 1 ? 'border-b border-red-100' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCertificateIds.has(cert.id)}
                        onChange={() => toggleSelectCertificate(cert.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 cursor-pointer rounded accent-[#003A6C]"
                        aria-label={`Seleccionar ${cert.name}`}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="size-4 shrink-0 text-[#4B778D]" />
                          <span className="truncate font-semibold text-[#003A6C]">{cert.name}</span>
                        </div>
                        {cert.credential_id && (
                          <p className="mt-1 truncate text-xs text-[#6B7E8E]">ID: {cert.credential_id}</p>
                        )}
                      </div>
                      <span className="truncate text-sm text-[#4B778D]">{cert.issuer}</span>
                      <span className="text-sm tabular-nums text-[#4B778D]">
                        {new Date(cert.date_issued).toLocaleDateString('es-ES')}
                      </span>
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
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#003A6C] mb-2">¿Estás seguro?</h3>
            <p className="text-gray-500 mb-6 text-sm">
              {certificateToDelete ? (
                <>
                  Esta acción eliminará permanentemente el certificado{' '}
                  <span className="font-bold text-red-600">"{certificateToDelete.name}"</span>.
                </>
              ) : (
                <>
                  Esta acción eliminará permanentemente{' '}
                  <span className="font-bold text-red-600">
                    {selectedCount} certificado{selectedCount > 1 ? 's' : ''}
                  </span>.
                </>
              )}
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
