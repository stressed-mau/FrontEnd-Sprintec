import { GraduationCap, Search } from "lucide-react"

import { EducationStatusBadge } from "@/components/education/EducationStatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import type { EducationItem } from "@/types/education"
import { formatEducationDate } from "@/utils/educationDateUtils"

interface EducationTableProps {
  education: EducationItem[]
  emptyMessage: string
  searchTerm?: string
  selectedIds?: Set<string>
  onSelect?: (id: string, checked: boolean) => void
  onSelectAll?: (checked: boolean) => void
  onRowClick?: (education: EducationItem) => void
}

export function EducationTable({ education, emptyMessage, searchTerm = "", ...props }: EducationTableProps) {
  return (
    <Card className="rounded-2xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
      <CardContent className="p-0">
        {education.length === 0 ? <EducationEmptyState emptyMessage={emptyMessage} searchTerm={searchTerm} /> : <EducationTableContent education={education} {...props} />}
      </CardContent>
    </Card>
  )
}

function EducationEmptyState({ emptyMessage, searchTerm }: { emptyMessage: string; searchTerm: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#D9EAF4] text-[#003A6C]">
        {searchTerm ? <Search className="size-7" /> : <GraduationCap className="size-7" />}
      </div>
      <p className="font-medium text-[#003A6C]">{emptyMessage}</p>
    </div>
  )
}

function EducationTableContent({ education, selectedIds, onSelect, onSelectAll, onRowClick }: Omit<EducationTableProps, "emptyMessage" | "searchTerm">) {
  const selectable = Boolean(selectedIds && onSelect)
  const currentSelectedIds = selectedIds ?? new Set<string>()
  const allSelected = Boolean(onSelectAll) && education.length > 0 && education.every((item) => currentSelectedIds.has(item.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        <EducationTableHead selectable={selectable} allSelected={allSelected} onSelectAll={onSelectAll} />
        <tbody className="divide-y divide-[#D9EAF4]">
          {education.map((item) => (
            <EducationRow key={item.id} education={item} selected={currentSelectedIds.has(item.id)} selectable={selectable} onSelect={onSelect} onRowClick={onRowClick} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EducationTableHead({ selectable, allSelected, onSelectAll }: { selectable: boolean; allSelected: boolean; onSelectAll?: (checked: boolean) => void }) {
  return (
    <thead className="bg-[#EEF5F9] text-left text-xs uppercase text-[#003A6C]">
      <tr>
        {selectable ? (
          <th className="w-12 px-4 py-3 font-semibold">
            {onSelectAll ? <input type="checkbox" checked={allSelected} onChange={(event) => onSelectAll(event.target.checked)} className="size-4 rounded-none border-[#A5D7E8]" aria-label="Seleccionar toda la formación académica visible" /> : <span>Sel.</span>}
          </th>
        ) : null}
        <th className="px-4 py-3 font-semibold">Institución académica</th>
        <th className="px-4 py-3 font-semibold">Nivel de formación</th>
        <th className="px-4 py-3 font-semibold">Área de estudio</th>
        <th className="px-4 py-3 font-semibold">Fecha de emisión</th>
        <th className="px-4 py-3 font-semibold">Estado</th>
      </tr>
    </thead>
  )
}

function EducationRow({ education, selected, selectable, onSelect, onRowClick }: {
  education: EducationItem
  selected: boolean
  selectable: boolean
  onSelect?: (id: string, checked: boolean) => void
  onRowClick?: (education: EducationItem) => void
}) {
  return (
    <tr onClick={() => onRowClick?.(education)} className={onRowClick ? "cursor-pointer transition hover:bg-[#EEF5F9]" : "transition hover:bg-[#F8FBFD]"}>
      {selectable ? <EducationSelectCell education={education} selected={selected} onSelect={onSelect} /> : null}
      <EducationIdentityCell education={education} />
      <td className="px-4 py-4 text-sm text-[#355468]">{education.position}</td>
      <td className="px-4 py-4 text-sm text-[#355468]">{education.fieldOfStudy || "-"}</td>
      <td className="px-4 py-4 text-sm text-[#355468]">{education.endDate ? formatEducationDate(education.endDate) : "Actual"}</td>
      <td className="px-4 py-4"><EducationStatusBadge education={education} /></td>
    </tr>
  )
}

function EducationSelectCell({ education, selected, onSelect }: { education: EducationItem; selected: boolean; onSelect?: (id: string, checked: boolean) => void }) {
  return (
    <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
      <input type="checkbox" checked={selected} onChange={(event) => onSelect?.(education.id, event.target.checked)} className="size-4 rounded-none border-[#A5D7E8]" aria-label={`Seleccionar ${education.company}`} />
    </td>
  )
}

function EducationIdentityCell({ education }: { education: EducationItem }) {
  return (
    <td className="px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
          <GraduationCap className="size-5" />
        </div>
        <p className="font-medium text-[#003A6C]">{education.company}</p>
      </div>
    </td>
  )
}
