import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ProjectFormField } from "@/components/projects/ProjectFormField"
import { ProjectRoleField } from "@/components/projects/ProjectRoleField"
import { ProjectTechnologyField } from "@/components/projects/ProjectTechnologyField"
import type { ProjectFormProps, ProjectFieldClassNames, ProjectFormTone } from "@/types/projectFormComponents"

const MAX_PROJECT_NAME_LENGTH = 60
const MAX_PROJECT_DESCRIPTION_LENGTH = 250

interface ProjectBasicFieldsProps {
  formProps: ProjectFormProps
  classNames: ProjectFieldClassNames
  tone: ProjectFormTone
  readOnlyFields: boolean
  gridClassName: string
}

export function ProjectBasicFields({ formProps, classNames, tone, readOnlyFields, gridClassName }: ProjectBasicFieldsProps) {
  return (
    <>
      <div className={gridClassName}>
        <ProjectFormField label="Nombre del proyecto" error={formProps.errors.nombre} required tone={tone}>
          <Input
            value={formProps.formData.nombre}
            onChange={(event) => formProps.onFieldChange("nombre", event.target.value)}
            disabled={readOnlyFields}
            className={readOnlyFields ? classNames.disabledInput : classNames.input(Boolean(formProps.errors.nombre))}
            maxLength={MAX_PROJECT_NAME_LENGTH}
            aria-invalid={Boolean(formProps.errors.nombre)}
          />
        </ProjectFormField>
        <ProjectRoleField
          value={formProps.formData.rol}
          error={formProps.errors.rol}
          roleOptions={formProps.roleOptions}
          readOnlyFields={readOnlyFields}
          classNames={classNames}
          tone={tone}
          onFieldChange={formProps.onFieldChange}
        />
        <ProjectTechnologyField
          error={formProps.errors.tecnologias}
          technologies={formProps.technologies}
          selectedTechs={formProps.selectedTechs}
          readOnlyFields={readOnlyFields}
          classNames={classNames}
          tone={tone}
          onTechnologyAdd={formProps.onTechnologyAdd}
          onTechnologyRemove={formProps.onTechnologyRemove}
        />
      </div>
      <ProjectFormField label="Descripción" error={formProps.errors.descripcion} tone={tone}>
        <Textarea
          value={formProps.formData.descripcion}
          onChange={(event) => formProps.onFieldChange("descripcion", event.target.value)}
          rows={4}
          maxLength={MAX_PROJECT_DESCRIPTION_LENGTH}
          className={classNames.input(Boolean(formProps.errors.descripcion))}
          aria-invalid={Boolean(formProps.errors.descripcion)}
        />
      </ProjectFormField>
    </>
  )
}
