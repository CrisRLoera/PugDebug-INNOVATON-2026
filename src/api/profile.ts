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
    banking: {
      banks: ['BBVA', 'Citibanamex'],
      departmentCards: ['Liverpool'],
      usesMobileBanking: true,
      hasInvestments: false,
      hasCrypto: false,
    },
    government: {
      receivesPension: true,
      pensionProvider: 'IMSS',
      filesTaxesPersonally: false,
      enrolledInSocialPrograms: ['Bienestar'],
    },
    telecom: {
      mobileCarrier: 'Telcel',
      internetProvider: 'Telmex',
      utilityProviders: { electricity: 'CFE', water: 'SACMEX' },
      shopsOnline: true,
      onlineStores: ['Amazon', 'Mercado Libre'],
    },
    family: {
      trustedContacts: [
        { name: 'María García', relationship: 'hija', phone: '5551234567' },
        { name: 'Carlos García', relationship: 'hijo', phone: '5552222222' },
      ],
      familyKeyword: 'girasol',
      hasRelativesAbroad: false,
      emergencyVerificationChannel: 'videollamada',
    },
    habits: {
      participatesInRaffles: false,
      lookingForWork: false,
      usesDatingApps: false,
    },
  },
};

export async function getProfile(userId: string): Promise<ProfileData> {
  if (USE_MOCK) { await delay(); return MOCK_PROFILE; }
  return post<ProfileData>(BASE_URL.profile.get, { userId });
}

export async function updateProfile(userId: string, data: ProfileData): Promise<void> {
  if (USE_MOCK) { await delay(700); return; }
  return post<void>(BASE_URL.profile.update, { userId, ...data });
}
