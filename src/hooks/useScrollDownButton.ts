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

  const getNextSectionTarget = useCallback(() => {
    if (typeof window === "undefined") return null

    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section, section")).filter(
      (section) => section.getBoundingClientRect().height > 0
    )
    const currentTop = window.scrollY + 8

    return sections.find((section) => section.getBoundingClientRect().top + window.scrollY > currentTop) ?? document.getElementById(targetId)
  }, [targetId])

  const updateVisibility = useCallback(() => {
    if (typeof window === "undefined") return

    const viewportHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const canScroll = documentHeight > viewportHeight + 1

    setIsVisible(canScroll)
  }, [hideOffset, revealOffset])

  const scrollDown = useCallback(() => {
    if (typeof window === "undefined") return

    const target = getNextSectionTarget()
    target?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [getNextSectionTarget])

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
