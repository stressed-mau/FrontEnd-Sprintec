import { useState } from "react"

export function usePasswordVisibility(initialValue = false) {
  const [isVisible, setIsVisible] = useState(initialValue)

  function toggleVisibility() {
    setIsVisible((current) => !current)
  }

  return {
    isVisible,
    toggleVisibility,
  }
}

