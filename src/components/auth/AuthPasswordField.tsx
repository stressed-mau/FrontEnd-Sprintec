import type { ComponentProps, ReactNode, Ref } from "react"
import { Eye, EyeOff, LockKeyhole } from "lucide-react"

import { AuthTextField } from "@/components/auth/AuthTextField"
import { Button } from "@/components/ui/button"

type AuthPasswordFieldProps = Omit<ComponentProps<"input">, "type"> & {
  error?: string
  errorId?: string
  help?: ReactNode
  helpId?: string
  inputRef?: Ref<HTMLInputElement>
  isVisible: boolean
  label: ReactNode
  required?: boolean
  toggleVisibility: () => void
  visibilityLabel: string
}

export function AuthPasswordField({
  error,
  errorId,
  help,
  helpId,
  inputRef,
  isVisible,
  label,
  required,
  toggleVisibility,
  visibilityLabel,
  ...inputProps
}: AuthPasswordFieldProps) {
  return (
    <AuthTextField
      {...inputProps}
      inputRef={inputRef}
      type={isVisible ? "text" : "password"}
      icon={LockKeyhole}
      label={label}
      required={required}
      error={error}
      errorId={errorId}
      help={help}
      helpId={helpId}
      className="h-11 border-[#C2DBED] bg-white pl-10 pr-11 text-[#003A6C] placeholder:text-[#7B98AF]"
      rightSlot={
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleVisibility}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#6B88A0] hover:bg-transparent hover:text-[#003A6C]"
          aria-label={visibilityLabel}
        >
          {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      }
    />
  )
}
