import { useState } from 'react';

export interface AccountData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type Errors = Partial<Record<keyof AccountData, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

function validate(form: AccountData): Errors {
  const e: Errors = {};
  if (!form.fullName.trim()) e.fullName = 'El nombre completo es obligatorio.';
  if (!form.email.trim()) e.email = 'El correo es obligatorio.';
  else if (!EMAIL_REGEX.test(form.email.trim())) e.email = 'Ingresa un correo válido.';
  if (!form.phone.trim()) e.phone = 'El teléfono es obligatorio.';
  else if (!PHONE_REGEX.test(form.phone.replace(/[\s()-]/g, ''))) e.phone = 'Ingresa un teléfono válido (7-15 dígitos).';
  if (!form.password) e.password = 'La contraseña es obligatoria.';
  else if (form.password.length < 8) e.password = 'Mínimo 8 caracteres.';
  if (!form.confirmPassword) e.confirmPassword = 'Confirma tu contraseña.';
  else if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden.';
  return e;
}

interface Props {
  initial: AccountData;
  /** Puede lanzar un Error con mensaje si el correo/teléfono ya existe. */
  onNext: (data: AccountData) => Promise<void>;
}

export function Step1Account({ initial, onNext }: Props) {
  const [form, setForm] = useState<AccountData>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const [checking, setChecking] = useState(false);

  function set(field: keyof AccountData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError('');
  }

  async function onSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setChecking(true);
    setServerError('');
    try {
      await onNext(form);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al verificar los datos.';
      // Mapear el mensaje al campo correspondiente para resaltarlo
      if (msg.toLowerCase().includes('correo')) {
        setErrors({ email: msg });
      } else if (msg.toLowerCase().includes('teléfono')) {
        setErrors({ phone: msg });
      } else {
        setServerError(msg);
      }
    } finally {
      setChecking(false);
    }
  }

  const inputCls = (field: keyof AccountData) =>
    `w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
      errors[field]
        ? 'border-red-400 ring-1 ring-red-300 focus:border-red-400 focus:ring-red-300'
        : 'border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
    }`;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Tu cuenta</h3>
        <p className="text-sm text-slate-500 mt-0.5">Con estos datos podrás iniciar sesión.</p>
      </div>

      {serverError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3.5 py-3 text-sm">
          <i className="pi pi-exclamation-circle mt-0.5 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo</label>
        <input id="fullName" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Nombre Apellido" className={inputCls('fullName')} />
        {errors.fullName && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><i className="pi pi-exclamation-circle text-xs" />{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
        <div className="relative">
          <input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="nombre@correo.com" className={inputCls('email')} />
          {errors.email?.includes('registrado') && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <i className="pi pi-times-circle text-red-500 text-sm" />
            </div>
          )}
        </div>
        {errors.email && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><i className="pi pi-exclamation-circle text-xs" />{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
        <div className="relative">
          <input id="phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="555 123 4567" className={inputCls('phone')} />
          {errors.phone?.includes('registrado') && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <i className="pi pi-times-circle text-red-500 text-sm" />
            </div>
          )}
        </div>
        {errors.phone && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><i className="pi pi-exclamation-circle text-xs" />{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
        <input id="password" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Mínimo 8 caracteres" className={inputCls('password')} />
        {errors.password && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><i className="pi pi-exclamation-circle text-xs" />{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">Confirmar contraseña</label>
        <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} placeholder="Repite tu contraseña" className={inputCls('confirmPassword')} />
        {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><i className="pi pi-exclamation-circle text-xs" />{errors.confirmPassword}</p>}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={checking}
          className="w-full text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
          style={{ background: checking ? '#9B6DC5' : 'linear-gradient(135deg, #6B4FA0, #9B6DC5)', boxShadow: checking ? 'none' : '0 4px 16px rgba(107,79,160,0.35)' }}
        >
          {checking ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verificando disponibilidad...
            </>
          ) : (
            <>
              Continuar
              <i className="pi pi-arrow-right" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
