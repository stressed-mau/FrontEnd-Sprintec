import type { ReactNode } from "react";
import { X } from "lucide-react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeAriaLabel?: string;
  children: ReactNode;
}

export default function BaseModal({
  isOpen,
  onClose,
  closeAriaLabel = "Cerrar modal",
  children,
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 sm:rounded-[32px] sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={closeAriaLabel}
        >
          <X className="size-6" />
        </button>

        {children}
      </div>
    </div>
  );
}
