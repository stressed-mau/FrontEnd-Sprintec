import { useCallback, useEffect, useState } from "react"

type UseScrollDownButtonOptions = {
  revealOffset?: number
  hideOffset?: number
  targetId?: string
}

export function useScrollDownButton({
  revealOffset = 240,
  hideOffset = 200,
  targetId = "page-end",
}: UseScrollDownButtonOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)

  const updateVisibility = useCallback(() => {
    if (typeof window === "undefined") return

    const scrollTop = window.scrollY
    const viewportHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const remainingSpace = documentHeight - (scrollTop + viewportHeight)
    const canScroll = documentHeight > viewportHeight + 1

    setIsVisible(scrollTop <= revealOffset && remainingSpace > hideOffset && canScroll)
  }, [hideOffset, revealOffset])

  const scrollDown = useCallback(() => {
    if (typeof window === "undefined") return

    const target = document.getElementById(targetId)
    target?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [targetId])

  useEffect(() => {
    updateVisibility()
    window.addEventListener("scroll", updateVisibility, { passive: true })
    window.addEventListener("resize", updateVisibility)

    return () => {
      window.removeEventListener("scroll", updateVisibility)
      window.removeEventListener("resize", updateVisibility)
    }
  }, [updateVisibility])

  return {
    isVisible,
    scrollDown,
  }
}
