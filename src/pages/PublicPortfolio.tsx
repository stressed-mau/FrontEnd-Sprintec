import { useEffect, useRef, useState } from "react"
//import type { Portfolio } from "@/types/portfolio"
import { usePortfolio } from "@/hooks/usePortfolio"
//import type { PortfolioVisibilityData } from "@/services/portfolioVisibilityService"
import { ArrowLeft, Calendar, Code, ExternalLink, GitBranch, Mail, MapPin, Briefcase, GraduationCap, MessageCircle, Send, X } from "lucide-react"
import MinimalistTemplate from "@/components/templates/MinimalistTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import { CorporatePortfolioTemplate } from "@/components/portfolio/CorporatePortfolioTemplate"
import { getSocialNetworkDisplayName, getSocialNetworkKey, SocialNetworkIcon } from "@/components/portfolio/SocialNetworkIcon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { getAuthSession } from "@/services/auth"
import { sendPortfolioMessage, type MessageReason } from "@/services/messagesService"
import {
  recordPortfolioView,
  recordProjectClick,
  recordProjectLinkClick,
  recordSocialClick,
  sendPortfolioTrackingPulse,
} from "@/services/portfolioAnalyticsService"

const asBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "si", "sí", "yes"].includes(value.trim().toLowerCase())
  return true
}

const getProjectTechnologies = (project: any): string[] => (
  project.technologies ??
  project.languages?.map((technology: any) => technology.name ?? technology) ??
  project.tecnologias?.map((technology: any) => technology.name ?? technology) ??
  []
).filter(Boolean)

const getNetworkName = (network: any): string => {
  return getSocialNetworkKey(network)
}

const getProjectTitle = (project: any): string =>
  project?.nombre || project?.name || project?.title || "Proyecto sin titulo"

const getProjectRole = (project: any): string =>
  project?.project_rol || project?.role || project?.rol || ""

const getProjectDescription = (project: any): string =>
  project?.descripcion || project?.description || project?.summary || ""

const getProjectStartDate = (project: any): string =>
  project?.fechaInicio || project?.start_date || project?.startDate || ""

const getProjectEndDate = (project: any): string =>
  project?.fechaFin || project?.end_date || project?.endDate || ""

const getProjectImage = (project: any): string =>
  project?.image || project?.image_url || project?.photograph || ""

const getProjectGithubUrl = (project: any): string =>
  project?.url_to_project || project?.github || project?.github_url || project?.repository_url || ""

const getProjectDemoUrl = (project: any): string =>
  project?.url_to_deploy || project?.demo || project?.demo_url || project?.project_url || project?.url || ""

const isProjectCurrent = (project: any): boolean => {
  const value = project?.is_current ?? project?.current
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "si", "sí", "yes"].includes(value.trim().toLowerCase())
  return false
}

const sameProjectId = (project: any, projectId?: string | number) =>
  projectId != null && String(project?.id) === String(projectId)

const sameRecordId = (record: any, recordId?: string | number) =>
  recordId != null && String(record?.id) === String(recordId)

const MESSAGE_REASON_OPTIONS: Array<{ id: MessageReason; title: string; message: string }> = [
  {
    id: "job_opportunity",
    title: "Oportunidad laboral",
    message: "Hola, me interesa tu perfil profesional. Tengo una oportunidad laboral que podria interesarte.",
  },
  {
    id: "project_collaboration",
    title: "Colaboracion en proyecto",
    message: "Hola, estoy trabajando en un proyecto y me gustaria colaborar contigo.",
  },
  {
    id: "technical_question",
    title: "Consulta tecnica",
    message: "Hola, me gustaria consultarte sobre tu experiencia en algunas tecnologias.",
  },
  {
    id: "professional_networking",
    title: "Networking profesional",
    message: "Hola, me gustaria conectar contigo y ampliar mi red profesional.",
  },
  {
    id: "mentorship",
    title: "Mentoria",
    message: "Hola, me interesa aprender de tu experiencia. Podrias orientarme?",
  },
  {
    id: "freelance_proposal",
    title: "Propuesta freelance",
    message: "Hola, tengo un proyecto freelance que podria interesarte.",
  },
]

const MESSAGE_DETAILS_MAX_LENGTH = 300
const CONTACT_NAME_MAX_LENGTH = 80
const CONTACT_EMAIL_MAX_LENGTH = 120
const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getPortfolioRecipientId = (portfolio: any): string => {
  const value =
    portfolio?.user_id ||
    portfolio?.userId ||
    portfolio?.owner_id ||
    portfolio?.profile?.user_id ||
    portfolio?.profile?.userId ||
    portfolio?.profile?.user?.id ||
    portfolio?.config?.user_id ||
    portfolio?.config?.userId ||
    portfolio?.config?.owner_id ||
    portfolio?.config?.user?.id ||
    portfolio?.owner?.id ||
    portfolio?.user?.id

  return value == null ? "" : String(value).trim()
}

