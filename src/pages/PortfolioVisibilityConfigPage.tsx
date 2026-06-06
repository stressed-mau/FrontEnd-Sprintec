import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { Footer } from "@/components/Footer";
import Header from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { type SectionKey, type VisibilityItem,} from "@/services/portfolioVisibilityService";
import { usePortfolioVisibility } from "../hooks/usePortfolioVisibility";
import { usePublishPortfolio } from "../hooks/usePublishPortfolio";
import PublishedPortfolioWarning from "@/components/portfVisibilityConfig/PublishedPortfolioWarning";
import VisibilitySectionCard from "@/components/portfVisibilityConfig/VisibilitySectionCard";

const PORTFOLIO_VISIBILITY_SECTIONS = [
  { key: "projects", label: "Proyectos" },
  { key: "skills", label: "Habilidades" },
  { key: "experience", label: "Experiencia Laboral" },
  { key: "education", label: "Formación Académica" },
  { key: "certificates", label: "Certificados" },
  { key: "networks", label: "Redes profesionales" },
] as const;

const PortfolioVisibilityConfigPage = () => {
  const {
    data: visibilityData,
    isLoading,
    isSaving,
    pageError,
    handleItemCheck,
    handleBulkSelect,
  } = usePortfolioVisibility();

  const {
    isPublished,
    checkInitialStatus,
  } = usePublishPortfolio();

  const [expandedSections, setExpandedSections] =
    useState<Record<string, boolean>>({});

  useEffect(() => {
    void checkInitialStatus();
  }, []);

  const toggleExpand = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getVisibleStats = (key: SectionKey) => {
    const items: VisibilityItem[] =
      visibilityData ? visibilityData[key] : [];

    const total = items.length;
    const visible = items.filter((item) => item.checked).length;

    return `${visible} de ${total} visibles`;
  };

  if (isPublished) {
    return <PublishedPortfolioWarning />;
  }

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col font-sans">
      <Header />

      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />

        <div role="main" className="flex-1 p-4 md:p-10">
          <div className="mx-auto max-w-6xl space-y-6">

            <div className="mb-8">
              <h1 className="text-[#003A6C] text-3xl md:text-4xl font-bold mb-2">
                Configuración de Visibilidad
              </h1>

              <p className="text-sm text-[#4B778D] md:text-base">
                Elige qué elementos específicos mostrar en tu portafolio
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">

              {pageError && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {pageError}
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Settings className="w-5 h-5 text-[#003A6C]" />
                </div>

                <div>
                  <h2 className="text-[#003A6C] font-semibold text-lg">
                    Configuración de Visibilidad
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Elige qué elementos específicos mostrar en tu portafolio
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003A6C]" />
                </div>
              ) : (
                <div className="space-y-4">
                  {PORTFOLIO_VISIBILITY_SECTIONS.map(
                    ({ key, label }) => {
                      const items: VisibilityItem[] =
                        visibilityData
                          ? visibilityData[key]
                          : [];

                      const isExpanded =
                        expandedSections[key];

                      return (
                        <VisibilitySectionCard
                          key={key}
                          sectionKey={key}
                          label={label}
                          items={items}
                          isExpanded={!!isExpanded}
                          isSaving={isSaving}
                          visibleStats={getVisibleStats(key)}
                          onToggleExpand={toggleExpand}
                          onBulkSelect={handleBulkSelect}
                          onItemCheck={handleItemCheck}
                        />
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PortfolioVisibilityConfigPage;