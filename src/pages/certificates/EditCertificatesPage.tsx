import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Edit3, X } from 'lucide-react';
import { useCertificatesManager } from '../../hooks/useCertificatesManager';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function EditCertificatesPage() {
  const {
    certificates,
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
    handleSubmit,
  } = useCertificatesManager();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-[#003A6C] mb-8">Editar Certificados</h1>

            {certificates.length === 0 ? (
              <div className="text-center py-10 text-[#4B778D] bg-white rounded-2xl border-2 border-dashed border-[#6dacbf]">
                <p>No hay certificados registrados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map(cert => (
                  <div
                    key={cert.id}
                    className="bg-white p-4 rounded-2xl border border-[#6dacbf]/30 flex justify-between items-center shadow-sm hover:border-[#003A6C] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#003A6C] truncate">{cert.name}</p>
                      <p className="text-sm text-[#4B778D] truncate">{cert.issuer}</p>
                    </div>
                    <button
                      onClick={() => openEditModal(cert)}
                      className="ml-2 p-2 bg-[#C2DBED]/50 text-[#003A6C] rounded-lg hover:bg-[#C2DBED] transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Edición */}
      {isModalOpen && editingCertificate && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-3 backdrop-blur-sm sm:items-center sm:px-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#6DACBF] bg-[#C2DBED] shadow-2xl sm:rounded-3xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#D7E6F2] px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-2xl font-bold text-[#003A6C]">Editar certificado</h2>
                <p className="mt-1 text-sm text-[#4B778D]">Actualiza la información del certificado.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9] disabled:opacity-50"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={`w-full p-3 rounded-xl border outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-400 focus:ring-red-100'
                      : 'border-[#A5D7E8] focus:ring-[#A5D7E8]'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">Emisor *</label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => updateField('issuer', e.target.value)}
                  className={`w-full p-3 rounded-xl border outline-none focus:ring-2 ${
                    errors.issuer
                      ? 'border-red-400 focus:ring-red-100'
                      : 'border-[#A5D7E8] focus:ring-[#A5D7E8]'
                  }`}
                />
                {errors.issuer && <p className="text-red-500 text-sm mt-1">{errors.issuer}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#003A6C] font-semibold mb-2">Fecha emisión *</label>
                  <input
                    type="date"
                    value={formData.date_issued}
                    onChange={(e) => updateField('date_issued', e.target.value)}
                    className={`w-full p-3 rounded-xl border outline-none focus:ring-2 ${
                      errors.date_issued
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-[#A5D7E8] focus:ring-[#A5D7E8]'
                    }`}
                  />
                  {errors.date_issued && <p className="text-red-500 text-sm mt-1">{errors.date_issued}</p>}
                </div>

                <div>
                  <label className="block text-[#003A6C] font-semibold mb-2">Vencimiento</label>
                  <input
                    type="date"
                    value={formData.date_expired}
                    onChange={(e) => updateField('date_expired', e.target.value)}
                    disabled={formData.no_expiration}
                    className={`w-full p-3 rounded-xl border outline-none focus:ring-2 disabled:opacity-50 ${
                      errors.date_expired
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-[#A5D7E8] focus:ring-[#A5D7E8]'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="no-expiration-edit"
                  checked={formData.no_expiration || false}
                  onChange={(e) => updateField('no_expiration', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="no-expiration-edit" className="text-[#003A6C] font-medium text-sm">
                  Sin fecha de vencimiento
                </label>
              </div>

              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-[#A5D7E8] outline-none focus:ring-2 focus:ring-[#A5D7E8]"
                />
              </div>

              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">ID Credencial</label>
                <input
                  type="text"
                  value={formData.credential_id}
                  onChange={(e) => updateField('credential_id', e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#A5D7E8] outline-none focus:ring-2 focus:ring-[#A5D7E8]"
                />
              </div>

              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">URL Credencial</label>
                <input
                  type="url"
                  value={formData.credential_url}
                  onChange={(e) => updateField('credential_url', e.target.value)}
                  className={`w-full p-3 rounded-xl border outline-none focus:ring-2 ${
                    errors.credential_url
                      ? 'border-red-400 focus:ring-red-100'
                      : 'border-[#A5D7E8] focus:ring-[#A5D7E8]'
                  }`}
                />
              </div>

              <div className="flex gap-3 border-t border-[#D7E6F2] pt-5">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 h-11 bg-[#003A6C] text-white hover:bg-[#1a4f7a] rounded-lg font-bold disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Actualizar'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="flex-1 h-11 border border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9] rounded-lg font-bold disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
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
