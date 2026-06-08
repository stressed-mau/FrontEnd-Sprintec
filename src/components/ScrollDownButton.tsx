import { ArrowDown } from "lucide-react"

import { useScrollDownButton } from "@/hooks/useScrollDownButton"

export default function ScrollDownButton() {
  const { isVisible, scrollDown } = useScrollDownButton()

  if (!isVisible) return null

  return (
    <button
      type="button"
      onClick={scrollDown}
      aria-label="Desplazarse hacia abajo"
      className="fixed bottom-6 left-1/2 z-50 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-white text-[#003A6C] shadow-[0_10px_30px_rgba(15,23,42,0.18)] ring-1 ring-[#A5D7E8]/60 transition-all hover:-translate-x-1/2 hover:scale-105 hover:shadow-[0_14px_36px_rgba(15,23,42,0.22)] active:scale-95"
    >
      <ArrowDown className="size-6" strokeWidth={2.5} />
    </button>
  )
}
