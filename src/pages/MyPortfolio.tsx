import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/HeaderUser"
import Sidebar from "../components/Sidebar"
import { usePortfolio } from "@/hooks/usePortfolio"
import type { PortfolioVisibilityData } from "@/services/portfolioVisibilityService"
import MinimalistTemplate from "@/components/templates/minimalist/MinimalistTemplate"
import ModernTemplate from "@/components/templates/modern/ModernTemplate"
import { CorporatePortfolioTemplate } from "@/components/templates/corporate/CorporatePortfolioTemplate"
import ClassicPortfolioTemplate from "@/components/portfolio/ClassicPortfolioTemplate";
import { useUserPersonalData } from "@/hooks/useUserPersonalData"
import { asBoolean, mapToVisibilityData } from "@/utils/PortfolioVisibility";
import ProjectDetailModal from "@/components/portfolio/ProjectDetailModal"
import DetailRecordModal from "@/components/portfolio/DetailRecordModal"
import CertificateDetailModal from "@/components/portfolio/CertificateDetailModal"
import { PROJECT_MODAL_THEMES } from "@/utils/PublicPortfolioUtils"

type PortfolioItem = {
  id: string | number;
  is_public?: boolean;
};
type SelectedPortfolioDetail = {
  type: "project" | "experience" | "education" | "certificate";
  item: unknown;
} | null;

