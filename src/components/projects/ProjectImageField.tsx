import type { ChangeEvent } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProjectFormField } from "@/components/projects/ProjectFormField"
import type { ProjectFormTone } from "@/types/projectFormComponents"

interface ProjectImageFieldProps {
  preview: string | null
  error?: string
  readOnlyFields: boolean
  tone: ProjectFormTone
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onImageRemove: () => void
}

export function ProjectImageField({ preview, error, readOnlyFields, tone, onImageChange, onImageRemove }: ProjectImageFieldProps) {
  const isModalTone = tone === "modal"

  return (
    <ProjectFormField label="Imagen del proyecto" error={error} tone={tone}>
      <div className="space-y-3">
        {preview ? <ProjectImagePreview preview={preview} readOnlyFields={readOnlyFields} isModalTone={isModalTone} onImageRemove={onImageRemove} /> : null}
        <div className="flex flex-wrap items-center gap-3">
          <label className={`rounded-lg bg-[#C2DBED] px-4 py-2 text-sm font-medium text-[#003A6C] ${readOnlyFields ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-[#A5D7E8]"}`}>
            Seleccionar archivo
            <input type="file" accept="image/png,image/jpeg" onChange={onImageChange} disabled={readOnlyFields} className="hidden" />
          </label>
          <span className={`text-xs ${isModalTone ? "text-gray-500" : "text-[#4B778D]"}`}>JPG o PNG, máximo 2 MB</span>
        </div>
      </div>
    </ProjectFormField>
  )
}

function ProjectImagePreview({ preview, readOnlyFields, isModalTone, onImageRemove }: { preview: string; readOnlyFields: boolean; isModalTone: boolean; onImageRemove: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <img src={preview} alt="Vista previa del proyecto" className="h-28 w-full max-w-xs rounded-lg object-cover shadow-sm" />
      {!readOnlyFields ? (
        <Button type="button" variant="outline" onClick={onImageRemove} className={isModalTone ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50" : "border-[#A5D7E8] bg-white text-[#003A6C]"}>
          <X className="size-4" />
          Quitar imagen
        </Button>
      ) : null}
    </div>
  )
}
