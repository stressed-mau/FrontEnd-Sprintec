import { useMemo } from "react"
import type {
  ModernCertificate,
  ModernEducation,
  ModernExperience,
  ModernProject,
  ModernSkill,
  ModernSocialNetwork,
  ModernTemplateData,
  ModernTemplateProps,
} from "@/types/modernPortfolio"
import { getProjectImage, getRecordImage } from "@/utils/PublicPortfolioUtils"
import {
  getModernId,
  getModernKey,
  getModernProjectTechnologies,
  getModernRecord,
  getModernText,
} from "@/utils/modernTemplateUtils"

export function useModernTemplateData(
  profile: ModernTemplateProps["profile"],
  portfolio: ModernTemplateProps["portfolio"],
): ModernTemplateData {
  return useMemo(() => {
    const userProfile = getUserProfile(profile)
    const skills = getSkills(portfolio?.skills ?? [])

    return {
      ...userProfile,
      skills,
      highlightedSkills: skills.slice(0, 4),
      projects: getProjects(portfolio?.projects ?? []),
      workExperience: getExperience(portfolio?.experiences ?? []),
      academicExperience: getEducation(portfolio?.educations ?? []),
      certificates: getCertificates(portfolio?.certificates ?? []),
      socialNetworks: getSocialNetworks(portfolio?.socialNetworks ?? []),
    }
  }, [profile, portfolio])
}

function getUserProfile(profile: ModernTemplateProps["profile"]) {
  const userProfile = profile ?? getEmptyProfile()
  const displayName = userProfile.fullname.trim() || "Sin nombre disponible"

  return {
    displayName,
    displayOccupation: userProfile.occupation.trim() || "Sin ocupación disponible",
    displayBiography: userProfile.biography.trim() || "Sin biografía disponible",
    displayResidence: userProfile.residence.trim() || "Sin ubicación disponible",
    displayEmail: userProfile.public_email.trim() || "Sin correo público disponible",
    displayPhone: userProfile.phone.trim() || "Sin teléfono disponible",
    userInitial: displayName.slice(0, 1).toUpperCase() || "?",
    imageUrl: userProfile.image_url.trim(),
  }
}

function getEmptyProfile() {
  return {
    fullname: "",
    occupation: "",
    image_url: "",
    residence: "",
    public_email: "",
    phone: "",
    biography: "",
  }
}

function getSkills(skills: unknown[]): ModernSkill[] {
  return skills.map((skill) => {
    const source = getModernRecord(skill)
    const type = getSkillType(source)
    const level = getSkillLevel(source)
    return {
      id: getModernId(source),
      key: getModernKey(source, "skills"),
      name: getModernText(source.name),
      sublabel: type === "tecnica" ? level : "Habilidad blanda",
      type,
      level,
    }
  })
}

function getSkillType(source: Record<string, unknown>): "tecnica" | "blanda" {
  const value = getModernText(source.type) || getModernText(source.tipo)
  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  return normalized.includes("tecn") || normalized === "technical" ? "tecnica" : "blanda"
}

function getSkillLevel(source: Record<string, unknown>) {
  return getModernText(source.level) || getModernText(source.level_of_domain) || getModernText(source.nivel) || "Sin nivel"
}

function getProjects(projects: unknown[]): ModernProject[] {
  return projects.map((project) => {
    const source = getModernRecord(project)
    return {
      id: getModernId(source),
      key: getModernKey(source, "projects"),
      name: getModernText(source.nombre) || getModernText(source.name) || getModernText(source.title) || "Proyecto sin titulo",
      role: getModernText(source.project_rol) || getModernText(source.role) || getModernText(source.rol) || "Rol no especificado",
      image: getProjectImage(project),
      technologies: getModernProjectTechnologies(project),
    }
  })
}

function getExperience(experiences: unknown[]): ModernExperience[] {
  return experiences.map((experience) => {
    const source = getModernRecord(experience)
    return {
      id: getModernId(source),
      key: getModernKey(source, "work"),
      company: getModernText(source.company),
      position: getModernText(source.position),
      image: getRecordImage(experience),
    }
  })
}

function getEducation(educations: unknown[]): ModernEducation[] {
  return educations.map((education) => {
    const source = getModernRecord(education)
    return {
      id: getModernId(source),
      key: getModernKey(source, "education"),
      title: getModernText(source.title),
      institution: getModernText(source.institution),
    }
  })
}

function getCertificates(certificates: unknown[]): ModernCertificate[] {
  return certificates.map((certificate) => {
    const source = getModernRecord(certificate)
    return {
      id: getModernId(source),
      name: getModernText(source.name),
      issuer: getModernText(source.issuer),
      source,
    }
  })
}

function getSocialNetworks(networks: unknown[]): ModernSocialNetwork[] {
  return networks.map((network) => {
    const source = getModernRecord(network)
    return {
      id: getModernId(source),
      key: getModernKey(source, "network"),
      url: getModernText(source.url) || "#",
      source,
    }
  })
}
