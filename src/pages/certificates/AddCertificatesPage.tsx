import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { useRef } from 'react';
import { useCertificatesManager } from '../../hooks/useCertificatesManager';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function AddCertificatesPage() {
  const {
    formData,
    errors,
    isSaving,
    errorMessage,
    showSuccessModal,
    closeSuccessModal,
    successMessage,
    updateField,
    handleFileChange,
    removeFile,
    handleSubmit,
    fileInput,
  } = useCertificatesManager();

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-2xl mx-auto bg-[#C2DBED] rounded-[2rem] p-8 shadow-sm border border-[#6dacbf]/20">
            <h1 className="text-3xl font-bold text-[#003A6C] mb-2">Agregar Certificado</h1>
            <p className="text-[#4982AD] mb-8">Completa la información para registrar un nuevo certificado o credencial.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">Nombre del certificado *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Ej: AWS Solutions Architect"
                  maxLength={255}
                  className={`w-full rounded-xl border bg-white p-3.5 outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-400 focus:ring-red-100'
                      : 'border-[#0E7D96]/20 focus:ring-[#0E7D96]/30'
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
                  placeholder="Ej: Amazon Web Services"
                  maxLength={255}
                  className={`w-full rounded-xl border bg-white p-3.5 outline-none focus:ring-2 ${
                    errors.issuer
                      ? 'border-red-400 focus:ring-red-100'
                      : 'border-[#0E7D96]/20 focus:ring-[#0E7D96]/30'
                  }`}
                />
                {errors.issuer && <p className="text-red-500 text-sm mt-1">{errors.issuer}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#003A6C] font-semibold mb-2">Fecha de emisión *</label>
                  <input
                    type="date"
                    value={formData.date_issued}
                    onChange={(e) => updateField('date_issued', e.target.value)}
                    className={`w-full rounded-xl border bg-white p-3.5 outline-none focus:ring-2 ${
                      errors.date_issued
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-[#0E7D96]/20 focus:ring-[#0E7D96]/30'
                    }`}
                  />
                  {errors.date_issued && <p className="text-red-500 text-sm mt-1">{errors.date_issued}</p>}
                </div>

                <div>
                  <label className="block text-[#003A6C] font-semibold mb-2">Fecha de vencimiento</label>
                  <input
                    type="date"
                    value={formData.date_expired}
                    onChange={(e) => updateField('date_expired', e.target.value)}
                    disabled={formData.no_expiration}
                    className={`w-full rounded-xl border bg-white p-3.5 outline-none focus:ring-2 disabled:opacity-50 ${
                      errors.date_expired
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-[#0E7D96]/20 focus:ring-[#0E7D96]/30'
                    }`}
                  />
                  {errors.date_expired && <p className="text-red-500 text-sm mt-1">{errors.date_expired}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="no-expiration"
                  checked={formData.no_expiration || false}
                  onChange={(e) => updateField('no_expiration', e.target.checked)}
                  className="w-4 h-4 rounded border-[#0E7D96]/20 text-[#003A6C]"
                />
                <label htmlFor="no-expiration" className="text-[#003A6C] font-medium text-sm">
                  Este certificado no tiene fecha de vencimiento
                </label>
              </div>

              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe las habilidades o conocimientos que acredita este certificado"
                  rows={3}
                  className="w-full rounded-xl border border-[#0E7D96]/20 bg-white p-3.5 outline-none focus:ring-2 focus:ring-[#0E7D96]/30"
                />
              </div>

              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">ID de credencial</label>
                <input
                  type="text"
                  value={formData.credential_id}
                  onChange={(e) => updateField('credential_id', e.target.value)}
                  placeholder="Ej: AWS-12345-67890"
                  maxLength={255}
                  className="w-full rounded-xl border border-[#0E7D96]/20 bg-white p-3.5 outline-none focus:ring-2 focus:ring-[#0E7D96]/30"
                />
              </div>

              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">URL de credencial</label>
                <input
                  type="url"
                  value={formData.credential_url}
                  onChange={(e) => updateField('credential_url', e.target.value)}
                  placeholder="Ej: https://verify.provider.com/certificate/12345"
                  className={`w-full rounded-xl border bg-white p-3.5 outline-none focus:ring-2 ${
                    errors.credential_url
                      ? 'border-red-400 focus:ring-red-100'
                      : 'border-[#0E7D96]/20 focus:ring-[#0E7D96]/30'
                  }`}
                />
                {errors.credential_url && <p className="text-red-500 text-sm mt-1">{errors.credential_url}</p>}
              </div>

              <div>
                <label className="block text-[#003A6C] font-semibold mb-2">Archivo Adicional</label>
                <div className="rounded-xl border-2 border-dashed border-[#0E7D96]/20 bg-[#F8FAFC] p-4">
                  {fileInput ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 truncate">
                        <p className="truncate text-sm font-medium text-[#003A6C]">{fileInput.name}</p>
                        <p className="text-xs text-[#4B778D]">{(fileInput.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-[#4B778D]">
                        Haz clic o arrastra un archivo (PDF, JPG, JPEG)
                      </p>
                      <p className="text-xs text-[#6B7E8E]">Máximo 2MB</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSaving}
                        className="inline-block px-4 py-2 bg-[#C2DBED] text-[#003A6C] rounded-lg font-medium hover:bg-[#9ec8e0]"
                      >
                        Seleccionar archivo
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#003A6C] text-white py-4 rounded-xl font-bold hover:bg-[#002a50] transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Certificado'}
                </button>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex-1 bg-[#C2DBED] text-[#003A6C] py-4 rounded-xl font-bold border border-[#6dacbf]/30 hover:bg-[#a8cde3]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
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
