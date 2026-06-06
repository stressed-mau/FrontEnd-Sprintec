export const asText = (value: any): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    return asText(
      value.name ??
      value.nombre ??
      value.title ??
      value.label ??
      value.value ??
      value.role ??
      value.rol ??
      value.position ??
      value.cargo ??
      value.company_name ??
      value.company
    );
  }
  return "";
};

export const firstText = (...values: any[]): string => {
  for (const value of values) {
    const text = asText(value);
    if (text) return text;
  }

  return "";
};

export const normalizeTechnologyNames = (...sources: any[]): string[] => {
  const seen = new Set<string>();
  return sources
    .flatMap((source) => Array.isArray(source) ? source : [])
    .map((item: any) => asText(item))
    .filter((technology) => {
      if (!technology) return false;

      const key = technology.toLowerCase();
      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
};

const normalizeProjectKey = (value: any) => asText(value).toLowerCase();

export const mergeProjectDetails = (baseProjects: any[], detailProjects: any[]) => {
  const detailsById = new Map(detailProjects.map((project: any) => [String(project.id), project]));
  const detailsByName = new Map(detailProjects.map((project: any) => [normalizeProjectKey(project.nombre ?? project.name ?? project.title), project]));

  return baseProjects.map((project: any, index: number) => {
    const detail =
      detailsById.get(String(project.id)) ??
      detailsByName.get(normalizeProjectKey(project.nombre ?? project.name ?? project.title ?? project.label));

    return normalizePortfolioProject(detail ? { ...project, ...detail } : project, index);
  });
};

export const normalizePortfolioProject = (project: any, index: number) => {
  const direct = project ?? {};
  const nestedProject = direct.project && typeof direct.project === "object" ? direct.project : {};
  const source = { ...nestedProject, ...direct };
  const name = firstText(
    direct.title,
    direct.name,
    direct.nombre,
    direct.label,
    direct.project_name,
    direct.projectTitle,
    nestedProject.title,
    nestedProject.name,
    nestedProject.nombre,
    nestedProject.label,
    nestedProject.project_name,
    nestedProject.projectTitle,
  ) || `Proyecto ${index + 1}`;
  const description = firstText(
    direct.description,
    direct.descripcion,
    direct.summary,
    nestedProject.description,
    nestedProject.descripcion,
    nestedProject.summary,
  );
  const role = firstText(
    direct.project_rol,
    direct.project_role,
    direct.role,
    direct.rol,
    direct.sublabel,
    direct.projectRole,
    nestedProject.project_rol,
    nestedProject.project_role,
    nestedProject.role,
    nestedProject.rol,
    nestedProject.sublabel,
    nestedProject.projectRole,
  );
  const technologies = normalizeTechnologyNames(
    direct.languages,
    direct.technologies,
    direct.tecnologias,
    direct.techs,
    direct.stack,
    direct.project_technologies,
    direct.project_languages,
    direct.language,
    nestedProject.languages,
    nestedProject.technologies,
    nestedProject.tecnologias,
    nestedProject.techs,
    nestedProject.stack,
    nestedProject.project_technologies,
    nestedProject.project_languages,
    nestedProject.language,
  );

  return {
    ...source,
    id: String(source.id ?? source.project_id ?? project?.id ?? `project-${index}`),
    name,
    title: name,
    nombre: name,
    description,
    descripcion: description,
    project_rol: role,
    role,
    rol: role,
    technologies,
    tecnologias: technologies.map((technology, technologyIndex) => ({
      id: `${source.id ?? index}-technology-${technologyIndex}`,
      name: technology,
    })),
    languages: technologies.map((technology, technologyIndex) => ({
      id: `${source.id ?? index}-language-${technologyIndex}`,
      name: technology,
    })),
    label: name,
    sublabel: role,
    is_public: source.is_public ?? project?.is_public,
  };
};

export const normalizePortfolioExperience = (experience: any, index: number) => {
  const direct = experience ?? {};
  const nestedExperience = direct.experience && typeof direct.experience === "object" ? direct.experience : {};
  const nestedWorkExperience = direct.work_experience && typeof direct.work_experience === "object" ? direct.work_experience : {};
  const source = { ...nestedExperience, ...nestedWorkExperience, ...direct };
  const company = firstText(
    direct.company_name,
    direct.company,
    direct.empresa,
    direct.organization,
    direct.institution,
    direct.name,
    nestedExperience.company_name,
    nestedExperience.company,
    nestedExperience.empresa,
    nestedExperience.organization,
    nestedExperience.institution,
    nestedExperience.name,
    nestedWorkExperience.company_name,
    nestedWorkExperience.company,
    nestedWorkExperience.empresa,
    nestedWorkExperience.organization,
    nestedWorkExperience.institution,
    nestedWorkExperience.name,
  ) || "Empresa no especificada";
  const position = firstText(
    direct.role,
    direct.rol,
    direct.position,
    direct.cargo,
    direct.job_title,
    direct.title,
    nestedExperience.role,
    nestedExperience.rol,
    nestedExperience.position,
    nestedExperience.cargo,
    nestedExperience.job_title,
    nestedExperience.title,
    nestedWorkExperience.role,
    nestedWorkExperience.rol,
    nestedWorkExperience.position,
    nestedWorkExperience.cargo,
    nestedWorkExperience.job_title,
    nestedWorkExperience.title,
  ) || "Rol no especificado";

  return {
    ...source,
    id: String(source.id ?? source.experience_id ?? experience?.id ?? `exp-${index}`),
    type: source.type ?? "laboral",
    position,
    role: position,
    rol: position,
    company,
    company_name: company,
    description: asText(source.description ?? source.descripcion),
    startDate: source.start_date ?? source.startDate ?? "",
    endDate: source.end_date ?? source.endDate ?? "",
    current: !!(source.current ?? source.is_current),
    label: position,
    sublabel: company,
    is_public: source.is_public ?? experience?.is_public,
  };
};

export const normalizePortfolioEducation = (education: any, index: number) => {
  const direct = education ?? {};
  const nestedEducation = direct.education && typeof direct.education === "object" ? direct.education : {};
  const source = { ...nestedEducation, ...direct };
  const title = firstText(
    direct.title,
    direct.degree,
    direct.name,
    direct.position,
    direct.label,
    nestedEducation.title,
    nestedEducation.degree,
    nestedEducation.name,
    nestedEducation.position,
    nestedEducation.label,
  ) || "Sin titulo";
  const institution = firstText(
    direct.institution,
    direct.institution_name,
    direct.organization,
    direct.company,
    direct.company_name,
    direct.sublabel,
    nestedEducation.institution,
    nestedEducation.institution_name,
    nestedEducation.organization,
    nestedEducation.company,
    nestedEducation.company_name,
    nestedEducation.sublabel,
  ) || "Sin institucion";

  return {
    ...source,
    id: String(source.id ?? source.education_id ?? education?.id ?? `education-${index}`),
    title,
    institution,
    position: title,
    company: institution,
    label: title,
    sublabel: institution,
    field_to_study: source.field_to_study ?? source.field_of_study ?? source.field ?? "",
    description: asText(source.description ?? source.descripcion),
    start_date: source.start_date ?? source.startDate ?? source.issue_date ?? source.date_issued ?? "",
    end_date: source.end_date ?? source.endDate ?? null,
    is_public: source.is_public ?? education?.is_public,
  };
};

export const normalizeProfile = (d: any) => ({
  id: d.profile.id ?? d.profile.profile_id ?? "",
  user_id: d.profile.user_id ?? d.profile.userId ?? d.profile.user?.id ?? "",
  fullname: d.profile.name || "",
  occupation: d.profile.occupation || "",
  biography: d.profile.bio || "",
  image_url: d.profile.image || "",
  public_email: d.profile.email || "",
  phone_number: d.profile.phone || "",
  nationality: d.profile.nacionality || d.profile.nationality || "",
});