import { USE_MOCK, BASE_URL, post } from './client';
import { MOCK_USERS } from '../mock/users';
import type { User } from '../types';

export interface CheckAvailabilityPayload {
  email: string;
  phone: string;
}

/** Throws an Error with a user-facing message if email or phone is already registered. */
export async function checkAvailability(payload: CheckAvailabilityPayload): Promise<void> {
  if (USE_MOCK) {
    await delay(600);
    const normalizedPhone = payload.phone.replace(/\D/g, '');
    for (const entry of Object.values(MOCK_USERS)) {
      if (entry.user.email.toLowerCase() === payload.email.trim().toLowerCase()) {
        throw new Error('Este correo electrónico ya está registrado.');
      }
      if (entry.user.phone.replace(/\D/g, '') === normalizedPhone) {
        throw new Error('Este número de teléfono ya está registrado.');
      }
    }
    return;
  }
  const data = await post<{ available?: boolean; field?: string; error?: string }>(
    BASE_URL.auth.check,
    payload,
  );
  if (data?.error) throw new Error(data.error);
  if (data?.available === false) {
    const msg =
      data.field === 'phone'
        ? 'Este número de teléfono ya está registrado.'
        : 'Este correo electrónico ya está registrado.';
    throw new Error(msg);
  }
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

function delay(ms = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (USE_MOCK) {
    await delay();
    const entry = MOCK_USERS[payload.identifier.toLowerCase()];
    if (!entry || entry.password !== payload.password) {
      throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }
    return { user: entry.user };
  }
  const data = await post<{ user?: User; error?: string }>(BASE_URL.auth.login, payload);
  if (!data.user) {
    throw new Error(data.error ?? 'Credenciales incorrectas. Verifica tu correo y contraseña.');
  }
  return { user: data.user };
}

export async function deleteAccount(userId: string): Promise<void> {
  if (USE_MOCK) {
    await delay(800);
    return;
  }
  return post<void>(BASE_URL.auth.deleteAccount, { userId });
}