type ExperienceItem = PortfolioItem & {
  type?: string;
};
type EducationItem = PortfolioItem & {
  title?: string;
  position?: string;
  degree?: string;
  name?: string;
  label?: string;
  institution?: string;
  company?: string;
  company_name?: string;
  institution_name?: string;
  organization?: string;
  sublabel?: string;
};
const MyPortfolio = () => {
  const { slug } = useParams()
  const { portfolio, loading } = usePortfolio(slug)
  const { form, phoneNumber, countryCode } = useUserPersonalData()
  const [selectedDetail, setSelectedDetail] = useState<SelectedPortfolioDetail>(null)
  const visibilityData = useMemo<PortfolioVisibilityData | null>(() => (portfolio ? mapToVisibilityData(portfolio) : null), [portfolio])
    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#003A6C]">
        <div className="animate-pulse">Cargando portafolio...</div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">El portafolio no está disponible.</p>
      </div>
    )
  }
  if (!visibilityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando datos...</p>
      </div>
    )
  }
  const templateValue = 'template' in portfolio
    ? (portfolio as { template?: number }).template
    : portfolio.config?.template;
  const template = Number(templateValue) || 0;
  
  const isModern = template === 1;
  const isMinimalist = template === 2;
  const isCorporate = template === 3;
  const detailModalTheme = isModern
    ? "modern"
    : isMinimalist
      ? "minimalist"
      : isCorporate
        ? "corporate"
        : "default"
  const modalTheme = PROJECT_MODAL_THEMES[detailModalTheme]
  
  const profile = {
    fullname: form.fullName || "",
    occupation: form.occupation || "",
    image_url: form.image || "",
    residence: form.location || "",
    public_email: form.email || "",
    phone: phoneNumber ? `+${countryCode} ${phoneNumber}` : "",
    biography: form.bio || "",
  }
  const visibleSkills = visibilityData.skills.filter(s => s.checked)
  const visibleExperience = portfolio.experiences.filter((item: ExperienceItem) => item.type !== "academica" && asBoolean(item.is_public))
  const visibleProjects = portfolio.projects.filter((item: PortfolioItem) => asBoolean(item.is_public))
  const visibleEducation = visibilityData.education
    .filter(e => e.checked)
    .map((item) => {
      const source = portfolio.educations?.find(
        (education: EducationItem) =>
          String(education.id) === String(item.id)
      );
      return {
        ...item,
        label: source?.title || source?.position || source?.degree || source?.name || source?.label || item.label,
        sublabel:
          source?.institution ||
          source?.company ||
          source?.company_name ||
          source?.institution_name ||
          source?.organization ||
          source?.sublabel ||
          item.sublabel,
      }
    })
  const visibleCertificates = visibilityData.certificates.filter(c => c.checked)
  const visibleNetworks = visibilityData.networks.filter(n => n.checked)
  const visiblePortfolio = {
    ...portfolio,

    projects: portfolio.projects.filter(
      (item: { id: string | number; is_public?: boolean }) =>
        asBoolean(item.is_public)
    ),

    skills: portfolio.skills.filter(
      (item: { id: string | number; is_public?: boolean }) =>
        asBoolean(item.is_public)
    ),

    experiences: portfolio.experiences.filter(
      (item: { id: string | number; is_public?: boolean; type?: string }) =>
        item.type !== "academica" && asBoolean(item.is_public)
    ),

    educations:
      portfolio.educations?.filter(
        (item: { id: string | number; is_public?: boolean }) =>
          asBoolean(item.is_public)
      ) ?? [],

    certificates:
      portfolio.certificates?.filter(
        (item: { id: string | number; is_public?: boolean }) =>
          asBoolean(item.is_public)
      ) ?? [],

    socialNetworks: portfolio.socialNetworks.filter(
      (item: { id: string | number; is_public?: boolean }) =>
        asBoolean(item.is_public)
    ),
  };
  const openProjectDetail = (projectId?: string | number) => {
    const project = visiblePortfolio.projects.find(
    (item: PortfolioItem) => String(item.id) === String(projectId));
    if (project) setSelectedDetail({ type: "project", item: project })
  }
  const openExperienceDetail = (experienceId?: string | number) => {
    const experience = visiblePortfolio.experiences.find((item: ExperienceItem) => String(item.id) === String(experienceId))
    if (experience) setSelectedDetail({ type: "experience", item: experience })
  }
  const openEducationDetail = (educationId?: string | number) => {
    const education = visiblePortfolio.educations.find((item: EducationItem) => String(item.id) === String(educationId))
    if (education) setSelectedDetail({ type: "education", item: education })
  }
  const openCertificateDetail = (certificateId?: string | number) => {
    const certificate = visiblePortfolio.certificates.find((item: PortfolioItem) => String(item.id) === String(certificateId))
    if (certificate) setSelectedDetail({ type: "certificate", item: certificate })
  }
  return (
    <div className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 md:p-10">
          {isModern && <ModernTemplate 
          //data={visibilityData} 
          profile={profile}
          portfolio={visiblePortfolio}
          onProjectClick={openProjectDetail}
          onExperienceClick={openExperienceDetail}
          onEducationClick={openEducationDetail}
          onCertificateClick={openCertificateDetail}
          />}

          {isMinimalist && <MinimalistTemplate 
            //data={visibilityData}           
            profile={profile} 
            portfolio={visiblePortfolio}
            isPreview={true} 
            onProjectClick={openProjectDetail}
            onExperienceClick={openExperienceDetail}
            onEducationClick={openEducationDetail}
            onCertificateClick={openCertificateDetail}
          />}

          {isCorporate && <CorporatePortfolioTemplate 
          //data={visibilityData} 
          profile={profile}
          portfolio={visiblePortfolio}
          onProjectClick={openProjectDetail}
          onExperienceClick={openExperienceDetail}
          onEducationClick={openEducationDetail}
          onCertificateClick={openCertificateDetail}
          />}

          {!isModern && !isMinimalist && !isCorporate && (
            <ClassicPortfolioTemplate
              profile={profile}
              visibleSkills={visibleSkills}
              visibleExperience={visibleExperience}
              visibleProjects={visibleProjects}
              visibleEducation={visibleEducation}
              visibleCertificates={visibleCertificates}
              visibleNetworks={visibleNetworks}
              onProjectClick={openProjectDetail}
              onExperienceClick={openExperienceDetail}
              onEducationClick={openEducationDetail}
            />
          )}
        </main>
      </div>
      {selectedDetail?.type === "project" ? (
        <ProjectDetailModal
          project={selectedDetail.item}
          theme={modalTheme}
          onClose={() => setSelectedDetail(null)}
          onProjectLinkClick={() => undefined}
        />
      ) : null}
      {selectedDetail?.type === "experience" ? (
        <DetailRecordModal
          kind="experience"
          record={selectedDetail.item}
          theme={modalTheme}
          onClose={() => setSelectedDetail(null)}
        />
      ) : null}
      {selectedDetail?.type === "education" ? (
        <DetailRecordModal
          kind="education"
          record={selectedDetail.item}
          theme={modalTheme}
          onClose={() => setSelectedDetail(null)}
        />
      ) : null}
      {selectedDetail?.type === "certificate" ? (
        <CertificateDetailModal
          certificate={selectedDetail.item}
          theme={modalTheme}
          onClose={() => setSelectedDetail(null)}
        />
      ) : null}
    </div>
  )
}
export default MyPortfolio
