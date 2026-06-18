import { useMemo } from "react"
import type {
  MinimalistCertificate,
  MinimalistEducation,
  MinimalistExperience,
  MinimalistPageId,
  MinimalistProject,
  MinimalistSkill,
  MinimalistSocialNetwork,
  MinimalistTemplateData,
  MinimalistTemplateProps,
} from "@/types/minimalistPortfolio"
import {
  getMinimalistId,
  getMinimalistProjectTechnologies,
  getMinimalistRecord,
  getMinimalistText,
} from "@/utils/minimalistTemplateUtils"

export function useMinimalistTemplateData(
  profile: MinimalistTemplateProps["profile"],
  portfolio: MinimalistTemplateProps["portfolio"],
  isPreview: boolean,
): MinimalistTemplateData {
  return useMemo(() => {
    const skills = getPreviewItems(getSkills(portfolio?.skills ?? []), isPreview)
    const projects = getPreviewItems(getProjects(portfolio?.projects ?? []), isPreview)
    const experiences = getPreviewItems(getExperiences(portfolio?.experiences ?? []), isPreview)
    const education = getEducation(portfolio?.educations ?? [])
    const certificates = getCertificates(portfolio?.certificates ?? [])

    return {
      user: getUser(profile),
      skills,
      projects,
      experiences,
      education,
      certificates,
      networks: getNetworks(portfolio?.socialNetworks ?? []),
      pageIds: getPageIds({ skills, projects, experiences, education, certificates }),
    }
  }, [profile, portfolio, isPreview])
}

function getUser(profile: MinimalistTemplateProps["profile"]) {
  const user = profile ?? {}
  return {
    fullname: user.fullname || "NOMBRE DE USUARIO",
    occupation: user.occupation || "PROFESIÓN / ROL",
    biography: user.biography || "Biografía no disponible. Configura tu perfil para mostrar tu información aquí.",
    imageUrl: user.image_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=600",
    publicEmail: user.public_email || "Email no disponible",
    phone: user.phone || user.phone_number || "Telefono no disponible",
    nationality: user.residence || user.nationality || "Ubicación no disponible",
  }
}

function getPreviewItems<T>(items: T[], isPreview: boolean) {
  return isPreview && items.length === 0 ? [] : items
}

function getSkills(skills: unknown[]): MinimalistSkill[] {
  return skills.map((skill) => {
    const source = getMinimalistRecord(skill)
    const type = getSkillType(source)
    return {
      id: getMinimalistId(source),
      label: getMinimalistText(source.label) || getMinimalistText(source.name),
      level: getMinimalistText(source.level) || getMinimalistText(source.level_of_domain) || getMinimalistText(source.nivel) || "Sin nivel",
      type,
    }
  })
}

function getSkillType(source: Record<string, unknown>): "tecnica" | "blanda" {
  const value = getMinimalistText(source.type) || getMinimalistText(source.tipo)
  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  return normalized.includes("tecn") || normalized === "technical" ? "tecnica" : "blanda"
}

function getProjects(projects: unknown[]): MinimalistProject[] {
  return projects.map((project) => {
    const source = getMinimalistRecord(project)
    return {
      id: getMinimalistId(source),
      label: getMinimalistText(source.label) || getMinimalistText(source.nombre) || getMinimalistText(source.name) || getMinimalistText(source.title) || "Proyecto sin titulo",
      role: getMinimalistText(source.project_rol) || getMinimalistText(source.role) || getMinimalistText(source.rol) || "Rol no especificado",
      technologies: getMinimalistProjectTechnologies(project),
    }
  })
}

function getExperiences(experiences: unknown[]): MinimalistExperience[] {
  return experiences.map((experience, index) => {
    const source = getMinimalistRecord(experience)
    return {
      id: getMinimalistId(source),
      key: getMinimalistId(source) || String(index),
      company: getMinimalistText(source.company) || "Empresa",
      position: getMinimalistText(source.position) || "Sin cargo",
      description: getMinimalistText(source.description) || "Sin descripción",
    }
  })
}

function getEducation(education: unknown[]): MinimalistEducation[] {
  return education.map((item) => {
    const source = getMinimalistRecord(item)
    return {
      id: getMinimalistId(source),
      title: getMinimalistText(source.title),
      institution: getMinimalistText(source.institution) || "Institución",
    }
  })
}

function getCertificates(certificates: unknown[]): MinimalistCertificate[] {
  return certificates.map((certificate) => {
    const source = getMinimalistRecord(certificate)
    return {
      id: getMinimalistId(source),
      name: getMinimalistText(source.name) || "Certificado",
      issuer: getMinimalistText(source.issuer) || "Institución",
      source,
    }
  })
}

function getNetworks(networks: unknown[]): MinimalistSocialNetwork[] {
  return networks.map((network) => {
    const source = getMinimalistRecord(network)
    return {
      id: getMinimalistId(source),
      url: getMinimalistText(source.url) || "#",
      source,
    }
  })
}

function getPageIds(data: Pick<MinimalistTemplateData, "skills" | "projects" | "experiences" | "education" | "certificates">) {
  const pageIds: MinimalistPageId[] = ["bio"]
  if (data.skills.length) pageIds.push("skills")
  if (data.projects.length) pageIds.push("projects")
  if (data.experiences.length) pageIds.push("experience")
  if (data.education.length) pageIds.push("education")
  if (data.certificates.length) pageIds.push("certificates")
  return pageIds
}
