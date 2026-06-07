import { Calendar, Code, ExternalLink, GitBranch, X } from "lucide-react";

import type { ProjectModalTheme } from "@/types/projectModalTheme";
import {
  getProjectDemoUrl,
  getProjectDescription,
  getProjectEndDate,
  getProjectGithubUrl,
  getProjectImage,
  getProjectRole,
  getProjectStartDate,
  getProjectTechnologies,
  getProjectTitle,
  isProjectCurrent,
} from "@/utils/PublicPortfolioUtils";

type ProjectDetailModalProps = {
  project: unknown;
  theme: ProjectModalTheme;
  onClose: () => void;
  onProjectLinkClick: (linkType: "repository" | "demo", url: string) => void;
};

export default function ProjectDetailModal({
  project,
  theme,
  onClose,
  onProjectLinkClick,
}: ProjectDetailModalProps) {
  if (!project) return null;

  const title = getProjectTitle(project);
  const role = getProjectRole(project);
  const description = getProjectDescription(project);
  const startDate = getProjectStartDate(project);
  const endDate = getProjectEndDate(project);
  const technologies = getProjectTechnologies(project);
  const githubUrl = getProjectGithubUrl(project);
  const demoUrl = getProjectDemoUrl(project);
  const projectImage = getProjectImage(project);
  const hasDates = Boolean(startDate || endDate || isProjectCurrent(project));
  const panelWidthClassName = projectImage ? "sm:w-[min(94vw,42rem)]" : "sm:w-[min(92vw,34rem)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl shadow-2xl sm:max-h-[88vh] ${panelWidthClassName} sm:rounded-2xl ${theme.fontClass} ${theme.panel}`}
      >
        <ModalHeader title={title} role={role} theme={theme} onClose={onClose} />
        <div className={`grid ${projectImage ? "md:grid-cols-[12rem_1fr]" : ""}`}>
          {projectImage ? <ProjectImage image={projectImage} title={title} /> : null}
          <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
            {description ? <ProjectDescription description={description} theme={theme} /> : null}
            <ProjectInfoCards
              hasDates={hasDates}
              startDate={startDate}
              endDate={endDate}
              isCurrent={isProjectCurrent(project)}
              technologies={technologies}
              theme={theme}
            />
            <ProjectLinks
              githubUrl={githubUrl}
              demoUrl={demoUrl}
              theme={theme}
              onProjectLinkClick={onProjectLinkClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalHeader({
  title,
  role,
  theme,
  onClose,
}: {
  title: string;
  role: string;
  theme: ProjectModalTheme;
  onClose: () => void;
}) {
  return (
    <div className={`sticky top-0 z-10 flex items-start justify-between gap-3 border-b px-4 py-4 sm:gap-4 sm:px-5 ${theme.header}`}>
      <div className="min-w-0">
        <p className={`text-xs font-bold uppercase tracking-[0.24em] ${theme.eyebrow}`}>Detalle de proyecto</p>
        <h2 className={`mt-1 break-words text-xl font-bold leading-tight sm:text-2xl ${theme.title}`}>{title}</h2>
        {role ? <p className={`mt-1 text-sm font-semibold ${theme.role}`}>{role}</p> : null}
      </div>
      <button type="button" onClick={onClose} className={`shrink-0 rounded-full p-2 transition ${theme.closeButton}`} aria-label="Cerrar detalle de proyecto">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function ProjectImage({ image, title }: { image: string; title: string }) {
  return (
    <div className="flex h-32 items-center justify-center overflow-hidden border-b border-black/10 px-4 py-4 sm:h-40 sm:px-5 md:h-44 md:border-b-0 md:border-r">
      <img src={image} alt={title} className="max-h-full max-w-full rounded-xl object-contain" />
    </div>
  );
}

function ProjectDescription({ description, theme }: { description: string; theme: ProjectModalTheme }) {
  return (
    <section>
      <h3 className={`text-sm font-bold uppercase tracking-[0.16em] ${theme.sectionTitle}`}>Descripción</h3>
      <p className={`mt-2 whitespace-pre-line text-sm leading-6 ${theme.text}`}>{description}</p>
    </section>
  );
}

function ProjectInfoCards({
  hasDates,
  startDate,
  endDate,
  isCurrent,
  technologies,
  theme,
}: {
  hasDates: boolean;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  technologies: string[];
  theme: ProjectModalTheme;
}) {
  if (!hasDates && technologies.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(9rem,max-content))]">
      {hasDates ? <DateCard startDate={startDate} endDate={endDate} isCurrent={isCurrent} theme={theme} /> : null}
      {technologies.length > 0 ? <TechnologiesCard technologies={technologies} theme={theme} /> : null}
    </div>
  );
}

function DateCard({
  startDate,
  endDate,
  isCurrent,
  theme,
}: {
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  theme: ProjectModalTheme;
}) {
  return (
    <div className={`min-w-0 max-w-full rounded-xl border px-3 py-2.5 ${theme.infoCard}`}>
      <div className={`flex items-center gap-2 text-sm font-bold ${theme.iconText}`}>
        <Calendar className="h-4 w-4" />
        Fechas
      </div>
      <p className={`mt-2 text-sm ${theme.text}`}>{[startDate, isCurrent ? "En curso" : endDate].filter(Boolean).join(" - ")}</p>
    </div>
  );
}

function TechnologiesCard({ technologies, theme }: { technologies: string[]; theme: ProjectModalTheme }) {
  return (
    <div className={`min-w-0 max-w-full rounded-xl border px-3 py-2.5 ${theme.infoCard}`}>
      <div className={`flex items-center gap-2 text-sm font-bold ${theme.iconText}`}>
        <Code className="h-4 w-4" />
        Tecnologías
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {technologies.map((technology) => (
          <span key={technology} className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.tag}`}>
            {technology}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectLinks({
  githubUrl,
  demoUrl,
  theme,
  onProjectLinkClick,
}: {
  githubUrl: string;
  demoUrl: string;
  theme: ProjectModalTheme;
  onProjectLinkClick: (linkType: "repository" | "demo", url: string) => void;
}) {
  if (!githubUrl && !demoUrl) return null;

  return (
    <div className="grid gap-3 sm:flex sm:flex-wrap">
      {githubUrl ? <ProjectLink href={githubUrl} label="Repositorio" icon="repository" className={theme.primaryLink} onProjectLinkClick={onProjectLinkClick} /> : null}
      {demoUrl ? <ProjectLink href={demoUrl} label="Demo" icon="demo" className={theme.secondaryLink} onProjectLinkClick={onProjectLinkClick} /> : null}
    </div>
  );
}

function ProjectLink({
  href,
  label,
  icon,
  className,
  onProjectLinkClick,
}: {
  href: string;
  label: string;
  icon: "repository" | "demo";
  className: string;
  onProjectLinkClick: (linkType: "repository" | "demo", url: string) => void;
}) {
  const Icon = icon === "repository" ? GitBranch : ExternalLink;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onProjectLinkClick(icon, href)}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition sm:w-auto ${className}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}
