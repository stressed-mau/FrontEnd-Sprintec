import type { ModernSkill } from "@/types/modernPortfolio"

type ModernSkillsSectionProps = {
  skills: ModernSkill[]
  highlightedSkills: ModernSkill[]
}

export function ModernSkillsSection({ skills, highlightedSkills }: ModernSkillsSectionProps) {
  if (!skills.length) return null

  const technicalSkills = skills.filter((skill) => skill.type === "tecnica")
  const softSkills = skills.filter((skill) => skill.type === "blanda")
  const highlightedTechnicalSkills = highlightedSkills.filter((skill) => skill.type === "tecnica").slice(0, 4)

  return (
    <section className="py-24 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          <HighlightedSkills skills={highlightedTechnicalSkills.length ? highlightedTechnicalSkills : technicalSkills.slice(0, 4)} />
          <SkillList technicalSkills={technicalSkills} softSkills={softSkills} />
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
          <h3 className="text-3xl font-black mb-2">Habilidades</h3>
          <p className="mb-8 border-b border-[#fcecd4]/20 pb-4 text-xs font-bold uppercase tracking-[0.26em] text-[#ee8e3b]">Tecnicas destacadas</p>
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
      <span className="rounded-full bg-[#fcecd4]/10 px-2 py-1 text-[10px] font-bold uppercase text-[#ee8e3b]">{skill.level}</span>
    </div>
  )
}

function SkillList({ technicalSkills, softSkills }: { technicalSkills: ModernSkill[]; softSkills: ModernSkill[] }) {
  return (
    <div className="flex-1">
      <div className="-mt-10 space-y-8">
        <SkillGroup title="Habilidades tecnicas" skills={technicalSkills} showLevel />
        <SkillGroup title="Habilidades blandas" skills={softSkills} />
      </div>
    </div>
  )
}

function SkillGroup({ title, skills, showLevel = false }: { title: string; skills: ModernSkill[]; showLevel?: boolean }) {
  if (!skills.length) return null

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-black uppercase tracking-[0.28em] text-[#2f606b]">{title}</h4>
      {skills.map((skill) => <SkillRow key={skill.key} skill={skill} showLevel={showLevel} />)}
    </div>
  )
}

function SkillRow({ skill, showLevel }: { skill: ModernSkill; showLevel: boolean }) {
  return (
    <div className="group flex items-center justify-between gap-4 p-5 bg-white rounded-2xl shadow-sm border-l-8 border-[#ee8e3b] hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-[#fcecd4] flex items-center justify-center text-[#173b61] font-bold">✓</div>
        <p className="text-xl font-bold">{skill.name}</p>
      </div>
      {showLevel ? <span className="shrink-0 text-xs font-bold text-[#7d959e] uppercase tracking-widest">{skill.level}</span> : null}
    </div>
  )
}
