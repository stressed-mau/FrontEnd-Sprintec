import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Trash2, AlertCircle } from 'lucide-react';
import { useSkillsManager } from '../../hooks/useSkillsManager';

const DeleteSkillsPage = () => {
  const { 
    technicalSkills, softSkills, requestDelete, showConfirmDelete, 
    setShowConfirmDelete, skillToDelete, confirmDelete, isDeleting 
  } = useSkillsManager();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <h1 className="text-3xl font-bold text-[#003A6C]">Eliminar Habilidades</h1>
              <span className="bg-red-100 text-red-600 p-1.5 rounded-full"><AlertCircle size={20}/></span>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <section>
                <h2 className="text-xl font-bold text-[#003A6C] mb-4">Habilidades Técnicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {technicalSkills.map(skill => (
                    <div key={skill.id} className="bg-white p-4 rounded-2xl border border-red-100 flex justify-between items-center shadow-sm">
                      <span className="font-bold text-gray-700">{skill.name}</span>
                      <button onClick={() => requestDelete(skill)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#003A6C] mb-4">Habilidades Blandas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {softSkills.map(skill => (
                    <div key={skill.id} className="bg-white p-4 rounded-2xl border border-red-100 flex justify-between items-center shadow-sm">
                      <span className="font-bold text-gray-700">{skill.name}</span>
                      <button onClick={() => requestDelete(skill)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Confirmación de Borrado */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#003A6C] mb-2">¿Estás seguro?</h3>
            <p className="text-gray-500 mb-6 text-sm">Esta acción eliminará permanentemente la habilidad <span className="font-bold text-red-600">"{skillToDelete?.name}"</span>.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => void confirmDelete()} 
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button 
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold"
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
};

export default DeleteSkillsPage;