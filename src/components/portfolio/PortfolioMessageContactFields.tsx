import { CONTACT_EMAIL_MAX_LENGTH, CONTACT_NAME_MAX_LENGTH } from "@/constants/portfolioMessageConstants";
import type { PortfolioMessageContactErrors } from "@/types/portfolioMessage";

type PortfolioMessageContactFieldsProps = {
  contactName: string;
  contactEmail: string;
  contactErrors: PortfolioMessageContactErrors;
  onContactNameChange: (value: string) => void;
  onContactEmailChange: (value: string) => void;
};

type ContactTextFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  maxLength: number;
  type?: "text" | "email";
  onChange: (value: string) => void;
};

export function PortfolioMessageContactFields({
  contactName,
  contactEmail,
  contactErrors,
  onContactNameChange,
  onContactEmailChange,
}: PortfolioMessageContactFieldsProps) {
  return (
    <section className="rounded-xl border border-[#6DACBF] bg-[#F6FBFE] p-4">
      <h3 className="mb-3 text-base font-bold text-[#00457A]">Tus datos de contacto *</h3>
      <div className="space-y-3">
        <ContactTextField
          id="portfolio-message-contact-name"
          label="Nombre completo *"
          value={contactName}
          error={contactErrors.contactName}
          maxLength={CONTACT_NAME_MAX_LENGTH}
          onChange={onContactNameChange}
        />
        <ContactTextField
          id="portfolio-message-contact-email"
          label="Correo de contacto *"
          type="email"
          value={contactEmail}
          error={contactErrors.contactEmail}
          maxLength={CONTACT_EMAIL_MAX_LENGTH}
          onChange={onContactEmailChange}
        />
      </div>
    </section>
  );
}

function ContactTextField({ id, label, value, error, maxLength, type = "text", onChange }: ContactTextFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm font-bold text-[#00457A]">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, maxLength))}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        className={`h-11 w-full rounded-xl border px-4 text-base text-[#003A6C] outline-none transition placeholder:text-[#7C9CB8] focus:border-[#00457A] focus:ring-2 focus:ring-[#00457A]/20 ${
          error ? "border-red-500 bg-red-50" : "border-[#6DACBF] bg-white"
        }`}
      />
      {error ? <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span> : null}
    </label>
  );
}
