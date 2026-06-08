import { X, ExternalLink } from "lucide-react";
import {
  getCurrentText,
  getDateText,
  getEducationField,
  getEducationInstitution,
  getEducationTitle,
  getExperienceCompany,
  getExperiencePosition,
  getFirstText,
  getProjectImage,
  getProjectRole,
  getProjectTechnologies,
  getProjectTitle,
} from "@/utils/portfolioUtils"

type PortfolioDetailType =
  | "project"
  | "experience"
  | "education";

export type PortfolioDetailTheme =
  | "modern"
  | "minimalist"
  | "corporate"
  | "default";

export type SelectedPortfolioDetail = {
  type: PortfolioDetailType;
  item: any;
} | null;

const DETAIL_MODAL_THEMES: Record<PortfolioDetailTheme, {
  overlay: string
  panel: string
  header: string
  eyebrow: string
  title: string
  subtitle: string
  closeButton: string
  body: string
  label: string
  value: string
  tag: string
  divider: string
  link: string
}> = {
  modern: {
    overlay: "bg-[#173b61]/72",
    panel: "bg-[#fcecd4] text-[#173b61] ring-1 ring-[#ee8e3b]/35",
    header: "border-[#ee8e3b]/35 bg-[#173b61] text-[#fcecd4]",
    eyebrow: "text-[#ee8e3b]",
    title: "text-[#fcecd4]",
    subtitle: "text-[#fcecd4]/78",
    closeButton: "text-[#fcecd4]/80 hover:bg-[#2f606b] hover:text-[#fcecd4]",
    body: "bg-[#fcecd4]",
    label: "text-[#2f606b]",
    value: "text-[#173b61]",
    tag: "bg-[#173b61] text-[#fcecd4]",
    divider: "border-[#ee8e3b]/30",
    link: "border-[#ee8e3b] bg-[#ee8e3b] text-[#173b61] hover:bg-[#f6a762]",
  },
  minimalist: {
    overlay: "bg-zinc-950/62",
    panel: "bg-white text-zinc-900 ring-1 ring-stone-200",
    header: "border-stone-200 bg-white",
    eyebrow: "text-stone-500",
    title: "text-zinc-900",
    subtitle: "text-stone-500",
    closeButton: "text-stone-500 hover:bg-stone-100 hover:text-zinc-900",
    body: "bg-white",
    label: "text-stone-500",
    value: "text-zinc-900",
    tag: "bg-stone-100 text-zinc-800 ring-1 ring-stone-200",
    divider: "border-stone-200",
    link: "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-700",
  },
  corporate: {
    overlay: "bg-[#111111]/72",
    panel: "bg-[#FBF8F2] text-[#1F2933] ring-1 ring-[#D7C3A4]",
    header: "border-[#D7C3A4] bg-[#1F2933] text-[#F4D8AE]",
    eyebrow: "text-[#D6A96B]",
    title: "text-[#F4D8AE]",
    subtitle: "text-[#D7C3A4]",
    closeButton: "text-[#F4D8AE]/80 hover:bg-[#2F3A45] hover:text-[#F4D8AE]",
    body: "bg-[#FBF8F2]",
    label: "text-[#8C6E46]",
    value: "text-[#1F2933]",
    tag: "border border-black/10 bg-[#F2E7D7] text-[#3D4348]",
    divider: "border-[#D7C3A4]",
    link: "border-[#1F2933] bg-[#1F2933] text-[#F4D8AE] hover:bg-[#2F3A45]",
  },
  default: {
    overlay: "bg-black/55",
    panel: "bg-white text-[#003A6C] ring-1 ring-[#D9EAF4]",
    header: "border-[#D9EAF4] bg-white",
    eyebrow: "text-[#4982AD]",
    title: "text-[#003A6C]",
    subtitle: "text-[#4B778D]",
    closeButton: "text-[#003A6C] hover:bg-[#EEF5F9]",
    body: "bg-white",
    label: "text-[#6B7E8E]",
    value: "text-[#003A6C]",
    tag: "bg-[#EEF5F9] text-[#003A6C]",
    divider: "border-[#D9EAF4]",
    link: "border-[#A5D7E8] bg-[#EEF5F9] text-[#003A6C] hover:bg-[#D9EAF4]",
  },
}

