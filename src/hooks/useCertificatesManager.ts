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
type CertificateFormTouched = Partial<Record<keyof CertificateFormValues, boolean>>;

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
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const NAME_REGEX = /^[A-Za-zÀ-ÿ0-9\s]+$/;
const ISSUER_REGEX = /^[A-Za-zÀ-ÿ\s]+$/;

function getTodayISODate(): string {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().split('T')[0];
}

function normalizeComparableText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

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
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  // Si es una fecha ISO con time, extrae la fecha
  const parsedDate = new Date(date);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split('T')[0];
  }
  return date;
}

function convertDateISOToDDMMYYYY(date: string): string {
  if (!date) return '';

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  const parsedDate = new Date(date);
  if (!isNaN(parsedDate.getTime())) {
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return date;
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseCertificateDate(value: string): Date | null {
  if (!value?.trim()) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);

    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed;
    }
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split('/').map(Number);
    const parsed = new Date(year, month - 1, day);

    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed;
    }
  }

  return null;
}

function validateForm(
  form: CertificateFormValues,
  certificates: Certificate[],
  editingCertificateId?: string
): CertificateFormErrors {
  const errors: CertificateFormErrors = {};
  const todayISO = getTodayISODate();
  const todayDate = parseCertificateDate(todayISO);
  const normalizedName = normalizeComparableText(form.name);
  const normalizedIssuer = normalizeComparableText(form.issuer);

  if (!form.name?.trim()) {
    errors.name = 'El campo Nombre del Certificado es obligatorio.';
  } else if (form.name.length > 100) {
    errors.name = 'El campo Nombre del certificado permite ingresar un máximo de 100 caracteres.';
  } else if (!NAME_REGEX.test(form.name.trim())) {
    errors.name = 'El Nombre del Certificado solo puede contener letras y números.';
  }

  if (!form.issuer?.trim()) {
    errors.issuer = 'El campo Emisor es obligatorio.';
  } else if (form.issuer.length > 100) {
    errors.issuer = 'El campo Emisor permite ingresar un máximo de 100 caracteres.';
  } else if (!ISSUER_REGEX.test(form.issuer.trim())) {
    errors.issuer = 'El Emisor solo puede contener letras.';
  }

  if (
    normalizedName &&
    normalizedIssuer &&
    certificates.some(
      (certificate) =>
        certificate.id !== editingCertificateId &&
        normalizeComparableText(certificate.name) === normalizedName &&
        normalizeComparableText(certificate.issuer) === normalizedIssuer
    )
  ) {
    errors.name = 'El certificado ya ha sido registrado';
  }

  if (!form.date_issued?.trim()) {
    errors.date_issued = 'La fecha de emisión es obligatoria.';
  } else {
    const issuedDate = parseCertificateDate(form.date_issued);
    if (!issuedDate) {
      errors.date_issued = 'La fecha debe tener un formato válido: dd/mm/aaaa.';
    } else if (todayDate && issuedDate > todayDate) {
      errors.date_issued = 'La fecha de emisión no puede ser posterior a la fecha actual.';
    }
  }

  if (form.date_expired?.trim() && !form.no_expiration) {
    const expiredDate = parseCertificateDate(form.date_expired);
    if (!expiredDate) {
      errors.date_expired = 'La fecha debe tener un formato válido: dd/mm/aaaa.';
    } else if (todayDate && expiredDate < todayDate) {
      errors.date_expired = 'La fecha de vencimiento no puede ser anterior a la fecha actual.';
    } else if (form.date_issued) {
      const issuedDate = parseCertificateDate(form.date_issued);
      if (issuedDate && expiredDate < issuedDate) {
        errors.date_expired = 'La fecha de vencimiento debe ser posterior a la de emisión';
      }
    }
  }

  if (form.description && form.description.length > 300) {
    errors.description = 'El campo Descripción permite un máximo de 300 caracteres.';
  }

  if (form.credential_id && form.credential_id.length > 50) {
    errors.credential_id = 'El campo ID de credencial permite un máximo de 50 caracteres.';
  }

  if (form.credential_url && form.credential_url.length > 200) {
    errors.credential_url = 'El campo URL de verificación permite un máximo de 200 caracteres.';
  } else if (form.credential_url?.trim() && !isValidUrl(form.credential_url)) {
    errors.credential_url = 'La URL de verificación debe ser un enlace válido.';
  }

  return errors;
}

