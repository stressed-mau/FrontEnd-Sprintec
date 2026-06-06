import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { usePortfolio } from "@/hooks/usePortfolio"
import MinimalistTemplate from "@/components/templates/MinimalistTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import { CorporatePortfolioTemplate } from "@/components/portfolio/CorporatePortfolioTemplate"
import { LOGIN_ROUTE } from "@/routes/route-paths"
import { getAuthSession, isAuthenticated } from "@/services/auth"
import PortfolioMessageModal from "@/components/portfolio/PortfolioMessageModal";
import ProjectDetailModal from "@/components/portfolio/ProjectDetailModal";
import DetailRecordModal from "@/components/portfolio/DetailRecordModal"
import {
  asBoolean,
  getNetworkName,
  sameProjectId,
  sameRecordId,
  getPortfolioRecipientId,
  PROJECT_MODAL_THEMES, 
} from "@/utils/PublicPortfolioUtils"
import {
  recordPortfolioView,
  recordProjectClick,
  recordProjectLinkClick,
  recordSocialClick,
  sendPortfolioTrackingPulse,
} from "@/services/portfolioAnalyticsService"
interface PortfolioProject {
  id: string | number
  is_public?: boolean
  [key: string]: unknown
}
interface PortfolioExperience {
  id: string | number
  type?: string
  is_public?: boolean
  [key: string]: unknown
}
interface PortfolioEducation {
  id: string | number
  is_public?: boolean
  [key: string]: unknown
}
interface BaseItem {
  is_public?: boolean
}
interface Experience extends BaseItem {
  type?: string
}
interface Portfolio {
  config?: {
    slug?: string
    template?: number
    is_public?: boolean
  }
  template?: number
  projects?: PortfolioProject[]
  skills?: BaseItem[]
  experiences?: PortfolioExperience[]
  educations?: PortfolioEducation[]
  certificates?: BaseItem[]
  socialNetworks?: BaseItem[]
  profile?: {
    name?: string
    occupation?: string
    image?: string
    nacionality?: string
    email?: string
    phone?: string
    bio?: string
  }
  user?: {
    fullname?: string
    occupation?: string
    image_url?: string
    nationality?: string
    public_email?: string
    biography?: string
    username?: string
  }
}
const PublicPortfolio = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { portfolio, loading, visitId } = usePortfolio(slug) as { portfolio: Portfolio | null
    loading: boolean
    visitId: string | null
  }
  const recordedViewRef = useRef<string | null>(null)
  const trackingStartRef = useRef<number>(Date.now())
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<PortfolioExperience | null>(null)
  const [selectedEducation, setSelectedEducation] = useState<PortfolioEducation | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [messageFeedback, setMessageFeedback] = useState("")
  const fromExplore = Boolean((location.state as { fromExplore?: boolean } | null)?.fromExplore)
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
      className="fixed left-4 top-4 z-40 inline-flex items-center gap-2 rounded-full border border-[#6DACBF]/35 bg-white/95 px-4 py-2 text-sm font-bold text-[#003A6C] shadow-lg shadow-black/10 backdrop-blur transition hover:bg-[#F7F0E1] focus:outline-none focus:ring-2 focus:ring-[#4982AD]/35">
      <ArrowLeft className="h-4 w-4" />
      Volver
    </button>
  )

  useEffect(() => {
    if (!visitId) return;
    trackingStartRef.current = Date.now()
    const pulseInterval = setInterval(async () => {
      const secondsElapsed = Math.max(1, Math.round((Date.now() - trackingStartRef.current) / 1000))
      await sendPortfolioTrackingPulse(visitId, secondsElapsed)
    }, 30000);
    return () => clearInterval(pulseInterval);
  }, [visitId]);

  useEffect(() => {
    const publicSlug = portfolio?.config?.slug ?? slug
    if (loading || !publicSlug || recordedViewRef.current === String(publicSlug)) {return}
    recordedViewRef.current = String(publicSlug)
    recordPortfolioView(String(publicSlug))
  }, [loading, portfolio, slug])

  const handleProjectClick = async (projectId?: string | number) => {
    if (!projectId) return
    const clickedProject = (portfolio?.projects ?? []).find((project) => sameProjectId(project, projectId))
    if (clickedProject) {
      setSelectedProject(clickedProject)
    }
    if (!visitId) return
    await recordProjectClick({ visitId, projectId })
  };
  const handleSocialClick = async (network: unknown) => {
    const networkName = getNetworkName(network)
    if (!networkName || !visitId) return
    await recordSocialClick({ visitId, networkName })
  }
  const handleExperienceClick = (experienceId?: string | number) => {
    const clickedExperience = (portfolio?.experiences ?? []).find((experience: unknown) => sameRecordId(experience, experienceId))
    if (clickedExperience) {
      setSelectedExperience(clickedExperience)
    }
  }
  const handleEducationClick = (educationId?: string | number) => {
    const clickedEducation = (portfolio?.educations ?? []).find((education: unknown) => sameRecordId(education, educationId))
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
    if (!isAuthenticated()) {
      navigate(LOGIN_ROUTE, { state: { from: location.pathname } })
      return
    }
    const session = getAuthSession()
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
    projects: (portfolio.projects ?? []).filter((item: BaseItem) => asBoolean(item.is_public)),
    skills: (portfolio.skills ?? []).filter((item: BaseItem) => asBoolean(item.is_public)),
    experiences: (portfolio.experiences ?? []).filter((item: Experience) => item.type !== "academica" && asBoolean(item.is_public)),
    educations: (portfolio.educations ?? []).filter((item: BaseItem) => asBoolean(item.is_public)),
    certificates: (portfolio.certificates ?? []).filter((item: BaseItem) => asBoolean(item.is_public)),
    socialNetworks: (portfolio.socialNetworks ?? []).filter((item: BaseItem) => asBoolean(item.is_public)),
  }
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
  return (
    <main className="flex-1 p-4 md:p-10">
      {backButton}
      <button
        type="button"
        onClick={handleOpenMessageModal}
        className="fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#00457A] text-white shadow-xl shadow-black/25 transition hover:bg-[#003A6C] focus:outline-none focus:ring-4 focus:ring-[#6DACBF]/40"
        aria-label={`Enviar mensaje a ${recipientName}`}
        title={`Enviar mensaje a ${recipientName}`}>
        <MessageCircle className="h-8 w-8" />
      </button>
      {messageFeedback ? (
        <div className="fixed bottom-24 right-5 z-40 max-w-[min(24rem,calc(100vw-2.5rem))] rounded-xl border border-[#6DACBF]/40 bg-white px-4 py-3 text-sm font-semibold text-[#003A6C] shadow-xl">
          {messageFeedback}
        </div>
      ) : null}
      {isModern && <ModernTemplate 
      profile={profile} portfolio={visiblePortfolio} onProjectClick={handleProjectClick} onExperienceClick={handleExperienceClick} onEducationClick={handleEducationClick} onSocialClick={handleSocialClick} />}
      {isMinimalist && <MinimalistTemplate 
      profile={profile} portfolio={visiblePortfolio} isPreview={false} onProjectClick={handleProjectClick} onExperienceClick={handleExperienceClick} onEducationClick={handleEducationClick} onSocialClick={handleSocialClick} />}
      {isCorporate && <CorporatePortfolioTemplate 
      profile={profile} portfolio={visiblePortfolio} onProjectClick={handleProjectClick} onExperienceClick={handleExperienceClick} onEducationClick={handleEducationClick} onSocialClick={handleSocialClick} />}
      <ProjectDetailModal
        project={selectedProject}
        theme={modalTheme}
        onClose={() => setSelectedProject(null)}
        onProjectLinkClick={handleProjectLinkClick}/>
      {selectedExperience ? (
        <DetailRecordModal
          kind="experience"
          record={selectedExperience}
          theme={modalTheme}
          onClose={() => setSelectedExperience(null)}/>
      ) : null}
      {selectedEducation ? (
        <DetailRecordModal
          kind="education"
          record={selectedEducation}
          theme={modalTheme}
          onClose={() => setSelectedEducation(null)}/>
      ) : null}
      {isMessageModalOpen ? (
        <PortfolioMessageModal
          recipientName={recipientName}
          recipientId={recipientId}
          portfolioSlug={portfolioSlug}
          onClose={() => setIsMessageModalOpen(false)}
          onSent={() => {
            setIsMessageModalOpen(false)
            setMessageFeedback("Mensaje enviado correctamente.")
          }}/>
      ) : null}
    </main>
  )
}
export default PublicPortfolio