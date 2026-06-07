import { useMemo } from "react"
import { getSocialNetworkDisplayName } from "@/components/portfolio/SocialNetworkIcon"
import { formatPublicPortfolioPeriod, getProjectImage, getRecordImage, isCurrentRecord } from "@/utils/PublicPortfolioUtils"
import type {
  CorporateCertificateItem,
  CorporateEducationItem,
  CorporateExperienceItem,
  CorporatePortfolioLink,
  CorporatePortfolioProps,
  CorporateProjectItem,
  CorporateSkillItem,
  CorporateTemplateData,
  CorporateTemplateSection,
} from "@/types/corporatePortfolio"
import {
  getCorporateInitials,
  getCorporateProjectTechnologies,
  getCorporateRecord,
  getCorporateText,
} from "@/utils/corporateTemplateUtils"

export function useCorporatePortfolioData(
  profile: CorporatePortfolioProps["profile"],
  portfolio: CorporatePortfolioProps["portfolio"],
): CorporateTemplateData {
  return useMemo(() => {
    const userProfile = getUserProfile(profile)
    const socialLinks = getSocialLinks(portfolio?.socialNetworks ?? [])
    const skills = getSkills(portfolio?.skills ?? [])
    const experience = getExperience(portfolio?.experiences ?? [])
    const education = getEducation(portfolio?.educations ?? [])
    const certificates = getCertificates(portfolio?.certificates ?? [])
    const projects = getProjects(portfolio?.projects ?? [])
    const initials = getCorporateInitials(userProfile.displayName)

    return {
      ...userProfile,
      initials,
      socialLinks,
      skills,
      experience,
      education,
      certificates,
      projects,
      hasContactInfo: Boolean(userProfile.displayEmail || userProfile.displayLocation || socialLinks.length),
      sections: getSections({ experience, certificates, education, projects, skills }),
    }
  }, [profile, portfolio])
}

function getUserProfile(profile: CorporatePortfolioProps["profile"]) {
  const fallback = {
    fullname: "",
    occupation: "",
    image_url: "",
    residence: "",
    public_email: "",
    phone: "",
    biography: "",
  }
  const userProfile = profile ?? fallback

  return {
    displayName: userProfile.fullname.trim() || "Sin nombre disponible",
    displayRole: userProfile.occupation.trim() || "Profesional",
    displaySummary: userProfile.biography.trim() || "Descripción profesional pendiente de completar.",
    displayEmail: userProfile.public_email.trim(),
    displayLocation: userProfile.residence.trim() || "Ubicación pendiente",
    displayProfileImage: userProfile.image_url.trim(),
  }
}

function getSocialLinks(networks: unknown[]): CorporatePortfolioLink[] {
  return networks
    .map((network) => getCorporateRecord(network))
    .filter((network) => Boolean(getCorporateText(network.url).trim()))
    .map((network) => ({
      id: String(network.id ?? ""),
      label: getSocialNetworkDisplayName(network),
      url: getCorporateText(network.url) || "#",
      source: network,
    }))
}

function getSkills(skills: unknown[]): CorporateSkillItem[] {
  return skills
    .map((skill) => {
      const source = getCorporateRecord(skill)
      return {
        id: String(source.id ?? getCorporateText(source.name)),
        name: getCorporateText(source.name),
        type: getSkillType(source),
        level: getCorporateText(source.level) || getCorporateText(source.level_of_domain) || getCorporateText(source.nivel) || "Sin nivel",
      }
    })
    .filter((skill) => Boolean(skill.name))
}

function getSkillType(source: Record<string, unknown>): "tecnica" | "blanda" {
  const value = getCorporateText(source.type) || getCorporateText(source.tipo)
  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  return normalized.includes("tecn") || normalized === "technical" ? "tecnica" : "blanda"
}

function getExperience(experiences: unknown[]): CorporateExperienceItem[] {
  return experiences.map((item) => {
    const source = getCorporateRecord(item)
    return {
      id: String(source.id ?? ""),
      title: getCorporateText(source.position) || "Sin cargo",
      organization: getCorporateText(source.company) || "Sin empresa",
      period: formatPublicPortfolioPeriod(source.start_date ?? source.startDate, source.end_date ?? source.endDate, isCurrentRecord(source)),
      description: getCorporateText(source.description),
      image: getRecordImage(item),
    }
  })
}

function getEducation(educations: unknown[]): CorporateEducationItem[] {
  return educations.map((item) => {
    const source = getCorporateRecord(item)
    return {
      id: String(source.id ?? ""),
      title: getCorporateText(source.title) || "Sin título",
      institution: getCorporateText(source.institution) || "Sin institución",
      period: formatPublicPortfolioPeriod(source.start_date ?? source.startDate, source.end_date ?? source.endDate, isCurrentRecord(source)),
    }
  })
}

function getCertificates(certificates: unknown[]): CorporateCertificateItem[] {
  return certificates.map((item) => {
    const source = getCorporateRecord(item)
    return {
      id: String(source.id ?? ""),
      title: getCorporateText(source.name) || "Sin certificado",
      institution: getCorporateText(source.issuer) || "Sin institución",
      period: "",
      source,
    }
  })
}

function getProjects(projects: unknown[]): CorporateProjectItem[] {
  return projects.map((project) => {
    const source = getCorporateRecord(project)
    return {
      id: String(source.id ?? ""),
      name: getCorporateText(source.nombre) || getCorporateText(source.name) || getCorporateText(source.title) || "Proyecto",
      role: getCorporateText(source.project_rol) || getCorporateText(source.role) || getCorporateText(source.rol) || "Rol no especificado",
      description: getCorporateText(source.description) || "Sin descripción",
      image: getProjectImage(project),
      stack: getCorporateProjectTechnologies(project),
    }
  })
}

function getSections(data: Pick<CorporateTemplateData, "experience" | "certificates" | "education" | "projects" | "skills">) {
  const sections: CorporateTemplateSection[] = [{ id: "corporate-intro", label: "Introduccion" }]
  if (data.experience.length) sections.push({ id: "corporate-experience", label: "Experiencia" })
  if (data.certificates.length) sections.push({ id: "corporate-certificates", label: "Certificados" })
  if (data.education.length) sections.push({ id: "corporate-education", label: "Formacion" })
  if (data.projects.length) sections.push({ id: "corporate-projects", label: "Proyectos" })
  if (data.skills.length) sections.push({ id: "corporate-skills", label: "Skills" })
  return sections
}
