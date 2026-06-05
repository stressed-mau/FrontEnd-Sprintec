import { useState, useRef, useEffect, useMemo } from "react";
import { getAuthSession } from "@/services/auth/authStorageService";
import { allCountries } from 'country-telephone-data';
import { useEmailValidation } from "@/hooks/useEmailValidation";
import {
  createUserInformation,
  getUserInformation,
  updateUserInformation,
  type UserInformation,
} from "@/services/PersonalDataService";

const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

type FormErrors = {
  fullName?: string;
  occupation?: string;
  bio?: string;
  location?: string;
  email?: string;
  phone?: string;
  image?: string;
  server?: string;
};

type PersonalDataForm = {
  fullName: string;
  occupation: string;
  bio: string;
  location: string;
  email: string;
  image: string;
};

const FIELD_LABELS: Record<keyof PersonalDataForm, string> = {
  fullName: "Nombre completo",
  occupation: "Ocupación",
  bio: "Biografía",
  location: "Residencia actual",
  email: "Correo electrónico público",
  image: "Foto de perfil",
};

const PRESERVE_VALUE_FIELDS: Array<keyof PersonalDataForm> = [
  "occupation",
  "bio",
  "location",
  "email",
];

export const useUserPersonalData = () => {
  console.log("HOOK useUserPersonalData CARGADO");
  const [countryCode, setCountryCode] = useState("591");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [charLimitWarning, setCharLimitWarning] = useState({
    fullName: "",
    occupation: "",
    bio: "",
    location: "",
    email: "",
    phone: ""
  });
  const handlePhoneChange = (value: string) => {
  setPhoneNumber(value);
  setErrors((prev: any) => ({
    ...prev,
    server: "",
    phone: validateField("phone", value)
  }));
};

  const [form, setForm] = useState<PersonalDataForm>({
    fullName: "",
    occupation: "",
    bio: "",
    location: "",
    email: "",
    image: ""
  });

  useEffect(() => {
    console.log("FORM CAMBIÓ:", form);
  }, [form]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasPersonalData, setHasPersonalData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { suggestion, sanitizeEmailInput, validateEmail } = useEmailValidation(form.email);
  const [originalForm, setOriginalForm] = useState<PersonalDataForm | null>(null);
  const [originalCountryCode, setOriginalCountryCode] = useState("591");
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState("");
  const applyUserInformation = (user: UserInformation) => {
    const mappedForm = {
      fullName: user.fullname || "",
      occupation: user.occupation || "",
      bio: user.biography || "",
      location: user.nationality || "",
      email: user.public_email || "",
      image: user.image_url || "",
    };

    setForm(mappedForm);
    setOriginalForm(mappedForm);
    setHasPersonalData(Boolean(
      user.fullname ||
      user.occupation ||
      user.biography ||
      user.nationality ||
      user.phone_number ||
      user.public_email ||
      user.image_url
    ));

    if (user.phone_number) {
      const foundCountry = allCountries.find(c =>
        user.phone_number.startsWith("+" + c.dialCode)
      );

      if (foundCountry) {
        const numberWithoutCode = user.phone_number.replace(
          "+" + foundCountry.dialCode,
          ""
        );

        setCountryCode(foundCountry.dialCode);
        setPhoneNumber(numberWithoutCode);
        setOriginalCountryCode(foundCountry.dialCode);
        setOriginalPhoneNumber(numberWithoutCode);
      } else {
        setPhoneNumber(user.phone_number);
        setOriginalPhoneNumber(user.phone_number);
      }
    } else {
      setCountryCode("591");
      setPhoneNumber("");
      setOriginalCountryCode("591");
      setOriginalPhoneNumber("");
    }

    return mappedForm;
  };

  const validateField = (id: string, value: string) => {
  switch (id) {
    case "fullName":
      if (!value.trim()) return "El campo Nombre completo es obligatorio.";
      if (EMOJI_REGEX.test(value)) return "El nombre solo puede contener letras.";
      if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(value)) return "El nombre solo puede contener letras.";
      if (value.length > 100) return "El nombre no puede exceder los 100 caracteres.";
      return "";

    case "occupation":
      if (EMOJI_REGEX.test(value)) return "La ocupación no permite emoticones.";
      return value.length > 80 ? "La ocupación no puede exceder los 80 caracteres." : "";

    case "bio":
      if (EMOJI_REGEX.test(value)) return "La biografía no permite emoticones.";
      return value.length > 300 ? "La biografía no puede exceder los 300 caracteres." : "";

    case "location":
      if (EMOJI_REGEX.test(value)) return "La residencia actual no permite emoticones.";
      return value.length > 100 ? "La residencia actual no puede exceder los 100 caracteres." : "";

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

      // Validación básica (rápida)
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
        // Aquí usamos mailcheck para sugerencia aunque sea inválido
        validateEmail(cleanValue);
        return "El Correo electrónico debe tener un formato válido (ej. usuario@gmail.com).";
      }
      // Validación completa (usa validator + mailcheck)
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
  const canSavePersonalData = useMemo(() => {
    if (isSubmitting) {
      return false;
    }

    const hasProfileImage = Boolean(preview || form.image || fileInputRef.current?.files?.length);

    if (!form.fullName.trim() || !form.email.trim() || !phoneNumber.trim() || !hasProfileImage) {
      return false;
    }

    if (Object.values(errors).some(Boolean)) {
      return false;
    }

    if (originalForm) {
      const hasClearedExistingField = PRESERVE_VALUE_FIELDS.some((field) => originalForm[field].trim() && !form[field].trim());

      if (hasClearedExistingField) {
        return false;
      }

      if (originalPhoneNumber.trim() && !phoneNumber.trim()) {
        return false;
      }
    }

    return true;
  }, [errors, form, isSubmitting, originalForm, originalPhoneNumber, phoneNumber, preview]);
  useEffect(() => {
    if (!loading) return;
    const fetchData = async () => {
    
    try {
      const session = getAuthSession();

      if (!session || !session.user?.id) return;

      const user = await getUserInformation();
      const userHasPersonalData = Boolean(
        user.fullname ||
        user.occupation ||
        user.biography ||
        user.nationality ||
        user.phone_number ||
        user.public_email ||
        user.image_url
      );
      const mappedForm = applyUserInformation(user);
      const initialErrors: any = {};

      if (userHasPersonalData) {
        Object.keys(mappedForm).forEach((key) => {
          const error = validateField(key, (mappedForm as any)[key]);
          if (error) initialErrors[key] = error;
        });
      }
      setErrors(initialErrors);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
    setLoading(false); 
    }
  };

    fetchData();
  }, []);

  const LIMITS: Record<string, number> = {
  fullName: 100,
  location: 100,
  occupation: 80,
  bio: 300,
  email: 60
};

const handleChange = (e: any) => {
  const { id, value } = e.target;

  const limit = LIMITS[id];

  // WARNING POR CAMPO
  if (limit && value.length > limit) {
    return; // Ignora el cambio si excede el límite
  }
  if (limit && value.length === limit) {
    setCharLimitWarning(prev => ({
      ...prev,
      [id]: `Has alcanzado el límite de ${limit} caracteres.`
    }));
  } else {
    setCharLimitWarning(prev => ({ ...prev, [id]: "" }));
  }

  const newValue = value;
  setForm(prev => ({
    ...prev,
    [id]: newValue
  }));

  // VALIDACIÓN
  setErrors((prev: any) => ({
    ...prev,
    server: "",
    [id]: validateField(id, newValue)
  }));
};
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("SUBMIT EJECUTADO");
    if (isSubmitting) return;
    const newErrors: any = {};

    Object.keys(form).forEach((key) => {
      const error = validateField(key, (form as any)[key]);
      if (error) newErrors[key] = error;
    });

    const phoneError = validateField("phone", phoneNumber);
    if (phoneError) newErrors.phone = phoneError;
    const hasImage =
      preview ||
      form.image ||
      fileInputRef.current?.files?.length;

    if (!hasImage) {
      newErrors.image = "La foto de perfil es obligatoria.";
    }
    if (originalForm) {
      PRESERVE_VALUE_FIELDS.forEach((field) => {
        if (originalForm[field].trim() && !form[field].trim()) {
          newErrors[field] = `El campo ${FIELD_LABELS[field]} no puede quedar vacío.`;
        }
      });

      if (originalPhoneNumber.trim() && !phoneNumber.trim()) {
        newErrors.phone = "El campo Numero de contacto no puede quedar vacío.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return false; // Detener si hay errores de validación
    }

    setIsSubmitting(true);

    try {
      const session = getAuthSession();

      if (!session || !session.accessToken) {
        setErrors({ server: "Sesión expirada. Inicia sesión nuevamente." });
        setIsSubmitting(false);
        return;
      }

      const buildRequestPayload = () => {
        const payload = {
          fullname: form.fullName,
          occupation: form.occupation,
          biography: form.bio,
          nationality: form.location,
          phone_number: phoneNumber.trim() ? `+${countryCode}${phoneNumber}` : "",
          public_email: form.email,
        };
        const imageFile = fileInputRef.current?.files?.[0];
        const requestPayload = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
          requestPayload.append(key, value);
        });

        if (imageFile) {
          requestPayload.append("image_url", imageFile);
        }

        return requestPayload;
      };

      if (hasPersonalData) {
        await updateUserInformation(buildRequestPayload());
      } else {
        try {
          await createUserInformation(buildRequestPayload());
        } catch (createError: any) {
          const message = String(createError.response?.data?.message || createError.response?.data?.error || createError.message || "");
          const shouldRetryAsUpdate = /creating user information|duplicate|unique|user_id/i.test(message);

          if (!shouldRetryAsUpdate) {
            throw createError;
          }

          await updateUserInformation(buildRequestPayload());
        }
      }

      const persistedUser = await getUserInformation();
      applyUserInformation(persistedUser);

      setPreview(null);
      setSuccess("Información actualizada correctamente.");
      return true;
    } catch (error: any) {
      const responseData = error.response?.data;
      const validationErrors = responseData?.errors;

      if (validationErrors && typeof validationErrors === "object") {
        const nextErrors: FormErrors = {};

        Object.entries(validationErrors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : String(messages);

          if (field === "fullname") nextErrors.fullName = message;
          else if (field === "biography") nextErrors.bio = message;
          else if (field === "nationality") nextErrors.location = message;
          else if (field === "public_email") nextErrors.email = message;
          else if (field === "phone_number") nextErrors.phone = message;
          else if (field === "image_url") nextErrors.image = message;
          else nextErrors.server = message;
        });

        setErrors(nextErrors);
      } else {
        setErrors({
          server: responseData?.error || responseData?.message || error.message || "Error al guardar datos"
        });
      }
    } finally {
      setIsSubmitting(false); 
    }
  };

  const handleCancel = () => {
    if (originalForm) {
      setForm(originalForm);
    }

    setPreview(null);
    setErrors({});
    setSuccess("");
    setCountryCode(originalCountryCode);
    setPhoneNumber(originalPhoneNumber);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: "Formato de imagen no válido."
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        image: "El tamaño de la imagen no debe superar los 2 MB."
      }));
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setErrors(prev => ({ ...prev, server: "", image: "" }));
  };

  const removeImage = () => {
    setPreview(null);
    setForm(prev => ({
      ...prev,
      image: ""
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setErrors(prev => ({
      ...prev,
      image: "La foto de perfil es obligatoria."
    }));
  };

  return {
    form,
    setForm,
    errors,
    setErrors,
    success,
    setSuccess,
    preview,
    setPreview,
    countryCode,
    phoneNumber,
    fileInputRef,
    setCountryCode,
    setPhoneNumber,
    handleChange,
    handlePhoneChange,
    isSubmitting,
    canSavePersonalData,
    handleSubmit,
    handleCancel,
    handleClick,
    handleFileChange,
    removeImage,
    loading,
    hasPersonalData,
    charLimitWarning,
    setCharLimitWarning,
    emailSuggestion: suggestion,
    applyEmailSuggestion: (email: string) => {
      const sanitized = sanitizeEmailInput(email);
      const { error } = validateEmail(sanitized);

      setForm(prev => ({
        ...prev,
        email: sanitized
      }));

      setErrors(prev => ({
        ...prev,
        server: "",
        email: error
      }));
    }
  };
};
