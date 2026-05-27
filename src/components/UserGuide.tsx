import { useCallback, useEffect, useMemo, useRef } from "react"
import { CircleHelp } from "lucide-react"
import { driver, type Config, type DriveStep } from "driver.js"
import "driver.js/dist/driver.css"
import { getAuthSession } from "@/services/auth"
import { useLocation } from "react-router-dom"
export const USER_GUIDE_PENDING_KEY = "portfolio_user_guide_pending"
const USER_GUIDE_SEEN_KEY = "portfolio_user_guide_seen"
export const USER_GUIDE_OPEN_SIDEBAR_EVENT = "portfolio:user-guide-open-sidebar"
export const USER_GUIDE_RESTORE_SIDEBAR_EVENT = "portfolio:user-guide-restore-sidebar"
export const USER_GUIDE_OPEN_USER_MENU_EVENT = "portfolio:user-guide-open-user-menu"
export const USER_GUIDE_RESTORE_USER_MENU_EVENT = "portfolio:user-guide-restore-user-menu"

const openSidebarStep = (_element: Element | undefined, _step: DriveStep, opts: { driver: ReturnType<typeof driver> }) => {
  openSidebarForGuide()
  window.setTimeout(() => opts.driver.refresh(), 320)
}

const refreshHighlightedStep = (_element: Element | undefined, _step: DriveStep, opts: { driver: ReturnType<typeof driver> }) => {
  window.requestAnimationFrame(() => opts.driver.refresh())
}

const moveNextWithSidebarReady = (_element: Element | undefined, _step: DriveStep, opts: { driver: ReturnType<typeof driver> }) => {
  openSidebarForGuide()
  window.setTimeout(() => opts.driver.moveNext(), 320)
}

const openUserMenuStep = (_element: Element | undefined, _step: DriveStep, opts: { driver: ReturnType<typeof driver> }) => {
  openUserMenuForGuide()
  window.setTimeout(() => opts.driver.refresh(), 180)
}

const moveNextWithUserMenuReady = (_element: Element | undefined, _step: DriveStep, opts: { driver: ReturnType<typeof driver> }) => {
  openUserMenuForGuide()
  window.setTimeout(() => opts.driver.moveNext(), 180)
}

const moveNextWithSidebarRestored = (_element: Element | undefined, _step: DriveStep, opts: { driver: ReturnType<typeof driver> }) => {
  restoreSidebarAfterGuide()
  window.setTimeout(() => opts.driver.moveNext(), 180)
}

function findVisibleElement(selector: string) {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))

  return elements.find((element) => {
    const rect = element.getBoundingClientRect()
    const style = window.getComputedStyle(element)

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.right > 0 &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.top < window.innerHeight &&
      style.display !== "none" &&
      style.visibility !== "hidden"
    )
  })
}

function openSidebarForGuide() {
  window.dispatchEvent(new Event(USER_GUIDE_OPEN_SIDEBAR_EVENT))
}

function restoreSidebarAfterGuide() {
  window.dispatchEvent(new Event(USER_GUIDE_RESTORE_SIDEBAR_EVENT))
}

function openUserMenuForGuide() {
  window.dispatchEvent(new Event(USER_GUIDE_OPEN_USER_MENU_EVENT))
}

function restoreUserMenuAfterGuide() {
  window.dispatchEvent(new Event(USER_GUIDE_RESTORE_USER_MENU_EVENT))
}


function scrollToTopForGuide() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" })
}


type GuideElementResolver = (() => Element) & { keepWhenMissing?: boolean; selector: string }

function resolveGuideElement(selector: string, options: { keepWhenMissing?: boolean } = {}): GuideElementResolver {
  const resolver = (() => findVisibleElement(selector) ?? document.querySelector<HTMLElement>(selector) ?? document.body) as unknown as GuideElementResolver
  resolver.selector = selector
  resolver.keepWhenMissing = options.keepWhenMissing
  return resolver
}

