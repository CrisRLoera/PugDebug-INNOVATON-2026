import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ProtectedPerson } from '../../../types';

type Errors = Partial<Record<keyof ProtectedPerson, string>>;

const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

function validate(form: ProtectedPerson): Errors {
  const e: Errors = {};
  if (!form.name.trim()) e.name = 'El nombre es obligatorio.';
  if (!form.phone.trim()) e.phone = 'El teléfono es obligatorio.';
  else if (!PHONE_REGEX.test(form.phone.replace(/[\s()-]/g, ''))) e.phone = 'Ingresa un teléfono válido (7-15 dígitos).';
  return e;
}

interface Props {
  initial: ProtectedPerson;
  onNext: (data: ProtectedPerson) => void;
  onBack: () => void;
}

export function Step2Protected({ initial, onNext, onBack }: Props) {
  const [form, setForm] = useState<ProtectedPerson>(initial);
  const [errors, setErrors] = useState<Errors>({});

  function set(field: keyof ProtectedPerson, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onNext(form);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Persona protegida</h3>
        <p className="text-sm text-slate-500 mt-0.5">
          Datos del familiar al que vas a cuidar con PugGuardian.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <i className="pi pi-info-circle text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Esta persona recibirá el análisis de mensajes y audios sospechosos que lleguen a su teléfono.
        </p>
      </div>

      <div>
        <label htmlFor="protectedName" className="block text-sm font-medium text-slate-700 mb-1.5">
          Nombre completo
        </label>
        <input
          id="protectedName"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Nombre de tu familiar"
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 outline-none transition-all
            ${errors.name
              ? 'border-red-400 ring-1 ring-red-300'
              : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }`}
        />
        {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="protectedPhone" className="block text-sm font-medium text-slate-700 mb-1.5">
          Número de teléfono
        </label>
        <input
          id="protectedPhone"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="555 123 4567"
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 outline-none transition-all
            ${errors.phone
              ? 'border-red-400 ring-1 ring-red-300'
              : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }`}
        />
        {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <i className="pi pi-arrow-left" />
          Atrás
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          Continuar
          <i className="pi pi-arrow-right" />
        </button>
      </div>
    </form>
  );
}
