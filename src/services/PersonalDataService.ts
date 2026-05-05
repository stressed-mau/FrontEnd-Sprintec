import { api } from './api';
import { toAbsoluteAssetUrl } from '@/services/assetUrl';

const USER_ENDPOINT = '/user_information';

export type UserInformation = {
  id?: string | number;
  fullname: string;
  occupation: string;
  biography: string;
  nationality: string;
  phone_number: string;
  public_email: string;
  image_url: string;
};

function asString(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  return '';
}

function unwrapPayload(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== 'object') return {};

  const record = data as Record<string, unknown>;

  if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
    return unwrapPayload(record.data);
  }

  if (record.profile && typeof record.profile === 'object' && !Array.isArray(record.profile)) {
    return unwrapPayload(record.profile);
  }

  if (record.user_information && typeof record.user_information === 'object' && !Array.isArray(record.user_information)) {
    return unwrapPayload(record.user_information);
  }

  return record;
}

function normalizeUserInformation(data: unknown): UserInformation {
  const user = unwrapPayload(data);

  return {
    id: asString(user.id),
    fullname: asString(user.fullname ?? user.full_name ?? user.name),
    occupation: asString(user.occupation ?? user.profession ?? user.job_title),
    biography: asString(user.biography ?? user.bio ?? user.description),
    nationality: asString(user.nationality ?? user.nacionality ?? user.location ?? user.residence),
    phone_number: asString(user.phone_number ?? user.phone ?? user.telephone),
    public_email: asString(user.public_email ?? user.email_public ?? user.email),
    image_url: toAbsoluteAssetUrl(user.image_url ?? user.image ?? user.photo ?? user.avatar),
  };
}

export const getUserInformation = async (_id?: string): Promise<UserInformation> => {
  void _id;

  const res = await api.get(USER_ENDPOINT);
  if (!res.data.success) {
    throw new Error('Error al obtener datos del usuario');
  }
  return normalizeUserInformation(res.data);
};

export const updateUserInformation = async (formData: FormData): Promise<UserInformation> => {
  const res = await api.post('/update/user_information', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (!res.data.success) {
    throw new Error('Error al actualizar datos');
  }
  return normalizeUserInformation(res.data);
};
