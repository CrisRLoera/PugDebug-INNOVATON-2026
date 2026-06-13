import { USE_MOCK, BASE_URL, post } from './client';
import type { OnboardingData, User } from '../types';

function delay(ms = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitOnboarding(data: OnboardingData): Promise<{ user: User }> {
  if (USE_MOCK) {
    await delay();
    return {
      user: {
        id: `u${Date.now()}`,
        email: data.account.email,
        phone: data.account.phone,
        fullName: data.account.fullName,
        role: 'usuario',
        token: `mock-token-${Date.now()}`,
      },
    };
  }
  return post<{ user: User }>(BASE_URL.onboarding, data);
}
