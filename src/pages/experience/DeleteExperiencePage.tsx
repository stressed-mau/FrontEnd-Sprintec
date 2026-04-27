import { useEffect, useMemo, useState } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ExperiencePageShell,
  ExperiencePagination,
  ExperienceSearch,
  ExperienceTable,
  FeedbackMessage,
} from "@/pages/experience/ExperiencePageParts"
import { filterExperiences, paginateExperiences } from "@/pages/experience/ExperiencePageUtils"
import { useExperienceManager } from "@/hooks/useExperienceManager"

export default function DeleteExperiencePage() {
  const manager = useExperienceManager()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const [isDeleting, setIsDeleting] = useState(false)

  const experiences = manager.laboralExperiences
  const filteredExperiences = useMemo(() => filterExperiences(experiences, searchTerm), [experiences, searchTerm])
  const pagination = paginateExperiences(filteredExperiences, currentPage)

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  useEffect(() => {
    setSelectedIds((current) => new Set([...current].filter((id) => experiences.some((experience) => experience.id === id))))
  }, [experiences])

  function handleSelect(id: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current)

      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }

      return next
    })
  }

  function handleSelectAll(checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current)

      pagination.items.forEach((experience) => {
        if (checked) {
          next.add(experience.id)
        } else {
          next.delete(experience.id)
        }
      })

      return next
    })
  }

  async function handleDeleteSelected() {
    if (selectedIds.size === 0 || isDeleting) {
      return
    }

    const confirmed = window.confirm(`Eliminar ${selectedIds.size} experiencia(s) seleccionada(s)?`)

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setFeedbackMessage("")
    setFeedbackType("")

    try {
      for (const id of selectedIds) {
        await manager.handleDelete(id)
      }

      setFeedbackMessage(`${selectedIds.size} experiencia(s) eliminada(s) correctamente.`)
      setFeedbackType("success")
      setSelectedIds(new Set())
      await manager.reloadExperiences()
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "No se pudieron eliminar las experiencias.")
      setFeedbackType("error")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ExperiencePageShell
      title="Eliminar experiencia"
      description={
        selectedIds.size > 0
          ? `${selectedIds.size} experiencia(s) seleccionada(s).`
          : "Selecciona una o varias experiencias para eliminarlas."
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          {experiences.length > 0 ? <ExperienceSearch value={searchTerm} onChange={handleSearchChange} /> : null}
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDeleteSelected}
          disabled={selectedIds.size === 0 || isDeleting}
          className="h-11 bg-[#B42318] px-5 text-white hover:bg-[#8F1C14]"
        >
          <Trash2 className="mr-2 size-4" />
          {isDeleting ? "Eliminando..." : `Eliminar (${selectedIds.size})`}
        </Button>
      </div>

      <FeedbackMessage message={feedbackMessage || manager.pageError} type={feedbackType || "error"} />

      {manager.isLoading ? (
        <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-10 text-center text-sm text-[#4B778D] shadow-sm">
          Cargando experiencias...
        </div>
      ) : (
        <ExperienceTable
          experiences={pagination.items}
          emptyMessage={searchTerm ? "No se encontraron experiencias con ese criterio." : "No hay experiencias para eliminar."}
          searchTerm={searchTerm}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
        />
      )}

      <ExperiencePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={filteredExperiences.length}
        onPageChange={setCurrentPage}
      />
    </ExperiencePageShell>
  )
}
