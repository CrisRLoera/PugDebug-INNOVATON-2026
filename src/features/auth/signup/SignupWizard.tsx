import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Step1Account } from './Step1Account';
import { Step2Protected } from './Step2Protected';
import { Step3Profile } from './Step3Profile';
import { submitOnboarding } from '../../../api/onboarding';
import { useAuth } from '../../../context/AuthContext';
import type { AccountData } from './Step1Account';
import type { ProtectedPerson, ProtectionProfile } from '../../../types';

const STEPS = ['Tu cuenta', 'Persona protegida', 'Perfil de protección'];

const DEFAULT_ACCOUNT: AccountData = {
  fullName: '', email: '', phone: '', password: '', confirmPassword: '',
};
const DEFAULT_PERSON: ProtectedPerson = { name: '', phone: '' };
const DEFAULT_PROFILE: ProtectionProfile = {
  banks: [],
  carrier: '',
  receivesPension: false,
  pensionInstitution: '',
  participatesInLotteries: false,
  hasInvestments: false,
  trustedContacts: [],
  familyKeyword: '',
};

export function SignupWizard() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState<AccountData>(DEFAULT_ACCOUNT);
  const [person, setPerson] = useState<ProtectedPerson>(DEFAULT_PERSON);
  const [profile, setProfile] = useState<ProtectionProfile>(DEFAULT_PROFILE);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  async function handleStep3(profileData: ProtectionProfile) {
    setSubmitting(true);
    setServerError('');
    try {
      const { user } = await submitOnboarding({
        account: {
          fullName: account.fullName,
          email: account.email,
          phone: account.phone,
          password: account.password,
        },
        protectedPerson: person,
        profile: profileData,
      });
      signIn(user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al crear la cuenta.');
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center shadow">
            <i className="pi pi-shield text-white" />
          </div>
          <span className="font-bold text-slate-900 text-xl">PugGuardian</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
                    ${i < step ? 'bg-blue-700 text-white' : i === step ? 'bg-blue-700 text-white ring-4 ring-blue-100' : 'bg-slate-200 text-slate-500'}`}>
                    {i < step ? <i className="pi pi-check text-xs" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded transition-all ${i < step ? 'bg-blue-700' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Paso {step + 1} de {STEPS.length} — <span className="font-medium text-slate-700">{STEPS[step]}</span>
            </p>
          </div>

          {serverError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <i className="pi pi-exclamation-circle mt-0.5 flex-shrink-0" />
              {serverError}
            </div>
          )}

          {step === 0 && (
            <Step1Account
              initial={account}
              onNext={(data) => { setAccount(data); setStep(1); }}
            />
          )}
          {step === 1 && (
            <Step2Protected
              initial={person}
              onNext={(data) => { setPerson(data); setStep(2); }}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <Step3Profile
              initial={profile}
              onNext={(data) => { setProfile(data); void handleStep3(data); }}
              onBack={() => setStep(1)}
              submitting={submitting}
            />
          )}
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-700 font-semibold hover:text-blue-800 transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
