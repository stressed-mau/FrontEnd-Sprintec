import { ArrowLeft, ArrowRight } from "lucide-react"
import { useCallback, useRef, useState, type UIEvent } from "react"
import { CorporateSectionContent } from "@/components/templates/corporate/CorporateSectionContent"
import type { CorporateTemplateData } from "@/types/corporatePortfolio"

type CorporateMobileLayoutProps = {
  data: CorporateTemplateData
  activeSectionId: string | null
  onActiveSectionChange: (sectionId: string | null) => void
  onProjectClick?: (projectId?: string | number) => void
  onExperienceClick?: (experienceId?: string | number) => void
  onEducationClick?: (educationId?: string | number) => void
  onSocialClick?: (network: unknown) => void
}

export function CorporateMobileLayout(props: CorporateMobileLayoutProps) {
  const totalMobileSheets = props.data.sections.length
  const [activeSheetIndex, setActiveSheetIndex] = useState(0)
  const sheetElements = useRef<Array<HTMLElement | null>>([])

  const assignSheetElement = useCallback((index: number, element: HTMLElement | null) => {
    sheetElements.current[index] = element
  }, [])

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    setActiveSheet(getClosestSheetIndex(event.currentTarget))
  }

  function scrollToSheet(index: number) {
    const target = sheetElements.current[index]
    if (!target) return

    target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
    setActiveSheet(index)
  }

  function setActiveSheet(index: number) {
    setActiveSheetIndex(index)
    props.onActiveSectionChange(props.data.sections[index]?.id ?? null)
  }

  return (
    <div className="border-t border-white/10 bg-[#0F0F0F] px-4 py-6 lg:hidden">
      <div className="mb-4 flex items-center justify-between gap-3">
        <SheetIndicators activeSheetIndex={activeSheetIndex} data={props.data} onSheetSelect={scrollToSheet} />
        <SheetNavigation
          activeSheetIndex={activeSheetIndex}
          totalMobileSheets={totalMobileSheets}
          onNextSheet={() => scrollToSheet(Math.min(totalMobileSheets - 1, activeSheetIndex + 1))}
          onPreviousSheet={() => scrollToSheet(Math.max(0, activeSheetIndex - 1))}
        />
      </div>
      <div onScroll={handleScroll} className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-full gap-4 pr-1 pt-1 snap-x snap-mandatory touch-pan-x">
          {props.data.sections.map((section, index) => (
            <MobileSheet key={section.id} {...props} assignSheetElement={assignSheetElement} index={index} sectionId={section.id} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SheetIndicators({ data, activeSheetIndex, onSheetSelect }: {
  data: CorporateTemplateData
  activeSheetIndex: number
  onSheetSelect: (index: number) => void
}) {
  return (
    <div className="min-w-0 flex items-center gap-1.5">
      {data.sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onSheetSelect(index)}
          className={`h-2.5 rounded-full transition-all ${activeSheetIndex === index ? "w-5 bg-[#D6A96B]" : "w-2.5 bg-white/25"}`}
          aria-label={`Ir a ${section.label ?? "seccion"}`}
        />
      ))}
    </div>
  )
}

function SheetNavigation({ activeSheetIndex, totalMobileSheets, onNextSheet, onPreviousSheet }: {
  activeSheetIndex: number
  totalMobileSheets: number
  onNextSheet: () => void
  onPreviousSheet: () => void
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button type="button" onClick={onPreviousSheet} disabled={activeSheetIndex === 0} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white transition hover:border-[#D6A96B] hover:text-[#F4D8AE] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Seccion anterior">
        <ArrowLeft className="h-4 w-4" />
      </button>
      <button type="button" onClick={onNextSheet} disabled={activeSheetIndex === totalMobileSheets - 1} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white transition hover:border-[#D6A96B] hover:text-[#F4D8AE] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Siguiente seccion">
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function MobileSheet(props: CorporateMobileLayoutProps & {
  assignSheetElement: (index: number, element: HTMLElement | null) => void
  index: number
  sectionId: CorporateTemplateData["sections"][number]["id"]
}) {
  const lightSheet = props.sectionId === "corporate-experience" || props.sectionId === "corporate-projects"
  const isActive = props.activeSectionId === props.sectionId
  const className = getSheetClassName(lightSheet, isActive)

  return (
    <section
      key={props.sectionId}
      ref={(element) => props.assignSheetElement(props.index, element)}
      data-corporate-sheet="true"
      className={className}
    >
      <CorporateSectionContent {...props} mode="mobile" sectionId={props.sectionId} isActive={isActive} />
    </section>
  )
}

function getClosestSheetIndex(viewport: HTMLDivElement) {
  const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2
  const sheets = Array.from(viewport.querySelectorAll<HTMLElement>("[data-corporate-sheet='true']"))
  return sheets.reduce((closestIndex, sheet, index) => {
    const currentDistance = getSheetDistance(sheet, viewportCenter)
    const closestDistance = getSheetDistance(sheets[closestIndex], viewportCenter)
    return currentDistance < closestDistance ? index : closestIndex
  }, 0)
}

function getSheetDistance(sheet: HTMLElement | null | undefined, viewportCenter: number) {
  if (!sheet) return Number.POSITIVE_INFINITY
  const sheetCenter = sheet.offsetLeft + sheet.clientWidth / 2
  return Math.abs(sheetCenter - viewportCenter)
}

function getSheetClassName(lightSheet: boolean, isActive: boolean) {
  const baseClassName = "w-full shrink-0 snap-start rounded-[1.5rem] border p-4 shadow-[0_18px_45px_rgba(0,0,0,0.16)] transition-colors duration-300 sm:rounded-[2rem] sm:p-5"
  const colorClassName = lightSheet ? "border-white/10 bg-[#EFE8DE] text-[#111111]" : "border-white/10 bg-[#1A1A1A] text-white"
  const activeClassName = getActiveClassName(lightSheet, isActive)
  return `${baseClassName} ${colorClassName} ${activeClassName}`
}

function getActiveClassName(lightSheet: boolean, isActive: boolean) {
  if (!isActive) return ""
  return lightSheet ? "border-[#9EB0BF] bg-[#CBD5DE]" : "border-[#7F97AB] bg-[#2F3E4C]"
}
