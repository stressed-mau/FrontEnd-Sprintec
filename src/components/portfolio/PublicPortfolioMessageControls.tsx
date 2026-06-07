import { MessageCircle } from "lucide-react";

import PortfolioMessageModal from "@/components/portfolio/PortfolioMessageModal";

type PublicPortfolioMessageControlsProps = {
  recipientName: string;
  recipientId: string;
  portfolioSlug: string;
  isGuest: boolean;
  messageFeedback: string;
  isMessageModalOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSent: () => void;
};

export function PublicPortfolioMessageControls({
  recipientName,
  recipientId,
  portfolioSlug,
  isGuest,
  messageFeedback,
  isMessageModalOpen,
  onOpen,
  onClose,
  onSent,
}: PublicPortfolioMessageControlsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#00457A] text-white shadow-xl shadow-black/25 transition hover:bg-[#003A6C] focus:outline-none focus:ring-4 focus:ring-[#6DACBF]/40"
        aria-label={`Enviar mensaje a ${recipientName}`}
        title={`Enviar mensaje a ${recipientName}`}
      >
        <MessageCircle className="h-8 w-8" />
      </button>
      {messageFeedback ? (
        <div className="fixed bottom-24 right-5 z-40 max-w-[min(24rem,calc(100vw-2.5rem))] rounded-xl border border-[#6DACBF]/40 bg-white px-4 py-3 text-sm font-semibold text-[#003A6C] shadow-xl">
          {messageFeedback}
        </div>
      ) : null}
      {isMessageModalOpen ? (
        <PortfolioMessageModal
          recipientName={recipientName}
          recipientId={recipientId}
          portfolioSlug={portfolioSlug}
          isGuest={isGuest}
          onClose={onClose}
          onSent={onSent}
        />
      ) : null}
    </>
  );
}
