import { useEffect, useMemo, useRef } from "react"
import { CircleHelp } from "lucide-react"
import { driver, type Config, type DriveStep } from "driver.js"
import "driver.js/dist/driver.css"

export const USER_GUIDE_PENDING_KEY = "portfolio_user_guide_pending"
const USER_GUIDE_SEEN_KEY = "portfolio_user_guide_seen"

const guideSteps: DriveStep[] = [
  {
    element: "#btn-go-dashboard",
    popover: {
      title: "Inicio",
      description: "Vuelve al panel principal para revisar avisos y continuar tu portafolio.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#guide-nav-personal",
    popover: {
      title: "Datos personales",
      description: "Completa primero esta seccion. Es la base de tu perfil publico.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#guide-nav-proyectos",
    popover: {
      title: "Proyectos",
      description: "Registra trabajos importantes para mostrar evidencia de tus capacidades.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#guide-nav-habilidades",
    popover: {
      title: "Habilidades",
      description: "Agrega habilidades tecnicas y blandas para fortalecer tu perfil.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#guide-nav-experiencia",
    popover: {
      title: "Experiencia",
      description: "Incluye tus cargos, empresas y fechas para construir tu trayectoria.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#guide-nav-plantillas",
    popover: {
      title: "Plantillas",
      description: "Elige el estilo visual que mejor represente tu portafolio.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#guide-nav-configuracion-visibilidad",
    popover: {
      title: "Visibilidad",
      description: "Decide que secciones se mostraran antes de publicar.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#guide-nav-publicar",
    popover: {
      title: "Publicar",
      description: "Cuando todo este listo, publica y comparte tu enlace profesional.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#btn-user-menu",
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
}

function getAvailableSteps() {
  return guideSteps.filter((step) => {
    if (typeof step.element !== "string") return true
    return Boolean(document.querySelector(step.element))
  })
}

export function UserGuide() {
  const guideRef = useRef<ReturnType<typeof driver> | null>(null)
  const config = useMemo(() => driverConfig, [])

  function startGuide() {
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
