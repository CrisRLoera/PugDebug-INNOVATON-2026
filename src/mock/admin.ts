import type { AdminMetrics, AdminUser } from '../types';

export const MOCK_METRICS: AdminMetrics = {
  totalUsers: 1248,
  totalAnalyses: 9743,
  fraudsDetected: 312,
  activeUsersThisMonth: 487,
};

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 'u1',
    fullName: 'María García',
    email: 'usuario@demo.com',
    phone: '5551234567',
    protectedPerson: { name: 'Josefina García', phone: '5557654321' },
    registeredAt: '2026-01-15T00:00:00Z',
    totalAnalyses: 28,
    fraudsBlocked: 4,
  },
  {
    id: 'u2',
    fullName: 'Carlos López',
    email: 'carlos@demo.com',
    phone: '5552345678',
    protectedPerson: { name: 'Roberto López', phone: '5558765432' },
    registeredAt: '2026-02-20T00:00:00Z',
    totalAnalyses: 15,
    fraudsBlocked: 2,
  },
  {
    id: 'u3',
    fullName: 'Ana Martínez',
    email: 'ana@demo.com',
    phone: '5553456789',
    protectedPerson: { name: 'Consuelo Martínez', phone: '5559876543' },
    registeredAt: '2026-03-05T00:00:00Z',
    totalAnalyses: 42,
    fraudsBlocked: 8,
  },
  {
    id: 'u4',
    fullName: 'Luis Hernández',
    email: 'luis@demo.com',
    phone: '5554567890',
    protectedPerson: { name: 'Carmen Hernández', phone: '5550123456' },
    registeredAt: '2026-04-10T00:00:00Z',
    totalAnalyses: 7,
    fraudsBlocked: 1,
  },
];
