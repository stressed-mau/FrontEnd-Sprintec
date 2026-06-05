export function FeedbackMessage({ message, type }: { message: string; type: "success" | "error" | "" }) {
  if (!message) return null

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {message}
    </div>
  )
}
