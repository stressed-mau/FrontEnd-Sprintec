import { Send } from "lucide-react";

type PortfolioMessageModalActionsProps = {
  isSending: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export function PortfolioMessageModalActions({ isSending, onCancel, onSubmit }: PortfolioMessageModalActionsProps) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 border-t border-gray-200 bg-white px-5 py-4">
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSending}
        className="inline-flex h-11 items-center justify-center gap-3 rounded-lg bg-[#00457A] px-4 text-base font-bold text-white transition hover:bg-[#003A6C] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Send className="h-5 w-5" />
        {isSending ? "Enviando..." : "Enviar mensaje"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isSending}
        className="h-11 rounded-lg border border-[#6DACBF] bg-[#CBE7F8] px-5 text-base font-semibold text-[#003A6C] transition hover:bg-[#B7DDF2] disabled:cursor-not-allowed disabled:opacity-70"
      >
        Cancelar
      </button>
    </div>
  );
}
