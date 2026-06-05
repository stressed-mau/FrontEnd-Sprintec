import type { ReactNode } from "react"

import { Footer } from "@/components/Footer"
import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"

type EducationPageShellProps = {
  title: string
  description: string
  children: ReactNode
  compact?: boolean
}

export function EducationPageShell({ title, description, children, compact = false }: EducationPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className={compact ? "flex-1 p-3 sm:p-4 md:p-5" : "flex-1 p-4 sm:p-6 md:p-10"}>
          <div className={compact ? "mx-auto max-w-6xl space-y-3" : "mx-auto max-w-6xl space-y-6"}>
            <div className="text-center sm:text-left">
              <h1 className={compact ? "text-2xl font-bold text-[#003A6C] md:text-3xl" : "text-3xl font-bold text-[#003A6C] md:text-4xl"}>{title}</h1>
              <p className={compact ? "mt-1 text-sm text-[#4B778D]" : "mt-2 text-sm text-[#4B778D] md:text-base"}>{description}</p>
            </div>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
