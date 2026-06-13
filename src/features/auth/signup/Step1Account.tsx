import { useState } from 'react';
import type { FormEvent } from 'react';

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
  onNext: (data: AccountData) => void;
}

export function Step1Account({ initial, onNext }: Props) {
  const [form, setForm] = useState<AccountData>(initial);
  const [errors, setErrors] = useState<Errors>({});

  function set(field: keyof AccountData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onNext(form);
  }


  const inputCls = (field: keyof AccountData) =>
    `w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
      errors[field]
        ? 'border-red-400 ring-1 ring-red-300'
        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`;

  const Field = ({ id, label, type = 'text', field, placeholder }: {
    id: string; label: string; type?: string; field: keyof AccountData; placeholder: string;
  }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        id={id}
        type={type}
        value={form[field]}
        onChange={(e) => set(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 outline-none transition-all
          ${errors[field]
            ? 'border-red-400 ring-1 ring-red-300'
            : 'border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
          }`}
      />
      {errors[field] && <p className="mt-1.5 text-xs text-red-600">{errors[field]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Tu cuenta</h3>
        <p className="text-sm text-slate-500 mt-0.5">Con estos datos podrás iniciar sesión.</p>
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo</label>
        <input id="fullName" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Nombre Apellido" className={inputCls('fullName')} />
        {errors.fullName && <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
        <input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="nombre@correo.com" className={inputCls('email')} />
        {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
        <input id="phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="555 123 4567" className={inputCls('phone')} />
        {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
        <input id="password" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Mínimo 8 caracteres" className={inputCls('password')} />
        {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">Confirmar contraseña</label>
        <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} placeholder="Repite tu contraseña" className={inputCls('confirmPassword')} />
        {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          Continuar
          <i className="pi pi-arrow-right" />
        </button>
      </div>
    </form>
  );
}
