import { Button } from "@/components/ui/button"

export function ExperienceFormActions({ isSaving, canSave, onCancel }: { isSaving: boolean; canSave: boolean; onCancel: () => void }) {
  return (
    <div className="flex gap-3 pt-4">
      <Button id="boton-guardar-experiencia" type="submit" disabled={isSaving || !canSave} className="h-11 bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
        {isSaving ? "Guardando..." : "Guardar"}
      </Button>
      <Button id="boton-cancelar-experiencia" type="button" variant="outline" disabled={isSaving} onClick={onCancel} className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]">
        Cancelar
      </Button>
    </div>
  )
}
