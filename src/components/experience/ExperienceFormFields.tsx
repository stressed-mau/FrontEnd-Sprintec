import type { ChangeEvent } from "react"

import { ExperienceFieldError } from "@/components/experience/ExperienceFieldError"
import { ExperienceSearchableSelect } from "@/components/experience/ExperienceSearchableSelect"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ExperienceFormErrors, ExperienceFormValues } from "@/hooks/useExperienceManager"

type ExperienceFormFieldsProps = {
  formData: ExperienceFormValues
  errors: ExperienceFormErrors
  isSaving: boolean
  isEditing: boolean
  roleOptions: string[]
  today: string
  onFieldChange: (field: keyof ExperienceFormValues, value: string | boolean) => void
  onBlur: (field: keyof ExperienceFormValues) => void
}

export function ExperienceFormFields(props: ExperienceFormFieldsProps) {
  const disabledClassName = "disabled:cursor-not-allowed disabled:border-[#D7E6F2] disabled:bg-[#EEF5F9] disabled:text-[#7F97AB] disabled:opacity-100"
  const inputClassName = `h-11 border-[#A5D7E8] bg-white text-[#003A6C] ${disabledClassName}`
  const isCurrentActive = props.formData.current
  const canCloseCurrentExperience = props.isEditing && Boolean(props.formData.current)
  const isEndDateDisabled = props.isSaving || (props.isEditing && !canCloseCurrentExperience) || (isCurrentActive && !canCloseCurrentExperience)
  const isCurrentDisabled = props.isSaving || props.isEditing || Boolean(props.formData.endDate)

  return (
    <>
      <ExperienceFieldError label="Empresa" id="experience-company" error={props.errors.company} required>
        <Input id="experience-company" maxLength={100} value={props.formData.company} disabled={props.isSaving || props.isEditing} onBlur={() => props.onBlur("company")} onChange={(event) => props.onFieldChange("company", event.target.value)} className={inputClassName} aria-invalid={Boolean(props.errors.company)} />
      </ExperienceFieldError>

      <ExperienceFieldError label="Correo electrónico de la empresa" id="experience-email" error={props.errors.email} required>
        <Input id="experience-email" type="email" maxLength={60} value={props.formData.email} disabled={props.isSaving || props.isEditing} onBlur={() => props.onBlur("email")} onChange={(event) => props.onFieldChange("email", event.target.value)} placeholder="Ej: contacto@empresa.com" className={inputClassName} aria-invalid={Boolean(props.errors.email)} />
      </ExperienceFieldError>

      <ExperienceFieldError label="Ubicación" id="experience-location" error={props.errors.location}>
        <Input id="experience-location" maxLength={100} value={props.formData.location} disabled={props.isSaving} onBlur={() => props.onBlur("location")} onChange={(event) => props.onFieldChange("location", event.target.value)} placeholder="Ej: La Paz, Bolivia / Remoto" className={inputClassName} aria-invalid={Boolean(props.errors.location)} />
      </ExperienceFieldError>

      <ExperienceFieldError label="Cargo" id="experience-position" error={props.errors.position} required>
        <ExperienceSearchableSelect id="experience-position" value={props.formData.position} disabled={props.isSaving || props.isEditing} options={props.roleOptions} placeholder="Busca y selecciona un cargo" onBlur={() => props.onBlur("position")} onChange={(event: ChangeEvent<HTMLInputElement>) => props.onFieldChange("position", event.target.value)} className={`h-11 w-full rounded-md border border-[#A5D7E8] bg-white px-3 text-sm text-[#003A6C] outline-none focus:ring-2 focus:ring-[#A5D7E8] ${disabledClassName}`} />
      </ExperienceFieldError>

      <ExperienceFieldError label="Descripción" id="experience-description" error={props.errors.description}>
        <Textarea id="experience-description" rows={3} maxLength={300} value={props.formData.description} disabled={props.isSaving} onBlur={() => props.onBlur("description")} onChange={(event) => props.onFieldChange("description", event.target.value)} className={`resize-none border-[#A5D7E8] bg-white text-[#003A6C] ${disabledClassName}`} aria-invalid={Boolean(props.errors.description)} />
      </ExperienceFieldError>

      <div className="grid gap-4 sm:grid-cols-2">
        <ExperienceFieldError label="Fecha de inicio" id="experience-start-date" error={props.errors.startDate} required>
          <Input id="experience-start-date" type="date" value={props.formData.startDate} disabled={props.isSaving || props.isEditing} max={props.today} onBlur={() => props.onBlur("startDate")} onChange={(event) => props.onFieldChange("startDate", event.target.value)} className={inputClassName} aria-invalid={Boolean(props.errors.startDate)} />
        </ExperienceFieldError>
        <ExperienceFieldError label="Fecha de finalización" id="experience-end-date" error={props.errors.endDate} required={!isCurrentActive}>
          <Input id="experience-end-date" type="date" value={props.formData.endDate} disabled={isEndDateDisabled} max={props.today} onBlur={() => props.onBlur("endDate")} onChange={(event) => props.onFieldChange("endDate", event.target.value)} className={inputClassName} aria-invalid={Boolean(props.errors.endDate)} />
        </ExperienceFieldError>
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-[#003A6C]">
        <input id="experience-current" type="checkbox" checked={props.formData.current} disabled={isCurrentDisabled} onChange={(event) => props.onFieldChange("current", event.target.checked)} className={`size-4 rounded border-[#A5D7E8] text-[#003A6C] focus:ring-[#A5D7E8] ${disabledClassName}`} />
        Trabajo actual
      </label>
    </>
  )
}
