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
  phone: string;
}

export interface ProtectionProfile {
  banks: string[];
  carrier: string;
  receivesPension: boolean;
  pensionInstitution: string;
  participatesInLotteries: boolean;
  hasInvestments: boolean;
  trustedContacts: TrustedContact[];
  familyKeyword: string;
}

export interface OnboardingData {
  account: {
    email: string;
    phone: string;
    password: string;
    fullName: string;
  };
  protectedPerson: ProtectedPerson;
  profile: ProtectionProfile;
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
