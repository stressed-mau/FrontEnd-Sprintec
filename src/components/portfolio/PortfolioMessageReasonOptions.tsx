import { MESSAGE_REASON_OPTIONS } from "@/constants/portfolioMessageConstants";
import type { MessageReason } from "@/types/messages";

type PortfolioMessageReasonOptionsProps = {
  selectedReason: MessageReason | "";
  onSelectReason: (reason: MessageReason) => void;
};

export function PortfolioMessageReasonOptions({ selectedReason, onSelectReason }: PortfolioMessageReasonOptionsProps) {
  return (
    <section>
      <h3 className="mb-3 text-base font-bold text-[#00457A]">Motivo de contacto *</h3>
      <div className="space-y-3">
        {MESSAGE_REASON_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition ${
              selectedReason === option.id ? "border-[#00457A] bg-[#EEF7FC]" : "border-[#6DACBF] bg-white hover:bg-[#F6FBFE]"
            }`}
          >
            <input
              type="radio"
              name="message-reason"
              value={option.id}
              checked={selectedReason === option.id}
              onChange={() => onSelectReason(option.id)}
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
  );
}
