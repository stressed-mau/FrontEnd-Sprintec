import { api } from './api';

const CREDENTIALS_ENDPOINT = '/user/credentials';

export interface UpdateCredentialsPayload {
  username?: string;
  email?: string;
  current_password?: string;       // Requerido solo si se cambia email o contraseña
  new_password?: string;
  new_password_confirmation?: string;
}
 
export const updateProfileCredentials = async (data: UpdateCredentialsPayload) => {
  const res = await api.put(CREDENTIALS_ENDPOINT, data);
  if (!res.data.success) {
    throw new Error(res.data.message || 'Error al actualizar credenciales');
  }
  return res.data;
};