function DetailLink({ href, label, className }: { href: string; label: string; className: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-bold transition sm:w-auto ${className}`}>
      <ExternalLink className="h-4 w-4" />
      {label}
    </a>
  )
}

export default function PortfolioRecordModal({
  selected,
  theme,
  onClose,
}: {
  selected: SelectedPortfolioDetail
  theme: PortfolioDetailTheme
  onClose: () => void
}) {
  if (!selected) return null

  const modalTheme = DETAIL_MODAL_THEMES[theme]
  const { type, item } = selected
  const isProject = type === "project"
  const isExperience = type === "experience"
  const title = isProject
    ? getProjectTitle(item)
    : isExperience
      ? getExperiencePosition(item)
      : getEducationTitle(item)
  const subtitle = isProject
    ? getProjectRole(item)
    : isExperience
      ? getExperienceCompany(item)
      : getEducationInstitution(item)
  const heading = isProject ? "Detalle de proyecto" : isExperience ? "Detalle de experiencia" : "Detalle de formacion academica"
  const image = isProject ? getProjectImage(item) : getFirstText(item?.image, item?.logo, item?.logo_url)
  const certificate = getFirstText(
    item?.certificate,
    item?.certificate_url,
    item?.certification_url,
    item?.certificate_file_url,
    item?.document_url,
    item?.file_url,
  )
  const projectRepository = getFirstText(item?.url_to_project, item?.github, item?.github_url, item?.repository_url)
  const projectDemo = getFirstText(item?.url_to_deploy, item?.demo, item?.demo_url, item?.project_url, item?.url)
  const technologies = isProject ? getProjectTechnologies(item) : []
  const rows = isProject
    ? [
        ["Nombre", getProjectTitle(item)],
        ["Rol", getProjectRole(item)],
        ["Descripcion", getFirstText(item?.descripcion, item?.description, item?.summary)],
        ["Fecha de inicio", getDateText(item?.fechaInicio ?? item?.start_date ?? item?.startDate ?? item?.initial_date)],
        ["Fecha de fin", getCurrentText(item?.is_current ?? item?.current, "En curso", "") || getDateText(item?.fechaFin ?? item?.end_date ?? item?.endDate ?? item?.final_date)],
      ]
    : isExperience
      ? [
          ["Empresa", getExperienceCompany(item)],
          ["Cargo", getExperiencePosition(item)],
          ["Correo", getFirstText(item?.email, item?.company_email)],
          ["Ubicacion", getFirstText(item?.location, item?.ubicacion)],
          ["Descripcion", getFirstText(item?.description, item?.descripcion)],
          ["Fecha de inicio", getDateText(item?.startDate ?? item?.start_date ?? item?.initial_date)],
          ["Fecha de fin", getCurrentText(item?.current ?? item?.is_current, "Actual", "") || getDateText(item?.endDate ?? item?.end_date ?? item?.final_date)],
        ]
      : [
          ["Institucion", getEducationInstitution(item)],
          ["Nivel de formacion", getEducationTitle(item)],
          ["Area de estudio", getEducationField(item)],
          ["Descripcion", getFirstText(item?.description, item?.descripcion)],
          ["Fecha de emision", getCurrentText(item?.currently_studying ?? item?.current ?? item?.is_current, "Cursando actualmente", "") || getDateText(item?.endDate ?? item?.end_date ?? item?.final_date)],
        ]
  const visibleRows = rows.filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <div className={`fixed inset-0 z-[160] flex items-center justify-center p-4 backdrop-blur-sm ${modalTheme.overlay}`}>
      <div className={`max-h-[86dvh] w-[min(100%,28rem)] overflow-y-auto rounded-xl shadow-2xl ${modalTheme.panel}`}>
        <div className={`sticky top-0 z-10 flex items-start justify-between gap-3 border-b px-4 py-3 sm:px-4 ${modalTheme.header}`}>
          <div className="min-w-0">
            <p className={`text-xs font-bold uppercase tracking-[0.18em] ${modalTheme.eyebrow}`}>{heading}</p>
            <h2 className={`mt-1 break-words text-lg font-bold leading-tight sm:text-xl ${modalTheme.title}`}>{title}</h2>
            {subtitle ? <p className={`mt-1 break-words text-sm font-semibold ${modalTheme.subtitle}`}>{subtitle}</p> : null}
          </div>
          <button type="button" onClick={onClose} className={`shrink-0 rounded-full p-2 transition ${modalTheme.closeButton}`} aria-label="Cerrar detalle">
            <X className="h-5 w-5" />
          </button>
        </div>

        {image ? <img src={image} alt={title} className="h-32 w-full object-cover sm:h-40" /> : null}

        <div className={`space-y-4 px-4 py-4 ${modalTheme.body}`}>
          <div className="grid grid-cols-1 gap-y-3">
            {visibleRows.map(([label, value]) => (
              <div key={label}>
                <p className={`text-xs font-bold uppercase tracking-[0.14em] ${modalTheme.label}`}>{label}</p>
                <p className={`mt-1 whitespace-pre-line break-words text-sm leading-5 ${modalTheme.value}`}>{value}</p>
              </div>
            ))}
          </div>

          {technologies.length ? (
            <div>
              <p className={`text-xs font-bold uppercase tracking-[0.14em] ${modalTheme.label}`}>Tecnologias</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <span key={technology} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${modalTheme.tag}`}>
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {(projectRepository || projectDemo || certificate) ? (
            <div className={`grid gap-2 border-t pt-3 sm:flex sm:flex-wrap ${modalTheme.divider}`}>
              {projectRepository ? <DetailLink href={projectRepository} label="Repositorio" className={modalTheme.link} /> : null}
              {projectDemo ? <DetailLink href={projectDemo} label="Demo" className={modalTheme.link} /> : null}
              {certificate ? <DetailLink href={certificate} label="Documento" className={modalTheme.link} /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}