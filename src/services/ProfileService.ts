import { api } from './api';

const CREDENTIALS_ENDPOINT = '/user/credentials';

export const getProfileCredentials = async () => {
  const res = await api.get(CREDENTIALS_ENDPOINT);
  if (!res.data.success) {
    throw new Error('Error al obtener credenciales');
  }
  return res.data.data; // Retorna { username, email }
};

export const updateProfileCredentials = async (data: { 
  current_password: string; 
  username?: string;
  email?: string; 
  new_password?: string; 
  new_password_confirmation?: string; 
}) => {
  // Según la documentación, se usa PUT para actualizar
  const res = await api.put(CREDENTIALS_ENDPOINT, data);
  if (!res.data.success) {
    throw new Error(res.data.message || 'Error al actualizar credenciales');
  }
  return res.data;
};