import axios from 'axios';

export function formatSkillApiError(
  error: unknown
): Error {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return new Error(
        'La solicitud tardó más de 30 segundos. Intenta nuevamente.'
      );
    }

    if (error.code === 'ERR_NETWORK') {
      return new Error(
        'No se pudo conectar con el backend configurado. Verifica que la API desplegada esté disponible.'
      );
    }

    const backendMessage =
      (
        error.response?.data as
          | { message?: string }
          | undefined
      )?.message ?? error.message;

    return new Error(
      backendMessage ||
      'Error inesperado al consumir skills API.'
    );
  }

  return new Error(
    'Error inesperado al consumir skills API.'
  );
}