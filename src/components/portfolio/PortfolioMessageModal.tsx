import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";

import {
  sendPortfolioMessage,
  type MessageReason,
} from "@/services/messagesService";

type PortfolioMessageModalProps = {
  recipientName: string;
  portfolioSlug: string;
  recipientId: string;
  onClose: () => void;
  onSent: () => void;
};

const MESSAGE_REASON_OPTIONS: Array<{ id: MessageReason; title: string; message: string }> = [
  {
    id: "job_opportunity",
    title: "Oportunidad laboral",
    message: "Hola, me interesa tu perfil profesional. Tengo una oportunidad laboral que podria interesarte.",
  },
  {
    id: "project_collaboration",
    title: "Colaboracion en proyecto",
    message: "Hola, estoy trabajando en un proyecto y me gustaria colaborar contigo.",
  },
  {
    id: "technical_question",
    title: "Consulta tecnica",
    message: "Hola, me gustaria consultarte sobre tu experiencia en algunas tecnologias.",
  },
  {
    id: "professional_networking",
    title: "Networking profesional",
    message: "Hola, me gustaria conectar contigo y ampliar mi red profesional.",
  },
  {
    id: "mentorship",
    title: "Mentoria",
    message: "Hola, me interesa aprender de tu experiencia. Podrias orientarme?",
  },
  {
    id: "freelance_proposal",
    title: "Propuesta freelance",
    message: "Hola, tengo un proyecto freelance que podria interesarte.",
  },
]

const MESSAGE_DETAILS_MAX_LENGTH = 300

const PortfolioMessageModal = ({ recipientName, portfolioSlug, recipientId, onClose, onSent }: PortfolioMessageModalProps) => {
  const [selectedReason, setSelectedReason] = useState<MessageReason | "">("")
  const [details, setDetails] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleSubmit = async () => {
    const reason = MESSAGE_REASON_OPTIONS.find((option) => option.id === selectedReason)

    if (!reason) {
      setErrorMessage("Selecciona un motivo de contacto.")
      return
    }

    setIsSending(true)
    setErrorMessage("")

    try {
      await sendPortfolioMessage({
        recipient_id: recipientId,
        portfolio_slug: portfolioSlug,
        reason: reason.id,
        reason_title: reason.title,
        base_message: reason.message,
        additional_details: details.trim() || undefined,
      })
      onSent()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo enviar el mensaje. Intentalo nuevamente.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-none bg-white shadow-2xl sm:w-[min(92vw,32rem)] sm:rounded-lg">
        <div className="flex items-center justify-between bg-[#00457A] px-5 py-5 text-white">
          <h2 className="min-w-0 break-words text-xl font-bold leading-tight sm:text-2xl">
            Enviar mensaje a {recipientName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="ml-3 shrink-0 rounded-full p-1 transition hover:bg-white/15"
            aria-label="Cerrar modal de mensaje"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <section>
            <h3 className="mb-3 text-base font-bold text-[#00457A]">Motivo de contacto *</h3>
            <div className="space-y-3">
              {MESSAGE_REASON_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition ${
                    selectedReason === option.id
                      ? "border-[#00457A] bg-[#EEF7FC]"
                      : "border-[#6DACBF] bg-white hover:bg-[#F6FBFE]"
                  }`}
                >
                  <input
                    type="radio"
                    name="message-reason"
                    value={option.id}
                    checked={selectedReason === option.id}
                    onChange={() => {
                      setSelectedReason(option.id)
                      setErrorMessage("")
                    }}
                    className="mt-1 h-4 w-4 accent-[#00457A]"
                  />
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-[#00457A]">{option.title}</span>
                    <span className="mt-1 block text-sm font-medium leading-5 text-[#4B5563]">{option.message}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <label className="block">
            <span className="mb-2 block text-base font-bold text-[#00457A]">Detalles adicionales (opcional)</span>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value.slice(0, MESSAGE_DETAILS_MAX_LENGTH))}
              maxLength={MESSAGE_DETAILS_MAX_LENGTH}
              placeholder="Agrega mas informacion si lo deseas..."
              className="h-28 w-full resize-none rounded-xl border border-[#6DACBF] px-4 py-3 text-base text-[#003A6C] outline-none transition placeholder:text-[#7C9CB8] focus:border-[#00457A] focus:ring-2 focus:ring-[#00457A]/20"
            />
            <span className="mt-2 block text-sm text-[#65758A]">
              {details.length}/{MESSAGE_DETAILS_MAX_LENGTH} caracteres
            </span>
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-3 border-t border-gray-200 bg-white px-5 py-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSending}
            className="inline-flex h-11 items-center justify-center gap-3 rounded-lg bg-[#00457A] px-4 text-base font-bold text-white transition hover:bg-[#003A6C] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send className="h-5 w-5" />
            {isSending ? "Enviando..." : "Enviar mensaje"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="h-11 rounded-lg border border-[#6DACBF] bg-[#CBE7F8] px-5 text-base font-semibold text-[#003A6C] transition hover:bg-[#B7DDF2] disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default PortfolioMessageModal;