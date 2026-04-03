import { useState, useRef, useEffect } from "react";
import { getAuthSession } from "@/services/auth/auth-storage";
import { allCountries } from 'country-telephone-data';
export const useUserPersonalData = () => {
  console.log("HOOK useUserPersonalData CARGADO");
  const [countryCode, setCountryCode] = useState("591");
  const [phoneNumber, setPhoneNumber] = useState("");

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


  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

 useEffect(() => {
  console.log("USEEFFECT CORRIENDO");

  const fetchData = async () => {
    try {
      const session = getAuthSession();

      if (!session || !session.user?.id || !session.accessToken) {
        console.error("No hay sesión válida");
        return;
      }

      const res = await fetch(
        `http://localhost:8000/api/user_information/${session.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const response = await res.json();

      console.log("DATA DEL BACKEND:", response);

      if (!res.ok || !response.success) {
        console.error("Error en la respuesta del backend");
        return;
      }

      const user = response.data;

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
  const handleChange = (e: any) => {
  const { id, value } = e.target;

  const updatedForm = {
    ...form,
    [id]: value
  };

  setForm(updatedForm);

  // 🔥 VALIDACIÓN EN TIEMPO REAL
  setErrors((prev: any) => {
    const newErrors = { ...prev };

    // FULL NAME
    if (id === "fullName") {
      if (!value.trim()) {
        newErrors.fullName = "El nombre completo es obligatorio.";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.fullName = "El nombre solo puede contener letras.";
      } else if (value.length > 100) {
        newErrors.fullName = "El nombre no puede exceder los 100 caracteres.";
      } else {
        newErrors.fullName = "";
      }
    }

    // OCCUPATION
    if (id === "occupation") {
      if (value.length > 80) {
        newErrors.occupation = "La ocupación no puede exceder los 80 caracteres.";
      } else {
        newErrors.occupation = "";
      }
    }

    // BIO
    if (id === "bio") {
      if (value.length > 300) {
        newErrors.bio = "La biografía no puede exceder los 300 caracteres.";
      } else {
        newErrors.bio = "";
      }
    }

    // LOCATION
    if (id === "location") {
      if (value.length > 100) {
        newErrors.location = "La ubicación no puede exceder los 100 caracteres.";
      } else {
        newErrors.location = "";
      }
    }

    // EMAIL
    if (id === "email") {
      if (!value.trim()) {
        newErrors.email = "El correo electrónico es obligatorio.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = "Formato de correo inválido.";
      } else if (value.length > 60) {
        newErrors.email = "El correo no puede exceder los 60 caracteres.";
      } else {
        newErrors.email = "";
      }
    }

    return newErrors;
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
    console.log("SUBMIT EJECUTADO");
    if (!validate()) {
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
      formData.append("_method", "PUT");
      formData.append("fullname", form.fullName);
      formData.append("occupation", form.occupation);
      formData.append("biography", form.bio);
      formData.append("nationality", form.location);
      formData.append("phone_number", `+${countryCode}${phoneNumber}`);
      formData.append("public_email", form.email);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("image_url", fileInputRef.current.files[0]);
      }
      //Conexión con backend
      const response = await fetch("http://localhost:8000/api/user_information/${session.user.id}".replace(/\$/,""), {
        method: "POST",
        headers: {
        Authorization: `Bearer ${session.accessToken}`, 
        "Accept": "application/json",
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        // Manejo de errores del backend
        if (result.errors?.public_email) {
          setErrors({ public_email: result.errors.public_email[0] });
        } else {
          setErrors({ server: "Error al guardar datos" });
        }
        return;
      }

      setSuccess("Información guardada correctamente ");

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
    handleSubmit,
    handleCancel,
    handleClick,
    handleFileChange,
    removeImage,
    loading
  };
};