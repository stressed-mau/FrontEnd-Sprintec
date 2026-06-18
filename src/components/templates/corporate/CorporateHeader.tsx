type CorporateHeaderProps = {
  displayEmail: string
  displayLocation: string
  displayPhone: string
}

export function CorporateHeader({ displayEmail, displayLocation, displayPhone }: CorporateHeaderProps) {
  return (
    <header className="border-b border-white/10 px-5 py-5 sm:px-8">
      <div className="flex flex-col gap-3 text-[11px] uppercase tracking-[0.32em] text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-full border border-[#8C6E46]/40 bg-[#D6A96B]/10 px-4 py-2 font-semibold text-[#F3E3C9]">
          Presentacion Corporativa
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end sm:gap-6">
          {displayEmail ? <span>{displayEmail}</span> : null}
          {displayLocation ? <span>{displayLocation}</span> : null}
          {displayPhone ? <span>{displayPhone}</span> : null}
          <span>Portfolio Preview</span>
        </div>
      </div>
    </header>
  )
}
