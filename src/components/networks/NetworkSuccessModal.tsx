import { Button } from "@/components/ui/button"

export function NetworkSuccessModal({ isOpen, message, onClose }: { isOpen: boolean; message: string; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div id="modal-exito-redes-profesionales" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div id="contenedor-modal-exito-redes-profesionales" className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
        <button id="boton-cerrar-modal-exito-redes-profesionales" type="button" onClick={onClose} aria-label="Cerrar modal de éxito" className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-[#4B778D] transition hover:bg-[#EEF5F9]">
          X
        </button>
        <div id="icono-modal-exito-redes-profesionales" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D9EAF4] text-[#003A6C]">
          <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 id="titulo-modal-exito-redes-profesionales" className="text-xl font-bold text-[#003A6C]">
          Exito
        </h2>
        <p id="mensaje-modal-exito-redes-profesionales" className="mt-2 text-sm text-[#4B778D]">
          {message}
        </p>
        <Button id="boton-aceptar-modal-exito-redes-profesionales" onClick={onClose} className="mt-6 h-11 w-full bg-[#003A6C] text-white hover:bg-[#1a4f7a]">
          Aceptar
        </Button>
      </div>
    </div>
  )
}
