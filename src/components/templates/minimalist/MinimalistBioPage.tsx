import type { MinimalistUser } from "@/types/minimalistPortfolio"

type MinimalistBioPageProps = {
  user: MinimalistUser
}

export function MinimalistBioPage({ user }: MinimalistBioPageProps) {
  const biography = user.biography.trim() ? `"${user.biography}"` : "No hay biografía registrada."

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-5xl font-black text-zinc-900 tracking-tighter uppercase leading-[0.9]">Biografía</h2>
      <div className="h-1 w-12 bg-zinc-900 my-6"></div>
      <p className="text-stone-500 text-lg leading-relaxed font-light italic">{biography}</p>
    </div>
  )
}
