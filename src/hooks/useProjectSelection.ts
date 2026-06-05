import { useState } from "react"

import type { ProjectItem } from "@/types/project"

export function useProjectSelection(visibleProjects: ProjectItem[]) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set())
  const selectedCount = selectedIds.size

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function handleToggleSelect(id: number, selected: boolean) {
    setSelectedIds((current) => updateSelectedId(current, id, selected))
  }

  function handleSelectAllVisible(selected: boolean) {
    setSelectedIds((current) => updateVisibleSelection(current, visibleProjects, selected))
  }

  return {
    clearSelection,
    handleSelectAllVisible,
    handleToggleSelect,
    selectedCount,
    selectedIds,
  }
}

function updateSelectedId(current: Set<number>, id: number, selected: boolean) {
  const next = new Set(current)
  if (selected) next.add(id)
  if (!selected) next.delete(id)
  return next
}

function updateVisibleSelection(current: Set<number>, projects: ProjectItem[], selected: boolean) {
  const next = new Set(current)
  projects.forEach((project) => updateVisibleProject(next, project.id, selected))
  return next
}

function updateVisibleProject(selectedIds: Set<number>, id: number, selected: boolean) {
  if (selected) selectedIds.add(id)
  if (!selected) selectedIds.delete(id)
}
