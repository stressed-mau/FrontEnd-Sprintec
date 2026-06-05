interface MessagesPageHeaderProps {
  unreadCount: number
}

export function MessagesPageHeader({ unreadCount }: MessagesPageHeaderProps) {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-[#003A6C]">Mensajes</h1>
        <p className="mt-1 text-sm text-[#5B8FB9]">
          {unreadCount > 0
            ? `Tienes ${unreadCount} mensaje${unreadCount !== 1 ? "s" : ""} sin leer`
            : "No tienes mensajes sin leer"}
        </p>
      </div>
    </div>
  )
}
