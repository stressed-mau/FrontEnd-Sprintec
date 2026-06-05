import { AlertCircle, X } from "lucide-react"

export function DuplicateProjectModal({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-5 top-5 text-gray-400 transition-colors hover:text-gray-600" aria-label="Cerrar alerta de proyecto duplicado">
          <X className="size-6" />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="size-8 text-red-600" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-[#003A6C]">Proyecto duplicado</h3>
          <p className="mb-8 text-lg text-[#6B7280]">{message}</p>
          <button type="button" onClick={onClose} className="w-full rounded-xl bg-[#003A6C] py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-[#002a50] active:scale-[0.98]">
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