const getFirstText = (...values: unknown[]): string => {
  const value = values.find((item) => typeof item === "string" && item.trim())
  return typeof value === "string" ? value.trim() : ""
}

const getExperienceTitle = (experience: any): string =>
  getFirstText(experience?.position, experience?.role, experience?.job_title, experience?.title) || "Cargo no especificado"

const getExperienceCompany = (experience: any): string =>
  getFirstText(experience?.company, experience?.company_name, experience?.institution, experience?.organization)

const getEducationTitle = (education: any): string =>
  getFirstText(education?.title, education?.degree, education?.career, education?.name) || "Formacion no especificada"

const getEducationInstitution = (education: any): string =>
  getFirstText(education?.institution, education?.institution_name, education?.company, education?.school)

const getRecordDescription = (record: any): string =>
  getFirstText(record?.description, record?.descripcion, record?.summary, record?.details)

const getRecordStartDate = (record: any): string =>
  getFirstText(record?.start_date, record?.startDate, record?.fechaInicio)

const getRecordEndDate = (record: any): string =>
  getFirstText(record?.end_date, record?.endDate, record?.fechaFin)

const getEducationField = (education: any): string =>
  getFirstText(education?.field_to_study, education?.fieldOfStudy, education?.field, education?.area)

const isCurrentRecord = (record: any): boolean => {
  const value = record?.currently_studying ?? record?.is_current ?? record?.current ?? record?.currently_working
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "si", "sÃ­", "yes"].includes(value.trim().toLowerCase())
  return false
}

type ProjectModalTheme = {
  panel: string
  header: string
  eyebrow: string
  title: string
  role: string
  closeButton: string
  sectionTitle: string
  text: string
  infoCard: string
  iconText: string
  tag: string
  primaryLink: string
  secondaryLink: string
}

const PROJECT_MODAL_THEMES: Record<"modern" | "minimalist" | "corporate" | "default", ProjectModalTheme> = {
  modern: {
    panel: "bg-[#173b61] text-[#fcecd4]",
    header: "border-[#ee8e3b]/35 bg-[#173b61]",
    eyebrow: "text-[#ee8e3b]",
    title: "text-[#fcecd4]",
    role: "text-[#ee8e3b]",
    closeButton: "text-[#fcecd4]/75 hover:bg-[#2f606b] hover:text-[#fcecd4]",
    sectionTitle: "text-[#ee8e3b]",
    text: "text-[#fcecd4]/82",
    infoCard: "border-[#ee8e3b]/25 bg-[#2f606b]/55",
    iconText: "text-[#fcecd4]",
    tag: "bg-[#fcecd4] text-[#173b61]",
    primaryLink: "bg-[#ee8e3b] text-[#173b61] hover:bg-[#f6a762]",
    secondaryLink: "border border-[#ee8e3b] text-[#fcecd4] hover:bg-[#ee8e3b]/15",
  },
  minimalist: {
    panel: "bg-white text-zinc-900",
    header: "border-stone-200 bg-white",
    eyebrow: "text-stone-500",
    title: "text-zinc-900",
    role: "text-stone-500",
    closeButton: "text-stone-500 hover:bg-stone-100 hover:text-zinc-900",
    sectionTitle: "text-zinc-900",
    text: "text-stone-700",
    infoCard: "border-stone-200 bg-stone-50",
    iconText: "text-zinc-900",
    tag: "bg-white text-stone-700 ring-1 ring-stone-200",
    primaryLink: "bg-zinc-900 text-white hover:bg-zinc-700",
    secondaryLink: "border border-zinc-900 text-zinc-900 hover:bg-stone-100",
  },
  corporate: {
    panel: "bg-[#FBF8F2] text-[#1F2933]",
    header: "border-[#D7C3A4] bg-[#FBF8F2]",
    eyebrow: "text-[#8C6E46]",
    title: "text-[#1F2933]",
    role: "text-[#8C6E46]",
    closeButton: "text-[#6F7782] hover:bg-[#F2E7D7] hover:text-[#1F2933]",
    sectionTitle: "text-[#8C6E46]",
    text: "text-[#3D4348]",
    infoCard: "border-[#D7C3A4] bg-[#F2E7D7]/70",
    iconText: "text-[#1F2933]",
    tag: "border border-black/10 bg-[#F2E7D7] text-[#3D4348]",
    primaryLink: "bg-[#1F2933] text-[#F4D8AE] hover:bg-[#2F3A45]",
    secondaryLink: "border border-[#8C6E46] text-[#8C6E46] hover:bg-[#F2E7D7]",
  },
  default: {
    panel: "bg-white text-gray-900",
    header: "border-[#D9EAF4] bg-white",
    eyebrow: "text-[#4982AD]",
    title: "text-[#003A6C]",
    role: "text-[#8C6E46]",
    closeButton: "text-gray-500 hover:bg-[#EEF5F9] hover:text-[#003A6C]",
    sectionTitle: "text-[#003A6C]",
    text: "text-gray-700",
    infoCard: "border-[#D9EAF4] bg-[#F8FBFD]",
    iconText: "text-[#003A6C]",
    tag: "bg-[#D9EAF4] text-[#003A6C]",
    primaryLink: "bg-[#003A6C] text-white hover:bg-[#002A4D]",
    secondaryLink: "border border-[#003A6C] text-[#003A6C] hover:bg-[#EEF5F9]",
  },
}

