import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react"
import type { ModernTemplateData } from "@/types/modernPortfolio"

type ModernProfileSectionProps = {
  data: ModernTemplateData
}

type ContactItem = {
  icon: LucideIcon
  text: string
}

export function ModernProfileSection({ data }: ModernProfileSectionProps) {
  const contactItems: ContactItem[] = [
    { icon: MapPin, text: data.displayResidence },
    { icon: Mail, text: data.displayEmail },
    { icon: Phone, text: data.displayPhone },
  ]

  return (
    <section className="py-20 px-6 md:px-20 bg-white/40 backdrop-blur-md border-y border-[#7d959e]/20">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <ModernProfileImage data={data} />
        <div className="flex-1">
          <span className="text-[#ee8e3b] font-bold tracking-widest text-sm uppercase">Sobre mí</span>
          <h2 className="text-5xl font-black mt-2 mb-6 tracking-tight">{data.displayName}</h2>
          <p className="text-xl text-[#2f606b] leading-relaxed mb-8 italic">"{data.displayBiography}"</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactItems.map((item) => <ContactCard key={item.text} item={item} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function ModernProfileImage({ data }: ModernProfileSectionProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-4 bg-linear-to-tr from-[#ee8e3b] to-[#2f606b] rounded-full opacity-30 group-hover:opacity-50 transition-opacity blur-lg"></div>
      {data.imageUrl ? (
        <img src={data.imageUrl} alt={data.displayName} className="relative w-64 h-64 rounded-full border-12 border-white shadow-2xl object-cover z-10" />
      ) : (
        <div className="relative w-64 h-64 rounded-full border-12 border-white shadow-2xl bg-[#173b61] text-[#fcecd4] flex items-center justify-center text-6xl font-black z-10">
          {data.userInitial}
        </div>
      )}
    </div>
  )
}

function ContactCard({ item }: { item: ContactItem }) {
  const Icon = item.icon
  return (
    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl shadow-sm border border-white/80">
      <Icon size={18} className="text-[#ee8e3b]" />
      <span className="text-sm font-semibold">{item.text}</span>
    </div>
  )
}
