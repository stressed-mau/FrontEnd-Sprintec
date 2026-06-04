import { HelpCircle } from "lucide-react";
import BaseModal from "./BaseModal";

interface ConfirmActionModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmActionModal({
  isOpen,
  title = "Confirmar acción",
  message,
  confirmText = "Guardar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onCancel}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E1EFFE]">
          <HelpCircle className="size-8 text-[#003A6C] stroke-[2.5px]" />
        </div>

        <h3 className="mb-2 text-2xl font-bold text-[#003A6C]">
          {title}
        </h3>

        <p className="mb-8 text-lg text-[#6B7280]">
          {message}
        </p>

        <div className="flex w-full gap-4">
          <button
            onClick={onConfirm}
            className="w-full rounded-xl bg-[#003A6C] py-4 text-lg font-bold text-white hover:bg-[#002a50]"
          >
            {confirmText}
          </button>

          <button
            onClick={onCancel}
            className="w-full rounded-xl border-2 border-[#003A6C] py-4 text-lg font-bold text-[#003A6C] hover:bg-gray-50"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}