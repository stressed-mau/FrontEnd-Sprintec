import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AuthCardProps = {
  cardClassName?: string
  children: ReactNode
  description: ReactNode
  icon: LucideIcon
  iconClassName: string
  title: ReactNode
}

export function AuthCard({ cardClassName, children, description, icon: Icon, iconClassName, title }: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#C2DBED]">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-md">
          <Card className={cardClassName}>
            <CardHeader className="space-y-4 text-center">
              <div className={iconClassName}>
                <Icon className="size-8" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-[#003A6C]">{title}</CardTitle>
                <CardDescription className="text-sm leading-6 text-[#4F6F88]">{description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">{children}</CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
