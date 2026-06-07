export function formatRelativeTime(value?: string) {
  if (!value) {
    return "Reciente"
  }

  const createdAt = new Date(value)
  if (Number.isNaN(createdAt.getTime())) {
    return "Reciente"
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / 60000))
  if (diffMinutes < 1) return "Hace un momento"
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `Hace ${diffHours} h`

  const diffDays = Math.floor(diffHours / 24)
  return `Hace ${diffDays} d`
}