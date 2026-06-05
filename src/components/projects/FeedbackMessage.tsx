export function FeedbackMessage({ message, type }: { message: string; type: "error" | "success" }) {
  if (!message) return null

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"
      }`}
    >
      {message}
    </div>
  )
}
