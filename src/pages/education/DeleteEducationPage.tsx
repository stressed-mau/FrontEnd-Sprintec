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

export default function DeleteEducationPage() {
  const manager = useExperienceManager()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const [isDeleting, setIsDeleting] = useState(false)

  const education = manager.academicExperiences
  const filteredEducation = useMemo(() => filterExperiences(education, searchTerm), [education, searchTerm])
  const pagination = paginateExperiences(filteredEducation, currentPage)

  useEffect(() => {
    setSelectedIds((current) => new Set([...current].filter((id) => education.some((item) => item.id === id))))
  }, [education])

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

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

      pagination.items.forEach((item) => {
        if (checked) {
          next.add(item.id)
        } else {
          next.delete(item.id)
        }
      })

      return next
    })
  }

  async function handleDeleteSelected() {
    if (selectedIds.size === 0 || isDeleting) {
      return
    }

    const confirmed = window.confirm(`Eliminar ${selectedIds.size} formacion(es) seleccionada(s)?`)

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

      setFeedbackMessage(`${selectedIds.size} formacion(es) eliminada(s) correctamente.`)
      setFeedbackType("success")
      setSelectedIds(new Set())
      await manager.reloadExperiences()
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "No se pudo eliminar la formacion academica.")
      setFeedbackType("error")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ExperiencePageShell
      title="Eliminar formacion academica"
      description={
        selectedIds.size > 0
          ? `${selectedIds.size} formacion(es) seleccionada(s).`
          : "Selecciona una o varias formaciones para eliminarlas."
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          {education.length > 0 ? <ExperienceSearch value={searchTerm} onChange={handleSearchChange} /> : null}
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
          Cargando formacion academica...
        </div>
      ) : (
        <ExperienceTable
          experiences={pagination.items}
          emptyMessage={searchTerm ? "No se encontro formacion con ese criterio." : "No hay formacion academica para eliminar."}
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
        totalItems={filteredEducation.length}
        onPageChange={setCurrentPage}
      />
    </ExperiencePageShell>
  )
}
