import { useState } from "react";

import { MESSAGE_REASON_OPTIONS } from "@/constants/portfolioMessageConstants";
import { sendPortfolioMessage } from "@/services/messagesService";
import type { MessageReason } from "@/types/messages";
import type { PortfolioMessageContactErrors, PortfolioMessageContactValues } from "@/types/portfolioMessage";
import { validateGuestContact } from "@/utils/portfolioMessageValidationUtils";

type SendMessageOptions = PortfolioMessageContactValues & {
  recipientId: string;
  portfolioSlug: string;
  selectedReason: MessageReason | "";
  details: string;
  isGuest: boolean;
};

export function usePortfolioMessageSender(onSent: () => void) {
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [contactErrors, setContactErrors] = useState<PortfolioMessageContactErrors>({});

  async function sendMessage(options: SendMessageOptions) {
    const reason = MESSAGE_REASON_OPTIONS.find((item) => item.id === options.selectedReason);
    const nextContactErrors = options.isGuest ? validateGuestContact(options.contactName, options.contactEmail) : {};

    if (Object.keys(nextContactErrors).length > 0) return showContactErrors(nextContactErrors);
    if (!reason) return setErrorMessage("Selecciona un motivo de contacto.");

    await submitMessage(options, reason);
  }

  function showContactErrors(nextContactErrors: PortfolioMessageContactErrors) {
    setContactErrors(nextContactErrors);
    setErrorMessage("Revisa los datos de contacto.");
  }

  async function submitMessage(options: SendMessageOptions, reason: (typeof MESSAGE_REASON_OPTIONS)[number]) {
    setIsSending(true);
    setErrorMessage("");

    try {
      await sendPortfolioMessage({
        recipient_id: options.recipientId,
        portfolio_slug: options.portfolioSlug,
        reason: reason.id,
        reason_title: reason.title,
        base_message: reason.message,
        additional_details: options.details.trim() || undefined,
        contact_name: options.isGuest ? options.contactName.trim() : undefined,
        contact_email: options.isGuest ? options.contactEmail.trim() : undefined,
      });
      onSent();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo enviar el mensaje. Intentalo nuevamente.");
    } finally {
      setIsSending(false);
    }
  }

  return { contactErrors, errorMessage, isSending, sendMessage, setContactErrors, setErrorMessage };
}
