import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function ProjectSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nombre, rol o tecnología..."
        className="h-11 border-gray-300 bg-white pl-10 text-gray-900 focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
      />
    </div>
  )
}
