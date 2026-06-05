import { useMemo, useState } from "react"

import type { EducationItem } from "@/types/education"

export function useEducationSelection(education: EducationItem[], visibleEducation: EducationItem[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const availableSelectedIds = useMemo(() => filterAvailableIds(selectedIds, education), [education, selectedIds])
  const selectedCount = availableSelectedIds.size

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function handleSelect(id: string, checked: boolean) {
    setSelectedIds((current) => updateSelectedId(current, id, checked))
  }

  function handleSelectAllVisible(checked: boolean) {
    setSelectedIds((current) => updateVisibleSelection(current, visibleEducation, checked))
  }

  return { clearSelection, handleSelect, handleSelectAllVisible, selectedCount, selectedIds: availableSelectedIds }
}

function filterAvailableIds(current: Set<string>, education: EducationItem[]) {
  const availableIds = new Set(education.map((item) => item.id))
  const next = new Set(Array.from(current).filter((id) => availableIds.has(id)))
  return next.size === current.size ? current : next
}

function updateSelectedId(current: Set<string>, id: string, checked: boolean) {
  const next = new Set(current)
  if (checked) next.add(id)
  if (!checked) next.delete(id)
  return next
}

function updateVisibleSelection(current: Set<string>, education: EducationItem[], checked: boolean) {
  const next = new Set(current)
  education.forEach((item) => {
    if (checked) next.add(item.id)
    if (!checked) next.delete(item.id)
  })
  return next
}
