import { useState, useEffect } from 'react';
import { getProfileCredentials, updateProfileCredentials } from '@/services/ProfileService';
import { useEmailValidation } from "@/hooks/useEmailValidation";

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', text: '' });
  
  const [form, setForm] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { suggestion, sanitizeEmailInput, validateEmail } = useEmailValidation(form.email);

  // Carga inicial de datos
  useEffect(() => {
    const fetchDate = async () => {
      try {
        const data = await getProfileCredentials();
        setForm(prev => ({
          ...prev,
          username: data.username || '',
          email: data.email || ''
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDate();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldName = id.replace('input-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    
    const newValue = fieldName === 'email' ? sanitizeEmailInput(value) : value;
    
    setForm(prev => ({ ...prev, [fieldName]: newValue }));
    
    // Limpiar errores al escribir
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[fieldName];
        return newErrs;
      });
    }
  };

    const handleUpdateInfo = async () => {
    setServerMessage({ type: '', text: '' });
    const emailRes = validateEmail(form.email);
    if (emailRes.error) {
        setErrors(prev => ({ ...prev, email: emailRes.error }));
        return;
    }
    if (!form.currentPassword) {
        setErrors(prev => ({ ...prev, currentPassword: 'La contraseña es necesaria por seguridad' }));
        return;
    }

    setIsSubmitting(true); 

    try {
        const response = await updateProfileCredentials({
        current_password: form.currentPassword,
        username: form.username,
        email: form.email
        });
        if (response.success && response.data) {
        setForm(prev => ({
            ...prev,
            username: response.data.username || prev.username,
            email: response.data.email || prev.email,
            currentPassword: '' 
        }));
        setServerMessage({ type: 'success', text: 'Información actualizada correctamente' });
        }
    } catch (err: any) {
        setServerMessage({ type: 'error', text: err.message });
    } finally {
        setIsSubmitting(false); 
    }
    };
  const SPECIAL_CHARACTER_REGEX = /[^A-Za-z0-9]/;
  const handleChangePassword = async () => {
    setServerMessage({ type: '', text: '' });
    const newErrs: Record<string, string> = {};

   const { currentPassword, newPassword, confirmPassword } = form;

  // Validación Contraseña Actual
  if (!currentPassword) {
    newErrs.currentPassword = "El campo Contraseña actual es obligatorio.";
  }

  // Validaciones Nueva Contraseña (idénticas a RegisterForm)
  if (!newPassword) {
    newErrs.newPassword = "El campo Nueva contraseña es obligatorio.";
  } else {
    if (newPassword.length < 8) newErrs.newPassword = "La contraseña debe tener al menos 8 caracteres.";
    if (newPassword.length > 20) newErrs.newPassword = "La contraseña permite un máximo de 20 caracteres.";
    if (/\s/.test(newPassword)) newErrs.newPassword = "La contraseña no puede contener espacios en blanco.";
    if (!/[A-Z]/.test(newPassword)) newErrs.newPassword = "La contraseña debe contener al menos una letra mayúscula.";
    if (!/\d/.test(newPassword)) newErrs.newPassword = "La contraseña debe contener al menos un número.";
    if (!SPECIAL_CHARACTER_REGEX.test(newPassword)) {
      newErrs.newPassword = "La contraseña debe contener al menos un carácter especial.";
    }
  }

  // Validación Confirmación
  if (!confirmPassword) {
    newErrs.confirmPassword = "El campo Confirmar contraseña es obligatorio.";
  } else if (confirmPassword !== newPassword) {
    newErrs.confirmPassword = "Las contraseñas no coinciden.";
  }

    if (Object.keys(newErrs).length > 0) {
      setErrors(newErrs);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfileCredentials({
        current_password: form.currentPassword,
        new_password: form.newPassword,
        new_password_confirmation: form.confirmPassword
      });
      setServerMessage({ type: 'success', text: 'Contraseña actualizada. Las sesiones en otros dispositivos se cerrarán.' });
      setForm(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (err: any) {
      setServerMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    errors,
    loading,
    isSubmitting,
    suggestion,
    serverMessage,
    handleChange,
    handleUpdateInfo,
    handleChangePassword,
    applyEmailSuggestion: (sug: string) => {
      setForm(prev => ({ ...prev, email: sug }));
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };
};