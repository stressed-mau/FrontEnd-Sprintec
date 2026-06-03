import { useEffect, useRef } from "react"
import { registerVisitor } from "@/services/visitorService"

export function useVisitorTracking() {
  const hasSent = useRef(false)

  useEffect(() => {
    if (hasSent.current) return

    hasSent.current = true

    registerVisitor().catch(console.error)
  }, [])
}