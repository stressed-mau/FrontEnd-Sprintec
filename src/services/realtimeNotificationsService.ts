import Echo from "laravel-echo"
import Pusher from "pusher-js"

import { api } from "@/services/api"
import { getAuthToken } from "@/services/auth"

type EchoChannel = {
  notification?: (callback: (payload: unknown) => void) => EchoChannel
  listen?: (event: string, callback: (payload: unknown) => void) => EchoChannel
}

type EchoClient = {
  private: (channel: string) => EchoChannel
  leave: (channel: string) => void
}

let echoClient: EchoClient | null = null

function getNumberEnv(name: string, fallback: number) {
  const value = Number(import.meta.env[name])
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function getEchoClient() {
  const key = import.meta.env.VITE_PUSHER_APP_KEY as string | undefined

  if (!key) {
    return null
  }

  if (echoClient) {
    return echoClient
  }

  const token = getAuthToken()
  const wsHost = (import.meta.env.VITE_PUSHER_HOST as string | undefined) || window.location.hostname
  const wsPort = getNumberEnv("VITE_PUSHER_PORT", 6001)
  const wssPort = getNumberEnv("VITE_PUSHER_WSS_PORT", 443)
  const forceTLS = String(import.meta.env.VITE_PUSHER_FORCE_TLS ?? "false") === "true"
  const authEndpoint =
    (import.meta.env.VITE_BROADCAST_AUTH_ENDPOINT as string | undefined) ||
    `${String(api.defaults.baseURL ?? "/api").replace(/\/+$/, "")}/broadcasting/auth`

  echoClient = new Echo({
    broadcaster: "pusher",
    client: new Pusher(key, {
      cluster: (import.meta.env.VITE_PUSHER_APP_CLUSTER as string | undefined) || "mt1",
      wsHost,
      wsPort,
      wssPort,
      forceTLS,
      enabledTransports: forceTLS ? ["ws", "wss"] : ["ws"],
      authEndpoint,
      auth: {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    }),
  }) as EchoClient

  return echoClient
}

export function subscribeToUserNotifications(userId: string, onNotification: () => void) {
  const echo = getEchoClient()

  if (!echo || !userId) {
    return () => {}
  }

  const channelName = `${(import.meta.env.VITE_NOTIFICATIONS_CHANNEL_PREFIX as string | undefined) || "user.notifications."}${userId}`
  const channel = echo.private(channelName)

  channel.notification?.(() => onNotification())
  channel.listen?.("MessageNotificationSent", () => onNotification())
  channel.listen?.(".MessageNotificationSent", () => onNotification())
  channel.listen?.(".new_message", () => onNotification())
  channel.listen?.("new_message", () => onNotification())
  channel.listen?.(".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated", () => onNotification())

  return () => {
    echo.leave(channelName)
  }
}
