import type { ReactNode } from "react"

import { Label } from "@/components/ui/label"

export function ExperienceFieldError({ label, id, error, required, children }: { label: string; id: string; error?: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label id={`${id}-label`} htmlFor={id} className="text-[#003A6C]">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </Label>
      {children}
      {error ? <p id={`${id}-error`} className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
