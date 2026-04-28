import { X, HelpCircle } from 'lucide-react'; // Importamos un icono para la acción

interface ConfirmActionModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmActionModal = ({
  isOpen,
  title = 'Confirmar acción',
  message,
  confirmText = 'Guardar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
        
        {/* Botón cerrar */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="size-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icono superior - Mismo estilo que el de Éxito pero con otro icono */}
          <div className="w-16 h-16 bg-[#E1EFFE] rounded-full flex items-center justify-center mb-6">
            <HelpCircle className="size-8 text-[#003A6C] stroke-[2.5px]" />
          </div>

          <h3 className="text-[#003A6C] text-2xl font-bold mb-2">
            {title}
          </h3>

          <p className="text-[#6B7280] text-lg mb-8 px-2">
            {message}
          </p>

          {/* Botones - Ajustados para que se vean igual de robustos */}
          <div className="flex gap-4 w-full">
            <button
              onClick={onCancel}
              className="w-full border-2 border-[#003A6C] text-[#003A6C] py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              className="w-full bg-[#003A6C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#002a50] transition-all shadow-lg active:scale-[0.98]"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
