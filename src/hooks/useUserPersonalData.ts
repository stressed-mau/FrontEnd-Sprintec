import { useState, useRef, useEffect } from "react";
import { getAuthSession } from "@/services/auth/auth-storage";
import { allCountries } from 'country-telephone-data';
import { useEmailValidation } from "@/hooks/useEmailValidation";
import { getUserInformation, updateUserInformation } from "@/services/PersonalDataService";

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

  // warning visual (UI)
  if (value.length === 8) {
    setCharLimitWarning(prev => ({
      ...prev,
      phone: "Has alcanzado el máximo de 8 dígitos."
    }));
  } else {
    setCharLimitWarning(prev => ({
      ...prev,
      phone: ""
    }));
  }

  // validación real
  setErrors((prev: any) => ({
    ...prev,
    phone: validateField("phone", value)
  }));
  };

  const [form, setForm] = useState({
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


  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { suggestion, sanitizeEmailInput, validateEmail } = useEmailValidation(form.email);
  const validateField = (id: string, value: string) => {
  switch (id) {
    case "fullName":
      if (!value.trim()) return "El nombre completo es obligatorio.";
      if (!/^[a-zA-Z\s]+$/.test(value)) return "El nombre solo puede contener letras.";
      if (value.length > 100) return "El nombre no puede exceder los 100 caracteres.";
      return "";

    case "occupation":
      return value.length >= 80 ? "La ocupación no puede exceder los 80 caracteres." : "";

    case "bio":
      return value.length >= 300 ? "La biografía no puede exceder los 300 caracteres." : "";

    case "location":
      return value.length >= 100 ? "La ubicación no puede exceder los 100 caracteres." : "";

    case "email": {
      const cleanValue = value.trim();

      if (!cleanValue) return "El correo electrónico es obligatorio.";

      if (cleanValue.length >= 60) {
        return "El correo no puede exceder los 60 caracteres.";
      }

      // Validación básica (rápida)
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
        // Aquí usamos mailcheck para sugerencia aunque sea inválido
        validateEmail(cleanValue);
        return "Formato de correo inválido.";
      }
      // Validación completa (usa validator + mailcheck)
      const result = validateEmail(cleanValue);

      return result.error;
    }
    case "phone": {
      const cleanValue = value.trim();

      if (!cleanValue) {
        return "El número de contacto es obligatorio";
      }

      if (!/^[0-9]+$/.test(cleanValue)) {
        return "El número de contacto solo puede contener números.";
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
  useEffect(() => {
    console.log("USEEFFECT CORRIENDO");

    const fetchData = async () => {
    try {
      const session = getAuthSession();

      if (!session || !session.user?.id || !session.accessToken) {
        console.error("No hay sesión válida");
        return;
      }

      const user = await getUserInformation(String(session.user.id));

      const mappedForm = {
        fullName: user.fullname || "",
        occupation: user.occupation || "",
        bio: user.biography || "",
        location: user.nationality || "",
        email: user.public_email || "",
        image: user.image_url || "",
      };

      setForm(mappedForm);

      if (user.phone_number) {
        const foundCountry = allCountries.find(c =>
          user.phone_number.startsWith("+" + c.dialCode)
        );

        if (foundCountry) {
          setCountryCode(foundCountry.dialCode);

          const numberWithoutCode = user.phone_number.replace(
            "+" + foundCountry.dialCode,
            ""
          );

          setPhoneNumber(numberWithoutCode);
        } else {
          // fallback
          setPhoneNumber(user.phone_number);
        }
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
    setLoading(false); 
    }
  };

  fetchData();
}, []);

  // =========================
  // INPUTS
  // =========================
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
  if (limit && value.length >= limit) {
    const errorMessage = validateField(id, value);

    setCharLimitWarning(prev => ({
      ...prev,
      [id]: errorMessage
    }));
  } else {
    setCharLimitWarning(prev => ({
      ...prev,
      [id]: ""
    }));
  }

  const newValue = id === "email" ? sanitizeEmailInput(value) : value;
  setForm(prev => ({
    ...prev,
    [id]: newValue
  }));

  // VALIDACIÓN
  setErrors((prev: any) => ({
    ...prev,
    [id]: validateField(id, newValue)
  }));
};

  
  
  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("SUBMIT EJECUTADO");

    const newErrors: any = {};

    Object.keys(form).forEach((key) => {
      const error = validateField(key, (form as any)[key]);
      if (error) newErrors[key] = error;
    });

    const phoneError = validateField("phone", phoneNumber);
    if (phoneError) newErrors.phone = phoneError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.log("VALIDACIÓN FALLÓ");
      return;
    }

    try {
      const session = getAuthSession();

      if (!session || !session.accessToken) {
        setErrors({ server: "Sesión expirada. Inicia sesión nuevamente." });
        return;
      }

      const formData = new FormData();
      formData.append("_method", "PUT"); // ← déjalo si usas Laravel
      formData.append("fullname", form.fullName);
      formData.append("occupation", form.occupation);
      formData.append("biography", form.bio);
      formData.append("nationality", form.location);
      formData.append("phone_number", `+${countryCode}${phoneNumber}`);
      formData.append("public_email", form.email);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("image_url", fileInputRef.current.files[0]);
      }

      
      await updateUserInformation(String(session.user.id), formData);

      setSuccess("Información guardada correctamente ");

    } catch (error: any) {
      if (error.response?.data?.errors?.public_email) {
        setErrors({ email: error.response.data.errors.public_email[0] });
      } else {
        setErrors({
          server: error.response?.data?.message || "Error al guardar datos"
        });
      }
    }
  };

  // =========================
  // CANCELAR
  // =========================
  const handleCancel = () => {
    setForm({
      fullName: "",
      occupation: "",
      bio: "",
      location: "",
      email: "",
      image: ""
    });
    setPhoneNumber("");
    setPreview(null);
    setErrors({});
    setSuccess("");
  };

  // =========================
  // IMAGEN
  // =========================
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
    setErrors(prev => ({ ...prev, image: "" }));
  };

  const removeImage = () => {
  setPreview(null);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
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
    handleSubmit,
    handleCancel,
    handleClick,
    handleFileChange,
    removeImage,
    loading,
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
        email: error
      }));
    }
  };
};