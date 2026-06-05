import { Mail, MessageCircle } from "lucide-react"

import { MessageAvatar } from "@/components/messages/MessageAvatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { InboxMessage } from "@/types/messages"

interface MessageDetailPanelProps {
  selectedMessage: InboxMessage | null
}

export function MessageDetailPanel({ selectedMessage }: MessageDetailPanelProps) {
  if (!selectedMessage) return <EmptyMessageDetail />

  return (
    <Card className="rounded-2xl border border-[#6DACBF] bg-white shadow-sm">
      <CardHeader className="border-b border-[#6DACBF]/30 bg-[#F7F0E1]">
        <MessageDetailHeader message={selectedMessage} />
      </CardHeader>
      <CardContent className="pt-6">
        <MessageBody message={selectedMessage} />
        <ReadOnlyNotice message={selectedMessage} />
      </CardContent>
    </Card>
  )
}

function MessageDetailHeader({ message }: { message: InboxMessage }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <MessageAvatar message={message} size="md" />
      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold text-[#003A6C]">{message.from}</h2>
        <div className="mt-0.5 flex items-center gap-1.5 text-sm text-[#5B8FB9]">
          <Mail className="h-3.5 w-3.5 flex-shrink-0" />
          <p className="truncate">{message.fromEmail}</p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#C2DBED] px-2 py-1 text-xs font-medium text-[#003A6C]">{message.category}</span>
          <span className="text-xs text-[#5B8FB9]">{message.date}</span>
        </div>
      </div>
    </div>
  )
}

function MessageBody({ message }: { message: InboxMessage }) {
  return (
    <div className="rounded-xl border border-[#6DACBF] bg-[#F8FAFC] p-4">
      <p className="mb-2 text-sm font-medium text-[#003A6C]">Mensaje:</p>
      <p className="whitespace-pre-line text-sm leading-6 text-[#4B5563]">{message.message}</p>
      {message.additionalDetails ? <AdditionalDetails details={message.additionalDetails} /> : null}
    </div>
  )
}

function AdditionalDetails({ details }: { details: string }) {
  return (
    <>
      <p className="mb-2 mt-4 text-sm font-medium text-[#003A6C]">Detalles adicionales:</p>
      <p className="whitespace-pre-line text-sm leading-6 text-[#4B5563]">{details}</p>
    </>
  )
}

function ReadOnlyNotice({ message }: { message: InboxMessage }) {
  return (
    <div className="mt-6 rounded-xl border border-[#C2DBED] bg-[#C2DBED]/30 p-4">
      <p className="text-sm leading-6 text-[#003A6C]">
        <MessageCircle className="mr-1.5 inline h-4 w-4" />
        Este es un mensaje de solo lectura. Para contactar a {message.from}, utiliza su correo:{" "}
        <span className="font-medium">{message.fromEmail}</span>
      </p>
    </div>
  )
}

function EmptyMessageDetail() {
  return (
    <Card className="flex min-h-80 items-center justify-center rounded-2xl border border-[#6DACBF] bg-white shadow-sm">
      <CardContent className="py-12 text-center">
        <MessageCircle className="mx-auto mb-4 h-16 w-16 text-[#C2DBED]" />
        <p className="text-[#5B8FB9]">Selecciona un mensaje para ver los detalles</p>
      </CardContent>
    </Card>
  )
}
