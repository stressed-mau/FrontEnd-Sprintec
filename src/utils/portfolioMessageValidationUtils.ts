import isEmail from "validator/lib/isEmail";

import { CONTACT_EMAIL_MAX_LENGTH, CONTACT_NAME_MAX_LENGTH } from "@/constants/portfolioMessageConstants";
import type { PortfolioMessageContactErrors } from "@/types/portfolioMessage";

const EMOJI_REGEX = /\p{Extended_Pictographic}/u;
const CONTACT_NAME_REGEX = /^[\p{L}\s]+$/u;

export function validateGuestContact(contactName: string, contactEmail: string) {
  const errors: PortfolioMessageContactErrors = {};
  const contactNameError = validateGuestContactName(contactName);
  const contactEmailError = validateGuestContactEmail(contactEmail);

  if (contactNameError) errors.contactName = contactNameError;
  if (contactEmailError) errors.contactEmail = contactEmailError;

  return errors;
}

export function validateGuestContactName(contactName: string) {
  const name = contactName.trim();

  if (!name) return "El campo Nombre completo es obligatorio.";
  if (EMOJI_REGEX.test(name) || !CONTACT_NAME_REGEX.test(name)) return "El nombre completo solo puede contener letras y espacios.";
  if (name.length > CONTACT_NAME_MAX_LENGTH) return `El nombre completo no puede exceder los ${CONTACT_NAME_MAX_LENGTH} caracteres.`;

  return "";
}

export function validateGuestContactEmail(contactEmail: string) {
  const email = contactEmail.trim();

  if (!email) return "El campo Correo de contacto es obligatorio.";
  if (/\s/.test(contactEmail)) return "El correo de contacto no puede contener espacios en blanco.";
  if (email.length > CONTACT_EMAIL_MAX_LENGTH) return `El correo de contacto no puede exceder los ${CONTACT_EMAIL_MAX_LENGTH} caracteres.`;
  if (EMOJI_REGEX.test(email) || !isEmail(email)) return "El correo de contacto debe tener un formato válido.";

  return "";
}
