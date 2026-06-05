import { cn } from "@/lib/utils"

type AuthMessageProps = {
  id?: string
  message?: string
  type?: "error" | "success"
}

const messageStyles = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
}

export function AuthMessage({ id, message, type = "error" }: AuthMessageProps) {
  if (!message) return null

  return <div id={id} className={cn("rounded-xl border px-4 py-3 text-sm", messageStyles[type])}>{message}</div>
}

export function AuthFieldError({ id, message }: AuthMessageProps) {
  if (!message) return null

  return (
    <p id={id} className="text-sm text-red-600">
      {message}
    </p>
  )
}
