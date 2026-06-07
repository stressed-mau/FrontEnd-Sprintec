import type { CorporateSkillItem } from "@/types/corporatePortfolio"

type CorporateSkillsSectionProps = {
  skills: CorporateSkillItem[]
  isActive?: boolean
  mode: "mobile" | "desktop"
}

export function CorporateSkillsSection({ skills, isActive = false, mode }: CorporateSkillsSectionProps) {
  const isDesktop = mode === "desktop"
  if (!skills.length && isDesktop) return null

  const technicalSkills = skills.filter((skill) => skill.type === "tecnica")
  const softSkills = skills.filter((skill) => skill.type === "blanda")

  return (
    <section id={isDesktop ? "corporate-skills" : undefined} className={getSectionClassName(isDesktop, isActive)}>
      <div className={isDesktop ? "rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,#1F1F1F_0%,#171717_100%)] p-4 text-white lg:rounded-[1.7rem] lg:p-6" : ""}>
        {!isDesktop ? <p className="text-xs uppercase tracking-[0.32em] text-white/45">Capacidades</p> : null}
        <h3 className={isDesktop ? "text-4xl font-black tracking-[-0.05em]" : "mt-2 text-3xl font-bold text-white"}>Skills</h3>
        {skills.length ? (
          <div className="mt-6 space-y-6">
            <SkillGroup title="Tecnicas" skills={technicalSkills} showLevel />
            <SkillGroup title="Blandas" skills={softSkills} />
          </div>
        ) : (
          <p className="mt-6 text-sm text-white/60">No hay habilidades disponibles.</p>
        )}
      </div>
    </section>
  )
}

function SkillGroup({ title, skills, showLevel = false }: { title: string; skills: CorporateSkillItem[]; showLevel?: boolean }) {
  if (!skills.length) return null

  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-[0.28em] text-[#D6A96B]">{title}</h4>
      <div className="mt-3 flex flex-wrap gap-3">
        {skills.map((skill) => <SkillPill key={skill.id} skill={skill} showLevel={showLevel} />)}
      </div>
    </div>
  )
}

function SkillPill({ skill, showLevel }: { skill: CorporateSkillItem; showLevel: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/4 px-4 py-2 text-sm font-semibold text-white/86 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B] hover:bg-[#D6A96B]/12 hover:text-[#F4D8AE]">
      {skill.name}
      {showLevel ? <span className="rounded-full bg-[#D6A96B]/18 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[#F4D8AE]">{skill.level}</span> : null}
    </span>
  )
}

function getSectionClassName(isDesktop: boolean, isActive: boolean) {
  if (!isDesktop) return ""
  return `rounded-[1.5rem] p-1 transition-colors duration-300 lg:rounded-[2rem] ${isActive ? "bg-[#8FA4B7]/35" : ""}`
}
