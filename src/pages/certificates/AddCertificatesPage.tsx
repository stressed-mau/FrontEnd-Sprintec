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
<<<<<<< HEAD
        <main className="flex-1 p-3 sm:p-4 md:p-5">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
            <div className="mb-4">
              <h1 className="mb-1 text-2xl font-bold text-[#003A6C] md:text-3xl">Agregar Certificado</h1>
              <p className="text-sm text-[#4B778D]">Completa la información para registrar un nuevo certificado o credencial.</p>
=======
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold text-[#003A6C] md:text-4xl">Registrar Certificado</h1>
              <p className="text-sm text-[#4B778D] md:text-base">Completa la información para registrar un nuevo certificado o credencial.</p>
>>>>>>> 75addb638adb8904db4dd22c0a942eb57ea522b5
            </div>

            <div className="rounded-2xl border border-[#A5D7E8] bg-white p-4 shadow-sm sm:p-5">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#003A6C]">Nombre del certificado *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Ej: AWS Solutions Architect"
                      maxLength={100}
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-red-400 focus:ring-red-100'
                          : 'border-[#0E7D96]/20 focus:ring-[#0E7D96]/40'
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#003A6C]">Emisor *</label>
                    <input
                      type="text"
                      value={formData.issuer}
                      onChange={(e) => updateField('issuer', e.target.value)}
                      placeholder="Ej: Amazon Web Services"
                      maxLength={100}
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 outline-none focus:ring-2 ${
                        errors.issuer
                          ? 'border-red-400 focus:ring-red-100'
                          : 'border-[#0E7D96]/20 focus:ring-[#0E7D96]/40'
                      }`}
                    />
                    {errors.issuer && <p className="mt-1 text-sm text-red-500">{errors.issuer}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <CertificateDateInput
                    id="certificate-date-issued"
                    label="Fecha de emisión"
                    required
                    value={formData.date_issued}
                    max={today}
                    error={errors.date_issued}
                    onChange={(value) => updateField('date_issued', value)}
                  />

                  <div className="space-y-2">
                    <CertificateDateInput
                      id="certificate-date-expired"
                      label="Fecha de vencimiento"
                      value={formData.date_expired ?? ''}
                      min={today}
                      disabled={formData.no_expiration}
                      error={errors.date_expired}
                      onChange={(value) => updateField('date_expired', value)}
                    />

                    <label
                      htmlFor="no-expiration"
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#D7E6F2] bg-[#F8FBFD] px-3 py-2 text-sm text-[#355468]"
                    >
                      <input
                        type="checkbox"
                        id="no-expiration"
                        checked={formData.no_expiration || false}
                        onChange={(e) => updateField('no_expiration', e.target.checked)}
                        className="h-4 w-4 rounded border-[#0E7D96]/20 text-[#003A6C]"
                      />
                      Este certificado no tiene fecha de vencimiento
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#003A6C]">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe las habilidades o conocimientos que acredita este certificado"
                    rows={3}
                    maxLength={300}
                    className="w-full rounded-xl border border-[#0E7D96]/20 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0E7D96]/40"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#003A6C]">ID de credencial</label>
                    <input
                      type="text"
                      value={formData.credential_id}
                      onChange={(e) => updateField('credential_id', e.target.value)}
                      placeholder="Ej: AWS1234567890"
                      maxLength={50}
                      className="w-full rounded-xl border border-[#0E7D96]/20 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0E7D96]/40"
                    />
                    {errors.credential_id && <p className="mt-1 text-sm text-red-500">{errors.credential_id}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#003A6C]">URL de verificación</label>
                    <input
                      type="url"
                      value={formData.credential_url}
                      onChange={(e) => updateField('credential_url', e.target.value)}
                      placeholder="Ej: https://verify.provider.com/certificate/12345"
                      maxLength={200}
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 outline-none focus:ring-2 ${
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
                  error={errors.file_bonus_url}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                />

                <div className="flex flex-col gap-3 border-t border-[#D7E6F2] pt-4 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 rounded-xl bg-[#003A6C] py-2.5 text-sm font-bold text-white transition-all hover:bg-[#002a50] disabled:opacity-50"
                  >
                    {isSaving ? 'Guardando...' : 'Guardar Certificado'}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex-1 rounded-xl border border-[#6dacbf] bg-[#C2DBED] py-2.5 text-sm font-bold text-[#003A6C] hover:bg-[#b0cfeb]"
                  >
                    Cancelar
                  </button>
                </div>
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
