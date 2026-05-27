import { useMemo } from "react"
import { Trash2 } from "lucide-react"

import ConfirmationModal from "@/components/ConfirmationModal"
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal"
import { Button } from "@/components/ui/button"
import { useCertificatesManager } from "@/hooks/useCertificatesManager"
import { CertificatesSearch, CertificatesTable } from "@/pages/certificates/CertificatePageParts"
import {
  ExperiencePageShell,
  ExperiencePagination,
  FeedbackMessage,
} from "@/pages/experience/ExperiencePageParts"

export default function DeleteCertificatesPage() {
  const manager = useCertificatesManager()
  const selectedCount = manager.selectedCertificateIds.size

  const pagination = useMemo(() => {
    const startIndex = manager.filteredCertificates.length === 0 ? 0 : (manager.currentPage - 1) * manager.itemsPerPage
    const endIndex = startIndex + manager.paginatedCertificates.length

    return {
      startIndex,
      endIndex,
    }
  }, [manager.currentPage, manager.filteredCertificates.length, manager.itemsPerPage, manager.paginatedCertificates.length])

  function handleSearchChange(value: string) {
    manager.setSearchTerm(value)
  }

  return (
    <ExperiencePageShell
      title="Eliminar Certificados"
      description={
        selectedCount === 0
          ? "Selecciona uno o varios certificados para eliminarlos."
          : `${selectedCount} certificado${selectedCount > 1 ? "s" : ""} seleccionado${selectedCount > 1 ? "s" : ""}.`
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          {manager.certificates.length > 0 ? (
            <CertificatesSearch value={manager.searchTerm} onChange={handleSearchChange} />
          ) : null}
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={manager.requestDeleteSelected}
          disabled={selectedCount === 0 || manager.isDeleting}
          className="h-11 bg-[#B42318] px-5 text-white hover:bg-[#8F1C14]"
        >
          <Trash2 className="mr-2 size-4" />
          {manager.isDeleting ? "Eliminando..." : `Eliminar${selectedCount > 0 ? ` (${selectedCount})` : ""}`}
        </Button>
      </div>

      <FeedbackMessage message={manager.errorMessage || manager.pageError} type="error" />

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando certificados...
        </div>
      ) : (
        <CertificatesTable
          certificates={manager.paginatedCertificates}
          emptyMessage={manager.searchTerm ? "No se encontraron certificados con ese criterio." : "No hay certificados para eliminar."}
          searchTerm={manager.searchTerm}
          selectedIds={manager.selectedCertificateIds}
          onSelect={(id) => manager.toggleSelectCertificate(id)}
          onSelectAll={() => manager.toggleSelectAllCertificates(manager.paginatedCertificates.map((certificate) => certificate.id))}
        />
      )}

      <ExperiencePagination
        currentPage={manager.currentPage}
        totalPages={manager.totalPages}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={manager.filteredCertificates.length}
        onPageChange={manager.setCurrentPage}
      />

      <DeleteConfirmationModal
        isOpen={manager.showConfirmDelete}
        title={
          manager.certificateToDelete
            ? "¿Está seguro de que desea eliminar este certificado?"
            : `¿Está seguro de que desea eliminar ${selectedCount > 1 ? "estos certificados" : "este certificado"}?`
        }
        message="Esta acción no se puede deshacer."
        isLoading={manager.isDeleting}
        onConfirm={() => void manager.confirmDelete()}
        onCancel={manager.cancelDelete}
      />

      <ConfirmationModal
        isOpen={manager.showSuccessModal}
        title="Exito"
        message={manager.successMessage}
        buttonText="Aceptar"
        onClose={manager.closeSuccessModal}
      />
    </ExperiencePageShell>
  )
}
