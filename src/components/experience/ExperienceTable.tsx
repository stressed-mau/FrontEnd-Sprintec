import { Briefcase, Search } from "lucide-react"

import { ExperienceStatusBadge } from "@/components/experience/ExperienceStatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { formatExperienceDate } from "@/hooks/useExperienceManager"
import type { ExperienceItem } from "@/types/experience"

type ExperienceTableProps = {
  experiences: ExperienceItem[]
  emptyMessage: string
  searchTerm?: string
  selectedIds?: Set<string>
  onSelect?: (id: string, checked: boolean) => void
  onSelectAll?: (checked: boolean) => void
  onRowClick?: (experience: ExperienceItem) => void
}

export function ExperienceTable({ experiences, emptyMessage, searchTerm = "", ...props }: ExperienceTableProps) {
  return (
    <Card className="rounded-2xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
      <CardContent className="p-0">
        {experiences.length === 0 ? <ExperienceEmptyState emptyMessage={emptyMessage} searchTerm={searchTerm} /> : <ExperienceTableContent experiences={experiences} {...props} />}
      </CardContent>
    </Card>
  )
}

function ExperienceEmptyState({ emptyMessage, searchTerm }: { emptyMessage: string; searchTerm: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#D9EAF4] text-[#003A6C]">
        {searchTerm ? <Search className="size-7" /> : <Briefcase className="size-7" />}
      </div>
      <p className="font-medium text-[#003A6C]">{emptyMessage}</p>
    </div>
  )
}

function ExperienceTableContent({ experiences, selectedIds, onSelect, onSelectAll, onRowClick }: Omit<ExperienceTableProps, "emptyMessage" | "searchTerm">) {
  const selectable = Boolean(selectedIds && onSelect)
  const currentSelectedIds = selectedIds ?? new Set<string>()
  const allSelected = Boolean(onSelectAll) && experiences.length > 0 && experiences.every((experience) => currentSelectedIds.has(experience.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse">
        <ExperienceTableHead selectable={selectable} allSelected={allSelected} onSelectAll={onSelectAll} />
        <tbody className="divide-y divide-[#D9EAF4]">
          {experiences.map((experience) => (
            <ExperienceRow key={experience.id} experience={experience} selected={currentSelectedIds.has(experience.id)} selectable={selectable} onSelect={onSelect} onRowClick={onRowClick} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ExperienceTableHead({ selectable, allSelected, onSelectAll }: { selectable: boolean; allSelected: boolean; onSelectAll?: (checked: boolean) => void }) {
  return (
    <thead className="bg-[#EEF5F9] text-left text-xs uppercase text-[#003A6C]">
      <tr>
        {selectable ? (
          <th className="w-12 px-4 py-3">
            {onSelectAll ? <input type="checkbox" checked={allSelected} onChange={(event) => onSelectAll(event.target.checked)} className="size-4 rounded-none border-[#A5D7E8]" aria-label="Seleccionar todas las experiencias visibles" /> : <span>Sel.</span>}
          </th>
        ) : null}
        <th className="px-4 py-3 font-semibold">Empresa</th>
        <th className="px-4 py-3 font-semibold">Cargo</th>
        <th className="px-4 py-3 font-semibold">Ubicación</th>
        <th className="px-4 py-3 font-semibold">Periodo</th>
        <th className="px-4 py-3 font-semibold">Estado</th>
      </tr>
    </thead>
  )
}

function ExperienceRow({ experience, selected, selectable, onSelect, onRowClick }: { experience: ExperienceItem; selected: boolean; selectable: boolean; onSelect?: (id: string, checked: boolean) => void; onRowClick?: (experience: ExperienceItem) => void }) {
  return (
    <tr onClick={() => onRowClick?.(experience)} className={onRowClick ? "cursor-pointer transition hover:bg-[#EEF5F9]" : "transition hover:bg-[#F8FBFD]"}>
      {selectable ? <ExperienceSelectCell experience={experience} selected={selected} onSelect={onSelect} /> : null}
      <td className="px-4 py-4"><ExperienceIdentityCell experience={experience} /></td>
      <td className="px-4 py-4 text-sm text-[#355468]">{experience.position}</td>
      <td className="px-4 py-4 text-sm text-[#355468]">{experience.location || "-"}</td>
      <td className="px-4 py-4 text-sm text-[#355468]">{formatExperiencePeriod(experience)}</td>
      <td className="px-4 py-4"><ExperienceStatusBadge experience={experience} /></td>
    </tr>
  )
}

function ExperienceSelectCell({ experience, selected, onSelect }: { experience: ExperienceItem; selected: boolean; onSelect?: (id: string, checked: boolean) => void }) {
  return (
    <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
      <input type="checkbox" checked={selected} onChange={(event) => onSelect?.(experience.id, event.target.checked)} className="size-4 rounded-none border-[#A5D7E8]" aria-label={`Seleccionar ${experience.company}`} />
    </td>
  )
}

function ExperienceIdentityCell({ experience }: { experience: ExperienceItem }) {
  return (
    <div className="flex items-center gap-3">
      {experience.image ? (
        <img src={experience.image} alt="" className="size-10 shrink-0 rounded-lg border border-[#D7E6F2] bg-white object-contain p-1" />
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
          <Briefcase className="size-5" />
        </div>
      )}
      <div>
        <p className="font-medium text-[#003A6C]">{experience.company}</p>
        {experience.email ? <p className="text-xs text-[#6B7E8E]">{experience.email}</p> : null}
      </div>
    </div>
  )
}

function formatExperiencePeriod(experience: ExperienceItem) {
  return `${formatExperienceDate(experience.startDate)} - ${experience.current ? "Actual" : formatExperienceDate(experience.endDate)}`
}
