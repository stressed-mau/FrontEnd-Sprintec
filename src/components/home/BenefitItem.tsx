import type { ReactNode } from "react"

type BenefitItemProps = {
  icon: ReactNode
  color: string
  title: string
  description: string
}

export function BenefitItem({
  icon,
  color,
  title,
  description,
}: BenefitItemProps) {
  return (
    <div className="flex gap-4 lg:gap-6">
      <div
        className={`shrink-0 size-12 lg:size-14 ${color} rounded-2xl flex items-center justify-center shadow-sm`}
      >
        {icon}
      </div>

      <div>
        <h3 className="mb-1 text-lg font-bold text-[#003A6C] lg:text-xl">
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-[#4982AD] lg:text-base">
          {description}
        </p>
      </div>
    </div>
  )
}