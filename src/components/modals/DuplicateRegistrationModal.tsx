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
        <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-red-100 sm:mb-6 sm:size-16">
          <AlertCircle className="size-7 text-red-600 sm:size-8" />
        </div>
        <h3 className="mb-2 max-w-full wrap-break-words text-xl font-bold leading-tight text-[#003A6C] sm:text-2xl">{title}</h3>
        <p className="mb-6 max-w-full wrap-break-words text-base leading-6 text-[#6B7280] sm:mb-8 sm:text-lg">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#003A6C] px-4 py-3 text-base font-bold text-white shadow-lg transition-all hover:bg-[#002a50] active:scale-[0.98] sm:py-4 sm:text-xl"
        >
          {closeLabel}
        </button>
      </div>
    </BaseModal>
  );
}
