import { MessageDetailPanel } from "@/components/messages/MessageDetailPanel"
import { MessagesInboxPanel } from "@/components/messages/MessagesInboxPanel"
import { MessagesPageHeader } from "@/components/messages/MessagesPageHeader"
import { Footer } from "@/components/Footer"
import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { useMessagesManager } from "@/hooks/useMessagesManager"

export function MessagesPage() {
  const manager = useMessagesManager()

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <MessagesPageHeader unreadCount={manager.unreadCount} />
            <MessagesPageError message={manager.pageError} />
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <MessagesInboxPanel
                  messages={manager.messages}
                  selectedMessage={manager.selectedMessage}
                  loading={manager.loading}
                  loadingMessageId={manager.loadingMessageId}
                  onSelectMessage={(message) => void manager.selectMessage(message)}
                />
              </div>
              <div className="lg:col-span-3">
                <MessageDetailPanel selectedMessage={manager.selectedMessage} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

function MessagesPageError({ message }: { message: string }) {
  if (!message) return null

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
      {message}
    </div>
  )
}
