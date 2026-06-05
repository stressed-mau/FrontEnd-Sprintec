import { Mail, MapPin } from "lucide-react"
import type { MinimalistUser } from "@/types/minimalistPortfolio"

type MinimalistSidebarProps = {
  user: MinimalistUser
}

export function MinimalistSidebar({ user }: MinimalistSidebarProps) {
  return (
    <div className="w-full md:w-1/3 bg-stone-50 p-6 md:p-8 flex flex-col items-center text-center border-r border-stone-100">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-white shadow-sm">
          <img src={user.imageUrl || "https://via.placeholder.com/150"} alt={user.fullname} className="w-full h-full object-cover grayscale" />
        </div>
        <h1 className="text-2xl font-black leading-tight tracking-tighter uppercase mb-2">{user.fullname}</h1>
        <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">{user.occupation}</p>
      </div>
      <div className="mt-auto space-y-4">
        <div className="flex items-center gap-3 text-stone-500">
          <Mail size={14} />
          <span className="text-xs font-medium">{user.publicEmail}</span>
        </div>
        <div className="flex items-center gap-3 text-stone-500">
          <MapPin size={14} />
          <span className="text-xs font-medium">{user.nationality}</span>
        </div>
      </div>
    </div>
  )
}
