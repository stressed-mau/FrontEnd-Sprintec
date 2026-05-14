import { useEffect, useState } from 'react';
import { allCountries } from 'country-telephone-data';
import { Upload, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ConfirmActionModal from '@/components/ConfirmActionModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Footer } from '@/components/Footer';
import Header from '@/components/HeaderUser';
import Sidebar from '@/components/Sidebar';
import { useUserPersonalData } from '@/hooks/useUserPersonalData';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {
    form,
    errors,
    preview,
    countryCode,
    phoneNumber,
    fileInputRef,
    setCountryCode,
    handlePhoneChange,
    handleChange,
    handleCancel,
    isSubmitting,
    canSavePersonalData,
    handleSubmit,
    success,
    setSuccess,
    loading,
    hasPersonalData,
    handleFileChange,
    handleClick,
    charLimitWarning,
    emailSuggestion,
    applyEmailSuggestion,
  } = useUserPersonalData();

  const handleSaveTrigger = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSavePersonalData) {
      setShowSaveConfirmModal(true);
    }
  };

  const confirmSave = async () => {
    setShowSaveConfirmModal(false);
    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;

    await handleSubmit(fakeEvent);
  };

  const confirmCancel = () => {
    handleCancel();
    setShowCancelConfirmModal(false);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSuccess('');
    navigate('/personal/ver', { replace: true });
  };

  useEffect(() => {
    if (success && !showSuccessModal) {
      setShowSuccessModal(true);
    }
  }, [success, showSuccessModal]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
        <Header />
        <div className="flex flex-col lg:flex-row flex-1">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 md:p-10">
            <div className="flex h-64 items-center justify-center text-[#003A6C]">
              <div className="mr-2 h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Cargando...
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hasPersonalData) {
    return (
      <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
        <Header />
        <div className="flex flex-col lg:flex-row flex-1">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 md:p-10">
            <div className="mx-auto max-w-6xl space-y-6">
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl">Editar datos personales</h1>
                <p className="mt-2 text-sm text-[#4B778D] md:text-base">Actualiza con cuidado la informacion visible en tu perfil profesional.</p>
              </div>

            <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-[#003A6C]">Aun no hay registro</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Primero debes registrar tus datos personales. Ese registro solo se realiza una vez; despues podras editar la informacion desde esta subseccion.
              </p>
              <button
                type="button"
                onClick={() => navigate('/registro/completar-perfil')}
                className="mt-6 rounded-xl bg-[#003A6C] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#002d54]"
              >
                Registrar datos personales
              </button>
            </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl">Editar datos personales</h1>
              <p className="mt-2 text-sm text-[#4B778D] md:text-base">Actualiza con cuidado la informacion visible en tu perfil profesional.</p>
            </div>

            <form onSubmit={handleSaveTrigger} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col items-center justify-center mb-6 text-center">
                <div className="w-24 h-24 bg-[#E2E8F0] rounded-full flex items-center justify-center overflow-hidden border border-gray-300 mb-3">
                  {preview || form.image ? (
                    <img src={preview || form.image} alt="Vista previa" className="w-full h-full object-cover" />
                  ) : (
                    <User size={60} className="text-gray-400" />
                  )}
                </div>

                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleClick}
                  className="flex items-center gap-2 px-6 py-2 border border-[#4982AD] rounded-lg text-[#003A6C] text-sm bg-[#E2EEF6] hover:bg-white transition-all shadow-sm mb-2 font-medium"
                >
                  <Upload size={16} /> Cambiar foto *
                </button>
                <p className="text-gray-500 text-[11px]">JPG, PNG, JPEG (max. 2MB)</p>
                {errors.image ? <p className="text-red-500 text-xs mt-1">{errors.image}</p> : null}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
                <div className="flex flex-col gap-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#003A6C]">Nombre completo *</label>
                    <input
                      id="fullName"
                      value={form.fullName}
                      type="text"
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-sm outline-none text-[#5B6B7A] cursor-not-allowed"
                    />
                    {errors.fullName ? <p className="text-red-500 text-xs mt-1">{errors.fullName}</p> : null}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#003A6C]">Biografía</label>
                    <textarea
                      id="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={6}
                      maxLength={300}
                      placeholder="Cuéntanos sobre ti y tu experiencia..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none resize-none focus:ring-2 focus:ring-blue-400 text-[#003A6C]"
                    />
                    {errors.bio ? <p className="text-red-500 text-xs mt-1">{errors.bio}</p> : null}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#003A6C]">Correo electrónico público *</label>
                    <input
                      id="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      maxLength={60}
                      placeholder="Ej: juan.perez@example.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 text-[#003A6C]"
                    />
                    {errors.email ? (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    ) : charLimitWarning.email ? (
                      <p className="text-yellow-600 text-xs mt-1">{charLimitWarning.email}</p>
                    ) : emailSuggestion ? (
                      <p className="text-amber-700 text-xs mt-1">
                        ¿Quisiste decir{' '}
                        <span
                          className="underline cursor-pointer font-medium"
                          onClick={() => applyEmailSuggestion(emailSuggestion.full)}
                        >
                          {emailSuggestion.full}
                        </span>
                        ?
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#003A6C]">Numero de contacto *</label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(event) => setCountryCode(event.target.value)}
                        className="w-32 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 text-[#003A6C] appearance-none cursor-pointer"
                      >
                        {allCountries.map((country) => (
                          <option key={country.iso2} value={country.dialCode}>
                            +{country.dialCode}
                          </option>
                        ))}
                      </select>

                      <input
                        value={phoneNumber}
                        onChange={(event) => handlePhoneChange(event.target.value)}
                        type="tel"
                        inputMode="numeric"
                        maxLength={8}
                        placeholder="Ej: 77777777"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 text-[#003A6C]"
                      />
                    </div>
                    {errors.phone ? (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    ) : charLimitWarning.phone ? (
                      <p className="text-red-500 text-xs mt-1">{charLimitWarning.phone}</p>
                    ) : null}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#003A6C]">Residencia actual</label>
                    <input
                      id="location"
                      value={form.location}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="Ej: La Paz, Bolivia"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none resize-none focus:ring-2 focus:ring-blue-400 text-[#003A6C]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#003A6C]">Ocupación</label>
                    <input
                      id="occupation"
                      value={form.occupation}
                      onChange={handleChange}
                      maxLength={80}
                      placeholder="Ej: Desarrollador Full Stack"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 text-[#003A6C]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !canSavePersonalData}
                  className={`bg-[#003A6C] text-white px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                    isSubmitting || !canSavePersonalData ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1a4f85]'
                  }`}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowCancelConfirmModal(true)}
                  className={`bg-[#C2DBED] text-[#003A6C] px-4 py-2 text-sm rounded-lg border border-[#4982AD] font-medium transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#C4A57C]'
                  }`}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <ConfirmActionModal
        isOpen={showCancelConfirmModal}
        title="Confirmar cambios"
        message="¿Está seguro de que desea revertir los cambios?"
        confirmText="Aceptar"
        cancelText="Cancelar"
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelConfirmModal(false)}
      />
      <ConfirmActionModal
        isOpen={showSaveConfirmModal}
        title="Confirmar cambios"
        message="¿Está seguro de que desea guardar los cambios en sus datos personales?"
        confirmText={isSubmitting ? "Guardando..." : "Aceptar"}
        cancelText="Cancelar"
        onConfirm={confirmSave}
        onCancel={() => setShowSaveConfirmModal(false)}
      />
      <ConfirmationModal
        isOpen={showSuccessModal}
        title="Éxito"
        message="Información actualizada correctamente."
        onClose={handleSuccessClose}
      />
      <Footer />
    </div>
  );
};

export default EditProfilePage;
