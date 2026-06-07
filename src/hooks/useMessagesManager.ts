import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { MutableRefObject } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { usePagination } from "@/hooks/usePagination"
import { MESSAGES_ROUTE } from "@/routes/route-paths"
import { getAuthSession } from "@/services/auth"
import { getInboxMessages, readInboxMessage } from "@/services/messagesService"
import { subscribeToUserNotifications } from "@/services/realtimeNotificationsService"
import type { InboxMessage } from "@/types/messages"

const MESSAGES_FALLBACK_REFRESH_MS = 15000

export function useMessagesManager() {
  const navigate = useNavigate()
  const { messageId } = useParams<{ messageId?: string }>()
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMessageId, setLoadingMessageId] = useState("")
  const [pageError, setPageError] = useState("")
  const selectionRequestRef = useRef(0)
  const messagesRef = useRef<InboxMessage[]>([])
  const pagination = usePagination({ items: messages })

  const unreadCount = useMemo(() => messages.filter((message) => !message.read).length, [messages])

  const loadMessages = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true)

    try {
      setMessages(await getInboxMessages())
      setPageError("")
    } catch (error) {
      if (showLoading) resetMessages()
      setPageError(error instanceof Error ? error.message : "No se pudieron cargar los mensajes.")
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  const selectMessage = useCallback(
    async (message: InboxMessage) => {
      const requestId = createSelectionRequest(selectionRequestRef)
      setSelectedMessage(message)
      setLoadingMessageId(message.id)

      try {
        const readMessage = await readInboxMessage(message.id)
        if (selectionRequestRef.current !== requestId) return

        applySelectedMessage(readMessage)
        if (messageId !== readMessage.id) navigate(`${MESSAGES_ROUTE}/${readMessage.id}`)
      } catch (error) {
        showSelectionError(error, requestId)
      } finally {
        clearSelectionLoading(requestId)
      }
    },
    [messageId, navigate],
  )

  const loadMessageFromRoute = useCallback(async (currentMessageId: string) => {
    const requestId = createSelectionRequest(selectionRequestRef)
    const existingMessage = messagesRef.current.find((message) => message.id === currentMessageId)
    if (existingMessage) setSelectedMessage(existingMessage)
    setLoadingMessageId(currentMessageId)

    try {
      const readMessage = await readInboxMessage(currentMessageId)
      if (selectionRequestRef.current !== requestId) return

      setSelectedMessage(readMessage)
      setMessages((current) => updateMessageList(current, readMessage))
      setPageError("")
    } catch (error) {
      if (selectionRequestRef.current !== requestId) return
      setPageError(error instanceof Error ? error.message : "No se pudo cargar el mensaje.")
    } finally {
      if (selectionRequestRef.current === requestId) setLoadingMessageId("")
    }
  }, [])

  useEffect(() => {
    void loadMessages(true)
  }, [loadMessages])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => subscribeToMessages(loadMessages), [loadMessages])
  useEffect(() => refreshMessagesFallback(loadMessages), [loadMessages])
  useEffect(() => {
    if (!messageId) return
    void loadMessageFromRoute(messageId)
  }, [loadMessageFromRoute, messageId])

  function resetMessages() {
    setMessages([])
    setSelectedMessage(null)
  }

  function applySelectedMessage(readMessage: InboxMessage) {
    setSelectedMessage(readMessage)
    setMessages((current) => updateMessageList(current, readMessage))
    setPageError("")
  }

  function showSelectionError(error: unknown, requestId: number) {
    if (selectionRequestRef.current !== requestId) return
    setPageError(error instanceof Error ? error.message : "No se pudo cargar el mensaje.")
  }

  function clearSelectionLoading(requestId: number) {
    if (selectionRequestRef.current === requestId) setLoadingMessageId("")
  }

  return { messages, paginatedMessages: pagination.items, pagination, selectedMessage, unreadCount, loading, loadingMessageId, pageError, selectMessage }
}

function createSelectionRequest(selectionRequestRef: MutableRefObject<number>) {
  const requestId = selectionRequestRef.current + 1
  selectionRequestRef.current = requestId
  return requestId
}

function updateMessageList(messages: InboxMessage[], readMessage: InboxMessage) {
  const exists = messages.some((message) => message.id === readMessage.id)
  return exists ? messages.map((message) => (message.id === readMessage.id ? readMessage : message)) : [readMessage, ...messages]
}

function subscribeToMessages(loadMessages: (showLoading?: boolean) => Promise<void>) {
  const userId = getAuthSession()?.user?.id
  if (userId == null) return undefined

  return subscribeToUserNotifications(String(userId), () => {
    void loadMessages(false)
  })
}

function refreshMessagesFallback(loadMessages: (showLoading?: boolean) => Promise<void>) {
  const intervalId = window.setInterval(() => {
    if (document.visibilityState === "visible") void loadMessages(false)
  }, MESSAGES_FALLBACK_REFRESH_MS)

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") void loadMessages(false)
  }

  document.addEventListener("visibilitychange", handleVisibilityChange)

  return () => {
    window.clearInterval(intervalId)
    document.removeEventListener("visibilitychange", handleVisibilityChange)
  }
}
