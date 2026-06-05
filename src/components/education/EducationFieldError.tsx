import type { ReactNode } from "react"

import { Label } from "@/components/ui/label"

export function EducationFieldError({
  label,
  id,
  error,
  required,
  children,
}: {
  label: string
  id: string
  error?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </Label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
