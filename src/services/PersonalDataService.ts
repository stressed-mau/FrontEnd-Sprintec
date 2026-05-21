import { api } from './api';
import { toAbsoluteAssetUrl } from '@/services/assetUrl';

const USER_ENDPOINT = '/user_information';
const UPDATE_USER_ENDPOINT = '/update/user_information';

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

export type UserInformationPayload = {
  fullname: string;
  occupation: string;
  biography: string;
  nationality: string;
  phone_number: string;
  public_email: string;
};

export type UserInformationRequest = UserInformationPayload | FormData;

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
  if (res.data?.success === false || res.data?.status === 'error') {
    throw new Error('Error al obtener datos del usuario');
  }
  return normalizeUserInformation(res.data);
};

function assertSuccessfulUserInformationResponse(data: any, fallbackMessage: string) {
  if (data?.success === false || data?.status === 'error') {
    throw new Error(data?.message || fallbackMessage);
  }
}

export const createUserInformation = async (payload: UserInformationRequest): Promise<UserInformation> => {
  const res = await api.post(USER_ENDPOINT, payload);

  assertSuccessfulUserInformationResponse(res.data, 'Error al registrar datos');
  return normalizeUserInformation(res.data);
};

export const updateUserInformation = async (payload: UserInformationRequest): Promise<UserInformation> => {
  const res = await api.put(UPDATE_USER_ENDPOINT, payload);

  assertSuccessfulUserInformationResponse(res.data, 'Error al actualizar datos');
  return normalizeUserInformation(res.data);
};
