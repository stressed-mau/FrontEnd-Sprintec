import { AlertCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function PortfolioViewsErrorCard({ message }: { message: string }) {
  if (!message) return null

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="flex items-start gap-3 pt-6 text-red-700">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </CardContent>
    </Card>
  )
}
