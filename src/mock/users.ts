import type { User } from '../types';

export const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'usuario@demo.com': {
    password: 'demo1234',
    user: {
      id: 'u1',
      email: 'usuario@demo.com',
      phone: '5551234567',
      fullName: 'María García',
      role: 'usuario',
      token: 'mock-token-usuario-abc123',
    },
  },
  'admin@demo.com': {
    password: 'admin1234',
    user: {
      id: 'a1',
      email: 'admin@demo.com',
      phone: '5559876543',
      fullName: 'Admin PugGuardian',
      role: 'admin',
      token: 'mock-token-admin-xyz789',
    },
  },
};
