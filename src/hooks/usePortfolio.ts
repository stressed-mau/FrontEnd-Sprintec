import { useEffect, useState, useCallback } from "react";
import type { Portfolio, Experience, Project, Skill, SocialNetwork } from "@/types/portfolio";
import { getAuthSession } from "@/services/auth/auth-storage";
import { api } from "@/services/api";

import { getUserInformation } from "@/services/PersonalDataService"; 
import { getSkills } from "@/services/skillsService";
import { getEducation } from "@/services/educationService";
import { getExperiences } from "@/services/experienceService";
import { getProjects } from "@/services/ProjectService";
import { getUserSocialNetworks } from "@/services/socialNetworksService";
const normalizeProfile = (d: any) => ({
  fullname: d.profile.name || "",
  occupation: d.profile.occupation || "",
  biography: d.profile.bio || "",
  image_url: d.profile.image || "",
  public_email: d.profile.email || "",
  phone_number: d.profile.phone || "",
  nationality: d.profile.nacionality || d.profile.nationality || "",
});

const trackVisit = async (portfolioData: any) => {
  try {
    const res = await api.post('/tracking/visit', {
      portfolio_slug: portfolioData.slug,
      template_type: portfolioData.template_type, // 'moderna' | 'minimalista' | 'corporativa'
      visited_at: new Date().toISOString(),
    });
    // Obtener el ID de la visita (puede variar según la estructura exacta de respuesta del backend)
    return res.data?.visit_id || res.data?.id || res.data?.data?.visit_id || res.data?.data?.id || null;
  } catch (error) {
    // Silenciar errores de tracking — no interrumpir la experiencia del visitante
    console.warn('Tracking no disponible:', error);
    return null;
  }
};

const getPortfolioId = (d: any) =>
  d.id ?? d.portfolio_id ?? d.config?.id ?? d.config?.portfolio_id ?? d.profile?.portfolio_id ?? null;

const asText = (value: any): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    return asText(value.name ?? value.title ?? value.label ?? value.value ?? value.role ?? value.company_name);
  }
  return "";
};

const firstText = (...values: any[]): string => {
  for (const value of values) {
    const text = asText(value);
    if (text) return text;
  }

  return "";
};

const normalizeTechnologyNames = (...sources: any[]): string[] => {
  const source = sources.find((item) => Array.isArray(item));

  if (!source) return [];

  return source
    .map((item: any) => asText(item))
    .filter(Boolean);
};

