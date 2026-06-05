import { Input } from "@/components/ui/input"
import { ProjectFormField } from "@/components/projects/ProjectFormField"
import type { ProjectFormValues } from "@/types/projectForm"
import type { ProjectFieldClassNames, ProjectFormTone } from "@/types/projectFormComponents"

const MAX_PROJECT_URL_LENGTH = 50

interface ProjectLinkFieldsProps {
  formData: ProjectFormValues
  errors: Partial<Record<keyof ProjectFormValues, string>>
  canEditGithub: boolean
  canEditDemo: boolean
  classNames: ProjectFieldClassNames
  tone: ProjectFormTone
  onFieldChange: (field: keyof ProjectFormValues, value: string | boolean) => void
}

export function ProjectLinkFields(props: ProjectLinkFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ProjectFormField label="Enlace de GitHub" error={props.errors.github} tone={props.tone}>
        <Input
          type="text"
          inputMode="url"
          value={props.formData.github}
          onChange={(event) => props.onFieldChange("github", event.target.value)}
          disabled={!props.canEditGithub}
          maxLength={MAX_PROJECT_URL_LENGTH}
          placeholder="https://github.com/usuario/proyecto"
          className={!props.canEditGithub ? props.classNames.disabledInput : props.classNames.input(Boolean(props.errors.github))}
          aria-invalid={Boolean(props.errors.github)}
        />
      </ProjectFormField>
      <ProjectFormField label="Enlace de la demo" error={props.errors.demo} tone={props.tone}>
        <Input
          type="text"
          inputMode="url"
          value={props.formData.demo}
          onChange={(event) => props.onFieldChange("demo", event.target.value)}
          disabled={!props.canEditDemo}
          maxLength={MAX_PROJECT_URL_LENGTH}
          placeholder="https://proyecto-demo.com"
          className={!props.canEditDemo ? props.classNames.disabledInput : props.classNames.input(Boolean(props.errors.demo))}
          aria-invalid={Boolean(props.errors.demo)}
        />
      </ProjectFormField>
    </div>
  )
}
