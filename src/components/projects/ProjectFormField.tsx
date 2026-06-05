import type { ReactNode } from "react"

import type { ProjectFormTone } from "@/types/projectFormComponents"

export function ProjectFormField({
  label,
  error,
  required,
  children,
  tone = "page",
}: {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
  tone?: ProjectFormTone
}) {
  return (
    <div className="space-y-2">
      <label className={`text-sm font-medium ${tone === "modal" ? "text-gray-700" : "text-[#003A6C]"}`}>
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
