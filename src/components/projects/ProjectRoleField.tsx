import { useState } from "react"

import { Input } from "@/components/ui/input"
import { ProjectFormField } from "@/components/projects/ProjectFormField"
import type { ProjectFormValues } from "@/types/projectForm"
import type { ProjectFieldClassNames, ProjectFormTone } from "@/types/projectFormComponents"

interface ProjectRoleFieldProps {
  value: string
  error?: string
  roleOptions: string[]
  readOnlyFields: boolean
  classNames: ProjectFieldClassNames
  tone: ProjectFormTone
  onFieldChange: (field: keyof ProjectFormValues, value: string | boolean) => void
}

export function ProjectRoleField({ value, error, roleOptions, readOnlyFields, classNames, tone, onFieldChange }: ProjectRoleFieldProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const filteredRoles = roleOptions.filter((role) => matchesSearch(role, value))

  function handleSelect(role: string) {
    onFieldChange("rol", role)
    setShowDropdown(false)
    setActiveIndex(0)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown && (event.key === "ArrowDown" || event.key === "ArrowUp")) setShowDropdown(true)
    if (!filteredRoles.length) return handleEmptyOptionsKey(event)
    if (event.key === "ArrowDown") return moveActiveRole(event, 1, filteredRoles.length, setActiveIndex)
    if (event.key === "ArrowUp") return moveActiveRole(event, -1, filteredRoles.length, setActiveIndex)
    if (event.key === "Enter") return selectActiveRole(event, filteredRoles, activeIndex, handleSelect)
    if (event.key === "Escape") setShowDropdown(false)
  }

  return (
    <ProjectFormField label="Tu rol en el proyecto" error={error} required tone={tone}>
      {readOnlyFields ? (
        <Input value={value} disabled className={classNames.disabledInput} aria-invalid={Boolean(error)} />
      ) : (
        <div className="relative">
          <Input
            value={value}
            onChange={(event) => {
              onFieldChange("rol", event.target.value)
              setActiveIndex(0)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            onBlur={() => window.setTimeout(() => setShowDropdown(false), 120)}
            placeholder="Busca y selecciona"
            className={classNames.input(Boolean(error))}
            aria-invalid={Boolean(error)}
          />
          {showDropdown ? <RoleOptions roles={filteredRoles} activeIndex={activeIndex} onActiveChange={setActiveIndex} onSelect={handleSelect} /> : null}
        </div>
      )}
    </ProjectFormField>
  )
}

function RoleOptions({ roles, activeIndex, onActiveChange, onSelect }: { roles: string[]; activeIndex: number; onActiveChange: (index: number) => void; onSelect: (role: string) => void }) {
  return (
    <div className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
      {roles.length ? (
        roles.map((role, index) => (
          <button key={role} type="button" onMouseDown={(event) => selectMouseOption(event, role, onSelect)} onMouseEnter={() => onActiveChange(index)} className={`block w-full px-3 py-2 text-left text-sm text-[#003A6C] transition-colors ${index === activeIndex ? "bg-blue-50" : "hover:bg-blue-50"}`}>
            {role}
          </button>
        ))
      ) : (
        <p className="px-3 py-2 text-xs text-gray-400">No se encontrá el rol</p>
      )}
    </div>
  )
}

function matchesSearch(value: string, searchValue: string) {
  const search = searchValue.trim().toLowerCase()
  return !search || value.toLowerCase().includes(search)
}

function handleEmptyOptionsKey(event: React.KeyboardEvent<HTMLInputElement>) {
  if (event.key === "Escape") event.currentTarget.blur()
}

function moveActiveRole(event: React.KeyboardEvent<HTMLInputElement>, direction: number, total: number, setActiveIndex: (value: React.SetStateAction<number>) => void) {
  event.preventDefault()
  setActiveIndex((current) => (current + direction + total) % total)
}

function selectActiveRole(event: React.KeyboardEvent<HTMLInputElement>, roles: string[], activeIndex: number, onSelect: (role: string) => void) {
  event.preventDefault()
  onSelect(roles[activeIndex] ?? roles[0])
}

function selectMouseOption(event: React.MouseEvent<HTMLButtonElement>, role: string, onSelect: (role: string) => void) {
  event.preventDefault()
  onSelect(role)
}
