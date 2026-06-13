import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Step1Account } from './Step1Account';
import { Step2Protected } from './Step2Protected';
import { Step3Profile, DEFAULT_PROFILE } from './Step3Profile';
import { submitOnboarding } from '../../../api/onboarding';
import { useAuth } from '../../../context/AuthContext';
import pugLogo from '../../../assets/pug-logo.jpeg';
import type { AccountData } from './Step1Account';
import type { ProtectedPerson, ProtectionProfile } from '../../../types';

const STEPS = ['Tu cuenta', 'Persona protegida', 'Perfil de protección'];
const BOT_URL = 'https://t.me/pugguardian_bot';

const DEFAULT_ACCOUNT: AccountData = { fullName: '', email: '', phone: '', password: '', confirmPassword: '' };
const DEFAULT_PERSON: ProtectedPerson = { name: '', phone: '' };

export function SignupWizard() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState<AccountData>(DEFAULT_ACCOUNT);
  const [person, setPerson] = useState<ProtectedPerson>(DEFAULT_PERSON);
  const [profile, setProfile] = useState<ProtectionProfile>(DEFAULT_PROFILE);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleStep3(profileData: ProtectionProfile) {
    setSubmitting(true);
    setServerError('');

    const now = new Date().toISOString();
    const profileId = crypto.randomUUID();

    try {
      const { user } = await submitOnboarding({
        account: {
          fullName: account.fullName,
          email: account.email,
          phone: account.phone,
          password: account.password,
        },
        protectedPerson: person,
        profile: {
          profileId,
          createdAt: now,
          updatedAt: now,
          ...profileData,
        },
      });
      signIn(user);
      setStep(3);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al crear la cuenta.');
      setSubmitting(false);
    }
  }

  function botDeepLink() {
    const phone = account.phone.replace(/\D/g, '');
    return phone ? `${BOT_URL}?start=${phone}` : BOT_URL;
  }

  function handleCopy() {
    void navigator.clipboard.writeText(botDeepLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#F5EFD6] via-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={pugLogo} alt="PugGuardian" className="w-12 h-12 rounded-full object-cover shadow" />
          <span className="font-bold text-slate-900 text-xl">PugGuardian</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
                    ${i < step ? 'bg-purple-700 text-white' : i === step ? 'bg-purple-700 text-white ring-4 ring-purple-100' : 'bg-slate-200 text-slate-500'}`}>
                    {i < step ? <i className="pi pi-check text-xs" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded transition-all ${i < step ? 'bg-purple-700' : 'bg-slate-200'}`} />
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
            <Step1Account initial={account} onNext={(d) => { setAccount(d); setStep(1); }} />
          )}
          {step === 1 && (
            <Step2Protected initial={person} onNext={(d) => { setPerson(d); setStep(2); }} onBack={() => setStep(0)} />
          )}
          {step === 2 && (
            <Step3Profile
              initial={profile}
              onNext={(d) => { setProfile(d); void handleStep3(d); }}
              onBack={() => setStep(1)}
              submitting={submitting}
            />
          )}
          {step === 3 && (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <i className="pi pi-check-circle text-3xl text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">¡Cuenta creada!</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Comparte el bot de Telegram con <span className="font-semibold text-slate-700">{person.name}</span> para que pueda enviarnos mensajes sospechosos.
                </p>
              </div>

              {/* Step 1: Guardian opens bot */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-left">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Paso 1 — Tú</p>
                <p className="text-sm text-slate-600">Abre el bot en Telegram para activar tus notificaciones.</p>
                <a
                  href={botDeepLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors w-full"
                >
                  <i className="pi pi-send" />
                  Abrir @pugguardian_bot
                </a>
              </div>

              {/* Step 2: Share with protected person */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-left">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Paso 2 — {person.name}</p>
                <p className="text-sm text-slate-600">Comparte el bot con la persona que quieres proteger.</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <i className={copied ? 'pi pi-check text-green-600' : 'pi pi-copy'} />
                    {copied ? '¡Copiado!' : 'Copiar link'}
                  </button>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(botDeepLink())}&text=${encodeURIComponent(`Hola ${person.name}, este es el bot de PugGuardian para enviarnos mensajes sospechosos: `)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="pi pi-send" />
                    Compartir
                  </a>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard', { replace: true })}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                Ir al dashboard <i className="pi pi-arrow-right ml-1" />
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-purple-700 font-semibold hover:text-purple-800 transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
