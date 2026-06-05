import type { ComponentProps, ReactNode, Ref } from "react"
import type { LucideIcon } from "lucide-react"

import { AuthFieldError } from "@/components/auth/AuthMessages"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AuthTextFieldProps = ComponentProps<"input"> & {
  error?: string
  errorId?: string
  help?: ReactNode
  helpId?: string
  icon: LucideIcon
  inputRef?: Ref<HTMLInputElement>
  label: ReactNode
  rightSlot?: ReactNode
  required?: boolean
}

export function AuthTextField({
  className,
  error,
  errorId,
  help,
  helpId,
  icon: Icon,
  id,
  inputRef,
  label,
  required,
  rightSlot,
  ...inputProps
}: AuthTextFieldProps) {
  const describedBy = [helpId, error ? errorId : undefined].filter(Boolean).join(" ") || undefined

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#003A6C]">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </Label>
      {help}
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B88A0]" />
        <Input
          {...inputProps}
          ref={inputRef}
          id={id}
          className={className}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        {rightSlot}
      </div>
      <AuthFieldError id={errorId} message={error} />
    </div>
  )
}
