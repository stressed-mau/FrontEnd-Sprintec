import type { ChangeEvent, RefObject } from "react"
import { ImagePlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"

type ExperienceAttachmentFieldsProps = {
  preview: string
  error?: string
  isSaving: boolean
  isEditing: boolean
  canRemoveImage: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
}

export function ExperienceAttachmentFields({
  preview,
  error,
  isSaving,
  isEditing,
  canRemoveImage,
  fileInputRef,
  onImageChange,
  onRemoveImage,
}: ExperienceAttachmentFieldsProps) {
  if (isEditing && !preview) return null

  return (
    <div className="space-y-2">
      <label id="experience-image-label" htmlFor="experience-image" className="text-[#003A6C]">Logo de la empresa</label>
      <input id="experience-image" ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" disabled={isSaving || isEditing} onChange={onImageChange} className="hidden" />

      {!isEditing ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button id="boton-subir-logo" type="button" variant="outline" disabled={isSaving} onClick={() => fileInputRef.current?.click()} className="h-10 border-[#A5D7E8] bg-[#C2DBED] text-[#003A6C] hover:bg-[#A5D7E8] disabled:cursor-not-allowed disabled:border-[#D7E6F2] disabled:bg-[#EEF5F9] disabled:text-[#7F97AB] disabled:opacity-100">
            <ImagePlus className="mr-2 size-4" />
            {preview ? "Cambiar imagen" : "Subir imagen"}
          </Button>
        </div>
      ) : null}

      {preview ? <ImagePreview preview={preview} canRemove={!isEditing && canRemoveImage} isSaving={isSaving} onRemove={onRemoveImage} /> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!isEditing ? <p className="text-xs text-[#6B7E8E]">Formatos permitidos: JPG, JPEG y PNG. Tamano maximo: 2 MB.</p> : null}
    </div>
  )
}

function ImagePreview({ preview, canRemove, isSaving, onRemove }: { preview: string; canRemove: boolean; isSaving: boolean; onRemove: () => void }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <img src={preview} alt="Vista previa" className="size-16 rounded-lg border border-[#D7E6F2] bg-white object-cover shadow-sm" />
      {canRemove ? (
        <Button id="boton-eliminar-logo" type="button" variant="outline" disabled={isSaving} onClick={onRemove} className="h-10 border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FFF1F1]">
          <X className="mr-2 size-4" />
          Eliminar
        </Button>
      ) : null}
    </div>
  )
}
