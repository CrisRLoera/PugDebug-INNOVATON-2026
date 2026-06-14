import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Step1Account } from './Step1Account';
import { Step2Protected } from './Step2Protected';
import { Step3Profile, DEFAULT_PROFILE } from './Step3Profile';
import { submitOnboarding } from '../../../api/onboarding';
import { checkAvailability } from '../../../api/auth';
import { useAuth } from '../../../context/AuthContext';
import pugLogo from '../../../assets/pug-logo.jpeg';
import type { AccountData } from './Step1Account';
import type { ProtectedPerson, ProtectionProfile } from '../../../types';

const STEPS = ['Tu cuenta', 'Persona protegida', 'Perfil de protección'];
const BOT_URL = 'https://t.me/pugguardian_bot';

const DEFAULT_ACCOUNT: AccountData = { fullName: '', email: '', phone: '', password: '', confirmPassword: '' };
const DEFAULT_PERSON: ProtectedPerson = { name: '', phone: '' };

const STEP_DESCRIPTIONS = [
  { icon: 'pi-user', title: 'Crea tu cuenta', desc: 'Estos datos te servirán para acceder a PugGuardian.' },
  { icon: 'pi-users', title: 'Persona protegida', desc: 'Indica quién recibirá protección digital con PugGuardian.' },
  { icon: 'pi-shield', title: 'Perfil de protección', desc: 'Información para detectar fraudes específicos para tu familiar.' },
];

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
        account: { fullName: account.fullName, email: account.email, phone: account.phone, password: account.password },
        protectedPerson: person,
        profile: { profileId, createdAt: now, updatedAt: now, ...profileData },
      });
      signIn({
        ...user,
        fullName: account.fullName,
        email: account.email,
        phone: account.phone,
      });
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

  const isSuccess = step === 3;

  return (
    <div className="min-h-screen flex">

      {/* ─── LEFT BRAND PANEL ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col w-5/12 min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #3D2314 0%, #6B4FA0 50%, #9B6DC5 100%)' }}
      >
        {/* Grid crema */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,239,214,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,239,214,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        {/* Glow blob */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(212,184,150,0.2)' }} />
        {/* Right border */}
        <div className="absolute top-0 right-0 w-px h-full" style={{ background: 'linear-gradient(to bottom, transparent, rgba(245,239,214,0.5), transparent)' }} />

        <div className="relative z-10 flex flex-col h-full px-12 py-12">
          {/* Logo top */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md" style={{ background: 'rgba(245,239,214,0.5)' }} />
              <img src={pugLogo} alt="PugGuardian" className="relative w-9 h-9 rounded-full object-cover" style={{ border: '2px solid rgba(245,239,214,0.7)' }} />
            </div>
            <span className="font-extrabold text-lg tracking-tight" style={{ color: '#F5EFD6' }}>PugGuardian</span>
          </Link>

          {/* Center content */}
          <div className="my-auto space-y-8">
            {/* Big logo with glow */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-3xl scale-[2.5]" style={{ background: 'rgba(212,184,150,0.5)' }} />
                <div className="absolute inset-0 rounded-full blur-xl scale-[1.8]" style={{ background: 'rgba(245,239,214,0.25)' }} />
                <div className="absolute inset-0 rounded-full scale-[1.35]" style={{ border: '1px solid rgba(245,239,214,0.45)' }} />
                <div className="absolute inset-0 rounded-full scale-[1.65]" style={{ border: '1px solid rgba(245,239,214,0.2)' }} />
                <img
                  src={pugLogo}
                  alt="PugGuardian"
                  className="relative w-40 h-40 rounded-full object-cover"
                  style={{ border: '3px solid rgba(245,239,214,0.7)', boxShadow: '0 0 60px rgba(212,184,150,0.6), 0 0 120px rgba(155,109,197,0.3)' }}
                />
              </div>
            </div>

            {/* Step info or success */}
            {!isSuccess ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-center" style={{ color: 'rgba(245,239,214,0.6)' }}>
                  Registro — Paso {step + 1} de {STEPS.length}
                </p>
                <h2 className="text-3xl font-black leading-tight text-center mb-6" style={{ color: '#F5EFD6' }}>
                  {STEP_DESCRIPTIONS[step].title}
                </h2>

                {/* Steps list */}
                <div className="space-y-3">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                        style={{
                          background: i < step ? '#D4B896' : i === step ? '#F5EFD6' : 'rgba(245,239,214,0.15)',
                          border: i < step ? '2px solid #D4B896' : i === step ? '2px solid #F5EFD6' : '2px solid rgba(245,239,214,0.25)',
                          color: i <= step ? '#6B4FA0' : 'rgba(245,239,214,0.35)',
                        }}
                      >
                        {i < step ? <i className="pi pi-check text-xs" /> : i + 1}
                      </div>
                      <span
                        className="text-sm font-medium transition-all"
                        style={{ color: i === step ? '#F5EFD6' : i < step ? '#D4B896' : 'rgba(245,239,214,0.3)' }}
                      >
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: 'rgba(245,239,214,0.2)', border: '2px solid rgba(245,239,214,0.4)' }}
                >
                  <i className="pi pi-check text-2xl" style={{ color: '#F5EFD6' }} />
                </div>
                <h2 className="text-3xl font-black" style={{ color: '#F5EFD6' }}>
                  ¡Cuenta creada
                  <br />
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #F5EFD6, #D4B896)' }}>
                    con éxito!
                  </span>
                </h2>
                <p className="text-sm" style={{ color: 'rgba(245,239,214,0.7)' }}>
                  Ya puedes proteger a {person.name}.
                </p>
              </div>
            )}
          </div>

          {/* Feature grid bottom */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: 'pi-shield', text: 'Protección 24/7' },
              { icon: 'pi-bell', text: 'Alertas al instante' },
              { icon: 'pi-users', text: 'Multi-familiar' },
              { icon: 'pi-lock', text: 'Datos cifrados' },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(245,239,214,0.12)', border: '1px solid rgba(245,239,214,0.2)' }}
              >
                <i className={`pi ${item.icon} text-xs`} style={{ color: '#D4B896' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(245,239,214,0.8)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── RIGHT CONTENT PANEL ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ background: '#F5EFD6' }}>

        {/* Mobile header */}
        <div
          className="flex lg:hidden items-center justify-between px-6 py-4"
          style={{ background: '#6B4FA0', borderBottom: '1px solid rgba(245,239,214,0.2)' }}
        >
          <Link to="/" className="flex items-center gap-2">
            <img src={pugLogo} alt="PugGuardian" className="w-8 h-8 rounded-full object-cover" style={{ border: '1px solid rgba(245,239,214,0.5)' }} />
            <span className="font-extrabold text-base" style={{ color: '#F5EFD6' }}>PugGuardian</span>
          </Link>
          <span className="text-xs font-medium" style={{ color: 'rgba(245,239,214,0.6)' }}>
            Paso {step < 3 ? step + 1 : 3} de {STEPS.length}
          </span>
        </div>

        {/* Progress bar (mobile) */}
        {!isSuccess && (
          <div className="lg:hidden h-1" style={{ background: 'rgba(107,79,160,0.15)' }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: 'linear-gradient(90deg, #6B4FA0, #9B6DC5)' }}
            />
          </div>
        )}

        <div className="flex-1 flex items-start justify-center px-6 py-10 overflow-y-auto">
          <div className="w-full max-w-lg">

            {/* Desktop heading */}
            {!isSuccess && (
              <div className="hidden lg:block mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#3D2314' }}>
                  {STEP_DESCRIPTIONS[step].title}
                </h1>
                <p className="text-sm mt-1.5" style={{ color: '#7a6050' }}>
                  {STEP_DESCRIPTIONS[step].desc}
                </p>
              </div>
            )}

            {/* Desktop step progress dots */}
            {!isSuccess && (
              <div className="hidden lg:flex items-center gap-2 mb-8">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                      style={{
                        background: i <= step ? '#6B4FA0' : 'rgba(107,79,160,0.15)',
                        color: i <= step ? '#F5EFD6' : '#9B6DC5',
                        boxShadow: i === step ? '0 0 0 4px rgba(107,79,160,0.2)' : 'none',
                      }}
                    >
                      {i < step ? <i className="pi pi-check text-xs" /> : i + 1}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className="flex-1 h-0.5 rounded transition-all"
                        style={{ background: i < step ? '#6B4FA0' : 'rgba(107,79,160,0.2)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Server error */}
            {serverError && (
              <div
                className="flex items-start gap-3 rounded-xl px-4 py-3.5 mb-6 text-sm"
                style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', color: '#b91c1c' }}
              >
                <i className="pi pi-exclamation-circle mt-0.5 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Step forms in white card */}
            {step < 3 && (
              <div
                className="rounded-2xl p-6"
                style={{ background: '#fff', boxShadow: '0 4px 30px rgba(61,35,20,0.1)', border: '1px solid rgba(107,79,160,0.12)' }}
              >
                {step === 0 && (
                  <Step1Account
                    initial={account}
                    onNext={async (d) => {
                      await checkAvailability({ email: d.email, phone: d.phone });
                      setAccount(d);
                      setStep(1);
                    }}
                  />
                )}
                {step === 1 && <Step2Protected initial={person} onNext={(d) => { setPerson(d); setStep(2); }} onBack={() => setStep(0)} />}
                {step === 2 && (
                  <Step3Profile
                    initial={profile}
                    onNext={(d) => { setProfile(d); void handleStep3(d); }}
                    onBack={() => setStep(1)}
                    submitting={submitting}
                  />
                )}
              </div>
            )}

            {/* Success state */}
            {step === 3 && (
              <div className="space-y-5">
                {/* Mobile success header */}
                <div className="lg:hidden text-center mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(107,79,160,0.12)', border: '2px solid rgba(107,79,160,0.3)' }}
                  >
                    <i className="pi pi-check-circle text-3xl" style={{ color: '#6B4FA0' }} />
                  </div>
                  <h2 className="text-2xl font-extrabold" style={{ color: '#3D2314' }}>¡Cuenta creada!</h2>
                  <p className="text-sm mt-1" style={{ color: '#7a6050' }}>
                    Ya puedes proteger a <span className="font-semibold" style={{ color: '#3D2314' }}>{person.name}</span>.
                  </p>
                </div>

                <div className="hidden lg:block mb-2">
                  <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#3D2314' }}>Activa la protección</h1>
                  <p className="text-sm mt-1.5" style={{ color: '#7a6050' }}>
                    Comparte el bot de Telegram con <span className="font-semibold" style={{ color: '#3D2314' }}>{person.name}</span>.
                  </p>
                </div>

                {/* Step 1 */}
                <div
                  className="rounded-2xl p-5 space-y-3"
                  style={{ background: '#fff', border: '1px solid rgba(107,79,160,0.2)', boxShadow: '0 4px 20px rgba(61,35,20,0.08)' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 text-xs font-bold rounded-full flex items-center justify-center"
                      style={{ background: '#6B4FA0', color: '#F5EFD6' }}
                    >1</div>
                    <p className="text-sm font-semibold" style={{ color: '#3D2314' }}>Tú — activa tus notificaciones</p>
                  </div>
                  <p className="text-sm" style={{ color: '#7a6050' }}>Abre el bot en Telegram para recibir alertas.</p>
                  <a
                    href={botDeepLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #6B4FA0, #9B6DC5)', color: '#F5EFD6', boxShadow: '0 4px 16px rgba(107,79,160,0.35)' }}
                  >
                    <i className="pi pi-send" />
                    Abrir @pugguardian_bot
                  </a>
                </div>

                {/* Step 2 */}
                <div
                  className="rounded-2xl p-5 space-y-3"
                  style={{ background: '#fff', border: '1px solid rgba(107,79,160,0.2)', boxShadow: '0 4px 20px rgba(61,35,20,0.08)' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 text-xs font-bold rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(107,79,160,0.15)', color: '#6B4FA0', border: '1px solid rgba(107,79,160,0.3)' }}
                    >2</div>
                    <p className="text-sm font-semibold" style={{ color: '#3D2314' }}>{person.name} — comparte el bot</p>
                  </div>
                  <p className="text-sm" style={{ color: '#7a6050' }}>Comparte el enlace con la persona que quieres proteger.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                      style={{ border: '1px solid rgba(107,79,160,0.3)', color: '#6B4FA0', background: 'rgba(107,79,160,0.06)' }}
                    >
                      <i className={copied ? 'pi pi-check' : 'pi pi-copy'} style={{ color: copied ? '#22c55e' : '#6B4FA0' }} />
                      {copied ? '¡Copiado!' : 'Copiar link'}
                    </button>
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(botDeepLink())}&text=${encodeURIComponent(`Hola ${person.name}, este es el bot de PugGuardian: `)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg, #6B4FA0, #9B6DC5)', color: '#F5EFD6', boxShadow: '0 4px 16px rgba(107,79,160,0.3)' }}
                    >
                      <i className="pi pi-send" />
                      Compartir
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/dashboard', { replace: true })}
                  className="w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #6B4FA0, #9B6DC5)', color: '#F5EFD6', boxShadow: '0 6px 25px rgba(107,79,160,0.4)' }}
                >
                  Ir al dashboard
                  <i className="pi pi-arrow-right" />
                </button>
              </div>
            )}

            {/* Footer links */}
            {step < 3 && (
              <div className="mt-6 space-y-3 text-center">
                <p className="text-sm" style={{ color: '#7a6050' }}>
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="font-bold transition-colors hover:underline" style={{ color: '#6B4FA0' }}>
                    Iniciar sesión
                  </Link>
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-sm transition-colors"
                  style={{ color: '#9B6DC5' }}
                >
                  <i className="pi pi-arrow-left text-xs" />
                  Volver al inicio
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
