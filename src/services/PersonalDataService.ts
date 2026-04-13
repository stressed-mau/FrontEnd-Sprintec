import { api } from './api';
const USER_ENDPOINT = "/user_information";
export const getUserInformation = async (userId: string | number) => {
  const res = await api.get(`${USER_ENDPOINT}/${userId}`);

  if (!res.data.success) {
    throw new Error('Error al obtener datos del usuario');
  }

  return res.data.data;
};

export const updateUserInformation = async (userId: string | number, formData: FormData) => {
  const res = await api.post(`${USER_ENDPOINT}/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!res.data.success) {
    throw new Error('Error al actualizar datos');
  }

  return res.data.data;
};