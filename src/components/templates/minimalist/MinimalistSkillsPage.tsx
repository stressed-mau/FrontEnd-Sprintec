import type { MinimalistSkill } from "@/types/minimalistPortfolio"

type MinimalistSkillsPageProps = {
  skills: MinimalistSkill[]
}

export function MinimalistSkillsPage({ skills }: MinimalistSkillsPageProps) {
  const technicalSkills = skills.filter((skill) => skill.type === "tecnica")
  const softSkills = skills.filter((skill) => skill.type === "blanda")

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Habilidades</h2>
      <SkillGroup title="Tecnicas" skills={technicalSkills} showLevel />
      <SkillGroup title="Blandas" skills={softSkills} />
    </div>
  )
}

function SkillGroup({ title, skills, showLevel = false }: { title: string; skills: MinimalistSkill[]; showLevel?: boolean }) {
  if (!skills.length) return null

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-stone-400">{title}</h3>
      <div className="grid grid-cols-2 gap-y-6 gap-x-5">
        {skills.map((skill) => (
          <div key={skill.id} className="group">
            {showLevel ? (
              <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest group-hover:text-zinc-900 transition-colors">
                {skill.level}
              </p>
            ) : null}
            <p className="text-base font-bold text-zinc-800">{skill.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
