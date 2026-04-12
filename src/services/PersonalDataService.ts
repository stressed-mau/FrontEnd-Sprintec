import { api } from './api';

export const getUserInformation = async (userId: string | number) => {
  const res = await api.get(`/user_information/${userId}`);

  if (!res.data.success) {
    throw new Error('Error al obtener datos del usuario');
  }

  return res.data.data;
};

export const updateUserInformation = async (userId: string | number, formData: FormData) => {
  const res = await api.post(`/user_information/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!res.data.success) {
    throw new Error('Error al actualizar datos');
  }

  return res.data.data;
};