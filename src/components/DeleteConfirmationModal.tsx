import { Trash2 } from "lucide-react"

type DeleteConfirmationModalProps = {
  isOpen: boolean
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmationModal({
  isOpen,
  title,
  message = "Esta accion no se puede deshacer.",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] bg-white px-6 py-7 text-center shadow-2xl animate-in zoom-in-95 duration-200 sm:px-8">
        <div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="size-8 text-red-600" strokeWidth={2.5} />
        </div>

        <h3 className="mx-auto max-w-sm text-2xl font-bold leading-snug text-[#003A6C]">
          {title}
        </h3>
        <p className="mt-4 text-lg text-gray-500">{message}</p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-2xl bg-red-600 px-5 py-4 text-lg font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Eliminando..." : confirmText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-2xl bg-gray-200 px-5 py-4 text-lg font-bold text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
