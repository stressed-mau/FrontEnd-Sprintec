import { AlertCircle } from "lucide-react";
import BaseModal from "@/components/modals/BaseModal";

interface DuplicateRegistrationModalProps {
  isOpen?: boolean;
  title: string;
  message: string;
  closeLabel?: string;
  onClose: () => void;
}

export function DuplicateRegistrationModal({
  isOpen,
  title,
  message,
  closeLabel = "Entendido",
  onClose,
}: DuplicateRegistrationModalProps) {
  const shouldShow = isOpen ?? Boolean(message);
  if (!shouldShow || !message) return null;

  return (
    <BaseModal
      isOpen={shouldShow}
      onClose={onClose}
      closeAriaLabel={`Cerrar alerta de ${title.toLowerCase()}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="size-8 text-red-600" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-[#003A6C]">{title}</h3>
        <p className="mb-8 text-lg text-[#6B7280]">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#003A6C] py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-[#002a50] active:scale-[0.98]"
        >
          {closeLabel}
        </button>
      </div>
    </BaseModal>
  );
}
