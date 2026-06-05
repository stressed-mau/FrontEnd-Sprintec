import { Clock, MessageCircle } from "lucide-react"

import { MessageAvatar } from "@/components/messages/MessageAvatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InboxMessage } from "@/types/messages"

interface MessagesInboxPanelProps {
  messages: InboxMessage[]
  selectedMessage: InboxMessage | null
  loading: boolean
  loadingMessageId: string
  onSelectMessage: (message: InboxMessage) => void
}

export function MessagesInboxPanel({
  messages,
  selectedMessage,
  loading,
  loadingMessageId,
  onSelectMessage,
}: MessagesInboxPanelProps) {
  return (
    <Card className="rounded-2xl border border-[#6DACBF] bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#003A6C]">
          <MessageCircle className="h-5 w-5 text-[#0E7D96]" />
          Bandeja de entrada
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <InboxContent
          messages={messages}
          selectedMessage={selectedMessage}
          loading={loading}
          loadingMessageId={loadingMessageId}
          onSelectMessage={onSelectMessage}
        />
      </CardContent>
    </Card>
  )
}

function InboxContent(props: MessagesInboxPanelProps) {
  if (props.loading) {
    return <div className="px-4 py-8 text-center text-sm text-[#5B8FB9]">Cargando mensajes...</div>
  }

  if (props.messages.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <MessageCircle className="mx-auto mb-3 h-12 w-12 text-[#C2DBED]" />
        <p className="text-sm text-[#5B8FB9]">No tienes mensajes</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-[#6DACBF]/30">
      {props.messages.map((message) => (
        <MessageListItem
          key={message.id}
          message={message}
          isSelected={props.selectedMessage?.id === message.id}
          isOpening={props.loadingMessageId === message.id}
          onSelectMessage={props.onSelectMessage}
        />
      ))}
    </div>
  )
}

function MessageListItem({
  message,
  isSelected,
  isOpening,
  onSelectMessage,
}: {
  message: InboxMessage
  isSelected: boolean
  isOpening: boolean
  onSelectMessage: (message: InboxMessage) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectMessage(message)}
      disabled={isOpening}
      className={`block w-full p-4 text-left transition-colors hover:bg-[#F7F0E1] disabled:cursor-wait ${getMessageItemClass(message, isSelected)}`}
    >
      <div className="flex items-start gap-3">
        <MessageAvatar message={message} />
        <div className="min-w-0 flex-1">
          <MessageListSender message={message} />
          <p className="mb-1 text-xs font-medium text-[#0E7D96]">{message.category}</p>
          <p className="line-clamp-2 text-xs text-[#4B5563]">{message.message}</p>
          <MessageListDate date={message.date} />
        </div>
      </div>
    </button>
  )
}

function MessageListSender({ message }: { message: InboxMessage }) {
  return (
    <div className="mb-1 flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm text-[#003A6C] ${!message.read ? "font-bold" : "font-medium"}`}>{message.from}</p>
        <p className="truncate text-xs text-[#5B8FB9]">{message.fromEmail}</p>
      </div>
      {!message.read ? <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#003A6C]" /> : null}
    </div>
  )
}

function MessageListDate({ date }: { date: string }) {
  return (
    <div className="mt-2 flex items-center gap-1 text-xs text-[#5B8FB9]">
      <Clock className="h-3 w-3" />
      <span>{date}</span>
    </div>
  )
}

function getMessageItemClass(message: InboxMessage, isSelected: boolean) {
  if (isSelected) return "bg-[#C2DBED]/45"
  return !message.read ? "bg-[#C2DBED]/25" : "bg-white"
}
