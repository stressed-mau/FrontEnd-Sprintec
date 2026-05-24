import { useEffect, useMemo, useRef } from "react"
import { CircleHelp } from "lucide-react"
import { driver, type Config, type DriveStep } from "driver.js"
import "driver.js/dist/driver.css"

export const USER_GUIDE_PENDING_KEY = "portfolio_user_guide_pending"
const USER_GUIDE_SEEN_KEY = "portfolio_user_guide_seen"
export const USER_GUIDE_OPEN_SIDEBAR_EVENT = "portfolio:user-guide-open-sidebar"

const openSidebarStep = (_element: Element | undefined, _step: DriveStep, opts: { driver: ReturnType<typeof driver> }) => {
  openSidebarForGuide()
  window.setTimeout(() => opts.driver.refresh(), 280)
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

type GuideElementResolver = (() => Element) & { selector: string }

function resolveGuideElement(selector: string): GuideElementResolver {
  const resolver = (() => findVisibleElement(selector) ?? document.querySelector<HTMLElement>(selector) ?? document.body) as unknown as GuideElementResolver
  resolver.selector = selector
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
    element: resolveGuideElement("#guide-nav-personal"),
    onHighlightStarted: openSidebarStep,
    popover: {
      title: "Datos personales",
      description: "Completa primero esta seccion. Es la base de tu perfil publico.",
      side: "right",
      align: "start",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-proyectos"),
    onHighlightStarted: openSidebarStep,
    popover: {
      title: "Proyectos",
      description: "Registra trabajos importantes para mostrar evidencia de tus capacidades.",
      side: "right",
      align: "start",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-habilidades"),
    onHighlightStarted: openSidebarStep,
    popover: {
      title: "Habilidades",
      description: "Agrega habilidades tecnicas y blandas para fortalecer tu perfil.",
      side: "right",
      align: "start",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-experiencia"),
    onHighlightStarted: openSidebarStep,
    popover: {
      title: "Experiencia",
      description: "Incluye tus cargos, empresas y fechas para construir tu trayectoria.",
      side: "right",
      align: "start",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-plantillas"),
    onHighlightStarted: openSidebarStep,
    popover: {
      title: "Plantillas",
      description: "Elige el estilo visual que mejor represente tu portafolio.",
      side: "right",
      align: "start",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-configuracion-visibilidad"),
    onHighlightStarted: openSidebarStep,
    popover: {
      title: "Visibilidad",
      description: "Decide que secciones se mostraran antes de publicar.",
      side: "right",
      align: "start",
    },
  },
  {
    element: resolveGuideElement("#guide-nav-publicar"),
    onHighlightStarted: openSidebarStep,
    popover: {
      title: "Publicar",
      description: "Cuando todo este listo, publica y comparte tu enlace profesional.",
      side: "right",
      align: "start",
    },
  },
  {
    element: resolveGuideElement("#btn-user-menu"),
    popover: {
      title: "Cuenta",
      description: "Desde aqui puedes entrar a tu perfil, revisar visualizaciones o cerrar sesion.",
      side: "bottom",
      align: "end",
    },
  },
]

const driverConfig: Config = {
  animate: true,
  allowClose: true,
  showButtons: ["next", "previous", "close"],
  showProgress: true,
  nextBtnText: "Siguiente",
  prevBtnText: "Anterior",
  doneBtnText: "Finalizar",
  progressText: "{{current}} de {{total}}",
  popoverClass: "portfolio-user-guide-popover",
  smoothScroll: true,
  stagePadding: 8,
  popoverOffset: 12,
}

function getAvailableSteps() {
  return guideSteps.filter((step) => {
    if (typeof step.element !== "function") return true
    const selector = (step.element as GuideElementResolver).selector
    return selector ? Boolean(findVisibleElement(selector) ?? document.querySelector(selector)) : true
  })
}

export function UserGuide() {
  const guideRef = useRef<ReturnType<typeof driver> | null>(null)
  const config = useMemo(() => driverConfig, [])

  function startGuide() {
    openSidebarForGuide()

    window.setTimeout(() => {
      const steps = getAvailableSteps()

      if (!steps.length) return

      guideRef.current?.destroy()
      guideRef.current = driver({
        ...config,
        steps,
        onDestroyed: () => {
          window.localStorage.setItem(USER_GUIDE_SEEN_KEY, "1")
        },
      })
      guideRef.current.drive()
    }, 320)
  }

  useEffect(() => {
    const shouldOpen = window.localStorage.getItem(USER_GUIDE_PENDING_KEY) === "1"

    if (!shouldOpen) return

    window.localStorage.removeItem(USER_GUIDE_PENDING_KEY)
    const guideTimer = window.setTimeout(startGuide, 450)

    return () => window.clearTimeout(guideTimer)
  }, [])

  useEffect(() => {
    return () => guideRef.current?.destroy()
  }, [])

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
