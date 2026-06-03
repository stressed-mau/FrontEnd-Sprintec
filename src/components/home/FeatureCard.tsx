import type { ReactNode } from "react"

type FeatureCardProps = {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-[#0e6db6] bg-[#F8FAFC] p-3 sm:p-5 lg:p-6 transition-shadow hover:shadow-md">
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-white shadow-sm sm:mb-4 sm:size-11 lg:size-12">
        {icon}
      </div>

      <h3 className="mb-2 text-sm font-bold leading-snug text-[#003A6C] sm:text-base lg:text-xl">
        {title}
      </h3>

      <p className="text-xs leading-snug text-[#4982AD] sm:text-sm sm:leading-relaxed lg:text-base">
        {description}
      </p>
    </div>
  )
}