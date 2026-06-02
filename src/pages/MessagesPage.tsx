import { useCallback, useEffect, useMemo, useState } from "react"
import { Clock, Mail, MessageCircle, RefreshCw } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

import { Footer } from "@/components/Footer"
import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MESSAGES_ROUTE } from "@/routes/route-paths"
import { getInboxMessages, readInboxMessage, type InboxMessage } from "@/services/messagesService"

export function MessagesPage() {
  const navigate = useNavigate()
  const { messageId } = useParams<{ messageId?: string }>()
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMessageId, setLoadingMessageId] = useState("")
  const [pageError, setPageError] = useState("")

  const unreadCount = useMemo(() => messages.filter((message) => !message.read).length, [messages])

  const loadMessages = useCallback(async () => {
    setLoading(true)

    try {
      const inboxMessages = await getInboxMessages()
      setMessages(inboxMessages)
      setPageError("")

      if (!messageId) {
        setSelectedMessage((current) => {
          if (!current) return null
          return inboxMessages.find((message) => message.id === current.id) ?? null
        })
      }
    } catch (error) {
      setMessages([])
      setSelectedMessage(null)
      setPageError(error instanceof Error ? error.message : "No se pudieron cargar los mensajes.")
    } finally {
      setLoading(false)
    }
  }, [messageId])

  const handleSelectMessage = useCallback(
    async (message: InboxMessage) => {
      setLoadingMessageId(message.id)

      try {
        const readMessage = await readInboxMessage(message.id)
        setSelectedMessage(readMessage)
        setMessages((current) => current.map((item) => (item.id === readMessage.id ? readMessage : item)))
        setPageError("")

        if (messageId !== readMessage.id) {
          navigate(`${MESSAGES_ROUTE}/${readMessage.id}`, { replace: false })
        }
      } catch (error) {
        setPageError(error instanceof Error ? error.message : "No se pudo cargar el mensaje.")
      } finally {
        setLoadingMessageId("")
      }
    },
    [messageId, navigate],
  )

  useEffect(() => {
    void loadMessages()
  }, [loadMessages])

  useEffect(() => {
    if (!messageId) return

    const existingMessage = messages.find((message) => message.id === messageId)
    if (existingMessage) {
      if (selectedMessage?.id !== messageId || !existingMessage.read) {
        void handleSelectMessage(existingMessage)
      }
      return
    }

    let isMounted = true
    setLoadingMessageId(messageId)

    const loadSelectedMessage = async () => {
      try {
        const readMessage = await readInboxMessage(messageId)

        if (!isMounted) return

        setSelectedMessage(readMessage)
        setMessages((current) => {
          const exists = current.some((message) => message.id === readMessage.id)
          return exists ? current.map((message) => (message.id === readMessage.id ? readMessage : message)) : [readMessage, ...current]
        })
        setPageError("")
      } catch (error) {
        if (isMounted) {
          setPageError(error instanceof Error ? error.message : "No se pudo cargar el mensaje.")
        }
      } finally {
        if (isMounted) {
          setLoadingMessageId("")
        }
      }
    }

    void loadSelectedMessage()

    return () => {
      isMounted = false
    }
  }, [handleSelectMessage, messageId, messages, selectedMessage?.id])

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#003A6C]">Mensajes</h1>
                <p className="mt-1 text-sm text-[#5B8FB9]">
                  {unreadCount > 0
                    ? `Tienes ${unreadCount} mensaje${unreadCount !== 1 ? "s" : ""} sin leer`
                    : "No tienes mensajes sin leer"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void loadMessages()}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#6DACBF] bg-white px-4 text-sm font-semibold text-[#003A6C] transition hover:bg-[#EEF7FC] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Actualizar
              </button>
            </div>

            {pageError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {pageError}
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <Card className="rounded-2xl border border-[#6DACBF] bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#003A6C]">
                      <MessageCircle className="h-5 w-5 text-[#0E7D96]" />
                      Bandeja de entrada
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="px-4 py-8 text-center text-sm text-[#5B8FB9]">Cargando mensajes...</div>
                    ) : messages.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <MessageCircle className="mx-auto mb-3 h-12 w-12 text-[#C2DBED]" />
                        <p className="text-sm text-[#5B8FB9]">No tienes mensajes</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#6DACBF]/30">
                        {messages.map((message) => {
                          const isSelected = selectedMessage?.id === message.id
                          const isOpening = loadingMessageId === message.id

                          return (
                            <button
                              key={message.id}
                              type="button"
                              onClick={() => void handleSelectMessage(message)}
                              disabled={isOpening}
                              className={`block w-full p-4 text-left transition-colors hover:bg-[#F7F0E1] disabled:cursor-wait ${
                                isSelected ? "bg-[#C2DBED]/45" : !message.read ? "bg-[#C2DBED]/25" : "bg-white"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {message.fromPhoto ? (
                                  <img
                                    src={message.fromPhoto}
                                    alt={message.from}
                                    className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#003A6C] font-bold text-white">
                                    {message.from.charAt(0).toUpperCase()}
                                  </div>
                                )}

                                <div className="min-w-0 flex-1">
                                  <div className="mb-1 flex items-center justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                      <p className={`truncate text-sm text-[#003A6C] ${!message.read ? "font-bold" : "font-medium"}`}>
                                        {message.from}
                                      </p>
                                      <p className="truncate text-xs text-[#5B8FB9]">{message.fromEmail}</p>
                                    </div>
                                    {!message.read ? <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#003A6C]" /> : null}
                                  </div>
                                  <p className="mb-1 text-xs font-medium text-[#0E7D96]">{message.category}</p>
                                  <p className="line-clamp-2 text-xs text-[#4B5563]">{message.message}</p>
                                  <div className="mt-2 flex items-center gap-1 text-xs text-[#5B8FB9]">
                                    <Clock className="h-3 w-3" />
                                    <span>{message.date}</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                {selectedMessage ? (
                  <Card className="rounded-2xl border border-[#6DACBF] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#6DACBF]/30 bg-[#F7F0E1]">
                      <div className="flex min-w-0 items-start gap-3">
                        {selectedMessage.fromPhoto ? (
                          <img
                            src={selectedMessage.fromPhoto}
                            alt={selectedMessage.from}
                            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#003A6C] text-lg font-bold text-white">
                            {selectedMessage.from.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-bold text-[#003A6C]">{selectedMessage.from}</h2>
                          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-[#5B8FB9]">
                            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                            <p className="truncate">{selectedMessage.fromEmail}</p>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#C2DBED] px-2 py-1 text-xs font-medium text-[#003A6C]">
                              {selectedMessage.category}
                            </span>
                            <span className="text-xs text-[#5B8FB9]">{selectedMessage.date}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="rounded-xl border border-[#6DACBF] bg-[#F8FAFC] p-4">
                        <p className="mb-2 text-sm font-medium text-[#003A6C]">Mensaje:</p>
                        <p className="whitespace-pre-line text-sm leading-6 text-[#4B5563]">{selectedMessage.message}</p>

                        {selectedMessage.additionalDetails ? (
                          <>
                            <p className="mb-2 mt-4 text-sm font-medium text-[#003A6C]">Detalles adicionales:</p>
                            <p className="whitespace-pre-line text-sm leading-6 text-[#4B5563]">{selectedMessage.additionalDetails}</p>
                          </>
                        ) : null}
                      </div>

                      <div className="mt-6 rounded-xl border border-[#C2DBED] bg-[#C2DBED]/30 p-4">
                        <p className="text-sm leading-6 text-[#003A6C]">
                          <MessageCircle className="mr-1.5 inline h-4 w-4" />
                          Este es un mensaje de solo lectura. Para contactar a {selectedMessage.from}, utiliza su correo:{" "}
                          <span className="font-medium">{selectedMessage.fromEmail}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="flex min-h-80 items-center justify-center rounded-2xl border border-[#6DACBF] bg-white shadow-sm">
                    <CardContent className="py-12 text-center">
                      <MessageCircle className="mx-auto mb-4 h-16 w-16 text-[#C2DBED]" />
                      <p className="text-[#5B8FB9]">Selecciona un mensaje para ver los detalles</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
