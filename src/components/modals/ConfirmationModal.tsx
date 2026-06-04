import { Check } from "lucide-react";
import BaseModal from "./BaseModal";

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title = "Éxito",
  message,
  buttonText = "Continuar",
  onClose,
}: ConfirmationModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E1EFFE]">
          <Check className="size-8 text-[#003A6C]" />
        </div>

        <h3 className="mb-2 text-2xl font-bold text-[#003A6C]">
          {title}
        </h3>

        <p className="mb-8 text-center text-lg text-[#6B7280]">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-[#003A6C] py-4 text-xl font-bold text-white"
        >
          {buttonText}
        </button>
      </div>
    </BaseModal>
  );
}