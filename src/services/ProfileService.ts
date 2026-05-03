import { api } from './api';

const CREDENTIALS_ENDPOINT = '/user/credentials';

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