import { USE_MOCK, BASE_URL, post } from './client';
import type { ProtectionProfile, ProtectedPerson } from '../types';

function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ProfileData {
  protectedPerson: ProtectedPerson;
  profile: ProtectionProfile;
}

export const MOCK_PROFILE: ProfileData = {
  protectedPerson: { name: 'Josefina García', phone: '5557654321' },
  profile: {
    banks: ['bbva', 'banamex'],
    carrier: 'telcel',
    receivesPension: true,
    pensionInstitution: 'imss',
    participatesInLotteries: false,
    hasInvestments: false,
    trustedContacts: [
      { name: 'María García', phone: '5551234567' },
      { name: 'Carlos García', phone: '5552222222' },
    ],
    familyKeyword: 'girasol',
  },
};

export async function getProfile(userId: string): Promise<ProfileData> {
  if (USE_MOCK) {
    await delay();
    return MOCK_PROFILE;
  }
  return post<ProfileData>(BASE_URL.profile.get, { userId });
}

export async function updateProfile(userId: string, data: ProfileData): Promise<void> {
  if (USE_MOCK) {
    await delay(700);
    return;
  }
  return post<void>(BASE_URL.profile.update, { userId, ...data });
}
