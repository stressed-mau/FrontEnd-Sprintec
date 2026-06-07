import type { ReactNode } from "react"

import { Footer } from "@/components/Footer"
import Header from "@/components/HeaderUser"
import { SectionHeader } from "@/components/sections/SectionHeader"
import Sidebar from "@/components/Sidebar"

type ExperiencePageShellProps = {
  title: string
  description: string
  children: ReactNode
  compact?: boolean
}

export function ExperiencePageShell({ title, description, children, compact = false }: ExperiencePageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className={compact ? "flex-1 p-3 sm:p-4 md:p-5" : "flex-1 p-4 sm:p-6 md:p-10"}>
          <div className={compact ? "mx-auto max-w-6xl space-y-3" : "mx-auto max-w-6xl space-y-6"}>
            <SectionHeader title={title} description={description} align="center" size={compact ? "compact" : "default"} />
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
