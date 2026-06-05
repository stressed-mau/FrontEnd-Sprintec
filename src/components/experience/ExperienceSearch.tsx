import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function ExperienceSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#4B778D]" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por empresa, cargo, correo o tipo..."
        className="h-11 border-[#A5D7E8] bg-white pl-10 text-[#003A6C]"
      />
    </div>
  )
}
