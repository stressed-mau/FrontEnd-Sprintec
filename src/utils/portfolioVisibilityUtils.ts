import type { Portfolio } from "@/types/portfolio";
import type { PortfolioVisibilityData } from "@/services/portfolioVisibilityService";
import { getSocialNetworkDisplayName } from "@/components/portfolio/SocialNetworkIcon";
export const asBoolean = (value: any): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") return value === "1" || value === "true";

  return true;
};
export const mapToVisibilityData = (
  portfolio: Portfolio
): PortfolioVisibilityData => ({
  projects: portfolio.projects.map((p, index) => ({
    id: Number(p.id ?? index),
    label: p.nombre ?? "",
    sublabel:
      (p as any).project_rol ??
      (p as any).role ??
      (p as any).rol ??
      "",
    checked: asBoolean(p.is_public),
    sourceTable: "projects",
  })),

  skills: portfolio.skills.map((s, index) => ({
    id: Number(s.id ?? index),
    label: s.name ?? "",
    sublabel: s.level ?? "",
    checked: asBoolean(s.is_public),
    sourceTable: "skills",
  })),

  experience: portfolio.experiences
    .filter((e) => e.type !== "academica")
    .map((e: any, index) => ({
      id: Number(e.id ?? index),
      label: e.rol ?? e.position ?? "",
      sublabel: e.company_name ?? e.company ?? "",
      checked: asBoolean(e.is_public),
      sourceTable: "work_experiences",
    })),

  education:
    portfolio.educations?.map((e: any, index) => ({
      id: Number(e.id ?? index),
      label: e.title || "Sin título",
      sublabel: e.institution || "Sin institución",
      checked: asBoolean(e.is_public),
      sourceTable: "educations",
    })) ?? [],

  certificates:
    (portfolio as any).certificates?.map(
      (cert: any, index: number) => ({
        id: index,
        label: cert.name ?? "",
        sublabel: cert.issuer ?? "",
        checked: asBoolean(cert.is_public),
        sourceTable: "certificates",
        date: cert.date_issued,
        url: cert.credential_url,
      })
    ) ?? [],

  networks: portfolio.socialNetworks.map((n, index) => ({
    id: Number(n.id ?? index),
    label: getSocialNetworkDisplayName(n),
    sublabel: n.url ?? "",
    checked: asBoolean(n.is_public),
    sourceTable: "social_networks",
  })),
});