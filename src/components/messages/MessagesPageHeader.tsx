import { SectionHeader } from "@/components/sections/SectionHeader"

interface MessagesPageHeaderProps {
  unreadCount: number
}

export function MessagesPageHeader({ unreadCount }: MessagesPageHeaderProps) {
  return (
    <SectionHeader
      title="Mensajes"
      description={
        unreadCount > 0
          ? `Tienes ${unreadCount} mensaje${unreadCount !== 1 ? "s" : ""} sin leer`
          : "No tienes mensajes sin leer"
      }
    />
  )
}
