import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Edit3, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
    showSuccessModal,
    closeSuccessModal,
    successMessage,
    openEditModal,
    closeModal,
    updateField,
    handleFileChange,
    removeFile,
    handleSubmit,
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
            <p className="text-[#4B778D] mb-6">Selecciona un certificado para actualizar su información.</p>

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
                  {paginatedCertificates.filter(cert => cert.id).map(cert => (
                    <div
                      key={cert.id}
                      className="bg-white p-5 rounded-2xl border border-[#6dacbf]/30 flex flex-col shadow-sm hover:shadow-md hover:border-[#003A6C] transition-all"
                    >
                      <div className="flex-1 min-w-0 mb-4">
                        <p className="font-bold text-[#003A6C] truncate mb-1 text-lg">{cert.name}</p>
                        <p className="text-sm text-[#4B778D] font-semibold mb-2">{cert.issuer}</p>
                        {cert.description && (
                          <p className="text-xs text-[#355468] line-clamp-2 mb-2">{cert.description}</p>
                        )}
                        <div className="text-xs text-[#6B7E8E] space-y-1">
                          <p>Emitido: {new Date(cert.date_issued).toLocaleDateString('es-ES')}</p>
                          {cert.credential_id && <p>ID: {cert.credential_id}</p>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEditModal(cert)}
                        className="w-full px-4 py-2.5 bg-[#C2DBED] text-[#003A6C] rounded-lg hover:bg-[#9ec8e0] font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit3 size={16} /> Editar
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