const guideSteps: DriveStep[] = [
  {
    element: resolveGuideElement("#btn-go-dashboard"),
    popover: {
      title: "Inicio",
      description: "Vuelve al panel principal para revisar avisos y continuar tu portafolio.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#btn-go-explore"),
    popover: {
      title: "Explorar portafolios",
      description: "Busca y revisa portafolios públicos de otros usuarios desde esta sección.",
      side: "bottom",
      align: "center",
      onNextClick: moveNextWithSidebarReady,
    },
  },
  {
    element: resolveGuideElement("#guide-nav-portafolio"),
    onHighlightStarted: openSidebarStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Ver mi portafolio",
      description: "Revisa cómo se ve tu portafolio público con la información que ya cargaste.",
      side: "right",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-personal"),
    onHighlightStarted: openSidebarStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Datos personales",
      description: "Completa tu información personal para construir una presentación profesional más completa.",
      side: "right",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-red-profesional"),
    onHighlightStarted: openSidebarStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Red profesional",
      description: "Agrega tus enlaces profesionales para que puedan contactarte y revisar tu trabajo.",
      side: "right",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-proyectos"),
    onHighlightStarted: openSidebarStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Proyectos",
      description: "Registra trabajos importantes para mostrar evidencia de tus capacidades.",
      side: "right",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-habilidades"),
    onHighlightStarted: openSidebarStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Habilidades",
      description: "Agrega habilidades tecnicas y blandas para fortalecer tu perfil.",
      side: "right",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-experiencia"),
    onHighlightStarted: openSidebarStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Experiencia Laboral",
      description: "Agrega tu experiencia laboral para fortalecer tu trayectoria profesional.",
      side: "right",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-formacion-academica"),
    onHighlightStarted: openSidebarStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Formación académica",
      description: "Agrega tu formación académica para respaldar tus conocimientos y mostrar tu trayectoria académica.",
      side: "right",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-certificados"),
    onHighlightStarted: openSidebarStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Certificados",
      description: "Agrega certificados y respaldos que validen tus conocimientos, cursos y logros profesionales.",
      side: "right",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-plantillas"),
    onHighlightStarted: openSidebarStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Plantillas",
      description: "Selecciona la plantilla que mejor represente tu estilo profesional y mejora la presentación de tu portafolio.",
      side: "right",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-configuracion-visibilidad"),
    onHighlightStarted: openSidebarStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Visibilidad",
      description: "Configura qué secciones serán visibles antes de publicar tu portafolio.",
      side: "right",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-publicar"),
    onHighlightStarted: openSidebarStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Publicar",
      description: "Publica tu portafolio para compartir tu perfil profesional mediante un enlace público.",
      side: "right",
      align: "center",
      onNextClick: moveNextWithSidebarRestored,
    },
  },
  {
    element: resolveGuideElement("#btn-notifications"),
    popover: {
      title: "Notificaciones",
      description: "Consulta avisos importantes y novedades relacionadas con tu portafolio.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: resolveGuideElement("#btn-user-menu"),
    popover: {
      title: "Cuenta",
      description: "Revisa tu perfil, revisa las visualizaciones que tuvo tu portafolio y accede al reporte de plantillas.",
      side: "bottom",
      align: "end",
      onNextClick: moveNextWithUserMenuReady,
    },
  },
  {
    element: resolveGuideElement("#user-menu-profile", { keepWhenMissing: true }),
    onHighlightStarted: openUserMenuStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Mi perfil",
      description: "Entra a tu perfil para revisar o actualizar la informacion de tu cuenta.",
      side: "left",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#user-menu-visualizations", { keepWhenMissing: true }),
    onHighlightStarted: openUserMenuStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Visualizaciones",
      description: "Consulta los reportes de vistas y actividad de tu portafolio.",
      side: "left",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#user-menu-reports", { keepWhenMissing: true }),
    onHighlightStarted: openUserMenuStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Reportes",
      description: "Accede a reportes generales y tendencias disponibles para tu usuario.",
      side: "left",
      align: "center",
    },
  },
  {
    element: resolveGuideElement("#user-menu-logout", { keepWhenMissing: true }),
    onHighlightStarted: openUserMenuStep,
    onHighlighted: refreshHighlightedStep,
    popover: {
      title: "Cerrar sesion",
      description: "Finaliza tu sesión de manera segura cuando termines de usar la plataforma.",
      side: "left",
      align: "center",
    },
  },
]

const driverConfig: Config = {
  animate: false,
  allowClose: true,
  showButtons: ["next", "previous", "close"],
  showProgress: true,
  nextBtnText: "Siguiente",
  prevBtnText: "Anterior",
  doneBtnText: "Finalizar",
  progressText: "{{current}} de {{total}}",
  popoverClass: "portfolio-user-guide-popover",
  smoothScroll: true,
  overlayColor: "#000",
  overlayOpacity: 0.7,
  stagePadding: 8,
  popoverOffset: 12,
}

function getAvailableSteps() {
  return guideSteps.filter((step) => {
    if (typeof step.element !== "function") return true
    const selector = (step.element as GuideElementResolver).selector
    const keepWhenMissing = (step.element as GuideElementResolver).keepWhenMissing

    if (selector === "#user-menu-visualizations" && getAuthSession()?.user.role_id !== 1) {
      return false
    }

    return selector ? keepWhenMissing || Boolean(findVisibleElement(selector) ?? document.querySelector(selector)) : true
  })
}

export function UserGuide() {
  const guideRef = useRef<ReturnType<typeof driver> | null>(null)
  const config = useMemo(() => driverConfig, [])
  const location = useLocation()

  const hiddenRoutes = ["/terminos", "/login", "/register", "/", "/about", "/contact"]
  const shouldHideGuide = hiddenRoutes.includes(location.pathname) || location.pathname.startsWith('/p/')

  const startGuide = useCallback(() => {
    if (shouldHideGuide) return 

    scrollToTopForGuide()

    window.setTimeout(() => {
      const steps = getAvailableSteps()

      if (!steps.length) return

      guideRef.current?.destroy()
      guideRef.current = driver({
        ...config,
        steps,
        onDestroyed: () => {
          restoreUserMenuAfterGuide()
          restoreSidebarAfterGuide()
          window.localStorage.setItem(USER_GUIDE_SEEN_KEY, "1")
        },
      })
      guideRef.current.drive()
    }, 320)
  }, [config, shouldHideGuide])  

  useEffect(() => {
    if (shouldHideGuide) return  

    const shouldOpen = window.localStorage.getItem(USER_GUIDE_PENDING_KEY) === "1"

    if (!shouldOpen) return

    window.localStorage.removeItem(USER_GUIDE_PENDING_KEY)
    const guideTimer = window.setTimeout(startGuide, 450)

    return () => window.clearTimeout(guideTimer)
  }, [startGuide, shouldHideGuide])  

  useEffect(() => {
    return () => guideRef.current?.destroy()
  }, [])

  
  if (shouldHideGuide) {
    return null
  }

  return (
    <button
      type="button"
      onClick={startGuide}
      className="fixed bottom-5 right-5 z-[75] flex size-14 items-center justify-center rounded-full border-2 border-white bg-[#003A6C] text-white shadow-xl shadow-slate-900/25 transition hover:scale-105 hover:bg-[#0E7D96] focus:outline-none focus:ring-4 focus:ring-[#77B6E6]/50"
      aria-label="Abrir guia interactiva"
      title="Guia interactiva"
    >
      <CircleHelp className="size-7" />
    </button>
  )
}
