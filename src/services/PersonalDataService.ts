import { api } from './api';

const USER_ENDPOINT = '/user_information';

export const getUserInformation = async (id?: string) => {

  const res = await api.get(USER_ENDPOINT);
  if (!res.data.success) {
    throw new Error('Error al obtener datos del usuario');
  }
  return res.data.data;
};

export const updateUserInformation = async (formData: FormData) => {
  const res = await api.put('/update/user_information', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (!res.data.success) {
    throw new Error('Error al actualizar datos');
  }
  return res.data.data;
};
