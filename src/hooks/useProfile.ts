import { useState, useEffect } from 'react';
import { updateProfileCredentials } from '@/services/ProfileService';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { getAuthSession, updateAuthSession } from '@/services/auth/auth-storage';
export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', text: '' });
  const session = getAuthSession();
  const [profile, setProfile] = useState({
    username: session?.user?.username || '',
    email: session?.user?.email || '',
  });
  const [form, setForm] = useState({
    username: session?.user?.username || '',
    email: session?.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { suggestion, sanitizeEmailInput, validateEmail } = useEmailValidation(form.email);

  const resetForm = () => {
    setForm({
      username: profile.username,
      email: profile.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setServerMessage({ type: '', text: '' });
  };

  // Carga inicial de datos
  useEffect(() => {
    setProfile({
      username: session?.user?.username || '',
      email: session?.user?.email || '',
    });
    setForm({
      username: session?.user?.username || '',
      email: session?.user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'email' ? sanitizeEmailInput(value) : value;
    
    setForm(prev => ({ ...prev, [name]: newValue }));
    
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const validateInfoFields = (): Record<string, string> => {
    const newErrs: Record<string, string> = {};
    const { username, email } = form;

    // Username
    if (!username || !username.trim()) {
      newErrs.username = 'El nombre de usuario es obligatorio.';
    } else if (username.trim().length < 3) {
      newErrs.username = 'El nombre de usuario debe tener al menos 3 caracteres.';
    } else if (username.length > 30) {
      newErrs.username = 'El nombre de usuario permite un máximo de 30 caracteres.';
    }

    // Email
    if (!email || !email.trim()) {
      newErrs.email = 'El correo electrónico es obligatorio.';
    } else if (/\s/.test(email)) {
      newErrs.email = 'El correo electrónico no puede contener espacios en blanco.';
    } else if (email.length > 60) {
      newErrs.email = 'El correo electrónico permite un máximo de 60 caracteres.';
    } else {
      const emailRes = validateEmail(email);
      if (emailRes.error) {
        newErrs.email = emailRes.error;
      }
    }

    return newErrs;
  };
// ─── Actualizar Información (username y/o email) ─────────────────────────────


    const handleUpdateInfo = async () => {
    setServerMessage({ type: '', text: '' });

    const newErrs = validateInfoFields();

    // current_password requerido si se cambia el username o email
    const usernameChanged = form.username.trim() !== profile.username.trim();
    const emailChanged = form.email.trim() !== profile.email.trim();
    if ((usernameChanged || emailChanged) && !form.currentPassword) {
      newErrs.currentPassword = 'La contraseña es necesaria para cambiar la información.';
    }

    if (Object.keys(newErrs).length > 0) {
      setErrors(newErrs);
      return;
    }

    // Armar payload mínimo según qué cambió
    const payload: Record<string, string> = {};
    payload.username = form.username.trim();
    payload.email = form.email.trim();
    if (usernameChanged || emailChanged) {
      payload.current_password = form.currentPassword;
    }

    setIsSubmitting(true); 
    try {
      const response = await updateProfileCredentials(payload);
      if (response.success && response.data) {
        const updatedUsername = response.data.username || form.username;
        const updatedEmail = response.data.email || form.email;

        setProfile({
          username: updatedUsername,
          email: updatedEmail,
        });
        setForm(prev => ({
          ...prev,
          username: updatedUsername,
          email: updatedEmail,
          currentPassword: '',
        }));

        if (updateAuthSession) {
          updateAuthSession({ username: updatedUsername, email: updatedEmail });
        }

        setServerMessage({ type: 'success', text: 'Información actualizada correctamente.' });
      }
    } catch (err: any) {
      setServerMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Cambiar contraseña
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
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err: any) {
      setServerMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    profile,
    form,
    errors,
    loading,
    isSubmitting,
    suggestion,
    serverMessage,
    handleChange,
    handleUpdateInfo,
    handleChangePassword,
    resetForm,
    applyEmailSuggestion: (sug: string) => {
      setForm(prev => ({ ...prev, email: sug }));
      setErrors(prev => { const e = { ...prev }; delete e.email; return e; });
    }
  };
};