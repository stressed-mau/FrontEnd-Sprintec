import type { MinimalistSkill } from "@/types/minimalistPortfolio"

type MinimalistSkillsPageProps = {
  skills: MinimalistSkill[]
}

export function MinimalistSkillsPage({ skills }: MinimalistSkillsPageProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Habilidades</h2>
      <div className="grid grid-cols-2 gap-y-6 pt-4">
        {skills.map((skill) => (
          <div key={skill.id} className="group">
            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest group-hover:text-zinc-900 transition-colors">
              {skill.level}
            </p>
            <p className="text-base font-bold text-zinc-800">{skill.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
