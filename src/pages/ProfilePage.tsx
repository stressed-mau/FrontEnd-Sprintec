import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { User, Mail, Lock, SquarePen, X, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div id="profile-page" className="min-h-screen bg-[#F7F0E1] relative">
      <Header />

        <div className="flex flex-col lg:flex-row">

          <Sidebar />

        <main id="profile-main" className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            
            {/* Título adaptable */}
            <div id="profile-header" className="text-left mb-6 md:mb-8">
              <h1 id="profile-title" className="text-[#003A6C] text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">
                Mi Perfil
              </h1>
              <p id="profile-subtitle" className="text-[#003A6C] opacity-80 text-sm md:text-base">
                Configuración de cuenta y estadísticas
              </p>
            </div>

            {/* Tarjeta Principal */}
            <div id="profile-card" className="bg-white border border-[#A5D7E8] rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
                <div>
                  <div className="flex items-center gap-2 text-[#003A6C]">
                    <User size={22} className="md:w-6 md:h-6" />
                    <h2 id="account-info-title" className="text-xl md:text-2xl font-semibold">Información de la cuenta</h2>
                  </div>
                  <p id="account-info-description" className="text-[#4B778D] text-xs md:text-sm ml-8">Datos de acceso a tu cuenta</p>
                </div>
                
                <button 
                  id="btn-edit-profile"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#003057] text-white px-4 py-2 text-sm rounded-md hover:bg-[#1a4f7a] transition-colors"
                >
                  <SquarePen size={16} />
                  <span>Editar información</span>
                </button>
              </div>

              {/* Vista de datos */}
              <div id="profile-info-list" className="space-y-3 md:space-y-4">
                {[
                  { icon: <User size={20} />, label: "Nombre de usuario", value: "Google User", bold: true },
                  { icon: <Mail size={20} />, label: "Correo electrónico", value: "googleuser@example.com", bold: false },
                ].map((item, index) => (
                  <div key={index} id={`profile-item-${index}`} className="bg-[#F8FAFC] p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4">
                    <div className="text-slate-400 shrink-0">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                      <p className={`text-[#003A6C] text-base md:text-lg truncate ${item.bold ? 'font-bold' : 'font-semibold'}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- MODAL DE EDICIÓN --- */}
      {isModalOpen && (
          <div id="modal-overlay" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-3 sm:px-4">
          <div 
            id="modal-container" 
            className="bg-[#D1E4F0] w-full max-w-2xl rounded-t-2xl sm:rounded-xl shadow-2xl flex flex-col h-[90vh] sm:h-auto max-h-[92vh]"
          >
            
            {/* Header Modal */}
            <div className="p-5 md:p-6 pb-2 flex justify-between items-start">
              <div>
                <h2 id="modal-title" className="text-[#003A6C] text-xl md:text-2xl font-bold">Editar información de cuenta</h2>
                <p className="text-[#5B8FB9] text-xs md:text-sm">Actualiza tu nombre de usuario, correo electrónico y contraseña</p>
              </div>
              <button id="btn-close-modal" onClick={() => setIsModalOpen(false)} className="text-[#003A6C] hover:bg-white/20 p-1 rounded-full">
                <X size={24} />
              </button>
            </div>

            {/* Cuerpo con Scroll */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 pt-2 custom-scrollbar">
              
              {/* Sección Datos de Cuenta */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-2 text-[#003A6C] mb-4">
                  <User size={18} />
                  <h3 id="section-account-data" className="font-bold text-sm md:text-base">Datos de cuenta</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[#003A6C] text-xs md:text-sm font-medium mb-1 block">Nombre de usuario</label>
                    <input
                      id="input-username"
                      type="text"
                      defaultValue="Google User"
                      className="w-full p-2.5 rounded-lg border border-[#A5D7E8] bg-white text-[#003A6C] text-sm outline-none focus:ring-2 ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="text-[#003A6C] text-xs md:text-sm font-medium mb-1 block">Correo electrónico</label>
                    <input
                      id="input-email"
                      type="email"
                      defaultValue="googleuser@example.com"
                      className="w-full p-2.5 rounded-lg border border-[#A5D7E8] bg-white text-[#003A6C] text-sm outline-none focus:ring-2 ring-blue-200"
                    />
                  </div>
                  <button id="btn-update-info" className="w-full bg-[#003A6C] text-white py-2.5 rounded-lg font-semibold text-sm mt-2 hover:bg-[#1a4f7a] transition-all">
                    Actualizar información
                  </button>
                </div>
              </div>

              <hr className="border-[#A5D7E8] mb-6 md:mb-8" />

              {/* Sección Cambiar Contraseña */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#003A6C] mb-4">
                  <Lock size={18} />
                  <h3 id="section-password" className="font-bold text-sm md:text-base">Cambiar contraseña</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[#003A6C] text-xs md:text-sm font-medium mb-1 block">Contraseña actual</label>
                    <input
                      id="input-current-password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full p-2.5 rounded-lg border border-[#A5D7E8] bg-white text-sm outline-none focus:ring-2 ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="text-[#003A6C] text-xs md:text-sm font-medium mb-1 block">Nueva contraseña</label>
                    <input
                      id="input-new-password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full p-2.5 rounded-lg border border-[#A5D7E8] bg-white text-sm outline-none focus:ring-2 ring-blue-200"
                    />
                    <span className="text-[10px] md:text-xs text-slate-500 mt-1 block">Mínimo 6 caracteres</span>
                  </div>

                  <div>
                    <label className="text-[#003A6C] text-xs md:text-sm font-medium mb-1 block">Confirmar nueva contraseña</label>
                    <input
                      id="input-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full p-2.5 rounded-lg border border-[#A5D7E8] bg-white text-sm outline-none focus:ring-2 ring-blue-200"
                    />
                  </div>
                  <button id="btn-change-password" className="w-full bg-[#003A6C] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1a4f7a] transition-all">
                    Cambiar contraseña
                  </button>
                </div>
              </div>

              {/* Banner de Seguridad */}
              <div className="bg-white rounded-xl p-4 flex gap-3 border border-[#A5D7E8] mb-6">
                <div className="text-blue-500 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 id="security-banner" className="text-[#003A6C] font-bold text-xs md:text-sm">Seguridad de tu cuenta</h4>
                  <p id="security-message" className="text-[#5B8FB9] text-[10px] md:text-xs leading-relaxed">
                    Mantén tu contraseña segura y no la compartas con nadie. Te recomendamos usar una contraseña única y cambiarla periódicamente.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;