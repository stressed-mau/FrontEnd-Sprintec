import { Button } from "@/components/ui/button"
import { FeedbackMessage } from "@/components/projects/FeedbackMessage"
import { ProjectBasicFields } from "@/components/projects/ProjectBasicFields"
import { ProjectDateFields } from "@/components/projects/ProjectDateFields"
import { ProjectImageField } from "@/components/projects/ProjectImageField"
import { ProjectLinkFields } from "@/components/projects/ProjectLinkFields"
import type { ProjectFieldClassNames, ProjectFormProps } from "@/types/projectFormComponents"

const pageInputClassName = (hasError?: boolean) =>
  hasError
    ? "border-red-500 bg-white focus-visible:border-red-500 focus-visible:ring-red-200"
    : "border-[#A5D7E8] bg-white focus-visible:border-[#003A6C] focus-visible:ring-[#A5D7E8]"

const modalInputClassName = (hasError?: boolean) =>
  hasError
    ? "border-red-500 bg-white focus-visible:border-red-500 focus-visible:ring-red-200"
    : "border-gray-300 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30"

export function ProjectForm(props: ProjectFormProps) {
  const tone = props.tone ?? "page"
  const isModalTone = tone === "modal"
  const readOnlyFields = props.readOnlyFields ?? false
  const canEditGithub = props.canEditGithub ?? true
  const canEditDemo = props.canEditDemo ?? true
  const canEditEndDate = props.canEditEndDate ?? false
  const isRegisterSubmit = props.submitLabel.toLowerCase().startsWith("registrar")
  const classNames = getProjectFieldClassNames(isModalTone)

  return (
    <form onSubmit={props.onSubmit} className={isModalTone ? "space-y-6 rounded-2xl bg-[#C2DBED]" : "space-y-5 rounded-2xl border border-[#A5D7E8] bg-white p-5 shadow-sm sm:p-6"}>
      <FeedbackMessage message={props.errors.form ?? ""} type="error" />
      <ProjectBasicFields formProps={{ ...props, tone, readOnlyFields }} classNames={classNames} tone={tone} readOnlyFields={readOnlyFields} gridClassName={isModalTone ? "space-y-6" : "grid gap-4 md:grid-cols-3"} />
      <ProjectDateFields
        formData={props.formData}
        errors={props.errors}
        isSaving={props.isSaving}
        readOnlyFields={readOnlyFields}
        canEditEndDate={canEditEndDate}
        classNames={classNames}
        tone={tone}
        gridClassName={isModalTone ? "grid gap-6 md:grid-cols-2" : "grid gap-4 md:grid-cols-3"}
        onFieldChange={props.onFieldChange}
      />
      <ProjectLinkFields formData={props.formData} errors={props.errors} canEditGithub={canEditGithub} canEditDemo={canEditDemo} classNames={classNames} tone={tone} onFieldChange={props.onFieldChange} />
      <ProjectImageField preview={props.preview} error={props.errors.image} readOnlyFields={readOnlyFields} tone={tone} onImageChange={props.onImageChange} onImageRemove={props.onImageRemove} />
      <ProjectFormActions isSaving={props.isSaving} canSave={props.canSave ?? true} isRegisterSubmit={isRegisterSubmit} submitLabel={props.submitLabel} onCancel={props.onCancel} />
    </form>
  )
}

function ProjectFormActions({
  isSaving,
  canSave,
  isRegisterSubmit,
  submitLabel,
  onCancel,
}: {
  isSaving: boolean
  canSave: boolean
  isRegisterSubmit: boolean
  submitLabel: string
  onCancel: () => void
}) {
  return (
    <div className={`flex flex-wrap gap-3 pt-2 ${isRegisterSubmit ? "justify-center" : ""}`}>
      <Button type="submit" disabled={isSaving || !canSave} className="bg-[#003A6C] text-white shadow-sm hover:bg-[#4982AD]">
        {isSaving ? "Guardando..." : isRegisterSubmit ? "Registrar" : submitLabel}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving} className={getCancelButtonClassName(isRegisterSubmit)}>
        Cancelar
      </Button>
    </div>
  )
}

function getProjectFieldClassNames(isModalTone: boolean): ProjectFieldClassNames {
  return {
    input: isModalTone ? modalInputClassName : pageInputClassName,
    disabledInput: isModalTone
      ? "cursor-not-allowed border-[#D7E6F2] bg-[#EEF5F9] text-[#7F97AB] opacity-100"
      : "border-[#D7E6F2] bg-[#EEF5F9] text-[#6B7E8E]",
  }
}

function getCancelButtonClassName(isRegisterSubmit: boolean) {
  if (isRegisterSubmit) return "border-[#A5D7E8] bg-[#F7F0E1] text-[#003A6C] hover:bg-[#F7F0E1]/80"

  return "border-[#A5D7E8] bg-white text-[#003A6C]"
}
