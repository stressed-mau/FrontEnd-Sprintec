import { Plus } from "lucide-react"

import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { NetworkFormModal } from "@/components/networks/NetworkFormModal"
import { NetworksList } from "@/components/networks/NetworksList"
import { Button } from "@/components/ui/button"
import { useNetworksManager } from "@/hooks/useNetworksManager"

const NetworksPage = () => {
  const {
    networks,
    formData,
    errors,
    feedbackMessage,
    feedbackType,
    isModalOpen,
    isEditing,
    openCreateModal,
    openEditModal,
    closeModal,
    updateField,
    handleBlur,
    handleSubmit,
    handleDelete,
  } = useNetworksManager()

  return (
    <div className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-center sm:text-left">
                <h1 className="mb-2 text-3xl font-bold text-[#003A6C] md:text-4xl">Redes profesionales</h1>
                <p className="text-sm text-[#4B778D] md:text-base">
                  Gestiona los enlaces que aparecerán en tu portafolio público.
                </p>
              </div>

              <Button
                type="button"
                onClick={openCreateModal}
                className="h-11 bg-[#003A6C] px-5 text-white hover:bg-[#1a4f7a]"
              >
                <Plus className="mr-2 size-4" />
                Agregar enlace
              </Button>
            </div>

            {feedbackMessage ? (
              <div
                className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                  feedbackType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {feedbackMessage}
              </div>
            ) : null}

            <NetworksList networks={networks} onEdit={openEditModal} onDelete={handleDelete} />
          </div>
        </main>
      </div>

      {isModalOpen ? (
        <NetworkFormModal
          formData={formData}
          errors={errors}
          isEditing={isEditing}
          onClose={closeModal}
          onFieldChange={updateField}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  )
}

export default NetworksPage
