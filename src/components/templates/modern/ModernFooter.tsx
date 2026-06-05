type ModernFooterProps = {
  displayName: string
}

export function ModernFooter({ displayName }: ModernFooterProps) {
  return (
    <footer className="py-10 text-center border-t border-[#7d959e]/10">
      <p className="text-[10px] font-black tracking-[0.5em] text-[#7d959e] uppercase">
        Portafolio Profesional • {displayName}
      </p>
    </footer>
  )
}
