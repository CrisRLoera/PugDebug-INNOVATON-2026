export type UserRole = 'admin' | 'usuario';

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  token: string;
}

export interface ProtectedPerson {
  name: string;
  phone: string;
}

export interface TrustedContact {
  name: string;
  relationship: string;
  phone: string;
}

// Matches perfil_struct.json exactly
export interface ProtectionProfile {
  banking: {
    banks: string[];
    departmentCards: string[];
    usesMobileBanking: boolean;
    hasInvestments: boolean;
    hasCrypto: boolean;
  };
  government: {
    receivesPension: boolean;
    pensionProvider: string;
    filesTaxesPersonally: boolean;
    enrolledInSocialPrograms: string[];
  };
  telecom: {
    mobileCarrier: string;
    internetProvider: string;
    utilityProviders: {
      electricity: string;
      water: string;
    };
    shopsOnline: boolean;
    onlineStores: string[];
  };
  family: {
    trustedContacts: TrustedContact[];
    familyKeyword: string;
    hasRelativesAbroad: boolean;
    emergencyVerificationChannel: string;
  };
  habits: {
    participatesInRaffles: boolean;
    lookingForWork: boolean;
    usesDatingApps: boolean;
  };
}

// Full payload sent to n8n onboarding webhook → DynamoDB
export interface OnboardingPayload {
  account: {
    email: string;
    phone: string;
    password: string;
    fullName: string;
  };
  protectedPerson: ProtectedPerson;
  profile: {
    profileId: string;
    createdAt: string;
    updatedAt: string;
  } & ProtectionProfile;
}

export type RiskLevel = 'bajo' | 'medio' | 'alto';
export type Verdict = 'seguro' | 'sospechoso' | 'estafa';

export interface ActivityItem {
  id: string;
  date: string;
  type: 'mensaje' | 'audio';
  preview: string;
  verdict: Verdict;
  riskLevel: RiskLevel;
  details?: string;
}

export interface ActivitySummary {
  total: number;
  safe: number;
  suspicious: number;
  fraudsBlocked: number;
}

export interface CatalogItem {
  id: string;
  label: string;
}

export interface Catalogs {
  banks: CatalogItem[];
  carriers: CatalogItem[];
  pensionInstitutions: CatalogItem[];
  departmentCards: CatalogItem[];
  socialPrograms: CatalogItem[];
  internetProviders: CatalogItem[];
  electricityProviders: CatalogItem[];
  waterProviders: CatalogItem[];
  onlineStores: CatalogItem[];
}

export interface AdminMetrics {
  totalUsers: number;
  totalAnalyses: number;
  fraudsDetected: number;
  activeUsersThisMonth: number;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  protectedPerson: ProtectedPerson;
  registeredAt: string;
  totalAnalyses: number;
  fraudsBlocked: number;
}
