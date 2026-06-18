import { Mail, MapPin, Phone } from "lucide-react"
import { CorporateProfileImage } from "@/components/templates/corporate/CorporateProfileImage"
import { CorporateSocialLinks } from "@/components/templates/corporate/CorporateSocialLinks"
import type { CorporateTemplateData } from "@/types/corporatePortfolio"

type CorporateIntroSectionProps = {
  data: CorporateTemplateData
  isActive?: boolean
  mode: "mobile" | "desktop"
  onSocialClick?: (network: unknown) => void
}

export function CorporateIntroSection({ data, isActive = false, mode, onSocialClick }: CorporateIntroSectionProps) {
  if (mode === "mobile") {
    return <CorporateMobileIntro data={data} onSocialClick={onSocialClick} />
  }

  return <CorporateDesktopIntro data={data} isActive={isActive} onSocialClick={onSocialClick} />
}

function CorporateMobileIntro({ data, onSocialClick }: Omit<CorporateIntroSectionProps, "mode" | "isActive">) {
  return (
    <section className="grid gap-4 rounded-[1.5rem] border border-[#D7C3A4] bg-[#E7D3B3] p-4 text-[#111111] lg:grid-cols-[0.74fr_1.26fr] lg:items-stretch lg:p-6">
      <CorporateProfileCard data={data} imageClassName="h-40 w-36 rounded-[1.75rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:h-52 lg:w-44" />
      <div className="flex flex-col justify-between gap-4 lg:gap-5">
        <CorporateIntroCopy data={data} onSocialClick={onSocialClick} />
      </div>
    </section>
  )
}

function CorporateDesktopIntro({ data, isActive, onSocialClick }: Omit<CorporateIntroSectionProps, "mode">) {
  return (
    <section
      id="corporate-intro"
      className={`grid border-t transition-colors duration-300 lg:grid-cols-[0.72fr_1.28fr] ${
        isActive ? "border-[#D1B58C] bg-[#E8D5B7] text-[#111111]" : "border-white/10 bg-[#E4CFAD] text-[#111111]"
      }`}
    >
      <div className="border-r border-black/10 px-8 py-10">
        <CorporateProfileCard data={data} imageClassName="h-64 w-56 rounded-[2rem] border border-white/35 shadow-[0_24px_55px_rgba(0,0,0,0.18)]" />
      </div>
      <div className="px-8 py-10">
        <CorporateIntroCopy data={data} desktop onSocialClick={onSocialClick} />
      </div>
    </section>
  )
}

