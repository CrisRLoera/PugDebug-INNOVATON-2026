import { USE_MOCK, BASE_URL, post } from './client';
import { MOCK_USERS } from '../mock/users';
import type { User } from '../types';

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
  return post<LoginResponse>(BASE_URL.auth.login, payload);
}

export async function deleteAccount(userId: string): Promise<void> {
  if (USE_MOCK) {
    await delay(800);
    return;
  }
  return post<void>(BASE_URL.auth.deleteAccount, { userId });
}
