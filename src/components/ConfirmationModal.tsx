import { Check, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

const ConfirmationModal = ({
  isOpen,
  title = 'Éxito',
  message,
  buttonText = 'Continuar',
  onClose,
}: ConfirmationModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar modal de éxito"
        >
          <X className="size-6" />
        </button>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#E1EFFE] rounded-full flex items-center justify-center mb-6">
            <Check className="size-8 text-[#003A6C] stroke-[3px]" />
          </div>
          <h3 className="text-[#003A6C] text-2xl font-bold mb-2">{title}</h3>
          <p className="text-[#6B7280] text-center text-lg mb-8">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-[#003A6C] text-white py-4 rounded-xl font-bold text-xl hover:bg-[#002a50] transition-all shadow-lg active:scale-[0.98]"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
