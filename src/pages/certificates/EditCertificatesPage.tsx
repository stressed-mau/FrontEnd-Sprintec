import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Search, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { useRef } from 'react';
import { useCertificatesManager } from '../../hooks/useCertificatesManager';
import ConfirmationModal from '../../components/ConfirmationModal';
import { CertificateFormModal } from '../../components/certificates/CertificateFormModal';

export default function EditCertificatesPage() {
  const {
    paginatedCertificates,
    filteredCertificates,
    formData,
    errors,
    isSaving,
    errorMessage,
    isModalOpen,
    editingCertificate,
    showConfirmEdit,
    showSuccessModal,
    closeSuccessModal,
    successMessage,
    openEditModal,
    closeModal,
    updateField,
    handleFileChange,
    removeFile,
    handleSubmit,
    setShowConfirmEdit,
    fileInput,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useCertificatesManager();

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-[#003A6C] mb-2">Editar Certificados</h1>
            <p className="text-[#4B778D] mb-6">Haz clic en una fila para editar el certificado.</p>

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
                <div className="overflow-hidden rounded-2xl border border-[#6dacbf]/30 bg-white shadow-sm">
                  <div className="grid grid-cols-[minmax(0,2.6fr)_minmax(180px,1.5fr)_140px] gap-6 border-b border-[#6dacbf]/20 px-6 py-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4B778D]">Certificado</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4B778D]">Emisor</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4B778D]">Emisión</span>
                  </div>
                  {paginatedCertificates.filter(cert => cert.id).map((cert, idx, arr) => (
                    <div
                      key={cert.id}
                      onClick={() => openEditModal(cert)}
                      className={`grid cursor-pointer grid-cols-[minmax(0,2.6fr)_minmax(180px,1.5fr)_140px] items-center gap-6 px-6 py-4 transition-colors hover:bg-[#EEF6FC] ${
                        idx !== arr.length - 1 ? 'border-b border-[#6dacbf]/10' : ''
                      }`}
                    >
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

      {/* Modal de Edición usando Componente */}
      {isModalOpen && editingCertificate && (
        <CertificateFormModal
          formData={formData}
          errors={errors}
          isEditing={true}
          isSaving={isSaving}
          fileInput={fileInput}
          errorMessage={errorMessage}
          fileInputRef={fileInputRef}
          onClose={closeModal}
          onFieldChange={updateField}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          onSubmit={handleSubmit}
        />
      )}

      {showConfirmEdit && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h3 className="mb-4 text-lg font-bold text-[#003A6C]">
              ¿Estás seguro de que deseas guardar los cambios realizados?
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => void handleSubmit()}
                disabled={isSaving}
                className="flex-1 rounded-lg bg-[#003A6C] py-2 text-white font-semibold hover:bg-[#002a50] disabled:opacity-60"
              >
                {isSaving ? 'Guardando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => setShowConfirmEdit(false)}
                disabled={isSaving}
                className="flex-1 rounded-lg bg-gray-200 py-2 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-60"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        title="¡Éxito!"
        message={successMessage}
      />
      <Footer />
    </div>
  );
}