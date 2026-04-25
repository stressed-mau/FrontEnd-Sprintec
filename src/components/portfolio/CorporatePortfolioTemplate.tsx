import {
  ArrowLeft,
  ArrowRight,
  Link as LinkIcon,
  Mail,
  MapPin,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import type { PortfolioVisibilityData } from "@/services/portfolioVisibilityService"

type CorporatePortfolioLink = {
  id: string
  label: string
  url: string
}

type CorporatePortfolioProfile = {
  fullname: string
  occupation: string
  image_url: string
  residence: string
  public_email: string
  phone: string
  biography: string
}

type CorporatePortfolioTemplateProps = {
  data: PortfolioVisibilityData
  profile?: CorporatePortfolioProfile | null
}

type Sheet = {
  id: string
  label: string
  content: ReactNode
}

const FALLBACK_SOCIAL_LINKS: CorporatePortfolioLink[] = [
  { id: "fallback-github", label: "GitHub", url: "https://github.com/" },
  { id: "fallback-linkedin", label: "LinkedIn", url: "https://linkedin.com/" },
]

const FALLBACK_SKILLS = ["Liderazgo", "Comunicación", "Gestión", "Estrategia", "React", "TypeScript"]

const FALLBACK_EXPERIENCE = [
  {
    id: "fallback-experience-1",
    title: "Cargo principal",
    organization: "Empresa o institución",
    period: "2023 - Actualidad",
    description: "Descripción breve de responsabilidades, logros o impacto profesional.",
  },
]

const FALLBACK_EDUCATION = [
  {
    id: "fallback-education-1",
    title: "Formación académica",
    institution: "Universidad o centro de estudios",
    period: "2018 - 2023",
  },
]

const FALLBACK_PROJECTS = [
  {
    id: "fallback-project-1",
    name: "Proyecto destacado",
    description: "Descripción general del proyecto, enfoque de trabajo o resultado principal.",
    stack: ["React", "Node.js"],
  },
]

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

function cleanVisibilitySublabel(value: string, prefix: string) {
  return value.startsWith(prefix) ? value.slice(prefix.length).trim() : value
}

export function CorporatePortfolioTemplate({ data, profile }: CorporatePortfolioTemplateProps) {
  const userProfile = profile ?? {
    fullname: "",
    occupation: "",
    image_url: "",
    residence: "",
    public_email: "",
    phone: "",
    biography: "",
  }

  const displayName = userProfile.fullname.trim() || "Sin nombre disponible"
  const displayRole = userProfile.occupation.trim() || "Profesional"
  const displaySummary = userProfile.biography.trim() || "Descripción profesional pendiente de completar."
  const displayEmail = userProfile.public_email.trim()
  const displayLocation = userProfile.residence.trim() || "Ubicación pendiente"
  const initials = getInitials(displayName)

  const visibleProjects = useMemo(() => data.projects.filter((item) => item.checked), [data.projects])
  const visibleSkills = useMemo(() => data.skills.filter((item) => item.checked), [data.skills])
  const visibleExperience = useMemo(() => data.experience.filter((item) => item.checked), [data.experience])
  const visibleNetworks = useMemo(() => data.networks.filter((item) => item.checked), [data.networks])

  const socialLinks = useMemo<CorporatePortfolioLink[]>(
    () =>
      visibleNetworks
        .filter((link) => link.label.trim() && link.sublabel.trim())
        .map((link) => ({
          id: String(link.id),
          label: link.label,
          url: link.sublabel,
        })),
    [visibleNetworks],
  )

  const skills = useMemo(() => {
  return visibleSkills.map((skill) => skill.label).filter(Boolean)
  }, [visibleSkills])

  const workExperience = useMemo(
    () => visibleExperience.filter((item) => item.sourceTable === "work_experiences"),
    [visibleExperience],
  )

  const educationItems = useMemo(
    () => visibleExperience.filter((item) => item.sourceTable === "educations"),
    [visibleExperience],
  )

  const experience = useMemo(() => {
  return workExperience.map((item) => ({
    id: String(item.id),
    title: item.label,
    organization: cleanVisibilitySublabel(item.sublabel, "Experiencia Laboral -"),
    period: "",
    description: "",
  }))
}, [workExperience])

  const education = useMemo(() => {
  return educationItems.map((item) => ({
    id: String(item.id),
    title: item.label,
    institution: cleanVisibilitySublabel(item.sublabel, "Educación -"),
    period: "",
  }))
}, [educationItems])

  const projects = useMemo(() => {
  return visibleProjects.map((project) => ({
    id: String(project.id),
    name: project.label,
    description: project.sublabel,
    stack: [] as string[],
  }))
}, [visibleProjects])

  const resolvedEducation = education
  const resolvedProjects = projects
  const resolvedSocialLinks = socialLinks
  const hasContactInfo = Boolean(displayEmail || displayLocation || socialLinks.length)

  const sheets = useMemo<Sheet[]>(() => {
    const nextSheets: Sheet[] = [
      {
        id: "corporate-intro",
        label: "Introduccion",
        content: (
          <section className="grid gap-6 rounded-[2rem] border border-[#D7C3A4] bg-[#E7D3B3] p-6 text-[#111111] lg:grid-cols-[0.74fr_1.26fr] lg:items-stretch">
            <div className="rounded-[1.75rem] border border-black/10 bg-white/35 p-6 lg:p-7">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-[#6F6250]">
                <span>Perfil</span>
                <span>{initials}</span>
              </div>

              <div className="flex min-h-55 items-center justify-center py-8 lg:min-h-85">
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

              {displayRole ? (
                <div className="rounded-[1.5rem] border border-black/10 bg-white/40 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#7B6D5B]">Rol</p>
                  <p className="mt-3 text-xl font-bold text-[#111111]">{displayRole}</p>
                </div>
              ) : null}

              {displaySummary ? (
                <div className="rounded-[1.5rem] border border-black/10 bg-white/40 p-5">
                  <p className="text-sm leading-7 text-[#4B545D]">{displaySummary}</p>
                </div>
              ) : null}

              {hasContactInfo ? (
                <div className="rounded-[1.5rem] border border-black/10 bg-white/40 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#7B6D5B]">Datos personales</p>
                  <div className="mt-4 grid gap-3 text-sm text-[#3D4348]">
                    {displayEmail ? (
                      <a href={`mailto:${displayEmail}`} className="flex items-center gap-3 transition hover:text-[#8C6E46]">
                        <Mail className="h-4 w-4" />
                        {displayEmail}
                      </a>
                    ) : null}
                    {displayLocation ? (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4" />
                        {displayLocation}
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
                    ) : (
                    <p className="text-sm text-gray-500">
                      No hay redes disponibles.
                    </p>
                  )}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ),
      },
    ]

    nextSheets.push({
      id: "corporate-experience",
      label: "Experiencia",
      content: (
        <section>
          <h3 className="text-3xl font-bold">Experiencia</h3>

          {experience.length ? (
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

                      <h4 className="mt-2 text-xl font-bold">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-sm font-medium text-[#5E6670]">
                        {item.organization}
                      </p>
                    </div>

                    {item.period.trim() ? (
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7C8791]">
                        {item.period}
                      </span>
                    ) : null}
                  </div>

                  {item.description.trim() ? (
                    <p className="mt-4 text-sm leading-7 text-[#47515B]">
                      {item.description}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-sm text-gray-500">
              No hay experiencia registrada.
            </div>
          )}
        </section>
      ),
    })

    nextSheets.push({
      id: "corporate-education",
      label: "Formacion",
      content: (
        <section>
          <h3 className="text-3xl font-bold text-white">Formacion</h3>

          {education.length ? (
            <div className="mt-6 grid gap-4">
              {education.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.6rem] border border-white/10 bg-white/3 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B]/60 hover:bg-white/[0.07]"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <p className="text-lg font-bold text-white">
                      {item.title}
                    </p>

                    {item.period.trim() ? (
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/48">
                        {item.period}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 text-sm text-white/68">
                    {item.institution}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-sm text-gray-400">
              No hay formación registrada.
            </div>
          )}
        </section>
      ),
    })

    nextSheets.push({
      id: "corporate-projects",
      label: "Proyectos",
      content: (
        <section>
          <h3 className="text-3xl font-bold">Proyectos</h3>

          {projects.length ? (
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

                  <p className="mt-4 text-sm leading-7 text-[#4B545D]">
                    {project.description}
                  </p>

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
          ) : (
            <div className="mt-6 text-sm text-gray-500">
              No hay proyectos disponibles.
            </div>
          )}
        </section>
      ),
    })

    
      nextSheets.push({
        id: "corporate-skills",
        label: "Skills",
        content: (
          <section>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">Capacidades</p>
              <h3 className="mt-2 text-3xl font-bold text-white">Skills</h3>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {skills.length ? (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/12 bg-white/4 px-4 py-2 text-sm font-semibold text-white/86 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B] hover:bg-[#D6A96B]/12 hover:text-[#F4D8AE]"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-white/60">
                  No hay habilidades disponibles.
                </p>
              )}
            </div>
          </section>
        ),
      })
    

    return nextSheets
 }, [
  displayEmail,
  displayLocation,
  displayRole,
  displaySummary,
  experience,
  education,
  projects,
  hasContactInfo,
  initials,
  resolvedEducation,
  resolvedProjects,
  resolvedSocialLinks,
  skills
])

  const [activeSectionId, setActiveSectionId] = useState<string | null>(sheets[0]?.id ?? null)
  const [activeSheetIndex, setActiveSheetIndex] = useState(0)
  const sheetsViewportRef = useRef<HTMLDivElement | null>(null)
  const sheetRefs = useRef<Array<HTMLElement | null>>([])
  const totalMobileSheets = sheets.length

  useEffect(() => {
    setActiveSheetIndex(0)
    setActiveSectionId(sheets[0]?.id ?? null)
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
    setActiveSectionId(sheets[index]?.id ?? null)
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
      setActiveSectionId(sheets[closestIndex]?.id ?? null)
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
            {displayEmail ? <span>{displayEmail}</span> : null}
            {displayLocation ? <span>{displayLocation}</span> : null}
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
                aria-label={`Ir a ${sheets[index]?.label ?? "seccion"}`}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handlePreviousSheet}
              disabled={activeSheetIndex === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white transition hover:border-[#D6A96B] hover:text-[#F4D8AE] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Seccion anterior"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextSheet}
              disabled={activeSheetIndex === totalMobileSheets - 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white transition hover:border-[#D6A96B] hover:text-[#F4D8AE] disabled:cursor-not-allowed disabled:opacity-35"
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
            {sheets.map((sheet, index) => {
              const isIntro = sheet.id === "corporate-intro"
              const lightSheet = sheet.id === "corporate-experience" || sheet.id === "corporate-projects"

              return (
                <section
                  key={sheet.id}
                  ref={(element) => {
                    sheetRefs.current[index] = element
                  }}
                  className={`min-h-155 w-full shrink-0 snap-start rounded-[2rem] border p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] transition-colors duration-300 ${
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

      <div className="hidden lg:block">
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

              <div className="mt-6 flex min-h-90 items-center justify-center">
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

            {displayRole ? (
              <p className="mt-8 text-4xl font-bold tracking-[-0.04em] text-[#1A1714]">{displayRole}</p>
            ) : null}

            {displaySummary ? (
              <p className="mt-6 max-w-3xl text-sm leading-7 text-[#4B545D]">{displaySummary}</p>
            ) : null}

            {hasContactInfo ? (
              <div className="mt-8 grid max-w-3xl gap-4 md:grid-cols-2">
                {displayEmail ? (
                  <div className="rounded-[1.4rem] border border-black/10 bg-white/50 p-5 shadow-[0_12px_28px_rgba(99,72,35,0.06)]">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#7B6D5B]">Correo</p>
                    <a href={`mailto:${displayEmail}`} className="mt-3 inline-flex items-center gap-3 text-sm font-medium transition hover:text-[#8C6E46]">
                      <Mail className="h-4 w-4" />
                      {displayEmail}
                    </a>
                  </div>
                ) : null}

                {displayLocation ? (
                  <div className="rounded-[1.4rem] border border-black/10 bg-white/50 p-5 shadow-[0_12px_28px_rgba(99,72,35,0.06)]">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#7B6D5B]">Ubicacion</p>
                    <div className="mt-3 inline-flex items-center gap-3 text-sm font-medium">
                      <MapPin className="h-4 w-4" />
                      {displayLocation}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {resolvedSocialLinks.length ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {resolvedSocialLinks.map((link) => (
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

        {(resolvedEducation.length || skills.length || experience.length || resolvedProjects.length) ? (
          <section className="grid border-t border-white/10 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="bg-[#141414] px-8 py-10">
              <div
                id="corporate-education"
                className={`rounded-[2rem] p-1 transition-colors duration-300 ${
                  activeSectionId === "corporate-education" ? "bg-[#2F3E4C]" : ""
                }`}
              >
                <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-6">
                  <h3 className="text-3xl font-black tracking-[-0.04em] text-white">
                    Formacion
                  </h3>

                  {resolvedEducation.length ? (
                    <div className="mt-6 grid gap-4">
                      {resolvedEducation.map((item) => (
                        <article
                          key={item.id}
                          className="rounded-[1.4rem] border border-white/10 bg-white/3 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B]/60 hover:bg-[#1B1815]"
                        >
                          <div className="flex flex-col gap-2">
                            <p className="text-lg font-bold text-white">{item.title}</p>
                            <p className="text-sm text-white/68">{item.institution}</p>

                            {item.period.trim() ? (
                              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/48">
                                {item.period}
                              </span>
                            ) : null}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 text-sm text-gray-400">
                      No hay formación registrada.
                    </div>
                  )}
                </div>
              </div>

              <div
                id="corporate-experience"
                className={`mt-8 rounded-[2rem] border p-6 transition-colors duration-300 ${
                  activeSectionId === "corporate-experience"
                    ? "border-[#8FA4B7] bg-[#D6E0E9] text-[#111111]"
                    : "border-black/10 bg-[#EFE8DE] text-[#111111]"
                }`}
              >
                <h3 className="text-4xl font-black tracking-[-0.05em]">Experiencia</h3>

                {experience.length ? (
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
                            <p className="mt-1 text-sm font-medium text-[#5E6670]">
                              {item.organization}
                            </p>
                          </div>

                          {item.period.trim() ? (
                            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7C8791]">
                              {item.period}
                            </span>
                          ) : null}
                        </div>

                        {item.description.trim() ? (
                          <p className="mt-4 text-sm leading-7 text-[#47515B]">
                            {item.description}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 text-sm text-gray-500">
                    No hay experiencia registrada.
                  </div>
                )}
              </div>
            </div>

            <div className="px-8 py-10 transition-colors duration-300 bg-[#EFE8DE] text-[#111111]">
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
                    {skills.length ? (
                      skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/12 bg-white/4 px-4 py-2 text-sm font-semibold text-white/86 transition duration-300 hover:-translate-y-1 hover:border-[#D6A96B] hover:bg-[#D6A96B]/12 hover:text-[#F4D8AE]"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-white/60">
                        No hay habilidades disponibles.
                      </p>
                    )}
                  </div>
                </div>
              </div>

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
                  {resolvedProjects.length ? (
                    resolvedProjects.map((project, index) => (
                      <article
                        key={project.id}
                        className="rounded-[1.8rem] border border-black/10 bg-[linear-gradient(180deg,#FFFFFF_0%,#FBF8F2_100%)] p-6 transition duration-300 hover:-translate-y-2 hover:border-[#8C6E46] hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)]"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6E46]">
                          Proyecto {String(index + 1).padStart(2, "0")}
                        </p>

                        <h4 className="mt-2 text-2xl font-bold">{project.name}</h4>

                        <p className="mt-4 text-sm leading-7 text-[#4B545D]">
                          {project.description}
                        </p>

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
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      No hay proyectos disponibles.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </article>
  )
}

export type { CorporatePortfolioLink, CorporatePortfolioProfile }
