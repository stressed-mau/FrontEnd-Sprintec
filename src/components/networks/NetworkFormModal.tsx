import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { NetworkFormErrors, NetworkFormValues } from "@/hooks/useNetworksManager"

type NetworkFormModalProps = {
  formData: NetworkFormValues
  errors: NetworkFormErrors
  isEditing: boolean
  onClose: () => void
  onFieldChange: (field: keyof NetworkFormValues, value: string) => void
  onBlur: (field: keyof NetworkFormValues) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function NetworkFormModal({
  formData,
  errors,
  isEditing,
  onClose,
  onFieldChange,
  onBlur,
  onSubmit,
}: NetworkFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-[#6EAED6] bg-[#C2DBED] shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-2xl font-bold text-[#003A6C]">{isEditing ? "Editar enlace" : "Nuevo enlace"}</h2>
            <p className="mt-1 text-sm text-[#4982AD]">Agrega enlaces a tus redes profesionales</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#4982AD] transition hover:bg-white/40 hover:text-[#003A6C]"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <form noValidate onSubmit={onSubmit} className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="space-y-2">
            <Label id="network-name-label" htmlFor="network-name" className="text-[#003A6C]">
              Nombre de la red
            </Label>
            <Input
              id="network-name"
              maxLength={40}
              value={formData.name}
              onBlur={() => onBlur("name")}
              onChange={(event) => onFieldChange("name", event.target.value)}
              placeholder="GitLab, GitHub, Portafolio..."
              className="h-12 rounded-2xl border-[#6EAED6] bg-white text-[#003A6C] placeholder:text-[#4982AD] focus-visible:ring-[#6EAED6]"
              aria-invalid={Boolean(errors.name)}
              aria-labelledby="network-name-label"
              aria-describedby={errors.name ? "network-name-error" : undefined}
            />
            {errors.name ? <p id="network-name-error" className="text-sm text-red-600">{errors.name}</p> : null}
          </div>

          <div className="space-y-2">
            <Label id="network-url-label" htmlFor="network-url" className="text-[#003A6C]">
              URL
            </Label>
            <Input
              id="network-url"
              type="url"
              maxLength={100}
              value={formData.url}
              onBlur={() => onBlur("url")}
              onChange={(event) => onFieldChange("url", event.target.value)}
              placeholder="https://..."
              className="h-12 rounded-2xl border-[#6EAED6] bg-white text-[#003A6C] placeholder:text-[#4982AD] focus-visible:ring-[#6EAED6]"
              aria-invalid={Boolean(errors.url)}
              aria-labelledby="network-url-label"
              aria-describedby={errors.url ? "network-url-error" : undefined}
            />
            {errors.url ? <p id="network-url-error" className="text-sm text-red-600">{errors.url}</p> : null}
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button type="submit" className="h-11 flex-1 rounded-xl bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
              Guardar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl border-[#6EAED6] bg-transparent text-[#003A6C] hover:bg-white/30"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
