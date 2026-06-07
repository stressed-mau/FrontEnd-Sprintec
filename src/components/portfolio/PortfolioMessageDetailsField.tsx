import { MESSAGE_DETAILS_MAX_LENGTH } from "@/constants/portfolioMessageConstants";

type PortfolioMessageDetailsFieldProps = {
  details: string;
  onDetailsChange: (value: string) => void;
};

export function PortfolioMessageDetailsField({ details, onDetailsChange }: PortfolioMessageDetailsFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-bold text-[#00457A]">Detalles adicionales (opcional)</span>
      <textarea
        value={details}
        onChange={(event) => onDetailsChange(event.target.value)}
        maxLength={MESSAGE_DETAILS_MAX_LENGTH}
        placeholder="Agrega mas informacion si lo deseas..."
        className="h-28 w-full resize-none rounded-xl border border-[#6DACBF] px-4 py-3 text-base text-[#003A6C] outline-none transition placeholder:text-[#7C9CB8] focus:border-[#00457A] focus:ring-2 focus:ring-[#00457A]/20"
      />
      <span className="mt-2 block text-sm text-[#65758A]">
        {details.length}/{MESSAGE_DETAILS_MAX_LENGTH} caracteres
      </span>
    </label>
  );
}
