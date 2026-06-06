export function asText(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value)
  return ""
}

export function getFirstText(...values: unknown[]) {
  for (const value of values) {
    const text = asText(value)

    if (text) {
      return text
    }
  }

  return ""
}

export function getProjectTitle(project: any) {
  return (
    getFirstText(
      project?.nombre,
      project?.name,
      project?.title
    ) || "Proyecto sin titulo"
  )
}

export function getProjectRole(project: any) {
  return getFirstText(
    project?.project_rol,
    project?.role,
    project?.rol
  )
}

export function getProjectTechnologies(project: any): string[] {
  const source = project?.technologies?.length
    ? project.technologies
    : project?.tecnologias?.length
      ? project.tecnologias
      : project?.languages ?? []

  return Array.isArray(source)
    ? source
        .map((technology: any) =>
          getFirstText(
            technology?.name,
            technology?.nombre,
            technology?.title,
            technology
          )
        )
        .filter(Boolean)
    : []
}

export function getProjectImage(project: any) {
  return getFirstText(
    project?.image,
    project?.image_url,
    project?.photograph
  )
}

export function getExperienceCompany(experience: any) {
  return (
    getFirstText(
      experience?.company,
      experience?.company_name
    ) || "Empresa no especificada"
  )
}

export function getExperiencePosition(experience: any) {
  return (
    getFirstText(
      experience?.position,
      experience?.role,
      experience?.rol
    ) || "Cargo no especificado"
  )
}

export function getEducationTitle(education: any) {
  return (
    getFirstText(
      education?.title,
      education?.position,
      education?.degree,
      education?.name,
      education?.label
    ) || "Formacion sin titulo"
  )
}

export function getEducationInstitution(education: any) {
  return (
    getFirstText(
      education?.institution,
      education?.company,
      education?.company_name,
      education?.institution_name,
      education?.organization,
      education?.sublabel
    ) || "Sin institucion"
  )
}

export function getEducationField(education: any) {
  return getFirstText(
    education?.field_to_study,
    education?.fieldOfStudy,
    education?.field_of_study,
    education?.field
  )
}

export function getDateText(value: unknown) {
  const text = asText(value)

  return text
    ? text.slice(0, 10)
    : ""
}

export function getCurrentText(
  value: unknown,
  trueLabel: string,
  falseLabel: string
) {
  if (typeof value === "boolean") {
    return value
      ? trueLabel
      : falseLabel
  }

  if (typeof value === "number") {
    return value === 1
      ? trueLabel
      : falseLabel
  }

  if (typeof value === "string" && value.trim()) {
    return ["1", "true", "si", "sí", "yes"].includes(
      value.trim().toLowerCase()
    )
      ? trueLabel
      : falseLabel
  }

  return ""
}