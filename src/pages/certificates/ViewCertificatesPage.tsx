import { useMemo, useState } from "react"

import { CertificateDetailsModal } from "@/components/certificates/CertificateDetailsModal"
import { useCertificatesManager, type Certificate } from "@/hooks/useCertificatesManager"
import { CertificatesSearch, CertificatesTable } from "@/pages/certificates/CertificatePageParts"
import {
  ExperiencePageShell,
  ExperiencePagination,
  FeedbackMessage,
} from "@/pages/experience/ExperiencePageParts"

export default function ViewCertificatesPage() {
  const manager = useCertificatesManager()
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

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
      title="Ver Certificados"
      description="Consulta los certificados y credenciales registrados en tu portafolio."
    >
      <FeedbackMessage message={manager.pageError} type="error" />

      {manager.certificates.length > 0 ? (
        <CertificatesSearch value={manager.searchTerm} onChange={handleSearchChange} />
      ) : null}

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando certificados...
        </div>
      ) : (
        <CertificatesTable
          certificates={manager.paginatedCertificates}
          emptyMessage={manager.searchTerm ? "No se encontraron certificados con ese criterio." : "No hay certificados registrados."}
          searchTerm={manager.searchTerm}
          onRowClick={setSelectedCertificate}
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

      <CertificateDetailsModal certificate={selectedCertificate} onClose={() => setSelectedCertificate(null)} />
    </ExperiencePageShell>
  )
}
