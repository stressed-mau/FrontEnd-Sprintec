type CorporateHeroSectionProps = {
  displayName: string
  displayRole: string
  initials: string
}

export function CorporateHeroSection({ displayName, displayRole, initials }: CorporateHeroSectionProps) {
  return (
    <section className="border-t border-white/10 bg-[linear-gradient(180deg,#111111_0%,#181512_100%)] px-8 py-10 text-white">
      <div className="flex items-start justify-between gap-8">
        <div className="max-w-4xl">
          <div className="text-[clamp(4rem,10vw,7.2rem)] font-black uppercase leading-[0.84] tracking-[-0.08em] text-[#F6F1E8]">
            {displayName}
          </div>
          {displayRole ? (
            <p className="mt-4 text-base uppercase tracking-[0.38em] text-[#D2B082]">
              {displayRole}
            </p>
          ) : null}
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#D2B082]/45 bg-[#D2B082]/10 text-[#F3E3C9] shadow-[0_12px_30px_rgba(214,169,107,0.12)]">
          <span className="text-lg font-black tracking-[-0.06em]">{initials}</span>
        </div>
      </div>
    </section>
  )
}
