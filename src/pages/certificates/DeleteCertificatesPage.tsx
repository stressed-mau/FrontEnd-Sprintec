import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Trash2, AlertCircle } from 'lucide-react';
import { useCertificatesManager } from '../../hooks/useCertificatesManager';

export default function DeleteCertificatesPage() {
  const {
    certificates,
    requestDelete,
    showConfirmDelete,
    cancelDelete,
    certificateToDelete,
    confirmDelete,
    isDeleting,
  } = useCertificatesManager();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <h1 className="text-3xl font-bold text-[#003A6C]">Eliminar Certificados</h1>
              <span className="bg-red-100 text-red-600 p-1.5 rounded-full">
                <AlertCircle size={20} />
              </span>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-10 text-[#4B778D] bg-white rounded-2xl border-2 border-dashed border-[#6dacbf]">
                <p>No hay certificados registrados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map(cert => (
                  <div
                    key={cert.id}
                    className="bg-white p-4 rounded-2xl border border-red-100 flex justify-between items-center shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-700 truncate">{cert.name}</p>
                      <p className="text-sm text-gray-500 truncate">{cert.issuer}</p>
                    </div>
                    <button
                      onClick={() => requestDelete(cert)}
                      className="ml-2 p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmDelete && certificateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#003A6C] mb-2">¿Estás seguro?</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Esta acción eliminará permanentemente el certificado{' '}
              <span className="font-bold text-red-600">"{certificateToDelete.name}"</span>.
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
