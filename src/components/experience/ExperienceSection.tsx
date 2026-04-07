import type { ReactNode } from "react"
import { Briefcase, Edit, GraduationCap, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatExperienceDate, type ExperienceItem } from "@/hooks/useExperienceManager"

type ExperienceSectionProps = {
  title: string
  emptyMessage: string
  icon: ReactNode
  items: ExperienceItem[]
  onEdit: (experience: ExperienceItem) => void
  onDelete: (id: number) => void
}

export function ExperienceSection({
  title,
  emptyMessage,
  icon,
  items,
  onEdit,
  onDelete,
}: ExperienceSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-[#003A6C]">
        {icon}
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      </div>

      {items.length === 0 ? (
        <Card className="rounded-3xl border-2 border-dashed border-[#6dacbf] bg-white py-0 shadow-sm">
          <CardContent className="px-6 py-12 text-center sm:py-14">
            <p className="py-4 text-center text-sm text-[#4B778D] sm:text-base">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((experience) => (
            <Card key={experience.id} className="rounded-3xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
              <CardHeader className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    {experience.image ? (
                      <img
                        src={experience.image}
                        alt={`Logo de ${experience.company}`}
                        className="size-14 shrink-0 rounded-lg object-cover shadow-sm sm:size-16"
                      />
                    ) : (
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C] sm:size-16">
                        {experience.type === "laboral" ? (
                          <Briefcase className="size-7" />
                        ) : (
                          <GraduationCap className="size-7" />
                        )}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-semibold text-[#003A6C]">
                        {experience.position}
                      </CardTitle>
                      <p className="mt-1 text-[#4B778D]">{experience.company}</p>
                      <p className="mt-1 text-sm text-[#6B7E8E]">
                        {formatExperienceDate(experience.startDate)} - {experience.current ? "Actual" : formatExperienceDate(experience.endDate)}
                      </p>
                      {experience.description ? (
                        <p className="mt-2 text-sm leading-6 text-[#355468]">{experience.description}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex gap-2 self-end sm:self-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(experience)}
                      className="border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(experience.id)}
                      className="border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FFF1F1]"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
