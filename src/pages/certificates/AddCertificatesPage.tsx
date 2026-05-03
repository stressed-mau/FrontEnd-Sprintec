import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { useRef } from 'react';
import { useCertificatesManager } from '../../hooks/useCertificatesManager';
import ConfirmationModal from '../../components/ConfirmationModal';
import { CertificateDateInput } from '@/components/certificates/CertificateDateInput';
import { CertificateFilePreviewField } from '@/components/certificates/CertificateFilePreviewField';

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
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold text-[#003A6C] md:text-4xl">Agregar Certificado</h1>
              <p className="text-sm text-[#4B778D] md:text-base">Completa la información para registrar un nuevo certificado o credencial.</p>
            </div>

            <div className="rounded-2xl border border-[#A5D7E8] bg-white p-5 shadow-sm sm:p-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#003A6C]">Nombre del certificado *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Ej: AWS Solutions Architect"
                    maxLength={100}
                    className={`w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-[#0E7D96]/20 focus:ring-[#0E7D96]/40'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#003A6C]">Emisor *</label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => updateField('issuer', e.target.value)}
                    placeholder="Ej: Amazon Web Services"
                    maxLength={100}
                    className={`w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 ${
                      errors.issuer
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-[#0E7D96]/20 focus:ring-[#0E7D96]/40'
                    }`}
                  />
                  {errors.issuer && <p className="mt-1 text-sm text-red-500">{errors.issuer}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <CertificateDateInput
                  id="certificate-date-issued"
                  label="Fecha de emisión"
                  required
                  value={formData.date_issued}
                  max={today}
                  error={errors.date_issued}
                  onChange={(value) => updateField('date_issued', value)}
                />

                <CertificateDateInput
                  id="certificate-date-expired"
                  label="Fecha de vencimiento"
                  value={formData.date_expired ?? ''}
                  min={today}
                  disabled={formData.no_expiration}
                  error={errors.date_expired}
                  onChange={(value) => updateField('date_expired', value)}
                />
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
                <label className="mb-2 block text-sm font-semibold text-[#003A6C]">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe las habilidades o conocimientos que acredita este certificado"
                  rows={4}
                  maxLength={300}
                  className="w-full rounded-xl border border-[#0E7D96]/20 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#0E7D96]/40"
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#003A6C]">ID de credencial</label>
                  <input
                    type="text"
                    value={formData.credential_id}
                    onChange={(e) => updateField('credential_id', e.target.value)}
                    placeholder="Ej: AWS1234567890"
                    maxLength={50}
                    className="w-full rounded-xl border border-[#0E7D96]/20 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#0E7D96]/40"
                  />
                  {errors.credential_id && <p className="mt-1 text-sm text-red-500">{errors.credential_id}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#003A6C]">URL de verificación</label>
                  <input
                    type="url"
                    value={formData.credential_url}
                    onChange={(e) => updateField('credential_url', e.target.value)}
                    placeholder="Ej: https://verify.provider.com/certificate/12345"
                    maxLength={200}
                    className={`w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 ${
                      errors.credential_url
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-[#0E7D96]/20 focus:ring-[#0E7D96]/40'
                    }`}
                  />
                  {errors.credential_url && <p className="mt-1 text-sm text-red-500">{errors.credential_url}</p>}
                </div>
              </div>

              <CertificateFilePreviewField
                fileInput={fileInput}
                isSaving={isSaving}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
              />

              <div className="flex flex-col gap-3 border-t border-[#D7E6F2] pt-5 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-xl bg-[#003A6C] py-3 text-white font-bold hover:bg-[#002a50] transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Certificado'}
                </button>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex-1 rounded-xl border border-[#6dacbf] bg-[#C2DBED] py-3 font-bold text-[#003A6C] hover:bg-[#b0cfeb]"
                >
                  Cancelar
                </button>
              </div>
            </form>
            </div>
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
