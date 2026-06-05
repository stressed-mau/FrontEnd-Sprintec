import { useMemo, useState } from "react"

import type { ExperienceItem } from "@/types/experience"

export function useExperienceSelection(experiences: ExperienceItem[], visibleExperiences: ExperienceItem[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const availableSelectedIds = useMemo(() => filterAvailableIds(selectedIds, experiences), [experiences, selectedIds])
  const selectedCount = availableSelectedIds.size

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function handleSelect(id: string, checked: boolean) {
    setSelectedIds((current) => updateSelectedId(current, id, checked))
  }

  function handleSelectAllVisible(checked: boolean) {
    setSelectedIds((current) => updateVisibleSelection(current, visibleExperiences, checked))
  }

  return { clearSelection, handleSelect, handleSelectAllVisible, selectedCount, selectedIds: availableSelectedIds }
}

function filterAvailableIds(current: Set<string>, experiences: ExperienceItem[]) {
  const availableIds = new Set(experiences.map((experience) => experience.id))
  const next = new Set(Array.from(current).filter((id) => availableIds.has(id)))
  return next.size === current.size ? current : next
}

function updateSelectedId(current: Set<string>, id: string, checked: boolean) {
  const next = new Set(current)
  if (checked) next.add(id)
  if (!checked) next.delete(id)
  return next
}

function updateVisibleSelection(current: Set<string>, experiences: ExperienceItem[], checked: boolean) {
  const next = new Set(current)
  experiences.forEach((experience) => {
    if (checked) next.add(experience.id)
    if (!checked) next.delete(experience.id)
  })
  return next
}
