import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Footer } from "@/components/Footer"
import { NetworkFeedback } from "@/components/networks/NetworkFeedback"
import { NetworkOAuthInfoCard } from "@/components/networks/NetworkOAuthInfoCard"
import { NetworkSuccessModal } from "@/components/networks/NetworkSuccessModal"
import { ProfessionalNetworksGrid } from "@/components/networks/ProfessionalNetworksGrid"
import { SectionHeader } from "@/components/sections/SectionHeader"
import { useNetworksManager } from "@/hooks/useNetworksManager"

const NetworksPage = () => {
  const manager = useNetworksManager()

  return (
    <div id="pagina-redes-profesionales" className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main id="contenido-principal-redes-profesionales" className="flex-1 p-4 sm:p-6 md:p-10">
          <div id="contenedor-redes-profesionales" className="mx-auto max-w-5xl space-y-8">
            <NetworksPageHeader />
            <NetworkOAuthInfoCard />
            <NetworkFeedback message={manager.feedbackMessage} type={manager.feedbackType} />
            <ProfessionalNetworksGrid
              networks={manager.connectedNetworks}
              isLoading={manager.isLoading}
              onConnect={manager.handleOAuthConnect}
              onDelete={manager.handleDelete}
            />
          </div>
        </main>
      </div>

      <Footer />
      <NetworkSuccessModal isOpen={manager.isSuccessModalOpen} message={manager.successMessage} onClose={manager.closeSuccessModal} />
    </div>
  )
}

function NetworksPageHeader() {
  return (
    <SectionHeader
      title="Enlazar Redes Profesionales"
      description="Enlaza tus perfiles profesionales de forma segura mediante OAuth"
      titleId="titulo-pagina-redes-profesionales"
      descriptionId="descripcion-pagina-redes-profesionales"
    />
  )
}

export default NetworksPage
