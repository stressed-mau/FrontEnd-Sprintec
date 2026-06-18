import { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { usePortfolio } from "@/hooks/usePortfolio"
import MinimalistTemplate from "@/components/templates/minimalist/MinimalistTemplate"
import ModernTemplate from "@/components/templates/modern/ModernTemplate"
import { CorporatePortfolioTemplate } from "@/components/templates/corporate/CorporatePortfolioTemplate"
import { PublicPortfolioMessageControls } from "@/components/portfolio/PublicPortfolioMessageControls"
import ProjectDetailModal from "@/components/portfolio/ProjectDetailModal";
import DetailRecordModal from "@/components/portfolio/DetailRecordModal"
import CertificateDetailModal from "@/components/portfolio/CertificateDetailModal"
import { usePublicPortfolioMessageAccess } from "@/hooks/usePublicPortfolioMessageAccess"
import { usePublicPortfolioTracking } from "@/hooks/usePublicPortfolioTracking"
import {
  asBoolean,
  sameProjectId,
  sameRecordId,
  getPortfolioRecipientId,
  PROJECT_MODAL_THEMES, 
} from "@/utils/publicPortfolioUtils"
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
  id?: string | number
  is_public?: boolean
}
interface Experience extends BaseItem {
  type?: string
}
interface Portfolio {
  config?: {
    slug?: string
    template?: string | number
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
    fullname?: string
    name?: string
    occupation?: string
    image?: string
    image_url?: string
    nacionality?: string
    nationality?: string
    email?: string
    public_email?: string
    phone?: string
    phone_number?: string
    bio?: string
    biography?: string
  }
  user?: {
    fullname?: string
    occupation?: string
    image_url?: string
    nationality?: string
    public_email?: string
    phone_number?: string
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
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<PortfolioExperience | null>(null)
  const [selectedEducation, setSelectedEducation] = useState<PortfolioEducation | null>(null)
  const [selectedCertificate, setSelectedCertificate] = useState<BaseItem | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [messageFeedback, setMessageFeedback] = useState("")
  const fromExplore = Boolean((location.state as { fromExplore?: boolean } | null)?.fromExplore)
  const messageAccess = usePublicPortfolioMessageAccess(portfolio)
  const portfolioTracking = usePublicPortfolioTracking({ portfolio, slug, loading, visitId })
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
  const handleProjectClick = async (projectId?: string | number) => {
    if (!projectId) return
    const clickedProject = (portfolio?.projects ?? []).find((project) => sameProjectId(project, projectId))
    if (clickedProject) {
      setSelectedProject(clickedProject)
    }
    await portfolioTracking.trackProjectClick(projectId)
  };
  const handleSocialClick = async (network: unknown) => {
    await portfolioTracking.trackSocialClick(network)
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
    portfolioTracking.trackProjectLinkClick(selectedProject?.id, linkType, url)
  }
  const handleCertificateClick = (certificateId?: string | number) => {
    const clickedCertificate = (portfolio?.certificates ?? []).find((certificate: BaseItem) => certificateId != null && String(certificate.id) === String(certificateId))
    if (clickedCertificate) {
      setSelectedCertificate(clickedCertificate)
    }
  }
  const handleOpenMessageModal = () => {
    const accessError = messageAccess.getMessageAccessError()
    if (accessError) {
      setMessageFeedback(accessError)
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
  const template = Number(portfolio.config?.template ?? portfolio.template ?? 0);
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
    fullname: portfolio.profile?.name || portfolio.profile?.fullname || portfolio.user?.fullname || "",
    occupation: portfolio.profile?.occupation || portfolio.user?.occupation || "",
    image_url: portfolio.profile?.image || portfolio.profile?.image_url || portfolio.user?.image_url || "",
    residence: portfolio.profile?.nacionality || portfolio.profile?.nationality || portfolio.user?.nationality || "",
    nationality: portfolio.profile?.nacionality || portfolio.profile?.nationality || portfolio.user?.nationality || "",
    public_email: portfolio.profile?.email || portfolio.profile?.public_email || portfolio.user?.public_email || "",
    phone: portfolio.profile?.phone || portfolio.profile?.phone_number || portfolio.user?.phone_number || "",
    phone_number: portfolio.profile?.phone || portfolio.profile?.phone_number || portfolio.user?.phone_number || "",
    biography: portfolio.profile?.bio || portfolio.profile?.biography || portfolio.user?.biography || "",
  };
  const recipientName = profile.fullname || portfolio.user?.fullname || portfolio.user?.username || "este usuario"
  const recipientId = getPortfolioRecipientId(portfolio)
  const portfolioSlug = String(portfolio.config?.slug ?? slug ?? "")
  return (
    <main className="flex-1 p-4 md:p-10">
      {backButton}
      <PublicPortfolioMessageControls
        recipientName={recipientName}
        recipientId={recipientId}
        portfolioSlug={portfolioSlug}
        isGuest={messageAccess.isGuestMessage}
        messageFeedback={messageFeedback}
        isMessageModalOpen={isMessageModalOpen}
        onOpen={handleOpenMessageModal}
        onClose={() => setIsMessageModalOpen(false)}
        onSent={() => {
          setIsMessageModalOpen(false)
          setMessageFeedback("Mensaje enviado correctamente.")
        }}
      />
      {isModern && <ModernTemplate 
      profile={profile} portfolio={visiblePortfolio} onProjectClick={handleProjectClick} onExperienceClick={handleExperienceClick} onEducationClick={handleEducationClick} onCertificateClick={handleCertificateClick} onSocialClick={handleSocialClick} />}
      {isMinimalist && <MinimalistTemplate 
      profile={profile} portfolio={visiblePortfolio} isPreview={false} onProjectClick={handleProjectClick} onExperienceClick={handleExperienceClick} onEducationClick={handleEducationClick} onCertificateClick={handleCertificateClick} onSocialClick={handleSocialClick} />}
      {isCorporate && <CorporatePortfolioTemplate 
      profile={profile} portfolio={visiblePortfolio} onProjectClick={handleProjectClick} onExperienceClick={handleExperienceClick} onEducationClick={handleEducationClick} onCertificateClick={handleCertificateClick} onSocialClick={handleSocialClick} />}
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
      {selectedCertificate ? (
        <CertificateDetailModal
          certificate={selectedCertificate}
          theme={modalTheme}
          onClose={() => setSelectedCertificate(null)}
        />
      ) : null}
    </main>
  )
}
export default PublicPortfolio
