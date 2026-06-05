type CorporateSkillsSectionProps = {
  skills: string[]
  isActive?: boolean
  mode: "mobile" | "desktop"
}

export function CorporateSkillsSection({ skills, isActive = false, mode }: CorporateSkillsSectionProps) {
  const isDesktop = mode === "desktop"
  if (!skills.length && isDesktop) return null

  return (
    <section id={isDesktop ? "corporate-skills" : undefined} className={getSectionClassName(isDesktop, isActive)}>
      <div className={isDesktop ? "rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,#1F1F1F_0%,#171717_100%)] p-4 text-white lg:rounded-[1.7rem] lg:p-6" : ""}>
        {!isDesktop ? <p className="text-xs uppercase tracking-[0.32em] text-white/45">Capacidades</p> : null}
        <h3 className={isDesktop ? "text-4xl font-black tracking-[-0.05em]" : "mt-2 text-3xl font-bold text-white"}>Skills</h3>
        <div className="mt-6 flex flex-wrap gap-3">
          {skills.length ? (
            skills.map((skill) => <SkillPill key={skill} skill={skill} />)
          ) : (
            <p className="text-sm text-white/60">No hay habilidades disponibles.</p>
          )}
        </div>
      </div>
    </section>
  )
}

function SkillPill({ skill }: { skill: string }) {
  return (
    <span className="rounded-full border border-white/12 bg-white/4 px-4 py-2 text-sm font-semibold text-white/86 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B] hover:bg-[#D6A96B]/12 hover:text-[#F4D8AE]">
      {skill}
    </span>
  )
}

function getSectionClassName(isDesktop: boolean, isActive: boolean) {
  if (!isDesktop) return ""
  return `rounded-[1.5rem] p-1 transition-colors duration-300 lg:rounded-[2rem] ${isActive ? "bg-[#8FA4B7]/35" : ""}`
}
