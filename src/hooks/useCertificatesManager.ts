import { useCallback, useEffect, useState, useMemo } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import {
  createCertificate,
  getCertificates,
  removeCertificate,
  updateCertificate,
  type Certificate,
  type CertificatePayload,
} from '../services/certificatesService';

export type { Certificate };

export type CertificateFormValues = Omit<Certificate, 'id'> & {
  no_expiration?: boolean;
};

export type CertificateFormErrors = Partial<Record<keyof CertificateFormValues, string>>;

const EMPTY_FORM: CertificateFormValues = {
  name: '',
  issuer: '',
  description: '',
  date_issued: '',
  date_expired: '',
  credential_id: '',
  credential_url: '',
  file_bonus_url: '',
  no_expiration: false,
};

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg'];
const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg'];

function convertDateDDMMYYYYtoISO(date: string): string {
  if (!date) return '';
  // Si ya está en formato ISO (YYYY-MM-DD), devuelve como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  // Convierte de DD/MM/YYYY a YYYY-MM-DD
  const parts = date.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return date;
}

function validateForm(form: CertificateFormValues): CertificateFormErrors {
  const errors: CertificateFormErrors = {};

  if (!form.name?.trim()) {
    errors.name = 'El nombre del certificado es requerido';
  } else if (form.name.length > 255) {
    errors.name = 'El nombre no debe exceder 255 caracteres';
  }

  if (!form.issuer?.trim()) {
    errors.issuer = 'El emisor es requerido';
  } else if (form.issuer.length > 255) {
    errors.issuer = 'El emisor no debe exceder 255 caracteres';
  }

  if (!form.date_issued?.trim()) {
    errors.date_issued = 'La fecha de emisión es requerida';
  } else {
    const issuedDate = new Date(form.date_issued);
    if (isNaN(issuedDate.getTime())) {
      errors.date_issued = 'La fecha de emisión no es válida';
    }
  }

  if (form.date_expired?.trim() && !form.no_expiration) {
    const expiredDate = new Date(form.date_expired);
    if (isNaN(expiredDate.getTime())) {
      errors.date_expired = 'La fecha de vencimiento no es válida';
    } else if (form.date_issued) {
      const issuedDate = new Date(form.date_issued);
      if (expiredDate < issuedDate) {
        errors.date_expired = 'La fecha de vencimiento debe ser posterior a la de emisión';
      }
    }
  }

  if (form.credential_url?.trim() && !isValidUrl(form.credential_url)) {
    errors.credential_url = 'La URL de credencial no es válida';
  }

  return errors;
}

export const useCertificatesManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  // Form state
  const [formData, setFormData] = useState<CertificateFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<CertificateFormErrors>({});
  const [fileInput, setFileInput] = useState<File | null>(null);

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pageError, setPageError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null);

  const isEditing = useMemo(() => editingCertificate !== null, [editingCertificate]);

  const loadCertificates = useCallback(async () => {
    setIsLoading(true);
    setPageError('');

    try {
      const remoteCertificates = await getCertificates();
      setCertificates(remoteCertificates);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar los certificados.';
      setPageError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCertificates();
  }, [loadCertificates]);

  useEffect(() => {
    if (!pageError) return;
    const timeoutId = window.setTimeout(() => setPageError(''), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [pageError]);

  const openCreateModal = useCallback(() => {
    setEditingCertificate(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setFileInput(null);
    setErrorMessage('');
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((certificate: Certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      name: certificate.name,
      issuer: certificate.issuer,
      description: certificate.description ?? '',
      date_issued: convertDateDDMMYYYYtoISO(certificate.date_issued),
      date_expired: convertDateDDMMYYYYtoISO(certificate.date_expired ?? ''),
      credential_id: certificate.credential_id ?? '',
      credential_url: certificate.credential_url ?? '',
      file_bonus_url: certificate.file_bonus_url ?? '',
      no_expiration: !certificate.date_expired,
    });
    setErrors({});
    setFileInput(null);
    setErrorMessage('');
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingCertificate(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setFileInput(null);
    setErrorMessage('');
  }, []);

  const closeSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
    closeModal();
    void loadCertificates();
  }, [closeModal, loadCertificates]);

  const updateField = useCallback(
    (field: keyof CertificateFormValues, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage('Solo se permiten archivos PDF, JPG y JPEG.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage('El archivo no debe exceder 2MB.');
      return;
    }

    setFileInput(file);
    setErrorMessage('');
  }, []);

  const removeFile = useCallback(() => {
    setFileInput(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage('');

      const newErrors = validateForm(formData);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSaving(true);

      try {
        const payload: CertificatePayload = {
          name: formData.name,
          issuer: formData.issuer,
          description: formData.description,
          date_issued: formData.date_issued,
          date_expired: formData.no_expiration ? undefined : formData.date_expired,
          credential_id: formData.credential_id,
          credential_url: formData.credential_url,
          file_bonus_url: fileInput,
        };

        if (isEditing && editingCertificate) {
          await updateCertificate(editingCertificate.id, payload);
          setSuccessMessage('Certificado actualizado exitosamente');
        } else {
          await createCertificate(payload);
          setSuccessMessage('Certificado creado exitosamente');
        }

        setShowSuccessModal(true);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al guardar el certificado';
        setErrorMessage(message);
      } finally {
        setIsSaving(false);
      }
    },
    [formData, fileInput, isEditing, editingCertificate]
  );

  const requestDelete = useCallback((certificate: Certificate) => {
    setCertificateToDelete(certificate);
    setShowConfirmDelete(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setShowConfirmDelete(false);
    setCertificateToDelete(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!certificateToDelete) return;

    setIsDeleting(true);

    try {
      await removeCertificate(certificateToDelete.id);
      setSuccessMessage('Certificado eliminado exitosamente');
      setCertificates((prev) =>
        prev.filter((cert) => cert.id !== certificateToDelete.id)
      );
      setShowConfirmDelete(false);
      setCertificateToDelete(null);
      setShowSuccessModal(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar el certificado';
      setErrorMessage(message);
    } finally {
      setIsDeleting(false);
    }
  }, [certificateToDelete]);

  return {
    // State
    certificates,
    formData,
    errors,
    isModalOpen,
    isEditing,
    errorMessage,
    successMessage,
    showSuccessModal,
    pageError,
    isLoading,
    isSaving,
    isDeleting,
    showConfirmDelete,
    certificateToDelete,
    fileInput,

    // Actions
    openCreateModal,
    openEditModal,
    closeModal,
    closeSuccessModal,
    updateField,
    handleFileChange,
    removeFile,
    handleSubmit,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
