import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Footer } from "@/components/Footer"
import { NetworkFeedback } from "@/components/networks/NetworkFeedback"
import { NetworkOAuthInfoCard } from "@/components/networks/NetworkOAuthInfoCard"
import { NetworkSuccessModal } from "@/components/networks/NetworkSuccessModal"
import { ProfessionalNetworksGrid } from "@/components/networks/ProfessionalNetworksGrid"
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 id="titulo-pagina-redes-profesionales" className="mb-2 text-3xl font-bold text-[#111827]">
          Enlazar Redes Profesionales
        </h1>
        <p id="descripcion-pagina-redes-profesionales" className="text-sm text-gray-600 sm:text-base">
          Enlaza tus perfiles profesionales de forma segura mediante OAuth
        </p>
      </div>
    </div>
  )
}

export default NetworksPage
