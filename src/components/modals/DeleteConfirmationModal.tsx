import { Trash2 } from "lucide-react";
import BaseModal from "./BaseModal";

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmationModal({
  isOpen,
  title,
  message = "Esta acción no se puede deshacer.",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onCancel}>
      <div className="text-center">
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Trash2
            className="size-8 text-red-600"
            strokeWidth={2.5}
          />
        </div>

        <h3 className="text-2xl font-bold text-[#003A6C]">
          {title}
        </h3>

        <p className="mt-4 text-lg text-gray-500">
          {message}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-2xl bg-red-600 px-5 py-4 text-lg font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isLoading ? "Eliminando..." : confirmText}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-2xl bg-gray-200 px-5 py-4 text-lg font-bold text-gray-700 hover:bg-gray-300 disabled:opacity-60"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}