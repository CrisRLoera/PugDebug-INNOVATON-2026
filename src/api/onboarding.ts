import { USE_MOCK, BASE_URL, post } from './client';
import type { OnboardingPayload, User } from '../types';

function delay(ms = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface OnboardingResult {
  user: User;
}

// Sends the payload to n8n which writes to DynamoDB with the perfil_struct.json schema
export async function submitOnboarding(payload: OnboardingPayload): Promise<OnboardingResult> {
  if (USE_MOCK) {
    await delay();
    console.info('[mock] Onboarding payload (DynamoDB format):', JSON.stringify(payload, null, 2));
    return {
      user: {
        id: payload.profile.profileId,
        email: payload.account.email,
        phone: payload.account.phone,
        fullName: payload.account.fullName,
        role: 'usuario',
        token: `mock-token-${Date.now()}`,
      },
    };
  }
  return post<OnboardingResult>(BASE_URL.onboarding, payload);
}