export const useCertificatesManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Form state
  const [formData, setFormData] = useState<CertificateFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<CertificateFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<CertificateFormTouched>({});
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
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null);
  const [selectedCertificateIds, setSelectedCertificateIds] = useState<Set<string>>(new Set());

  const isEditing = useMemo(() => editingCertificate !== null, [editingCertificate]);

  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => 
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.credential_id?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
  }, [certificates, searchTerm]);

  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  
  const paginatedCertificates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCertificates.slice(startIndex, endIndex);
  }, [filteredCertificates, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    setTouchedFields({});
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
      date_issued: convertDateISOToDDMMYYYY(certificate.date_issued),
      date_expired: convertDateISOToDDMMYYYY(certificate.date_expired ?? ''),
      credential_id: certificate.credential_id ?? '',
      credential_url: certificate.credential_url ?? '',
      file_bonus_url: certificate.file_bonus_url ?? '',
      no_expiration: !certificate.date_expired,
    });
    setErrors({});
    setTouchedFields({});
    setFileInput(null);
    setErrorMessage('');
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingCertificate(null);
    setShowConfirmEdit(false);
    setFormData(EMPTY_FORM);
    setErrors({});
    setTouchedFields({});
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
      setFormData((prev) => {
        const nextForm =
          field === 'no_expiration'
            ? {
                ...prev,
                no_expiration: Boolean(value),
                date_expired: value ? '' : prev.date_expired,
              }
            : {
                ...prev,
                [field]:
                  field === 'date_issued' || field === 'date_expired'
                    ? formatDateInput(String(value))
                    : value,
              };

        const nextTouched: CertificateFormTouched = {
          ...touchedFields,
          [field]: true,
        };

        if (field === 'name' || field === 'issuer') {
          nextTouched.name = true;
          nextTouched.issuer = true;
        }

        if (field === 'date_issued' || field === 'date_expired' || field === 'no_expiration') {
          nextTouched.date_issued = true;
          nextTouched.date_expired = true;
        }

        setTouchedFields(nextTouched);

        const nextErrors = validateForm(nextForm, certificates, editingCertificate?.id);
        const visibleErrors = Object.fromEntries(
          Object.entries(nextErrors).filter(([key]) => nextTouched[key as keyof CertificateFormValues])
        ) as CertificateFormErrors;

        setErrors(visibleErrors);

        return nextForm;
      });
    },
    [certificates, editingCertificate?.id, touchedFields]
  );

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileInput(null);
      setErrorMessage('Formato de imagen no válido.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileInput(null);
      setErrorMessage('El tamaño de la imagen no debe superar los 2 MB.');
      return;
    }

    setFileInput(file);
    setErrorMessage('');
  }, []);

  const removeFile = useCallback(() => {
    setFileInput(null);
  }, []);

  const handleSubmit = useCallback(
    async (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      setErrorMessage('');

      const newErrors = validateForm(formData, certificates, editingCertificate?.id);
      if (Object.keys(newErrors).length > 0) {
        setTouchedFields({
          name: true,
          issuer: true,
          description: true,
          date_issued: true,
          date_expired: true,
          credential_id: true,
          credential_url: true,
          file_bonus_url: true,
          no_expiration: true,
        });
        setErrors(newErrors);
        return;
      }

      if (isEditing && editingCertificate && !showConfirmEdit) {
        setShowConfirmEdit(true);
        return;
      }

      setIsSaving(true);

      try {
        const payload: CertificatePayload = {
          name: formData.name,
          issuer: formData.issuer,
          description: formData.description,
          date_issued: convertDateDDMMYYYYtoISO(formData.date_issued),
          date_expired: formData.no_expiration ? undefined : convertDateDDMMYYYYtoISO(formData.date_expired ?? ''),
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
        setShowConfirmEdit(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al guardar el certificado';
        setErrorMessage(message);
      } finally {
        setIsSaving(false);
      }
    },
    [certificates, formData, fileInput, isEditing, editingCertificate, showConfirmEdit]
  );

  const requestDelete = useCallback((certificate: Certificate) => {
    setCertificateToDelete(certificate);
    setShowConfirmDelete(true);
  }, []);

  const toggleSelectCertificate = useCallback((certificateId: string) => {
    setSelectedCertificateIds((prev) => {
      const next = new Set(prev);

      if (next.has(certificateId)) {
        next.delete(certificateId);
      } else {
        next.add(certificateId);
      }

      return next;
    });
  }, []);

  const toggleSelectAllCertificates = useCallback((certificateIds: string[]) => {
    setSelectedCertificateIds((prev) => {
      const allSelected = certificateIds.length > 0 && certificateIds.every((id) => prev.has(id));

      if (allSelected) {
        const next = new Set(prev);
        certificateIds.forEach((id) => next.delete(id));
        return next;
      }

      const next = new Set(prev);
      certificateIds.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const requestDeleteSelected = useCallback(() => {
    setCertificateToDelete(null);
    setShowConfirmDelete(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setShowConfirmDelete(false);
    setCertificateToDelete(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    const idsToDelete = certificateToDelete
      ? [certificateToDelete.id]
      : Array.from(selectedCertificateIds);

    if (idsToDelete.length === 0) return;

    setIsDeleting(true);

    try {
      await Promise.all(idsToDelete.map((id) => removeCertificate(id)));
      setSuccessMessage(
        idsToDelete.length > 1
          ? 'Certificados eliminados exitosamente'
          : 'Certificado eliminado exitosamente'
      );
      setCertificates((prev) =>
        prev.filter((cert) => !idsToDelete.includes(cert.id))
      );
      setSelectedCertificateIds((prev) => {
        const next = new Set(prev);
        idsToDelete.forEach((id) => next.delete(id));
        return next;
      });
      setShowConfirmDelete(false);
      setCertificateToDelete(null);
      setShowSuccessModal(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar el certificado';
      setErrorMessage(message);
    } finally {
      setIsDeleting(false);
    }
  }, [certificateToDelete, selectedCertificateIds]);

  return {
    // State
    certificates,
    paginatedCertificates,
    filteredCertificates,
    editingCertificate,
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
    showConfirmEdit,
    certificateToDelete,
    selectedCertificateIds,
    fileInput,
    searchTerm,
    currentPage,
    totalPages,

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
    requestDeleteSelected,
    cancelDelete,
    confirmDelete,
    setShowConfirmEdit,
    toggleSelectCertificate,
    toggleSelectAllCertificates,
    setSearchTerm,
    setCurrentPage,
  };
};
