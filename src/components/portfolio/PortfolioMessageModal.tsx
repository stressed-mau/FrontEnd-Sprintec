import { useEffect } from "react";
import { X } from "lucide-react";

import { PortfolioMessageContactFields } from "@/components/portfolio/PortfolioMessageContactFields";
import { PortfolioMessageDetailsField } from "@/components/portfolio/PortfolioMessageDetailsField";
import { PortfolioMessageModalActions } from "@/components/portfolio/PortfolioMessageModalActions";
import { PortfolioMessageReasonOptions } from "@/components/portfolio/PortfolioMessageReasonOptions";
import { usePortfolioMessageModal } from "@/hooks/usePortfolioMessageModal";

type PortfolioMessageModalProps = {
  recipientName: string;
  portfolioSlug: string;
  recipientId: string;
  isGuest: boolean;
  onClose: () => void;
  onSent: () => void;
};

const PortfolioMessageModal = ({
  recipientName,
  portfolioSlug,
  recipientId,
  isGuest,
  onClose,
  onSent,
}: PortfolioMessageModalProps) => {
  const messageModal = usePortfolioMessageModal({ recipientId, portfolioSlug, isGuest, onSent });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
          {isGuest ? (
            <PortfolioMessageContactFields
              contactName={messageModal.contactName}
              contactEmail={messageModal.contactEmail}
              contactErrors={messageModal.contactErrors}
              onContactNameChange={messageModal.updateContactName}
              onContactEmailChange={messageModal.updateContactEmail}
            />
          ) : null}
          <PortfolioMessageReasonOptions
            selectedReason={messageModal.selectedReason}
            onSelectReason={messageModal.selectReason}
          />
          <PortfolioMessageDetailsField details={messageModal.details} onDetailsChange={messageModal.updateDetails} />
          {messageModal.errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {messageModal.errorMessage}
            </p>
          ) : null}
        </div>
        <PortfolioMessageModalActions
          isSending={messageModal.isSending}
          onCancel={onClose}
          onSubmit={messageModal.submitMessage}
        />
      </div>
    </div>
  );
};

export default PortfolioMessageModal;
