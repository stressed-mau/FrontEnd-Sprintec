import {
  Calendar,
  Code,
  ExternalLink,
  GitBranch,
  X,
} from "lucide-react";

import {
  getProjectTitle,
  getProjectImage,
  getProjectTechnologies,
  getProjectRole,
  getProjectDescription,
  getProjectStartDate,
  getProjectEndDate,
  getProjectGithubUrl,
  getProjectDemoUrl,
  isProjectCurrent,
} from "@/utils/PublicPortfolioUtils";

type ProjectModalTheme = {
  panel: string;
  header: string;
  eyebrow: string;
  title: string;
  role: string;
  closeButton: string;
  sectionTitle: string;
  text: string;
  infoCard: string;
  iconText: string;
  tag: string;
  primaryLink: string;
  secondaryLink: string;
};

type ProjectDetailModalProps = {
  project: any;
  theme: ProjectModalTheme;
  onClose: () => void;
  onProjectLinkClick: (
    linkType: "repository" | "demo",
    url: string
  ) => void;
};

export default function ProjectDetailModal({
  project,
  theme,
  onClose,
  onProjectLinkClick,
}: ProjectDetailModalProps) {
  if (!project) return null;

  const description = getProjectDescription(project);
  const role = getProjectRole(project);

  const startDate = getProjectStartDate(project);
  const endDate = getProjectEndDate(project);

  const technologies = getProjectTechnologies(project);

  const githubUrl = getProjectGithubUrl(project);
  const demoUrl = getProjectDemoUrl(project);

  const hasDates = Boolean(
    startDate ||
      endDate ||
      isProjectCurrent(project)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl shadow-2xl sm:max-h-[88vh] sm:w-[min(92vw,40rem)] sm:rounded-2xl ${theme.panel}`}
      >
        <div
          className={`sticky top-0 z-10 flex items-start justify-between gap-3 border-b px-4 py-4 sm:gap-4 sm:px-5 ${theme.header}`}
        >
          <div className="min-w-0">
            <p
              className={`text-xs font-bold uppercase tracking-[0.24em] ${theme.eyebrow}`}
            >
              Detalle de proyecto
            </p>

            <h2
              className={`mt-1 break-words text-xl font-bold leading-tight sm:text-2xl ${theme.title}`}
            >
              {getProjectTitle(project)}
            </h2>

            {role ? (
              <p className={`mt-1 text-sm font-semibold ${theme.role}`}>
                {role}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`shrink-0 rounded-full p-2 transition ${theme.closeButton}`}
            aria-label="Cerrar detalle de proyecto"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {getProjectImage(project) ? (
          <img
            src={getProjectImage(project)}
            alt={getProjectTitle(project)}
            className="h-44 w-full object-cover sm:h-64"
          />
        ) : null}

        <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
          {description ? (
            <section>
              <h3
                className={`text-sm font-bold uppercase tracking-[0.16em] ${theme.sectionTitle}`}
              >
                Descripción
              </h3>

              <p
                className={`mt-2 whitespace-pre-line text-sm leading-6 ${theme.text}`}
              >
                {description}
              </p>
            </section>
          ) : null}

          {(hasDates || technologies.length > 0) ? (
            <div className="flex flex-wrap gap-3">
              {hasDates ? (
                <div
                  className={`w-full min-w-0 rounded-xl border p-4 sm:w-auto sm:min-w-52 sm:max-w-full sm:p-5 ${theme.infoCard}`}
                >
                  <div
                    className={`flex items-center gap-2 text-sm font-bold ${theme.iconText}`}
                  >
                    <Calendar className="h-4 w-4" />
                    Fechas
                  </div>

                  <p className={`mt-2 text-sm ${theme.text}`}>
                    {[
                      startDate,
                      isProjectCurrent(project)
                        ? "En curso"
                        : endDate,
                    ]
                      .filter(Boolean)
                      .join(" - ")}
                  </p>
                </div>
              ) : null}

              {technologies.length > 0 ? (
                <div
                  className={`w-full min-w-0 rounded-xl border p-4 sm:w-auto sm:min-w-56 sm:max-w-full sm:p-5 ${theme.infoCard}`}
                >
                  <div
                    className={`flex items-center gap-2 text-sm font-bold ${theme.iconText}`}
                  >
                    <Code className="h-4 w-4" />
                    Tecnologías
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {technologies.map(
                      (technology: string) => (
                        <span
                          key={technology}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.tag}`}
                        >
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {(githubUrl || demoUrl) ? (
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    onProjectLinkClick(
                      "repository",
                      githubUrl
                    )
                  }
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition sm:w-auto ${theme.primaryLink}`}
                >
                  <GitBranch className="h-4 w-4" />
                  Repositorio
                </a>
              ) : null}

              {demoUrl ? (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    onProjectLinkClick(
                      "demo",
                      demoUrl
                    )
                  }
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition sm:w-auto ${theme.secondaryLink}`}
                >
                  <ExternalLink className="h-4 w-4" />
                  Demo
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}