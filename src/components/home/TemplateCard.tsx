import { Palette } from "lucide-react"

type TemplateCardProps = {
  title: string
  description: string
  img: string
  isFeatured?: boolean
}

export function TemplateCard({
  title,
  description,
  img,
  isFeatured = false,
}: TemplateCardProps) {
  return (
    <div
      className={`bg-white rounded-3xl border ${
        isFeatured
          ? "border-2 border-[#C2DBED] shadow-xl lg:scale-105"
          : "border-[#C2DBED] shadow-sm"
      } flex flex-col overflow-hidden hover:shadow-2xl transition-all group hover:-translate-y-1`}
    >
      <div className="relative h-48 overflow-hidden lg:h-60">
        <img
          src={img}
          alt={`Portada de ${title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute bottom-3 right-3 rounded-full bg-white/85 p-2 shadow-sm">
          <Palette className="size-5 text-[#003A6C]" />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-4 p-6 lg:p-8">
        <div>
          <h3 className="text-xl font-bold text-[#003A6C] lg:text-2xl">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-[#4982AD] lg:text-base">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}