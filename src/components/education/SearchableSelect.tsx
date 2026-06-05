import { useMemo, useState, type ChangeEvent, type InputHTMLAttributes, type KeyboardEvent } from "react"

import { Input } from "@/components/ui/input"

type SearchableSelectProps = {
  id: string
  value: string
  disabled?: boolean
  onBlur?: () => void
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  className?: string
  options: string[]
  placeholder: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "onBlur" | "value" | "disabled" | "className">

export function SearchableSelect({ id, value, disabled, onBlur, onChange, className, options, placeholder, ...rest }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const filteredOptions = useMemo(() => filterOptions(options, value), [options, value])

  function selectOption(option: string) {
    onChange({ target: { value: option } } as ChangeEvent<HTMLInputElement>)
    setIsOpen(false)
    setActiveIndex(0)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) setIsOpen(true)
    if (!filteredOptions.length) return handleEmptyOptionsKey(event, setIsOpen)
    handleOptionsKey(event, filteredOptions, activeIndex, setActiveIndex, selectOption, isOpen, setIsOpen)
  }

  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        disabled={disabled}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 120)
          onBlur?.()
        }}
        onKeyDown={handleKeyDown}
        onChange={(event) => {
          onChange(event)
          setIsOpen(true)
          setActiveIndex(0)
        }}
        placeholder={placeholder}
        className={className}
        {...rest}
      />
      {isOpen ? <SearchableOptions options={filteredOptions} activeIndex={activeIndex} onSelect={selectOption} onHover={setActiveIndex} /> : null}
    </div>
  )
}

function SearchableOptions({ options, activeIndex, onSelect, onHover }: { options: string[]; activeIndex: number; onSelect: (option: string) => void; onHover: (index: number) => void }) {
  return (
    <div className="absolute z-30 mt-1 max-h-44 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
      {options.length ? options.map((option, index) => (
        <button
          key={option}
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()
            onSelect(option)
          }}
          onMouseEnter={() => onHover(index)}
          className={`block w-full px-3 py-2 text-left text-sm text-[#003A6C] transition-colors ${index === activeIndex ? "bg-blue-50" : "hover:bg-blue-50"}`}
        >
          {option}
        </button>
      )) : <p className="px-3 py-2 text-xs text-gray-400">No se encontró una opción</p>}
    </div>
  )
}

function filterOptions(options: string[], value: string) {
  const query = value.trim().toLowerCase()
  return query ? options.filter((option) => option.toLowerCase().includes(query)) : options
}

function handleEmptyOptionsKey(event: KeyboardEvent<HTMLInputElement>, setIsOpen: (isOpen: boolean) => void) {
  if (event.key === "Escape") setIsOpen(false)
}

function handleOptionsKey(
  event: KeyboardEvent<HTMLInputElement>,
  options: string[],
  activeIndex: number,
  setActiveIndex: (updater: (current: number) => number) => void,
  selectOption: (option: string) => void,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
) {
  if (event.key === "ArrowDown") return moveActiveOption(event, setActiveIndex, options.length, 1)
  if (event.key === "ArrowUp") return moveActiveOption(event, setActiveIndex, options.length, -1)
  if (event.key === "Enter" && isOpen) return selectActiveOption(event, options, activeIndex, selectOption)
  if (event.key === "Escape") setIsOpen(false)
}

function moveActiveOption(event: KeyboardEvent<HTMLInputElement>, setActiveIndex: (updater: (current: number) => number) => void, total: number, direction: 1 | -1) {
  event.preventDefault()
  setActiveIndex((current) => {
    const nextIndex = (current + direction + total) % total
    return nextIndex
  })
}

function selectActiveOption(event: KeyboardEvent<HTMLInputElement>, options: string[], activeIndex: number, selectOption: (option: string) => void) {
  event.preventDefault()
  selectOption(options[activeIndex] ?? options[0])
}
