import type { ApiMessage, InboxMessage, SendPortfolioMessagePayload } from "@/types/messages"

interface ParsedMessage {
  category: string
  message: string
  contactName?: string
  contactEmail?: string
  additionalDetails?: string
}

export function composeBackendMessage(payload: SendPortfolioMessagePayload) {
  const parts = [payload.reason_title.trim(), payload.base_message.trim()]
  const contactSection = buildContactSection(payload)

  if (contactSection) parts.push(contactSection)
  if (payload.additional_details?.trim()) {
    parts.push(`Detalles adicionales:\n${payload.additional_details.trim()}`)
  }

  return parts.filter(Boolean).join("\n\n")
}

export function normalizeInboxMessage(message: ApiMessage): InboxMessage {
  const sender = message.sender
  const senderInfo = sender?.user_information
  const parsedMessage = parseBackendMessage(message.message || "")
  const fallbackName = sender?.username || `Usuario ${message.sender_id}`
  const guestName = message.guest_name?.trim() || parsedMessage.contactName
  const guestEmail = message.guest_email?.trim() || parsedMessage.contactEmail

  return {
    id: String(message.id),
    senderId: message.sender_id == null ? "" : String(message.sender_id),
    receiverId: String(message.receiver_id),
    from: guestName || senderInfo?.fullname || fallbackName,
    fromEmail: guestEmail || senderInfo?.public_email || sender?.email || "Sin correo publico",
    fromPhoto: senderInfo?.image_url || undefined,
    category: parsedMessage.category,
    message: parsedMessage.message,
    additionalDetails: parsedMessage.additionalDetails,
    contactName: guestName,
    contactEmail: guestEmail,
    date: formatRelativeTime(message.created_at),
    read: Boolean(message.is_read),
    createdAt: message.created_at,
    rawMessage: message.message,
  }
}

function buildContactSection(payload: SendPortfolioMessagePayload) {
  if (!payload.contact_name?.trim() && !payload.contact_email?.trim()) return ""

  return [
    "Datos de contacto:",
    payload.contact_name?.trim() ? `Nombre completo: ${payload.contact_name.trim()}` : "",
    payload.contact_email?.trim() ? `Correo de contacto: ${payload.contact_email.trim()}` : "",
  ].filter(Boolean).join("\n")
}

function formatRelativeTime(value?: string) {
  if (!value) return "Reciente"

  const createdAt = new Date(value)
  if (Number.isNaN(createdAt.getTime())) return "Reciente"

  const diffMinutes = Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / 60000))
  if (diffMinutes < 1) return "Hace un momento"
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `Hace ${diffHours} h`

  return `Hace ${Math.floor(diffHours / 24)} d`
}

function parseBackendMessage(value: string): ParsedMessage {
  const sections = value.split(/\n{2,}/).map((section) => section.trim()).filter(Boolean)
  const contactSection = sections.find((section) => /^Datos de contacto:/i.test(section)) ?? ""
  const detailsSection = sections.find((section) => /^Detalles adicionales:/i.test(section)) ?? ""

  return {
    category: sections[0] || "Mensaje",
    message: sections[1] || sections[0] || "",
    contactName: contactSection.match(/Nombre completo:\s*(.+)/i)?.[1]?.trim() || undefined,
    contactEmail: contactSection.match(/Correo de contacto:\s*(.+)/i)?.[1]?.trim() || undefined,
    additionalDetails: detailsSection.replace(/^Detalles adicionales:\s*/i, "").trim() || undefined,
  }
}
