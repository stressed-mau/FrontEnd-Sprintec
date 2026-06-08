import { Award, Heart } from "lucide-react"

type ModernHeaderProps = {
  displayOccupation: string
}

export function ModernHeader({ displayOccupation }: ModernHeaderProps) {
  return (
    <header className="relative pt-10 pb-10 px-10 text-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-[#173b61]/10 to-transparent opacity-50 -z-10"></div>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center gap-3 mb-8">
          <Heart size={28} className="text-[#ee8e3b] fill-[#ee8e3b] animate-pulse" />
          <Award size={28} className="text-[#2f606b]" />
        </div>
       <h1 className="text-[50px] md:text-[90px] font-black leading-[0.9] tracking-tight drop-shadow-sm">
  P<span className="text-transparent bg-clip-text bg-linear-to-r from-[#173b61] to-[#ee8e3b]">ORTAFOLIO</span><br />
  <span className="text-transparent bg-clip-text bg-linear-to-r from-[#Ee8e3b] to-[#173b61]">GEN</span>
</h1>
        <div className="mt-10 inline-block bg-[#173b61] px-6 py-2 rounded-full">
          <p className="text-sm md:text-lg font-bold tracking-[0.2em] text-[#fcecd4]">
            {displayOccupation.toUpperCase()}
          </p>
        </div>
      </div>
    </header>
  )
}
