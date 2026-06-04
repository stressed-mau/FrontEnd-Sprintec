export type FormErrors = {
  fullName?: string;
  occupation?: string;
  bio?: string;
  location?: string;
  email?: string;
  phone?: string;
  image?: string;
  server?: string;
};

export type PersonalDataForm = {
  fullName: string;
  occupation: string;
  bio: string;
  location: string;
  email: string;
  image: string;
};

export const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

export const FIELD_LABELS = {
  fullName: "Nombre completo",
  occupation: "Ocupación",
  bio: "Biografía",
  location: "Residencia actual",
  email: "Correo electrónico público",
  image: "Foto de perfil",
} as const;

export const PRESERVE_VALUE_FIELDS = [
  "occupation",
  "bio",
  "location",
  "email",
] as const;

export const LIMITS: Record<string, number> = {
  fullName: 100,
  location: 100,
  occupation: 80,
  bio: 300,
  email: 60,
};

export type EmailValidator = (
  email: string
) => {
  error: string;
};

export const validateField = (
  id: string,
  value: string,
  validateEmail: EmailValidator
): string => {
  switch (id) {
    case "fullName":
      if (!value.trim()) {
        return "El campo Nombre completo es obligatorio.";
      }

      if (EMOJI_REGEX.test(value)) {
        return "El nombre solo puede contener letras.";
      }

      if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(value)) {
        return "El nombre solo puede contener letras.";
      }

      if (value.length > 100) {
        return "El nombre no puede exceder los 100 caracteres.";
      }

      return "";

    case "occupation":
      if (EMOJI_REGEX.test(value)) {
        return "La ocupación no permite emoticones.";
      }

      return value.length > 80
        ? "La ocupación no puede exceder los 80 caracteres."
        : "";

    case "bio":
      if (EMOJI_REGEX.test(value)) {
        return "La biografía no permite emoticones.";
      }

      return value.length > 300
        ? "La biografía no puede exceder los 300 caracteres."
        : "";

    case "location":
      if (EMOJI_REGEX.test(value)) {
        return "La residencia actual no permite emoticones.";
      }

      return value.length > 100
        ? "La residencia actual no puede exceder los 100 caracteres."
        : "";

    case "email": {
      const rawValue = value;

      if (rawValue.length === 0) {
        return "El campo Correo electrónico es obligatorio.";
      }

      if (/\s/.test(rawValue) || rawValue.trim().length === 0) {
        return "El correo electrónico no puede contener espacios en blanco.";
      }

      const cleanValue = rawValue.trim();

      if (cleanValue.length > 60) {
        return "El correo no puede exceder los 60 caracteres.";
      }

      if (EMOJI_REGEX.test(cleanValue)) {
        return "El Correo electrónico debe tener un formato válido (ej. usuario@gmail.com).";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
        validateEmail(cleanValue);

        return "El Correo electrónico debe tener un formato válido (ej. usuario@gmail.com).";
      }

      const result = validateEmail(cleanValue);

      return result.error;
    }

    case "phone": {
      const rawValue = value;
      const cleanValue = rawValue.trim();

      if (!cleanValue) {
        return rawValue.length > 0
          ? "El Número de contacto no puede contener espacios en blanco."
          : "El campo Número de contacto es obligatorio.";
      }

      if (/\s/.test(rawValue)) {
        return "El Número de contacto no puede contener espacios en blanco.";
      }

      if (!/^[0-9]+$/.test(cleanValue)) {
        return "El Número de contacto solo puede contener números.";
      }

      if (cleanValue.length !== 8) {
        return "El número de contacto debe tener 8 dígitos";
      }

      return "";
    }

    default:
      return "";
  }
  
};

export const validatePersonalDataForm = (
  form: PersonalDataForm,
  phoneNumber: string,
  validateEmail: EmailValidator
): FormErrors => {
  const errors: FormErrors = {};

  (Object.keys(form) as Array<keyof PersonalDataForm>).forEach((key) => {
    const error = validateField(key, form[key], validateEmail);

    if (error) {
      errors[key] = error;
    }
  });

  const phoneError = validateField(
    "phone",
    phoneNumber,
    validateEmail
  );

  if (phoneError) {
    errors.phone = phoneError;
  }

  return errors;
};

export const validatePreservedFields = (
  form: PersonalDataForm,
  originalForm: PersonalDataForm | null,
  phoneNumber: string,
  originalPhoneNumber: string
): FormErrors => {
  const errors: FormErrors = {};

  if (!originalForm) {
    return errors;
  }

  PRESERVE_VALUE_FIELDS.forEach((field) => {
    if (
      originalForm[field].trim() &&
      !form[field].trim()
    ) {
      errors[field] =
        `El campo ${FIELD_LABELS[field]} no puede quedar vacío.`;
    }
  });

  if (
    originalPhoneNumber.trim() &&
    !phoneNumber.trim()
  ) {
    errors.phone =
      "El campo Numero de contacto no puede quedar vacío.";
  }

  return errors;
};