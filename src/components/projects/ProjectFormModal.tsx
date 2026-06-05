import { X } from "lucide-react"
import type { ReactNode } from "react"

export function ProjectFormModal({
  title,
  description,
  children,
  onClose,
}: {
  title: string
  description: string
  children: ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-[#6DACBF] bg-[#C2DBED] shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#D7E6F2] px-5 pb-4 pt-5 sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-[#003A6C]">{title}</h2>
            <p className="mt-1 text-sm text-[#4B778D]">{description}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  )
}