const normalizePortfolioProject = (project: any, index: number) => {
  const source = project?.project && typeof project.project === "object" ? { ...project.project, ...project } : project ?? {};
  const name = firstText(source.title, source.name, source.nombre, source.project_name, source.projectTitle) || `Proyecto ${index + 1}`;
  const description = firstText(source.description, source.descripcion, source.summary);
  const role = firstText(source.project_rol, source.project_role, source.role, source.rol, source.projectRole);
  const technologies = normalizeTechnologyNames(source.languages, source.technologies, source.tecnologias, source.language);

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

const normalizePortfolioExperience = (experience: any, index: number) => {
  const source = experience?.experience && typeof experience.experience === "object"
    ? { ...experience.experience, ...experience }
    : experience?.work_experience && typeof experience.work_experience === "object"
      ? { ...experience.work_experience, ...experience }
      : experience ?? {};
  const company = firstText(
    source.company_name,
    source.company,
    source.empresa,
    source.organization,
    source.institution,
    source.name,
  ) || "Empresa no especificada";
  const position = firstText(
    source.role,
    source.rol,
    source.position,
    source.cargo,
    source.job_title,
    source.title,
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

export const usePortfolio = (externalSlug?: string) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [visitId, setVisitId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const session = getAuthSession();
    // Priorizamos el slug externo (público), si no, usamos el del usuario logueado
    const slugToFetch = externalSlug || session?.user?.username;

    if (!slugToFetch) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // --- PASO 1: INTENTAR CARGAR PORTAFOLIO PUBLICADO ---
      try {
        const res = await api.get(`/p/${slugToFetch}`);
        
        if (res.data.success) {
          const d = res.data.data;
          console.log("PORTAFOLIO PUBLICO:", d)
          console.log("PUBLIC RESPONSE", d);
          console.log("WORK EXPERIENCES", d.work_experiences);
          setPortfolio({
            id: getPortfolioId(d) ? String(getPortfolioId(d)) : undefined,
            user: {
              id: String(d.profile.id),
              fullname: d.profile.name,
              occupation: d.profile.occupation || "",
              biography: d.profile.bio || "",
              nationality: d.profile.nationality || "",
              public_email: d.profile.email || "",
              phone_number: d.profile.phone || "",
              image_url: d.profile.image || "",
            },
            projects: (d.projects || []).map(normalizePortfolioProject),
            skills: d.skills,
            experiences: (d.work_experiences || d.experiences || []).map((exp: any, index: number) => {
              const normalizedExperience = normalizePortfolioExperience(exp, index)
              return normalizedExperience
              // El backend ahora envía 'rol' (gracias al Resource) y 'company_name'
              const position =
                exp.position ??
                exp.rol ??
                exp.role ??
                exp.cargo ??
                exp.job_title ??
                exp.title ??
                "Rol no especificado";
              const company =
                exp.company ??
                exp.company_name ??
                exp.empresa ??
                exp.organization ??
                exp.institution ??
                "Empresa no especificada";
              
              return {
                ...exp,
                id: String(exp.id ?? exp.experience_id ?? `exp-${index}`),
                // Propiedades unificadas en inglés para la interfaz estándar 'Experience'
                position,
                company,
                description: exp.description || "",
                startDate: exp.start_date ?? exp.startDate ?? "",
                endDate: exp.end_date ?? exp.endDate ?? "",
                current: !!(exp.current ?? exp.is_current),
                // Espejos en español / formato visibilidad por si tu UI los usa
                label: position,
                sublabel: company,
              };
            }),
            educations: (d.educations || []).map((education: any, index: number) => ({
              ...education,
              id: String(education.id ?? education.education_id ?? `education-${index}`),
              title: education.title ?? education.degree ?? education.name ?? "Sin titulo",
              institution: education.institution ?? education.institution_name ?? education.organization ?? "Sin institucion",
              field_to_study: education.field_to_study ?? education.field_of_study ?? education.field ?? "",
              description: education.description ?? "",
              start_date: education.start_date ?? education.startDate ?? "",
              end_date: education.end_date ?? education.endDate ?? null,
            })),
            socialNetworks: (d.social_networks || d.socialNetworks || []).map((network: any, index: number) => {
              const name = network.name ?? network.platform ?? network.social_network ?? "Red social";
              const url = network.url ?? network.link ?? network.sublabel ?? "";

              return {
                ...network,
                id: String(network.id ?? network.social_network_id ?? `network-${index}`),
                name,
                platform: name,
                label: name,
                url,
                sublabel: url,
              };
            }),
            certificates: (d.certificates || []).map((certificate: any, index: number) => ({
              ...certificate,
              id: String(certificate.id ?? certificate.certificate_id ?? `certificate-${index}`),
              name: certificate.name ?? certificate.title ?? certificate.certificate_name ?? "Certificado",
              issuer: certificate.issuer ?? certificate.institution ?? certificate.organization ?? "",
              credential_url: certificate.credential_url ?? certificate.url ?? certificate.file_url ?? "",
            })),
            isPublished: d.config.is_public ?? true,
            template: Number(d.config.template),
            config: d.config, 
            profile: normalizeProfile(d)
          });

          const templateMap: Record<number, string> = {
            1: 'moderna',
            2: 'minimalista',
            3: 'corporativa'
          };

          trackVisit({
            slug: slugToFetch,
            template_type: templateMap[Number(d.config.template)] || 'moderna'
          }).then(vId => {
            if (vId) setVisitId(vId);
          });

          return; // Éxito: salimos de la función
        }
      } catch {
        console.warn("No se encontró portafolio publicado o error en endpoint /p/.");
      }

      // --- PASO 2: CARGA DE EMERGENCIA (DATOS INDIVIDUALES) ---
      // Si no hay portafolio publicado pero tenemos sesión, traemos sus datos base
      if (!externalSlug && session?.user?.id) {
        const [userData, skills, experiences, education, projects, social] = await Promise.all([
          getUserInformation(String(session.user.id)),
          getSkills(),
          getExperiences(),
          getEducation(),
          getProjects(),
          getUserSocialNetworks(),
        ]);

        setPortfolio({
          id: undefined,
          user: {
            id: String(userData.id),
            fullname: (userData as any).name || (userData as any).fullname || (userData as any).full_name || session.user.username,
            occupation: userData.occupation || "",
            biography: (userData as any).bio || "",
            nationality: userData.nationality || "",
            public_email: (userData as any).email || session.user.email,
          phone_number: (userData as any).phone || "",
          },
          
          skills: skills as Skill[],
          experiences: [...experiences, ...education] as unknown as Experience[],
          educations: education as unknown as Experience[],
          projects: projects.map((project: any) => ({
            ...project,
            name: project.name ?? project.title ?? project.nombre ?? "Proyecto",
            title: project.title ?? project.name ?? project.nombre ?? "Proyecto",
            nombre: project.nombre ?? project.title ?? project.name ?? "Proyecto",
            project_rol: project.project_rol ?? project.role ?? project.rol ?? "",
            role: project.role ?? project.project_rol ?? project.rol ?? "",
            technologies: project.technologies ?? project.languages?.map((language: any) => language.name ?? language).filter(Boolean) ?? project.tecnologias?.map((technology: any) => technology.name ?? technology).filter(Boolean) ?? [],
          })) as unknown as Project[],
          socialNetworks: social as SocialNetwork[],
          certificates: [],
          template: 0, // Template 0 indica que no ha elegido uno aún
          isPublished: false,
          config: (userData as any).config || {}, 
          profile: normalizeProfile({ profile: userData }) || {},
          
        });
      } else {
        // Si no hay slug público y no hay sesión, no hay nada que mostrar
        setPortfolio(null);
      }
    } catch (error) {
      console.error("Error crítico en usePortfolio:", error);
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  }, [externalSlug]);

  useEffect(() => {
    fetchAll();

    // Sincronización mediante eventos globales (útil para el Sidebar de Visibilidad)
    const handleUpdate = () => {
      console.log("Sincronizando datos de portafolio...");
      fetchAll();
    };

    window.addEventListener("portfolioUpdated", handleUpdate);
    return () => window.removeEventListener("portfolioUpdated", handleUpdate);
  }, [fetchAll]);

  return { 
    portfolio, 
    loading, 
    refresh: fetchAll,
    visitId
  };
};