type DetailRecordModalProps = {
  kind: "experience" | "education"
  record: any
  theme: ProjectModalTheme
  onClose: () => void
}

const DetailRecordModal = ({ kind, record, theme, onClose }: DetailRecordModalProps) => {
  const isEducation = kind === "education"
  const title = isEducation ? getEducationTitle(record) : getExperienceTitle(record)
  const subtitle = isEducation ? getEducationInstitution(record) : getExperienceCompany(record)
  const description = getRecordDescription(record)
  const startDate = getRecordStartDate(record)
  const endDate = getRecordEndDate(record)
  const dateText = [startDate, isCurrentRecord(record) ? "En curso" : endDate].filter(Boolean).join(" - ")
  const rows = [
    ["Institucion", isEducation ? subtitle : ""],
    ["Empresa", isEducation ? "" : subtitle],
    ["Campo de estudio", isEducation ? getEducationField(record) : ""],
    ["Fechas", dateText],
  ].filter(([, value]) => Boolean(value))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true">
      <div className={`max-h-[88vh] w-[min(100%,30rem)] overflow-y-auto rounded-2xl shadow-2xl ${theme.panel}`}>
        <div className={`sticky top-0 z-10 flex items-start justify-between gap-3 border-b px-4 py-4 sm:px-5 ${theme.header}`}>
          <div className="min-w-0">
            <p className={`text-xs font-bold uppercase tracking-[0.22em] ${theme.eyebrow}`}>
              {isEducation ? "Detalle de formacion" : "Detalle de experiencia"}
            </p>
            <h2 className={`mt-1 break-words text-xl font-bold leading-tight ${theme.title}`}>{title}</h2>
            {subtitle ? <p className={`mt-1 text-sm font-semibold ${theme.role}`}>{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`shrink-0 rounded-full p-2 transition ${theme.closeButton}`}
            aria-label={isEducation ? "Cerrar detalle de formacion" : "Cerrar detalle de experiencia"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4 sm:px-5">
          {description ? (
            <section>
              <h3 className={`text-sm font-bold uppercase tracking-[0.16em] ${theme.sectionTitle}`}>Descripcion</h3>
              <p className={`mt-2 whitespace-pre-line text-sm leading-6 ${theme.text}`}>{description}</p>
            </section>
          ) : null}

          {rows.length > 0 ? (
            <div className={`rounded-xl border p-4 ${theme.infoCard}`}>
              <dl className="space-y-3">
                {rows.map(([label, value]) => (
                  <div key={label}>
                    <dt className={`text-xs font-bold uppercase tracking-[0.16em] ${theme.sectionTitle}`}>{label}</dt>
                    <dd className={`mt-1 break-words text-sm ${theme.text}`}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

type PortfolioMessageModalProps = {
  recipientName: string
  portfolioSlug: string
  recipientId: string
  isGuest: boolean
  onClose: () => void
  onSent: () => void
}

const PortfolioMessageModal = ({ recipientName, portfolioSlug, recipientId, isGuest, onClose, onSent }: PortfolioMessageModalProps) => {
  const [selectedReason, setSelectedReason] = useState<MessageReason | "">("")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [details, setDetails] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleSubmit = async () => {
    const reason = MESSAGE_REASON_OPTIONS.find((option) => option.id === selectedReason)
    const trimmedContactName = contactName.trim()
    const trimmedContactEmail = contactEmail.trim()

    if (!reason) {
      setErrorMessage("Selecciona un motivo de contacto.")
      return
    }

    if (isGuest && !trimmedContactName) {
      setErrorMessage("Ingresa tu nombre completo.")
      return
    }

    if (isGuest && !trimmedContactEmail) {
      setErrorMessage("Ingresa tu correo de contacto.")
      return
    }

    if (isGuest && !CONTACT_EMAIL_REGEX.test(trimmedContactEmail)) {
      setErrorMessage("Ingresa un correo de contacto valido.")
      return
    }

    setIsSending(true)
    setErrorMessage("")

    try {
      await sendPortfolioMessage({
        recipient_id: recipientId,
        portfolio_slug: portfolioSlug,
        reason: reason.id,
        reason_title: reason.title,
        base_message: reason.message,
        contact_name: isGuest ? trimmedContactName : undefined,
        contact_email: isGuest ? trimmedContactEmail : undefined,
        additional_details: details.trim() || undefined,
      })
      onSent()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo enviar el mensaje. Intentalo nuevamente.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-none bg-white shadow-2xl sm:w-[min(92vw,32rem)] sm:rounded-lg">
        <div className="flex items-center justify-between bg-[#00457A] px-5 py-5 text-white">
          <h2 className="min-w-0 break-words text-xl font-bold leading-tight sm:text-2xl">
            Enviar mensaje a {recipientName}
          </h2>
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="ml-3 h-8 w-8 shrink-0 rounded-full p-1 text-white transition hover:bg-white/15 hover:text-white"
            aria-label="Cerrar modal de mensaje"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {isGuest ? (
            <section className="rounded-xl border border-[#6DACBF] bg-[#F6FBFE] p-4">
              <h3 className="mb-3 text-base font-bold text-[#00457A]">Tus datos de contacto *</h3>
              <div className="grid gap-3">
                <Label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-[#00457A]">Nombre completo</span>
                  <Input
                    type="text"
                    value={contactName}
                    onChange={(event) => {
                      setContactName(event.target.value.slice(0, CONTACT_NAME_MAX_LENGTH))
                      setErrorMessage("")
                    }}
                    maxLength={CONTACT_NAME_MAX_LENGTH}
                    autoComplete="name"
                    placeholder="Ej: Maria Rodriguez"
                    className="h-11 w-full rounded-lg border border-[#6DACBF] px-3 text-base text-[#003A6C] outline-none transition placeholder:text-[#7C9CB8] focus:border-[#00457A] focus:ring-2 focus:ring-[#00457A]/20"
                  />
                </Label>
                <Label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-[#00457A]">Correo de contacto</span>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(event) => {
                      setContactEmail(event.target.value.slice(0, CONTACT_EMAIL_MAX_LENGTH))
                      setErrorMessage("")
                    }}
                    maxLength={CONTACT_EMAIL_MAX_LENGTH}
                    autoComplete="email"
                    inputMode="email"
                    placeholder="Ej: contacto@correo.com"
                    className="h-11 w-full rounded-lg border border-[#6DACBF] px-3 text-base text-[#003A6C] outline-none transition placeholder:text-[#7C9CB8] focus:border-[#00457A] focus:ring-2 focus:ring-[#00457A]/20"
                  />
                </Label>
              </div>
            </section>
          ) : null}

          <section>
            <h3 className="mb-3 text-base font-bold text-[#00457A]">Motivo de contacto *</h3>
            <div className="space-y-3">
              {MESSAGE_REASON_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition ${
                    selectedReason === option.id
                      ? "border-[#00457A] bg-[#EEF7FC]"
                      : "border-[#6DACBF] bg-white hover:bg-[#F6FBFE]"
                  }`}
                >
                  <input
                    type="radio"
                    name="message-reason"
                    value={option.id}
                    checked={selectedReason === option.id}
                    onChange={() => {
                      setSelectedReason(option.id)
                      setErrorMessage("")
                    }}
                    className="mt-1 h-4 w-4 accent-[#00457A]"
                  />
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-[#00457A]">{option.title}</span>
                    <span className="mt-1 block text-sm font-medium leading-5 text-[#4B5563]">{option.message}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <label className="block">
            <span className="mb-2 block text-base font-bold text-[#00457A]">Detalles adicionales (opcional)</span>
            <Textarea
              value={details}
              onChange={(event) => setDetails(event.target.value.slice(0, MESSAGE_DETAILS_MAX_LENGTH))}
              maxLength={MESSAGE_DETAILS_MAX_LENGTH}
              placeholder="Agrega mas informacion si lo deseas..."
              className="h-28 w-full resize-none rounded-xl border border-[#6DACBF] px-4 py-3 text-base text-[#003A6C] outline-none transition placeholder:text-[#7C9CB8] focus:border-[#00457A] focus:ring-2 focus:ring-[#00457A]/20"
            />
            <span className="mt-2 block text-sm text-[#65758A]">
              {details.length}/{MESSAGE_DETAILS_MAX_LENGTH} caracteres
            </span>
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-3 border-t border-gray-200 bg-white px-5 py-4">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSending}
            size="lg"
            className="inline-flex h-11 items-center justify-center gap-3 rounded-lg bg-[#00457A] px-4 text-base font-bold text-white transition hover:bg-[#003A6C] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send className="h-5 w-5" />
            {isSending ? "Enviando..." : "Enviar mensaje"}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            disabled={isSending}
            variant="outline"
            size="lg"
            className="h-11 rounded-lg border border-[#6DACBF] bg-[#CBE7F8] px-5 text-base font-semibold text-[#003A6C] transition hover:bg-[#B7DDF2] disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

const PublicPortfolio = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { portfolio, loading, visitId } = usePortfolio(slug) as { portfolio: any, loading: boolean, visitId: string | null };
  const recordedViewRef = useRef<string | null>(null)
  const trackingStartRef = useRef<number>(Date.now())
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<any | null>(null)
  const [selectedEducation, setSelectedEducation] = useState<any | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [messageFeedback, setMessageFeedback] = useState("")
  const fromExplore = Boolean((location.state as { fromExplore?: boolean } | null)?.fromExplore)
  const session = getAuthSession()
  const isGuestVisitor = !session

  const handleBack = () => {
    if (fromExplore) {
      navigate(-1)
      return
    }

    navigate("/explore")
  }

  const backButton = (
    <button
      type="button"
      onClick={handleBack}
      className="fixed left-4 top-4 z-40 inline-flex items-center gap-2 rounded-full border border-[#6DACBF]/35 bg-white/95 px-4 py-2 text-sm font-bold text-[#003A6C] shadow-lg shadow-black/10 backdrop-blur transition hover:bg-[#F7F0E1] focus:outline-none focus:ring-2 focus:ring-[#4982AD]/35"
    >
      <ArrowLeft className="h-4 w-4" />
      Volver
    </button>
  )

  useEffect(() => {
    if (!visitId) return;
    trackingStartRef.current = Date.now()

    // Enviar pulso de permanencia cada 30 segundos
    const pulseInterval = setInterval(async () => {
      const secondsElapsed = Math.max(1, Math.round((Date.now() - trackingStartRef.current) / 1000))
      await sendPortfolioTrackingPulse(visitId, secondsElapsed)
    }, 30000);

    // Limpiar el intervalo cuando el usuario cambia de página
    return () => clearInterval(pulseInterval);
  }, [visitId]);

  useEffect(() => {
    const publicSlug = portfolio?.config?.slug ?? slug

    if (loading || !publicSlug || recordedViewRef.current === String(publicSlug)) {
      return
    }

    recordedViewRef.current = String(publicSlug)
    recordPortfolioView(String(publicSlug))
  }, [loading, portfolio, slug])

  const handleProjectClick = async (projectId?: string | number) => {
    if (!projectId) return

    const clickedProject = (portfolio?.projects ?? []).find((project: any) => sameProjectId(project, projectId))

    if (clickedProject) {
      setSelectedProject(clickedProject)
    }

    if (!visitId) return
    await recordProjectClick({ visitId, projectId })
  };

  const handleSocialClick = async (network: any) => {
    const networkName = getNetworkName(network)
    if (!networkName || !visitId) return
    await recordSocialClick({ visitId, networkName })
  }

  const handleExperienceClick = (experienceId?: string | number) => {
    const clickedExperience = (portfolio?.experiences ?? []).find((experience: any) => sameRecordId(experience, experienceId))

    if (clickedExperience) {
      setSelectedExperience(clickedExperience)
    }
  }

  const handleEducationClick = (educationId?: string | number) => {
    const clickedEducation = (portfolio?.educations ?? []).find((education: any) => sameRecordId(education, educationId))

    if (clickedEducation) {
      setSelectedEducation(clickedEducation)
    }
  }

  const handleProjectLinkClick = (linkType: "repository" | "demo", url: string) => {
    if (!selectedProject?.id || !visitId || !url) return

    void recordProjectLinkClick({
      visitId,
      projectId: selectedProject.id,
      linkType,
    })
  }

  const handleOpenMessageModal = () => {
    const portfolioOwnerId = getPortfolioRecipientId(portfolio)

    if (!portfolioOwnerId) {
      setMessageFeedback("No se pudo identificar al destinatario del mensaje.")
      return
    }

    if (session?.user?.id != null && String(session.user.id) === String(portfolioOwnerId)) {
      setMessageFeedback("No puedes enviarte un mensaje a ti mismo.")
      return
    }

    setMessageFeedback("")
    setIsMessageModalOpen(true)
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#003A6C]">
        {backButton}
        <div className="animate-pulse">Cargando portafolio...</div>
      </div>
    )
  }

  if (portfolio && portfolio.config?.is_public === false) {
    return (
      <div className="flex h-screen items-center justify-center">
        {backButton}
        <p className="text-gray-500 text-lg font-medium">
          Este portafolio no está disponible.
        </p>
      </div>
    )
  }
  if (!portfolio) {
    return (
      <div className="flex h-screen items-center justify-center">
        {backButton}
        <p className="text-gray-500">Este portafolio no está disponible.</p>
      </div>
    )
  }

  const template = portfolio.config?.template ?? portfolio.template;
  const isModern = template === 1
  const isMinimalist = template === 2
  const isCorporate = template === 3
  const modalTheme = isModern
    ? PROJECT_MODAL_THEMES.modern
    : isMinimalist
      ? PROJECT_MODAL_THEMES.minimalist
      : isCorporate
        ? PROJECT_MODAL_THEMES.corporate
        : PROJECT_MODAL_THEMES.default
  const visiblePortfolio = {
    ...portfolio,
    projects: (portfolio.projects ?? []).filter((item: any) => asBoolean(item.is_public)),
    skills: (portfolio.skills ?? []).filter((item: any) => asBoolean(item.is_public)),
    experiences: (portfolio.experiences ?? []).filter((item: any) => item.type !== "academica" && asBoolean(item.is_public)),
    educations: (portfolio.educations ?? []).filter((item: any) => asBoolean(item.is_public)),
    certificates: (portfolio.certificates ?? []).filter((item: any) => asBoolean(item.is_public)),
    socialNetworks: (portfolio.socialNetworks ?? []).filter((item: any) => asBoolean(item.is_public)),
  }
  //const visibilityData = mapToVisibilityData(portfolio)
  const profile = {
    fullname: portfolio.profile?.name || portfolio.user?.fullname || "",
    occupation: portfolio.profile?.occupation || portfolio.user?.occupation || "",
    image_url: portfolio.profile?.image || portfolio.user?.image_url || "",
    residence: portfolio.profile?.nacionality || portfolio.user?.nationality || "",
    public_email: portfolio.profile?.email || portfolio.user?.public_email || "",
    phone: portfolio.profile?.phone || "",
    biography: portfolio.profile?.bio || portfolio.user?.biography || "",
  };
  const recipientName = profile.fullname || portfolio.user?.fullname || portfolio.user?.username || "este usuario"
  const recipientId = getPortfolioRecipientId(portfolio)
  const portfolioSlug = String(portfolio.config?.slug ?? slug ?? "")
  const selectedProjectDescription = selectedProject ? getProjectDescription(selectedProject) : ""
  const selectedProjectRole = selectedProject ? getProjectRole(selectedProject) : ""
  const selectedProjectStartDate = selectedProject ? getProjectStartDate(selectedProject) : ""
  const selectedProjectEndDate = selectedProject ? getProjectEndDate(selectedProject) : ""
  const selectedProjectTechnologies = selectedProject ? getProjectTechnologies(selectedProject) : []
  const selectedProjectGithubUrl = selectedProject ? getProjectGithubUrl(selectedProject) : ""
  const selectedProjectDemoUrl = selectedProject ? getProjectDemoUrl(selectedProject) : ""
  const selectedProjectHasDates = Boolean(
    selectedProjectStartDate ||
    selectedProjectEndDate ||
    (selectedProject && isProjectCurrent(selectedProject)),
  )

  return (
    <main className="flex-1 p-4 md:p-10">
      {backButton}
      <button
        type="button"
        onClick={handleOpenMessageModal}
        className="fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#00457A] text-white shadow-xl shadow-black/25 transition hover:bg-[#003A6C] focus:outline-none focus:ring-4 focus:ring-[#6DACBF]/40"
        aria-label={`Enviar mensaje a ${recipientName}`}
        title={`Enviar mensaje a ${recipientName}`}
      >
        <MessageCircle className="h-8 w-8" />
      </button>

      {messageFeedback ? (
        <div className="fixed bottom-24 right-5 z-40 max-w-[min(24rem,calc(100vw-2.5rem))] rounded-xl border border-[#6DACBF]/40 bg-white px-4 py-3 text-sm font-semibold text-[#003A6C] shadow-xl">
          {messageFeedback}
        </div>
      ) : null}

      {isModern && <ModernTemplate 
      //data={visibilityData} 
      profile={profile} portfolio={visiblePortfolio} onProjectClick={handleProjectClick} onExperienceClick={handleExperienceClick} onEducationClick={handleEducationClick} onSocialClick={handleSocialClick} />}

      {isMinimalist && <MinimalistTemplate 
      //data={visibilityData} 
      profile={profile} portfolio={visiblePortfolio} isPreview={false} onProjectClick={handleProjectClick} onExperienceClick={handleExperienceClick} onEducationClick={handleEducationClick} onSocialClick={handleSocialClick} />}

      {isCorporate && <CorporatePortfolioTemplate 
      //data={visibilityData} 
      profile={profile} portfolio={visiblePortfolio} onProjectClick={handleProjectClick} onExperienceClick={handleExperienceClick} onEducationClick={handleEducationClick} onSocialClick={handleSocialClick} />}

      {!isModern && !isMinimalist && !isCorporate && (
        <div className="max-w-6xl mx-auto bg-white shadow-lg border-t-8 border-[#003A6C] p-8 md:p-10">
          <header className="text-center border-b pb-6 mb-8">
            <div className="flex justify-center mb-4">
              {portfolio.user.image_url ? (
                <img
                  src={portfolio.user.image_url}
                  alt={portfolio.user.fullname}
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#003A6C]"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  Sin foto
                </div>
              )}
            </div>

            <h1 className="text-4xl font-serif font-bold uppercase">{portfolio.user.fullname}</h1>

            <p className="text-[#003A6C] mt-2 font-medium">
              {portfolio.user.occupation || "Profesión no especificada"}
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Mail size={16} /> {portfolio.user.public_email}
              </span>

              <span className="flex items-center gap-1">
                <MapPin size={16} /> {portfolio.user.nationality}
              </span>

              {visiblePortfolio.socialNetworks?.map((sn: any, index: number) => (
                <span key={index} className="flex items-center gap-1">
                  <SocialNetworkIcon network={sn} className="h-4 w-4" /> {getSocialNetworkDisplayName(sn)}
                </span>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <aside className="space-y-8">
              <div>
                <h3 className="font-bold uppercase border-b pb-2">Sobre mí</h3>
                <p className="text-sm text-gray-600 mt-3">{portfolio.user.biography}</p>
              </div>

              {visiblePortfolio.skills.length > 0 ? (
              <div>
                <h3 className="font-bold uppercase border-b pb-2">Habilidades</h3>

                <div className="mt-3 flex flex-col gap-2">
                  {visiblePortfolio.skills.map((skill: any, index:number) => (
                      <div key={index} className="text-sm text-gray-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#003A6C] rounded-full" />
                        <span className="font-medium">{skill.name}</span>
                        {"level" in skill && skill.level && (
                          <span className="text-xs text-gray-400">({skill.level})</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
              ) : null}
            </aside>

            <section className="md:col-span-2 space-y-10">
              {visiblePortfolio.experiences.length > 0 ? (
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold uppercase">
                  <Briefcase size={18} /> Experiencia
                </h3>

                <div className="mt-6 space-y-6">
                  {visiblePortfolio.experiences.map((exp: any, index: number) => (
                      <div
                        key={index}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer border-l-2 pl-4 transition hover:border-[#003A6C] hover:bg-[#EEF5F9]/60 focus:outline-none focus:ring-2 focus:ring-[#003A6C]"
                        onClick={() => handleExperienceClick(exp.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            handleExperienceClick(exp.id)
                          }
                        }}
                      >
                        <p className="font-bold">{exp.company || exp.company_name || "Empresa no especificada"}</p>
                        <p className="text-[#003A6C] text-sm">{exp.position || exp.role || "Cargo no especificado"}</p>
                      </div>
                    ))}
                </div>
              </div>
              ) : null}

              {visiblePortfolio.educations.length > 0 ? (
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold uppercase">
                  <GraduationCap size={18} /> Formacion academica
                </h3>

                <div className="mt-6 space-y-6">
                  {visiblePortfolio.educations.map((education: any, index: number) => (
                    <div
                      key={index}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer border-l-2 pl-4 transition hover:border-[#003A6C] hover:bg-[#EEF5F9]/60 focus:outline-none focus:ring-2 focus:ring-[#003A6C]"
                      onClick={() => handleEducationClick(education.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          handleEducationClick(education.id)
                        }
                      }}
                    >
                      <p className="font-bold">{education.institution || education.institution_name || "Institucion no especificada"}</p>
                      <p className="text-[#003A6C] text-sm">{education.title || education.degree || "Formacion no especificada"}</p>
                    </div>
                  ))}
                </div>
              </div>
              ) : null}

              {visiblePortfolio.projects.length > 0 ? (
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold uppercase">
                  <Code size={18} /> Proyectos
                </h3>

                <div className="mt-6 flex flex-wrap gap-4">
                  {visiblePortfolio.projects.map((project: any, index: number) => (
                    <div 
                      key={index} 
                      role="button"
                      tabIndex={0}
                      className="w-full cursor-pointer bg-gray-50 border-l-4 border-[#003A6C] p-4 transition hover:bg-[#EEF5F9] focus:outline-none focus:ring-2 focus:ring-[#003A6C] sm:w-auto sm:min-w-64 sm:max-w-sm"
                      onClick={() => handleProjectClick(project.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          void handleProjectClick(project.id)
                        }
                      }}
                    >
                      <h4 className="font-bold text-sm uppercase">
                        {project.name || project.title || project.nombre || "Proyecto sin titulo"}
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        {project.project_rol || project.role || project.rol || "Rol no especificado"}
                      </p>

                      {getProjectTechnologies(project).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {getProjectTechnologies(project).map((technology) => (
                            <span key={technology} className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {technology}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              ) : null}
            </section>
          </div>
        </div>
      )}

      {selectedProject ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
          <div className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl shadow-2xl sm:max-h-[88vh] sm:w-[min(92vw,40rem)] sm:rounded-2xl ${modalTheme.panel}`}>
            <div className={`sticky top-0 z-10 flex items-start justify-between gap-3 border-b px-4 py-4 sm:gap-4 sm:px-5 ${modalTheme.header}`}>
              <div className="min-w-0">
                <p className={`text-xs font-bold uppercase tracking-[0.24em] ${modalTheme.eyebrow}`}>Detalle de proyecto</p>
                <h2 className={`mt-1 break-words text-xl font-bold leading-tight sm:text-2xl ${modalTheme.title}`}>{getProjectTitle(selectedProject)}</h2>
                {selectedProjectRole ? (
                  <p className={`mt-1 text-sm font-semibold ${modalTheme.role}`}>{selectedProjectRole}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className={`shrink-0 rounded-full p-2 transition ${modalTheme.closeButton}`}
                aria-label="Cerrar detalle de proyecto"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {getProjectImage(selectedProject) ? (
              <img
                src={getProjectImage(selectedProject)}
                alt={getProjectTitle(selectedProject)}
                className="h-44 w-full object-cover sm:h-64"
              />
            ) : null}

            <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
              {selectedProjectDescription ? (
                <section>
                  <h3 className={`text-sm font-bold uppercase tracking-[0.16em] ${modalTheme.sectionTitle}`}>Descripcion</h3>
                  <p className={`mt-2 whitespace-pre-line text-sm leading-6 ${modalTheme.text}`}>{selectedProjectDescription}</p>
                </section>
              ) : null}

              {(selectedProjectHasDates || selectedProjectTechnologies.length > 0) ? (
                <div className="flex flex-wrap gap-3">
                  {selectedProjectHasDates ? (
                    <div className={`w-full min-w-0 rounded-xl border p-4 sm:w-auto sm:min-w-52 sm:max-w-full sm:p-5 ${modalTheme.infoCard}`}>
                      <div className={`flex items-center gap-2 text-sm font-bold ${modalTheme.iconText}`}>
                        <Calendar className="h-4 w-4" />
                        Fechas
                      </div>
                      <p className={`mt-2 text-sm ${modalTheme.text}`}>
                        {[
                          selectedProjectStartDate,
                          selectedProject && isProjectCurrent(selectedProject) ? "En curso" : selectedProjectEndDate,
                        ].filter(Boolean).join(" - ")}
                      </p>
                    </div>
                  ) : null}

                  {selectedProjectTechnologies.length > 0 ? (
                    <div className={`w-full min-w-0 rounded-xl border p-4 sm:w-auto sm:min-w-56 sm:max-w-full sm:p-5 ${modalTheme.infoCard}`}>
                      <div className={`flex items-center gap-2 text-sm font-bold ${modalTheme.iconText}`}>
                        <Code className="h-4 w-4" />
                        Tecnologias
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedProjectTechnologies.map((technology) => (
                          <span key={technology} className={`rounded-full px-3 py-1 text-xs font-semibold ${modalTheme.tag}`}>
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {(selectedProjectGithubUrl || selectedProjectDemoUrl) ? (
                <div className="grid gap-3 sm:flex sm:flex-wrap">
                  {selectedProjectGithubUrl ? (
                    <a
                      href={selectedProjectGithubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleProjectLinkClick("repository", selectedProjectGithubUrl)}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition sm:w-auto ${modalTheme.primaryLink}`}
                    >
                      <GitBranch className="h-4 w-4" />
                      Repositorio
                    </a>
                  ) : null}

                  {selectedProjectDemoUrl ? (
                    <a
                      href={selectedProjectDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleProjectLinkClick("demo", selectedProjectDemoUrl)}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition sm:w-auto ${modalTheme.secondaryLink}`}
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
      ) : null}

      {selectedExperience ? (
        <DetailRecordModal
          kind="experience"
          record={selectedExperience}
          theme={modalTheme}
          onClose={() => setSelectedExperience(null)}
        />
      ) : null}

      {selectedEducation ? (
        <DetailRecordModal
          kind="education"
          record={selectedEducation}
          theme={modalTheme}
          onClose={() => setSelectedEducation(null)}
        />
      ) : null}

      {isMessageModalOpen ? (
        <PortfolioMessageModal
          recipientName={recipientName}
          recipientId={recipientId}
          portfolioSlug={portfolioSlug}
          isGuest={isGuestVisitor}
          onClose={() => setIsMessageModalOpen(false)}
          onSent={() => {
            setIsMessageModalOpen(false)
            setMessageFeedback("Mensaje enviado correctamente.")
          }}
        />
      ) : null}
    </main>
  )
}

export default PublicPortfolio