function CorporateProfileCard({ data, imageClassName }: { data: CorporateTemplateData; imageClassName: string }) {
  return (
    <div className="rounded-[1.8rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.2))] p-6 shadow-[0_18px_40px_rgba(99,72,35,0.08)]">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-[#6F6250]">
        <span>Perfil</span>
        <span>{data.initials}</span>
      </div>
      <div className="mt-6 flex min-h-90 items-center justify-center">
        <CorporateProfileImage
          alt={data.displayName}
          className={imageClassName}
          initials={data.initials}
          initialsClassName="text-7xl tracking-[-0.08em]"
          src={data.displayProfileImage}
        />
      </div>
    </div>
  )
}

function CorporateIntroCopy({ data, desktop = false, onSocialClick }: { data: CorporateTemplateData; desktop?: boolean; onSocialClick?: (network: unknown) => void }) {
  return (
    <>
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[#7B6D5B]">Introduccion</p>
        <h3 className={desktop ? "mt-3 text-5xl font-black leading-[0.92] tracking-[-0.05em]" : "mt-3 text-3xl font-bold text-[#111111] sm:text-4xl"}>
          Perfil profesional
        </h3>
      </div>
      {data.displayRole ? <CorporateRole role={data.displayRole} desktop={desktop} /> : null}
      {data.displaySummary ? <CorporateSummary summary={data.displaySummary} desktop={desktop} /> : null}
      {data.hasContactInfo ? <CorporateContact data={data} desktop={desktop} onSocialClick={onSocialClick} /> : null}
    </>
  )
}

function CorporateRole({ role, desktop }: { role: string; desktop: boolean }) {
  if (desktop) return <p className="mt-8 text-4xl font-bold tracking-[-0.04em] text-[#1A1714]">{role}</p>
  return <div className="rounded-[1.25rem] border border-black/10 bg-white/40 p-4 lg:rounded-[1.5rem] lg:p-5"><p className="text-xs uppercase tracking-[0.28em] text-[#7B6D5B]">Rol</p><p className="mt-3 text-xl font-bold text-[#111111]">{role}</p></div>
}

function CorporateSummary({ summary, desktop }: { summary: string; desktop: boolean }) {
  if (desktop) return <p className="mt-6 max-w-3xl text-sm leading-7 text-[#4B545D]">{summary}</p>
  return <div className="rounded-[1.25rem] border border-black/10 bg-white/40 p-4 lg:rounded-[1.5rem] lg:p-5"><p className="text-sm leading-7 text-[#4B545D]">{summary}</p></div>
}

function CorporateContact({ data, desktop, onSocialClick }: { data: CorporateTemplateData; desktop: boolean; onSocialClick?: (network: unknown) => void }) {
  const linkClassName = desktop
    ? "inline-flex items-center gap-2 rounded-full border border-[#8C6E46]/70 bg-[#D6A96B]/35 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1F2933] shadow-[0_8px_18px_rgba(99,72,35,0.10)] transition hover:-translate-y-0.5 hover:border-[#1F2933] hover:bg-[#1F2933] hover:text-[#F4D8AE]"
    : "inline-flex items-center gap-2 rounded-full border border-[#8C6E46]/70 bg-[#D6A96B]/35 px-3 py-2 text-xs font-bold text-[#1F2933] shadow-[0_8px_18px_rgba(99,72,35,0.10)] transition hover:border-[#1F2933] hover:bg-[#1F2933] hover:text-[#F4D8AE]"

  return (
    <div className={desktop ? "mt-8" : "rounded-[1.25rem] border border-black/10 bg-white/40 p-4 lg:rounded-[1.5rem] lg:p-5"}>
      {!desktop ? <p className="text-xs uppercase tracking-[0.28em] text-[#7B6D5B]">Datos personales</p> : null}
      <CorporateContactInfo data={data} desktop={desktop} />
      <CorporateSocialLinks links={data.socialLinks} className={desktop ? "mt-6 flex flex-wrap gap-3" : "flex flex-wrap gap-2 pt-2"} linkClassName={linkClassName} onSocialClick={onSocialClick} />
    </div>
  )
}

function CorporateContactInfo({ data, desktop }: { data: CorporateTemplateData; desktop: boolean }) {
  if (!data.displayEmail && !data.displayLocation && !data.displayPhone) return null
  if (!desktop) return <div className="mt-4 grid gap-3 text-sm text-[#3D4348]"><CorporateEmail email={data.displayEmail} /><CorporateLocation location={data.displayLocation} /><CorporatePhone phone={data.displayPhone} /></div>

  return (
    <div className="grid max-w-3xl gap-4 md:grid-cols-2">
      {data.displayEmail ? <CorporateInfoCard label="Correo"><CorporateEmail email={data.displayEmail} /></CorporateInfoCard> : null}
      {data.displayLocation ? <CorporateInfoCard label="Ubicacion"><CorporateLocation location={data.displayLocation} /></CorporateInfoCard> : null}
      {data.displayPhone ? <CorporateInfoCard label="Telefono"><CorporatePhone phone={data.displayPhone} /></CorporateInfoCard> : null}
    </div>
  )
}

function CorporateEmail({ email }: { email: string }) {
  if (!email) return null
  return <a href={`mailto:${email}`} className="flex items-center gap-3 transition hover:text-[#8C6E46]"><Mail className="h-4 w-4" />{email}</a>
}

function CorporateLocation({ location }: { location: string }) {
  if (!location) return null
  return <div className="flex items-center gap-3"><MapPin className="h-4 w-4" />{location}</div>
}

function CorporatePhone({ phone }: { phone: string }) {
  if (!phone) return null
  return <a href={`tel:${phone}`} className="flex items-center gap-3 transition hover:text-[#8C6E46]"><Phone className="h-4 w-4" />{phone}</a>
}

function CorporateInfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="rounded-[1.4rem] border border-black/10 bg-white/50 p-5 shadow-[0_12px_28px_rgba(99,72,35,0.06)]"><p className="text-xs uppercase tracking-[0.24em] text-[#7B6D5B]">{label}</p><div className="mt-3 inline-flex items-center gap-3 text-sm font-medium">{children}</div></div>
}
