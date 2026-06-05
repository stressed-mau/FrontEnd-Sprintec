import { useState, useRef, useEffect, useMemo } from "react";
import { getAuthSession } from "@/services/auth/auth-storage";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import {
  PRESERVE_VALUE_FIELDS, 
  LIMITS, validateField, 
  validatePersonalDataForm, 
  validatePreservedFields,
  type FormErrors,
  type PersonalDataForm,
} from "@/utils/PersonalDataValidation";
import { mapUserToForm, userHasData } from "@/utils/PersonalDataMapper";
import {createUserInformation, getUserInformation, updateUserInformation, type UserInformation,} from "@/services/personalDataService";
import { usePhoneData } from "@/hooks/usePhoneData";
export const useUserPersonalData = () => {
  const {countryCode, setCountryCode, phoneNumber, setPhoneNumber, originalPhoneNumber, applyPhoneNumber,} = usePhoneData();
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
    setErrors(prev => ({...prev, server: "", phone: validateField("phone", value, validateEmail)}));
  };
  const [form, setForm] = useState<PersonalDataForm>({
    fullName: "",
    occupation: "",
    bio: "",
    location: "",
    email: "",
    image: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasPersonalData, setHasPersonalData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { suggestion, sanitizeEmailInput, validateEmail } = useEmailValidation(form.email);
  const [originalForm, setOriginalForm] = useState<PersonalDataForm | null>(null);
  const applyUserInformation = (user: UserInformation) => {
    const mappedForm = mapUserToForm(user);
    setForm(mappedForm);
    setOriginalForm(mappedForm);
    setHasPersonalData(userHasData(user));
    applyPhoneNumber(user.phone_number || "");
    return mappedForm;
  };

  const canSavePersonalData = useMemo(() => {
    if (isSubmitting) { return false;}
    const hasProfileImage = Boolean(preview || form.image || fileInputRef.current?.files?.length);
    if (!form.fullName.trim() || !form.email.trim() || !phoneNumber.trim() || !hasProfileImage) {return false;}
    if (Object.values(errors).some(Boolean)) {return false;}
    if (originalForm) {
      const hasClearedExistingField = PRESERVE_VALUE_FIELDS.some((field) => originalForm[field].trim() && !form[field].trim());
      if (hasClearedExistingField) {return false;}
      if (originalPhoneNumber.trim() && !phoneNumber.trim()) {return false;}
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
      const initialErrors: FormErrors = {};

      if (userHasPersonalData) {
        (Object.keys(mappedForm) as Array<keyof PersonalDataForm>).forEach((key) => {
          const error = validateField(key, mappedForm[key], validateEmail);
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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const limit = LIMITS[id];
    if (limit && value.length > limit) {return; }
    if (limit && value.length === limit) {
      setCharLimitWarning(prev => ({...prev, [id]: `Has alcanzado el límite de ${limit} caracteres.`}));
    } else {
      setCharLimitWarning(prev => ({ ...prev, [id]: "" }));
    }
    const newValue = value;
    setForm(prev => ({...prev, [id]: newValue}));
    setErrors((prev: FormErrors) => ({...prev, server: "", [id]: validateField(id, newValue, validateEmail)}));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    const newErrors = validatePersonalDataForm(form, phoneNumber, validateEmail);
    const hasImage = Boolean(preview || form.image || fileInputRef.current?.files?.length);
    if (!hasImage) { newErrors.image = "La foto de perfil es obligatoria.";}
    Object.assign( newErrors, validatePreservedFields(form, originalForm,phoneNumber,originalPhoneNumber));
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) { return false; }
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
    if (originalForm) { setForm(originalForm);}
    setPreview(null);
    setErrors({});
    setSuccess("");
    applyPhoneNumber(originalPhoneNumber);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    setForm(prev => ({...prev, image: ""}));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setErrors(prev => ({...prev, image: "La foto de perfil es obligatoria."}));
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
      setForm(prev => ({ ...prev, email: sanitized }));
      setErrors(prev => ({...prev, server: "", email: error}));
    }
  };
};