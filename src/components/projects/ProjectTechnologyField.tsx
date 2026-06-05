import { X } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ProjectFormField } from "@/components/projects/ProjectFormField"
import type { ProjectTechnology } from "@/types/project"
import type { ProjectFieldClassNames, ProjectFormTone } from "@/types/projectFormComponents"

interface ProjectTechnologyFieldProps {
  error?: string
  technologies: ProjectTechnology[]
  selectedTechs: ProjectTechnology[]
  readOnlyFields: boolean
  classNames: ProjectFieldClassNames
  tone: ProjectFormTone
  onTechnologyAdd: (technologyId: string) => void
  onTechnologyRemove: (id: number) => void
}

export function ProjectTechnologyField(props: ProjectTechnologyFieldProps) {
  const [search, setSearch] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const filteredTechnologies = getFilteredTechnologies(props.technologies, props.selectedTechs, search)

  function handleSelect(technologyId: number) {
    props.onTechnologyAdd(String(technologyId))
    setSearch("")
    setShowDropdown(false)
    setActiveIndex(0)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown && (event.key === "ArrowDown" || event.key === "ArrowUp")) setShowDropdown(true)
    if (!filteredTechnologies.length) return handleEmptyOptionsKey(event, setShowDropdown)
    if (event.key === "ArrowDown") return moveActiveTechnology(event, 1, filteredTechnologies.length, setActiveIndex)
    if (event.key === "ArrowUp") return moveActiveTechnology(event, -1, filteredTechnologies.length, setActiveIndex)
    if (event.key === "Enter") return selectActiveTechnology(event, filteredTechnologies, activeIndex, handleSelect)
    if (event.key === "Escape") setShowDropdown(false)
  }

  return (
    <ProjectFormField label="Tecnologías" error={props.error} required tone={props.tone}>
      {props.readOnlyFields ? (
        <Input value={getSelectedTechnologyText(props.selectedTechs)} disabled className={props.classNames.disabledInput} aria-invalid={Boolean(props.error)} />
      ) : (
        <>
          <div className="relative">
            <ProjectTechnologyInput search={search} selectedCount={props.selectedTechs.length} error={props.error} classNames={props.classNames} onSearchChange={setSearch} onActiveChange={setActiveIndex} onShowChange={setShowDropdown} onKeyDown={handleKeyDown} />
            {showDropdown ? <TechnologyOptions technologies={filteredTechnologies} activeIndex={activeIndex} onActiveChange={setActiveIndex} onSelect={handleSelect} /> : null}
          </div>
          <SelectedTechnologies selectedTechs={props.selectedTechs} tone={props.tone} onTechnologyRemove={props.onTechnologyRemove} />
        </>
      )}
    </ProjectFormField>
  )
}

function ProjectTechnologyInput({ search, selectedCount, error, classNames, onSearchChange, onActiveChange, onShowChange, onKeyDown }: { search: string; selectedCount: number; error?: string; classNames: ProjectFieldClassNames; onSearchChange: (value: string) => void; onActiveChange: (index: number) => void; onShowChange: (value: boolean) => void; onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void }) {
  return (
    <>
      <Input
        value={search}
        onChange={(event) => {
          onSearchChange(event.target.value)
          onActiveChange(0)
          onShowChange(true)
        }}
        onFocus={() => onShowChange(true)}
        onKeyDown={onKeyDown}
        onBlur={() => window.setTimeout(() => onShowChange(false), 120)}
        disabled={selectedCount >= 10}
        placeholder={selectedCount >= 10 ? "Límite alcanzado (max 10)" : "Busca y selecciona"}
        className={classNames.input(Boolean(error))}
        aria-invalid={Boolean(error)}
      />
    </>
  )
}

function TechnologyOptions({ technologies, activeIndex, onActiveChange, onSelect }: { technologies: ProjectTechnology[]; activeIndex: number; onActiveChange: (index: number) => void; onSelect: (id: number) => void }) {
  return (
    <div className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
      {technologies.length ? technologies.map((technology, index) => (
        <button key={technology.id} type="button" onMouseDown={(event) => selectMouseTechnology(event, technology.id, onSelect)} onMouseEnter={() => onActiveChange(index)} className={`block w-full px-3 py-2 text-left text-sm text-[#003A6C] transition-colors ${index === activeIndex ? "bg-blue-50" : "hover:bg-blue-50"}`}>
          {technology.name}
        </button>
      )) : <p className="px-3 py-2 text-xs text-gray-400">No se encontró la tecnología</p>}
    </div>
  )
}

function SelectedTechnologies({ selectedTechs, tone, onTechnologyRemove }: { selectedTechs: ProjectTechnology[]; tone: ProjectFormTone; onTechnologyRemove: (id: number) => void }) {
  if (!selectedTechs.length) return null

  return (
    <div className={`mt-3 flex flex-wrap gap-2 rounded-xl border p-3 ${tone === "modal" ? "border-gray-200 bg-gray-50" : "border-[#D7E6F2] bg-[#EEF5F9]"}`}>
      {selectedTechs.map((technology) => (
        <Badge key={technology.id} className={`gap-1 ${tone === "modal" ? "bg-gray-100 text-gray-700 hover:bg-gray-100" : "bg-[#D9EAF4] text-[#003A6C]"}`}>
          {technology.name}
          <button type="button" onClick={() => onTechnologyRemove(technology.id)} className={`rounded-full p-0.5 ${tone === "modal" ? "hover:bg-gray-200" : "hover:bg-[#A5D7E8]"}`}>
            <X className="size-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}

function getFilteredTechnologies(technologies: ProjectTechnology[], selectedTechs: ProjectTechnology[], searchValue: string) {
  const search = searchValue.trim().toLowerCase()

  return technologies.filter((technology) => {
    return (!search || technology.name.toLowerCase().includes(search)) && !selectedTechs.some((selected) => selected.id === technology.id)
  })
}

function getSelectedTechnologyText(selectedTechs: ProjectTechnology[]) {
  return selectedTechs.length > 0 ? selectedTechs.map((technology) => technology.name).join(", ") : "Sin tecnologías"
}

function handleEmptyOptionsKey(event: React.KeyboardEvent<HTMLInputElement>, setShowDropdown: (value: boolean) => void) {
  if (event.key === "Escape") setShowDropdown(false)
}

function moveActiveTechnology(event: React.KeyboardEvent<HTMLInputElement>, direction: number, total: number, setActiveIndex: (value: React.SetStateAction<number>) => void) {
  event.preventDefault()
  setActiveIndex((current) => (current + direction + total) % total)
}

function selectActiveTechnology(event: React.KeyboardEvent<HTMLInputElement>, technologies: ProjectTechnology[], activeIndex: number, onSelect: (id: number) => void) {
  event.preventDefault()
  onSelect(technologies[activeIndex]?.id ?? technologies[0].id)
}

function selectMouseTechnology(event: React.MouseEvent<HTMLButtonElement>, technologyId: number, onSelect: (id: number) => void) {
  event.preventDefault()
  onSelect(technologyId)
}
