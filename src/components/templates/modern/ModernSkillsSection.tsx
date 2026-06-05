import type { ModernSkill } from "@/types/modernPortfolio"

type ModernSkillsSectionProps = {
  skills: ModernSkill[]
  highlightedSkills: ModernSkill[]
}

export function ModernSkillsSection({ skills, highlightedSkills }: ModernSkillsSectionProps) {
  if (!skills.length) return null

  return (
    <section className="py-24 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          <HighlightedSkills skills={highlightedSkills} />
          <SkillList skills={skills} />
        </div>
      </div>
    </section>
  )
}

function HighlightedSkills({ skills }: { skills: ModernSkill[] }) {
  return (
    <div className="lg:w-1/3">
      <div className="sticky top-10">
        <div className="bg-[#173b61] text-[#fcecd4] p-6 rounded-[1.5rem] shadow-xl md:p-8 md:rounded-[2rem]">
          <h3 className="text-3xl font-black mb-8 border-b border-[#fcecd4]/20 pb-4">Habilidades</h3>
          <div className="grid grid-cols-2 gap-6">
            {skills.map((skill) => <HighlightedSkill key={skill.key} skill={skill} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

function HighlightedSkill({ skill }: { skill: ModernSkill }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-[#2f606b] flex items-center justify-center text-[#ee8e3b] text-lg font-black">
        {skill.name.slice(0, 1).toUpperCase()}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{skill.name}</span>
    </div>
  )
}

function SkillList({ skills }: { skills: ModernSkill[] }) {
  return (
    <div className="flex-1">
      <div className="-mt-10 space-y-4">
        {skills.map((skill) => <SkillRow key={skill.key} skill={skill} />)}
      </div>
    </div>
  )
}

function SkillRow({ skill }: { skill: ModernSkill }) {
  return (
    <div className="group flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border-l-8 border-[#ee8e3b] hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-[#fcecd4] flex items-center justify-center text-[#173b61] font-bold">✓</div>
        <p className="text-xl font-bold">{skill.name}</p>
      </div>
      {skill.level ? <span className="text-xs font-bold text-[#7d959e] uppercase tracking-widest">{skill.sublabel}</span> : null}
    </div>
  )
}
