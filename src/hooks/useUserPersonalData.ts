import { useState, useRef } from "react";

export const useUserPersonalData = () => {
  const [countryCode, setCountryCode] = useState("591");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    occupation: "",
    bio: "",
    location: "",
    email: ""
  });

  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // =========================
  // INPUTS
  // =========================
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  // =========================
  // VALIDACIONES
  // =========================
  const validate = () => {
    let newErrors: any = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "El nombre completo es obligatorio.";
    } else if (!/^[a-zA-Z\s]+$/.test(form.fullName)) {
      newErrors.fullName = "El nombre solo puede contener letras.";
    } else if (form.fullName.length > 100) {
      newErrors.fullName = "El nombre no puede exceder los 100 caracteres.";
    }

    if (form.occupation.length > 80) {
      newErrors.occupation = "La ocupación no puede exceder los 80 caracteres.";
    }

    if (form.bio.length > 300) {
      newErrors.bio = "La biografía no puede exceder los 300 caracteres.";
    }

    if (form.location.length > 100) {
      newErrors.location = "La ubicación no puede exceder los 100 caracteres.";
    }

    if (!form.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (form.email.length > 60) {
      newErrors.email = "El correo no puede exceder los 60 caracteres.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email =
        "El Correo electrónico debe tener un formato válido (ej. usuario@uno.com).";
    }

    if (phoneNumber && !/^[0-9]+$/.test(phoneNumber)) {
      newErrors.phone = "El teléfono solo debe contener números.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const formData = new FormData();

      formData.append("fullname", form.fullName);
      formData.append("occupation", form.occupation);
      formData.append("biography", form.bio);
      formData.append("nationality", form.location);
      formData.append("phone_number", `+${countryCode}${phoneNumber}`);
      formData.append("public_email", form.email);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("image_url", fileInputRef.current.files[0]);
      }

      const response = await fetch("http://localhost:8000/api/user_information", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        // Manejo de errores del backend
        if (result.errors?.public_email) {
          setErrors({ email: result.errors.public_email[0] });
        } else {
          setErrors({ server: "Error al guardar datos" });
        }
        return;
      }

      setSuccess("Información guardada correctamente 🚀");

    } catch (error) {
      setErrors({ server: "Error de conexión con el servidor" });
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
      email: ""
    });
    setPhoneNumber("");
    setPreview(null);
    setErrors({});
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
      setErrors({ ...errors, image: "Formato de imagen no válido." });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors({ ...errors, image: "El tamaño de la imagen no debe superar los 2 MB." });
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setErrors({ ...errors, image: "" });
  };

  const removeImage = () => {
    setPreview(null);
  };

  return {
    form,
    errors,
    success,
    preview,
    countryCode,
    phoneNumber,
    fileInputRef,
    setCountryCode,
    setPhoneNumber,
    handleChange,
    handleSubmit,
    handleCancel,
    handleClick,
    handleFileChange,
    removeImage
  };
};