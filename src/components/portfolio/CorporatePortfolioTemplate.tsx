import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  LayoutGrid,
  Link as LinkIcon,
  Mail,
  MapPin,
  Rocket,
  UserRound,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react"

type CorporatePortfolioLink = {
  id: string
  label: string
  url: string
}

type CorporatePortfolioData = {
  fullName: string
  role?: string
  summary?: string
  email?: string
  location?: string
  githubUrl?: string
  linkedinUrl?: string
  socialLinks?: CorporatePortfolioLink[]
  skills?: string[]
  experience?: Array<{
    id: string
    title: string
    organization: string
    period: string
    description: string
  }>
  education?: Array<{
    id: string
    title: string
    institution: string
    period: string
  }>
  projects?: Array<{
    id: string
    name: string
    description: string
    stack: string[]
  }>
}

type CorporatePortfolioTemplateProps = {
  data: CorporatePortfolioData
}

type Sheet = {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
  content: ReactNode
}

function getInitials(name: string) {
  const trimmedName = name.trim()

  if (!trimmedName) {
    return "CP"
  }

  return trimmedName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

function normalizeSocialLinks(data: CorporatePortfolioData) {
  const dynamicLinks = (data.socialLinks ?? []).filter((link) => link.label.trim() && link.url.trim())

  if (dynamicLinks.length > 0) {
    return dynamicLinks
  }

  const fallbackLinks: CorporatePortfolioLink[] = []

  if (data.githubUrl?.trim()) {
    fallbackLinks.push({
      id: "github",
      label: "GitHub",
      url: data.githubUrl,
    })
  }

  if (data.linkedinUrl?.trim()) {
    fallbackLinks.push({
      id: "linkedin",
      label: "LinkedIn",
      url: data.linkedinUrl,
    })
  }

  return fallbackLinks
}

export function CorporatePortfolioTemplate({ data }: CorporatePortfolioTemplateProps) {
  const initials = getInitials(data.fullName)
  const socialLinks = useMemo(() => normalizeSocialLinks(data), [data])
  const skills = data.skills ?? []
  const experience = data.experience ?? []
  const education = data.education ?? []
  const projects = data.projects ?? []
  const hasContactInfo = Boolean(data.email?.trim() || data.location?.trim() || socialLinks.length)

  const sheets = useMemo<Sheet[]>(() => {
    const nextSheets: Sheet[] = [
      {
        id: "corporate-intro",
        label: "Introduccion",
        icon: UserRound,
        content: (
          <section className="grid gap-6 rounded-[2rem] border border-[#D7C3A4] bg-[#E7D3B3] p-6 text-[#111111] lg:grid-cols-[0.74fr_1.26fr] lg:items-stretch">
            <div className="rounded-[1.75rem] border border-black/10 bg-white/35 p-6 lg:p-7">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-[#6F6250]">
                <span>Perfil</span>
                <span>{initials}</span>
              </div>

              <div className="flex min-h-[220px] items-center justify-center py-8 lg:min-h-[340px]">
                <div className="relative flex h-40 w-36 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(160deg,#D8B182_0%,#7C8EA1_100%)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:h-52 lg:w-44">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_42%)]" />
                  <span className="relative text-5xl font-black tracking-[-0.06em] text-white">
                    {initials}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 lg:gap-5">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[#7B6D5B]">Introduccion</p>
                <h3 className="mt-3 text-3xl font-bold text-[#111111] sm:text-4xl">Perfil profesional</h3>
              </div>

              {data.role?.trim() ? (
                <div className="rounded-[1.5rem] border border-black/10 bg-white/40 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#7B6D5B]">Rol</p>
                  <p className="mt-3 text-xl font-bold text-[#111111]">{data.role}</p>
                </div>
              ) : null}

              {data.summary?.trim() ? (
                <div className="rounded-[1.5rem] border border-black/10 bg-white/40 p-5">
                  <p className="text-sm leading-7 text-[#4B545D]">{data.summary}</p>
                </div>
              ) : null}

              {hasContactInfo ? (
                <div className="rounded-[1.5rem] border border-black/10 bg-white/40 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#7B6D5B]">Datos personales</p>
                  <div className="mt-4 grid gap-3 text-sm text-[#3D4348]">
                    {data.email?.trim() ? (
                      <a href={`mailto:${data.email}`} className="flex items-center gap-3 transition hover:text-[#8C6E46]">
                        <Mail className="h-4 w-4" />
                        {data.email}
                      </a>
                    ) : null}
                    {data.location?.trim() ? (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4" />
                        {data.location}
                      </div>
                    ) : null}
                    {socialLinks.length ? (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {socialLinks.map((link) => (
                          <a
                            key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-semibold text-[#3D4348] transition hover:border-[#8C6E46] hover:text-[#8C6E46]"
                        >
                          <LinkIcon className="h-3.5 w-3.5" />
                          {link.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ),
      },
    ]

    if (experience.length) {
      nextSheets.push({
        id: "corporate-experience",
        label: "Experiencia",
        icon: BriefcaseBusiness,
        content: (
          <section>
            <h3 className="text-3xl font-bold">Experiencia</h3>
            <div className="mt-6 space-y-4">
              {experience.map((item, index) => (
                <article
                  key={item.id}
                  className="rounded-[1.6rem] border border-black/10 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#111111] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6E46]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h4 className="mt-2 text-xl font-bold">{item.title}</h4>
                      <p className="mt-1 text-sm font-medium text-[#5E6670]">{item.organization}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7C8791]">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#47515B]">{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        ),
      })
    }

    if (education.length) {
      nextSheets.push({
        id: "corporate-education",
        label: "Formacion",
        icon: GraduationCap,
        content: (
          <section>
            <h3 className="text-3xl font-bold text-white">Formacion</h3>
            <div className="mt-6 grid gap-4">
              {education.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B]/60 hover:bg-white/[0.07]"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <p className="text-lg font-bold text-white">{item.title}</p>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/48">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/68">{item.institution}</p>
                </article>
              ))}
            </div>
          </section>
        ),
      })
    }

    if (projects.length) {
      nextSheets.push({
        id: "corporate-projects",
        label: "Proyectos",
        icon: LayoutGrid,
        content: (
          <section>
            <h3 className="text-3xl font-bold">Proyectos</h3>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {projects.map((project, index) => (
                <article
                  key={project.id}
                  className="rounded-[1.8rem] border border-black/10 bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-[#111111] hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)]"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6E46]">
                    Proyecto {String(index + 1).padStart(2, "0")}
                  </p>
                  <h4 className="mt-2 text-2xl font-bold">{project.name}</h4>
                  <p className="mt-4 text-sm leading-7 text-[#4B545D]">{project.description}</p>

                  {project.stack.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-black/10 bg-[#F7F1E8] px-3 py-1.5 text-xs font-semibold text-[#3D4348]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ),
      })
    }

    if (skills.length) {
      nextSheets.push({
        id: "corporate-skills",
        label: "Skills",
        icon: Rocket,
        content: (
          <section>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">Capacidades</p>
              <h3 className="mt-2 text-3xl font-bold text-white">Skills</h3>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/86 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B] hover:bg-[#D6A96B]/12 hover:text-[#F4D8AE]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ),
      })
    }

    return nextSheets
  }, [data.email, data.location, data.role, data.summary, education, experience, hasContactInfo, initials, projects, skills, socialLinks])

  const [activeSectionId, setActiveSectionId] = useState<string | null>(sheets[0]?.id ?? null)
  const [activeSheetIndex, setActiveSheetIndex] = useState(0)
  const sheetsViewportRef = useRef<HTMLDivElement | null>(null)
  const sheetRefs = useRef<Array<HTMLElement | null>>([])
  const totalMobileSheets = sheets.length + 1

  useEffect(() => {
    setActiveSheetIndex(0)
    setActiveSectionId(null)
  }, [sheets])

  function scrollToSheet(index: number) {
    const viewport = sheetsViewportRef.current
    const target = sheetRefs.current[index]

    if (!viewport || !target) {
      return
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    })

    setActiveSheetIndex(index)
    setActiveSectionId(index === 0 ? null : sheets[index - 1]?.id ?? null)
  }

  function handlePreviousSheet() {
    scrollToSheet(Math.max(0, activeSheetIndex - 1))
  }

  function handleNextSheet() {
    scrollToSheet(Math.min(totalMobileSheets - 1, activeSheetIndex + 1))
  }

  useEffect(() => {
    const viewport = sheetsViewportRef.current

    if (!viewport) {
      return
    }

    function handleScroll() {
      const currentViewport = sheetsViewportRef.current

      if (!currentViewport) {
        return
      }

      const viewportCenter = currentViewport.scrollLeft + currentViewport.clientWidth / 2
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      sheetRefs.current.forEach((sheet, index) => {
        if (!sheet) {
          return
        }

        const sheetCenter = sheet.offsetLeft + sheet.clientWidth / 2
        const distance = Math.abs(sheetCenter - viewportCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setActiveSheetIndex(closestIndex)
      setActiveSectionId(closestIndex === 0 ? null : sheets[closestIndex - 1]?.id ?? null)
    }

    handleScroll()
    viewport.addEventListener("scroll", handleScroll, { passive: true })

    return () => viewport.removeEventListener("scroll", handleScroll)
  }, [sheets])

  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#26221D] bg-[#111111] text-white shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
      <header className="border-b border-white/10 px-5 py-5 sm:px-8">
        <div className="flex flex-col gap-3 text-[11px] uppercase tracking-[0.32em] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-full border border-[#8C6E46]/40 bg-[#D6A96B]/10 px-4 py-2 font-semibold text-[#F3E3C9]">
            Presentacion Corporativa
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end sm:gap-6">
            {data.email?.trim() ? <span>{data.email}</span> : null}
            {data.location?.trim() ? <span>{data.location}</span> : null}
            <span>Portfolio Preview</span>
          </div>
        </div>
      </header>

      <div className="border-t border-white/10 bg-[#0F0F0F] px-4 py-6 lg:hidden">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-1.5">
            {Array.from({ length: totalMobileSheets }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToSheet(index)}
                className={`h-2.5 rounded-full transition-all ${
                  activeSheetIndex === index ? "w-5 bg-[#D6A96B]" : "w-2.5 bg-white/25"
                }`}
                aria-label={index === 0 ? "Ir a navigation" : `Ir a ${sheets[index - 1]?.label ?? "seccion"}`}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handlePreviousSheet}
              disabled={activeSheetIndex === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white transition hover:border-[#D6A96B] hover:text-[#F4D8AE] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Seccion anterior"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextSheet}
              disabled={activeSheetIndex === totalMobileSheets - 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white transition hover:border-[#D6A96B] hover:text-[#F4D8AE] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Siguiente seccion"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={sheetsViewportRef}
          className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex min-w-full gap-4 pr-1 pt-1 snap-x snap-mandatory touch-pan-x">
            <section
              ref={(element) => {
                sheetRefs.current[0] = element
              }}
              className="min-h-[520px] w-full shrink-0 snap-start rounded-[2rem] border border-white/10 bg-[#181818] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">Navigation</p>
              <h3 className="mt-2 text-3xl font-bold text-white">Table of Contents</h3>

              <div className="mt-8 grid gap-3">
                {sheets.slice(1).map((sheet, index) => {
                  const Icon = sheet.icon

                  return (
                    <button
                      key={sheet.id}
                      type="button"
                      onClick={() => scrollToSheet(index + 1)}
                      className="group flex items-center border border-white/12 bg-white/[0.03] px-3 py-3 text-left transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B] hover:bg-white/[0.08] sm:px-4 sm:py-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 bg-white/[0.03] text-white/80 transition group-hover:border-[#D6A96B] group-hover:text-[#F4D8AE]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 break-words text-sm font-semibold uppercase tracking-[0.12em] leading-5 text-white/86">
                          {sheet.label}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            {sheets.map((sheet, index) => {
              const isIntro = sheet.id === "corporate-intro"
              const lightSheet = sheet.id === "corporate-experience" || sheet.id === "corporate-projects"

              return (
                <section
                  key={sheet.id}
                  ref={(element) => {
                    sheetRefs.current[index + 1] = element
                  }}
                  className={`min-h-[620px] w-full shrink-0 snap-start rounded-[2rem] border p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] transition-colors duration-300 ${
                    lightSheet
                      ? "border-white/10 bg-[#EFE8DE] text-[#111111]"
                      : "border-white/10 bg-[#1A1A1A] text-white"
                  } ${
                    activeSectionId === sheet.id
                      ? lightSheet
                        ? "border-[#9EB0BF] bg-[#CBD5DE]"
                        : "border-[#7F97AB] bg-[#2F3E4C]"
                      : ""
                  }`}
                >
                  {isIntro ? sheet.content : sheet.content}
                </section>
              )
            })}
          </div>
        </div>
      </div>

      <section className="hidden border-t border-white/10 bg-[#181818] px-8 py-10 lg:block">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {sheets.map((sheet) => {
            const Icon = sheet.icon

            return (
              <a
                key={sheet.id}
                href={`#${sheet.id}`}
                onClick={() => setActiveSectionId(sheet.id)}
                className="group flex items-center border border-white/12 bg-white/[0.03] px-4 py-4 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B] hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center border border-white/15 bg-white/[0.03] text-white/80 transition group-hover:border-[#D6A96B] group-hover:text-[#F4D8AE]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-[0.16em] text-white/86">
                    {sheet.label}
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </section>

      <div className="hidden lg:block">
        <section className="border-t border-white/10 bg-[linear-gradient(180deg,#111111_0%,#181512_100%)] px-8 py-10 text-white">
          <div className="flex items-start justify-between gap-8">
            <div className="max-w-4xl">
              <div className="text-[clamp(4rem,10vw,7.2rem)] font-black uppercase leading-[0.84] tracking-[-0.08em] text-[#F6F1E8]">
                {data.fullName}
              </div>
              {data.role?.trim() ? (
                <p className="mt-4 text-base uppercase tracking-[0.38em] text-[#D2B082]">
                  {data.role}
                </p>
              ) : null}
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#D2B082]/45 bg-[#D2B082]/10 text-[#F3E3C9] shadow-[0_12px_30px_rgba(214,169,107,0.12)]">
              <span className="text-lg font-black tracking-[-0.06em]">{initials}</span>
            </div>
          </div>
        </section>

        <section className="grid border-t border-white/10 bg-[linear-gradient(180deg,#171717_0%,#141414_100%)] px-8 py-10 text-white lg:grid-cols-[0.65fr_1.35fr]">
          <div className="pr-10">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Navigation</p>
            <h3 className="mt-3 text-6xl font-black leading-[0.9] tracking-[-0.06em] text-[#F8F4EC]">
              Table of Contents
            </h3>
          </div>

          <div className="grid gap-8">
            <div className="max-w-3xl text-sm leading-7 text-white/58">
              {data.summary?.trim()
                ? data.summary
                : "Diseno editorial corporativo preparado para mostrar informacion real proveniente del backend, manteniendo una estructura limpia y adaptable segun los datos disponibles."}
            </div>

            <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
              {sheets.map((sheet) => {
                const Icon = sheet.icon

                return (
                  <a
                    key={sheet.id}
                    href={`#${sheet.id}`}
                    onClick={() => setActiveSectionId(sheet.id)}
                    className="group flex min-h-[72px] items-center border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-3 py-3 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B] hover:bg-[#1D1A17]"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/15 bg-white/[0.03] text-white/80 transition group-hover:border-[#D6A96B] group-hover:bg-[#D6A96B]/10 group-hover:text-[#F4D8AE]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 whitespace-normal break-words text-[12px] font-semibold uppercase tracking-[0.04em] leading-4 text-white/86">
                        {sheet.label}
                      </span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        <section
          id="corporate-intro"
          className={`grid border-t transition-colors duration-300 lg:grid-cols-[0.72fr_1.28fr] ${
            activeSectionId === "corporate-intro"
              ? "border-[#D1B58C] bg-[#E8D5B7] text-[#111111]"
              : "border-white/10 bg-[#E4CFAD] text-[#111111]"
          }`}
        >
          <div className="border-r border-black/10 px-8 py-10">
            <div className="rounded-[1.8rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.2))] p-6 shadow-[0_18px_40px_rgba(99,72,35,0.08)]">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-[#6F6250]">
                <span>Perfil</span>
                <span>{initials}</span>
              </div>

              <div className="mt-6 flex min-h-[360px] items-center justify-center">
                <div className="relative flex h-64 w-56 items-center justify-center overflow-hidden rounded-[2rem] border border-white/35 bg-[linear-gradient(160deg,#CFA16A_0%,#697A8F_100%)] shadow-[0_24px_55px_rgba(0,0,0,0.18)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_42%)]" />
                  <span className="relative text-7xl font-black tracking-[-0.08em] text-white">
                    {initials}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-10">
            <p className="text-xs uppercase tracking-[0.35em] text-[#7B6D5B]">Introduccion</p>
            <h3 className="mt-3 text-5xl font-black leading-[0.92] tracking-[-0.05em]">Perfil profesional</h3>

            {data.role?.trim() ? (
              <p className="mt-8 text-4xl font-bold tracking-[-0.04em] text-[#1A1714]">{data.role}</p>
            ) : null}

            {data.summary?.trim() ? (
              <p className="mt-6 max-w-3xl text-sm leading-7 text-[#4B545D]">{data.summary}</p>
            ) : null}

            {hasContactInfo ? (
              <div className="mt-8 grid max-w-3xl gap-4 md:grid-cols-2">
                {data.email?.trim() ? (
                  <div className="rounded-[1.4rem] border border-black/10 bg-white/50 p-5 shadow-[0_12px_28px_rgba(99,72,35,0.06)]">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#7B6D5B]">Correo</p>
                    <a href={`mailto:${data.email}`} className="mt-3 inline-flex items-center gap-3 text-sm font-medium transition hover:text-[#8C6E46]">
                      <Mail className="h-4 w-4" />
                      {data.email}
                    </a>
                  </div>
                ) : null}

                {data.location?.trim() ? (
                  <div className="rounded-[1.4rem] border border-black/10 bg-white/50 p-5 shadow-[0_12px_28px_rgba(99,72,35,0.06)]">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#7B6D5B]">Ubicacion</p>
                    <div className="mt-3 inline-flex items-center gap-3 text-sm font-medium">
                      <MapPin className="h-4 w-4" />
                      {data.location}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {socialLinks.length ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3D4348] transition hover:-translate-y-0.5 hover:border-[#8C6E46] hover:bg-white hover:text-[#8C6E46]"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {(education.length || skills.length || experience.length || projects.length) ? (
          <section className="grid border-t border-white/10 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="bg-[#141414] px-8 py-10">
              {education.length ? (
                <div
                  id="corporate-education"
                  className={`rounded-[2rem] p-1 transition-colors duration-300 ${
                    activeSectionId === "corporate-education" ? "bg-[#2F3E4C]" : ""
                  }`}
                >
                  <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-6">
                    <h3 className="text-3xl font-black tracking-[-0.04em] text-white">Formacion</h3>
                    <div className="mt-6 grid gap-4">
                      {education.map((item) => (
                        <article
                          key={item.id}
                          className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B]/60 hover:bg-[#1B1815]"
                        >
                          <div className="flex flex-col gap-2">
                            <p className="text-lg font-bold text-white">{item.title}</p>
                            <p className="text-sm text-white/68">{item.institution}</p>
                            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/48">
                              {item.period}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {experience.length ? (
                <div
                  id="corporate-experience"
                  className={`mt-8 rounded-[2rem] border p-6 transition-colors duration-300 ${
                    activeSectionId === "corporate-experience"
                      ? "border-[#8FA4B7] bg-[#D6E0E9] text-[#111111]"
                      : "border-black/10 bg-[#EFE8DE] text-[#111111]"
                  }`}
                >
                  <h3 className="text-4xl font-black tracking-[-0.05em]">Experiencia</h3>
                  <div className="mt-6 grid gap-4">
                    {experience.map((item, index) => (
                      <article
                        key={item.id}
                        className="rounded-[1.6rem] border border-black/10 bg-[linear-gradient(180deg,#FFFFFF_0%,#FBF8F2_100%)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#8C6E46] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6E46]">
                              {String(index + 1).padStart(2, "0")}
                            </p>
                            <h4 className="mt-2 text-xl font-bold">{item.title}</h4>
                            <p className="mt-1 text-sm font-medium text-[#5E6670]">{item.organization}</p>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7C8791]">
                            {item.period}
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[#47515B]">{item.description}</p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="px-8 py-10 transition-colors duration-300 bg-[#EFE8DE] text-[#111111]">
              {skills.length ? (
                <div
                  id="corporate-skills"
                  className={`rounded-[2rem] p-1 transition-colors duration-300 ${
                    activeSectionId === "corporate-skills" ? "bg-[#8FA4B7]/35" : ""
                  }`}
                >
                  <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,#1F1F1F_0%,#171717_100%)] p-6 text-white">
                    <div>
                      <h3 className="text-4xl font-black tracking-[-0.05em]">Skills</h3>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/86 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B] hover:bg-[#D6A96B]/12 hover:text-[#F4D8AE]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-[1.7rem] border border-dashed border-black/15 bg-white/40 p-10 text-center text-sm text-[#5E6670]">
                  No hay skills disponibles.
                </div>
              )}

              {projects.length ? (
                <div
                  id="corporate-projects"
                  className={`mt-10 rounded-[2rem] border p-6 transition-colors duration-300 ${
                    activeSectionId === "corporate-projects"
                      ? "border-[#8FA4B7] bg-[#D6E0E9]"
                      : "border-black/10 bg-white/45"
                  }`}
                >
                  <h3 className="text-4xl font-black tracking-[-0.05em]">Proyectos</h3>
                  <div className="mt-8 grid gap-4">
                    {projects.map((project, index) => (
                      <article
                        key={project.id}
                        className="rounded-[1.8rem] border border-black/10 bg-[linear-gradient(180deg,#FFFFFF_0%,#FBF8F2_100%)] p-6 transition duration-300 hover:-translate-y-2 hover:border-[#8C6E46] hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)]"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6E46]">
                          Proyecto {String(index + 1).padStart(2, "0")}
                        </p>
                        <h4 className="mt-2 text-2xl font-bold">{project.name}</h4>
                        <p className="mt-4 text-sm leading-7 text-[#4B545D]">{project.description}</p>
                        {project.stack.length ? (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {project.stack.map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-black/10 bg-[#F2E7D7] px-3 py-1.5 text-xs font-semibold text-[#3D4348]"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  )
}

export type { CorporatePortfolioData, CorporatePortfolioLink }
