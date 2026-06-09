import type { ModernSkill } from "@/types/modernPortfolio"

type ModernSkillsSectionProps = {
  technicalSkills: ModernSkill[]
  softSkills: ModernSkill[]
}

export function ModernSkillsSection({ technicalSkills, softSkills }: ModernSkillsSectionProps) {
  if (!technicalSkills.length && !softSkills.length) return null

  return (
    <section className="py-24 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black tracking-tight text-[#173b61] md:text-5xl">Habilidades</h2>
          <p className="mt-3 text-sm font-medium uppercase tracking-[0.3em] text-[#7d959e]">Técnicas y blandas</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <SkillGroup
            title="Habilidades técnicas"
            cardAccentClassName="border-[#ee8e3b]"
            badgeClassName="text-[#ee8e3b]"
            skills={technicalSkills}
            kind="technical"
          />
          <SkillGroup
            title="Habilidades blandas"
            cardAccentClassName="border-[#2f606b]"
            badgeClassName="text-[#2f606b]"
            skills={softSkills}
            kind="soft"
          />
        </div>
      </div>
    </section>
  )
}

function SkillGroup({ title, cardAccentClassName, badgeClassName, skills, kind }: { title: string; cardAccentClassName: string; badgeClassName: string; skills: ModernSkill[]; kind: "technical" | "soft" }) {
  if (!skills.length) return null

  return (
    <div className="rounded-[2rem] bg-white/70 p-6 shadow-xl ring-1 ring-[#173b61]/10 backdrop-blur-sm md:p-8">
      <h3 className="mb-6 border-b border-[#173b61]/10 pb-3 text-2xl font-black text-[#173b61]">{title}</h3>
      {kind === "technical" ? <TechnicalSkillsList skills={skills} cardAccentClassName={cardAccentClassName} /> : <SoftSkillsGrid skills={skills} badgeClassName={badgeClassName} />}
    </div>
  )
}

function SoftSkillsGrid({ skills, badgeClassName }: { skills: ModernSkill[]; badgeClassName: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {skills.map((skill) => (
        <SoftSkill key={skill.key} skill={skill} badgeClassName={badgeClassName} />
      ))}
    </div>
  )
}

function SoftSkill({ skill, badgeClassName }: { skill: ModernSkill; badgeClassName: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#173b61]/10 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#173b61] text-3xl font-black text-white ${badgeClassName}`}>
        {skill.name.slice(0, 1).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="break-words text-lg font-black leading-tight text-[#173b61] md:text-xl">{skill.name}</p>
      </div>
    </div>
  )
}

function TechnicalSkillsList({ skills, cardAccentClassName }: { skills: ModernSkill[]; cardAccentClassName: string }) {
  return (
    <div className="flex-1">
      <div className="space-y-4">
        {skills.map((skill) => <TechnicalSkillRow key={skill.key} skill={skill} cardAccentClassName={cardAccentClassName} />)}
      </div>
    </div>
  )
}

function TechnicalSkillRow({ skill, cardAccentClassName }: { skill: ModernSkill; cardAccentClassName: string }) {
  return (
    <div className={`group flex items-start justify-between gap-4 rounded-2xl border-l-8 bg-white p-5 shadow-sm transition-all hover:shadow-md ${cardAccentClassName}`}>
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fcecd4] font-bold text-[#173b61]">✓</div>
        <p className="break-words text-xl font-bold leading-tight text-[#173b61]">{skill.name}</p>
      </div>
      <div className="min-w-0 shrink-0 text-right">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7d959e]">Nivel de dominio</p>
        <p className="mt-1 text-sm font-black uppercase tracking-[0.24em] text-[#173b61]">
          {skill.levelLabel || skill.sublabel || "No disponible"}
        </p>
      </div>
    </div>
  )
}