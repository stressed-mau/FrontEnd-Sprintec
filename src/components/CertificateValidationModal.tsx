import { X, AlertTriangle } from 'lucide-react';

interface CertificateValidationModalProps {
  isOpen: boolean;
  errors: string[];
  onClose: () => void;
}

const CertificateValidationModal = ({
  isOpen,
  errors,
  onClose,
}: CertificateValidationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="size-6" />
        </button>

        <div className="flex flex-col items-center text-center">

          {/* Ícono superior */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="size-8 text-red-600 stroke-[2.5px]" />
          </div>

          <h3 className="text-[#003A6C] text-2xl font-bold mb-3">
            No se pudo registrar el certificado
          </h3>

          <p className="text-[#6B7280] text-lg mb-6">
            Se detectaron los siguientes problemas:
          </p>

          {/* Lista de errores */}
          <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-left max-h-60 overflow-y-auto">
            <ul className="space-y-3">
              {errors.map((error, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-red-700"
                >
                  <span className="mt-1">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#003A6C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#002a50] transition-all shadow-lg active:scale-[0.98]"
          >
            Aceptar
          </button>

        </div>
      </div>
    </div>
  );
};

export default CertificateValidationModal;