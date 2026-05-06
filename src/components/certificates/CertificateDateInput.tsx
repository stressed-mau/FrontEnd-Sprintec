import { CalendarDays } from "lucide-react"
import { useRef } from "react"

type PickerInput = HTMLInputElement & {
  showPicker?: () => void
}

type CertificateDateInputProps = {
  id: string
  label: string
  value: string
  disabled?: boolean
  required?: boolean
  error?: string
  placeholder?: string
  min?: string
  max?: string
  onChange: (value: string) => void
}

function convertDateDDMMYYYYtoISO(date: string): string {
  if (!date || !/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return ""
  const [day, month, year] = date.split("/")
  return `${year}-${month}-${day}`
}

function convertDateISOToDDMMYYYY(date: string): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return ""
  const [year, month, day] = date.split("-")
  return `${day}/${month}/${year}`
}

export function CertificateDateInput({
  id,
  label,
  value,
  disabled,
  required,
  error,
  placeholder = "DD/MM/AAAA",
  min,
  max,
  onChange,
}: CertificateDateInputProps) {
  const datePickerRef = useRef<PickerInput | null>(null)

  const openPicker = () => {
    const picker = datePickerRef.current
    if (!picker || disabled) return

    if (typeof picker.showPicker === "function") {
      picker.showPicker()
      return
    }

    picker.focus()
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-[#003A6C]">
        {label} {required ? "*" : null}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode="numeric"
          className={`w-full rounded-xl border bg-white px-4 py-2.5 pr-11 text-sm outline-none focus:ring-2 ${
            error
              ? "border-red-400 focus:ring-red-100"
              : "border-[#0E7D96]/20 focus:ring-[#0E7D96]/40"
          } disabled:opacity-50`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-xl text-[#0E7D96] transition hover:bg-[#EEF5F9] disabled:opacity-50"
          aria-label={`Abrir calendario para ${label.toLowerCase()}`}
        >
          <CalendarDays className="size-4" />
        </button>
        <input
          ref={datePickerRef}
          type="date"
          tabIndex={-1}
          value={convertDateDDMMYYYYtoISO(value)}
          min={min}
          max={max}
          onChange={(e) => onChange(convertDateISOToDDMMYYYY(e.target.value))}
          className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 opacity-0"
          aria-hidden="true"
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
