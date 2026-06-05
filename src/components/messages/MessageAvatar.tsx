import type { InboxMessage } from "@/types/messages"

interface MessageAvatarProps {
  message: InboxMessage
  size?: "sm" | "md"
}

const avatarSizeClasses = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
}

export function MessageAvatar({ message, size = "sm" }: MessageAvatarProps) {
  const sizeClass = avatarSizeClasses[size]

  if (message.fromPhoto) {
    return <img src={message.fromPhoto} alt={message.from} className={`${sizeClass} flex-shrink-0 rounded-full object-cover`} />
  }

  return (
    <div className={`${sizeClass} flex flex-shrink-0 items-center justify-center rounded-full bg-[#003A6C] font-bold text-white`}>
      {message.from.charAt(0).toUpperCase()}
    </div>
  )
}
