import { useState } from "react";

import { MESSAGE_DETAILS_MAX_LENGTH } from "@/constants/portfolioMessageConstants";
import { usePortfolioMessageSender } from "@/hooks/usePortfolioMessageSender";
import type { MessageReason } from "@/types/messages";
import { validateGuestContactEmail, validateGuestContactName } from "@/utils/portfolioMessageValidationUtils";

type UsePortfolioMessageModalParams = {
  recipientId: string;
  portfolioSlug: string;
  isGuest: boolean;
  onSent: () => void;
};

export function usePortfolioMessageModal(params: UsePortfolioMessageModalParams) {
  const [selectedReason, setSelectedReason] = useState<MessageReason | "">("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [details, setDetails] = useState("");
  const sender = usePortfolioMessageSender(params.onSent);

  function selectReason(reason: MessageReason) {
    setSelectedReason(reason);
    sender.setErrorMessage("");
  }

  function updateContactName(value: string) {
    setContactName(value);
    sender.setContactErrors((current) => ({ ...current, contactName: validateGuestContactName(value) }));
    sender.setErrorMessage("");
  }

  function updateContactEmail(value: string) {
    const sanitizedValue = value.replace(/\s+/g, "");
    setContactEmail(sanitizedValue);
    sender.setContactErrors((current) => ({ ...current, contactEmail: validateGuestContactEmail(sanitizedValue) }));
    sender.setErrorMessage("");
  }

  function updateDetails(value: string) {
    setDetails(value.slice(0, MESSAGE_DETAILS_MAX_LENGTH));
  }

  function submitMessage() {
    void sender.sendMessage({
      recipientId: params.recipientId,
      portfolioSlug: params.portfolioSlug,
      selectedReason,
      details,
      isGuest: params.isGuest,
      contactName,
      contactEmail,
    });
  }

  return {
    selectedReason,
    contactName,
    contactEmail,
    contactErrors: sender.contactErrors,
    details,
    isSending: sender.isSending,
    errorMessage: sender.errorMessage,
    selectReason,
    updateContactName,
    updateContactEmail,
    updateDetails,
    submitMessage,
  };
}
