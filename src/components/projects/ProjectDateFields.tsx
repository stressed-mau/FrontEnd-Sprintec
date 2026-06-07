import { Input } from "@/components/ui/input"
import { ProjectFormField } from "@/components/projects/ProjectFormField"
import type { ProjectFormValues } from "@/types/projectForm"
import type { ProjectFieldClassNames, ProjectFormTone } from "@/types/projectFormComponents"

const TODAY = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10)

interface ProjectDateFieldsProps {
  formData: ProjectFormValues
  errors: Partial<Record<keyof ProjectFormValues, string>>
  isSaving: boolean
  readOnlyFields: boolean
  canEditEndDate: boolean
  classNames: ProjectFieldClassNames
  tone: ProjectFormTone
  gridClassName: string
  onFieldChange: (field: keyof ProjectFormValues, value: string | boolean) => void
}

export function ProjectDateFields(props: ProjectDateFieldsProps) {
  const isModalTone = props.tone === "modal"
  const isEndDateDisabled = props.formData.is_current
    ? !(props.readOnlyFields && isModalTone && props.canEditEndDate)
    : props.readOnlyFields && !isModalTone
  const isCurrentDisabled = props.isSaving || props.readOnlyFields || Boolean(props.formData.fechaFin)

  return (
    <div className="space-y-3">
      <div className={props.gridClassName}>
        <ProjectFormField label="Fecha de inicio" error={props.errors.fechaInicio} required tone={props.tone}>
          <Input
            type="date"
            value={props.formData.fechaInicio}
            onChange={(event) => props.onFieldChange("fechaInicio", event.target.value)}
            disabled={props.readOnlyFields}
            max={TODAY}
            className={props.readOnlyFields ? props.classNames.disabledInput : props.classNames.input(Boolean(props.errors.fechaInicio))}
            aria-invalid={Boolean(props.errors.fechaInicio)}
          />
        </ProjectFormField>
        <ProjectFormField label="Fecha de finalización" error={props.errors.fechaFin} required={!props.formData.is_current} tone={props.tone}>
          <Input
            type="date"
            value={props.formData.fechaFin}
            disabled={isEndDateDisabled}
            max={TODAY}
            onChange={(event) => props.onFieldChange("fechaFin", event.target.value)}
            className={isEndDateDisabled ? props.classNames.disabledInput : props.classNames.input(Boolean(props.errors.fechaFin))}
            aria-invalid={Boolean(props.errors.fechaFin)}
          />
        </ProjectFormField>
      </div>
      <label className={`flex items-center gap-2 text-sm font-medium ${isModalTone ? "text-gray-700" : "text-[#003A6C]"}`}>
        <input
          type="checkbox"
          checked={props.formData.is_current}
          disabled={isCurrentDisabled}
          onChange={(event) => props.onFieldChange("is_current", event.target.checked)}
          className={`size-4 rounded disabled:cursor-not-allowed disabled:opacity-60 ${isModalTone ? "border-gray-300 accent-[#003A6C]" : "border-[#A5D7E8]"}`}
        />
        Proyecto en curso
      </label>
    </div>
  )
}
