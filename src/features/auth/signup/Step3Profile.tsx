import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getCatalogs } from '../../../api/admin';
import type { ProtectionProfile, TrustedContact, CatalogItem } from '../../../types';

interface Props {
  initial: ProtectionProfile;
  onNext: (data: ProtectionProfile) => void;
  onBack: () => void;
  submitting: boolean;
}

function validate(form: ProtectionProfile): string[] {
  const errors: string[] = [];
  if (form.banks.length === 0) errors.push('Selecciona al menos un banco.');
  if (!form.carrier) errors.push('Selecciona una compañía de celular.');
  if (form.receivesPension && !form.pensionInstitution) errors.push('Indica la institución de pensión.');
  if (!form.familyKeyword.trim()) errors.push('La palabra clave familiar es obligatoria.');
  return errors;
}

export function Step3Profile({ initial, onNext, onBack, submitting }: Props) {
  const [form, setForm] = useState<ProtectionProfile>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [banks, setBanks] = useState<CatalogItem[]>([]);
  const [carriers, setCarriers] = useState<CatalogItem[]>([]);
  const [pensionInstitutions, setPensionInstitutions] = useState<CatalogItem[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  useEffect(() => {
    getCatalogs()
      .then((c) => {
        setBanks(c.banks);
        setCarriers(c.carriers);
        setPensionInstitutions(c.pensionInstitutions);
      })
      .finally(() => setLoadingCatalogs(false));
  }, []);

  function toggleBank(id: string) {
    setForm((prev) => ({
      ...prev,
      banks: prev.banks.includes(id) ? prev.banks.filter((b) => b !== id) : [...prev.banks, id],
    }));
  }

  function updateContact(index: number, field: keyof TrustedContact, value: string) {
    setForm((prev) => {
      const contacts = [...prev.trustedContacts];
      contacts[index] = { ...contacts[index], [field]: value };
      return { ...prev, trustedContacts: contacts };
    });
  }

  function addContact() {
    setForm((prev) => ({ ...prev, trustedContacts: [...prev.trustedContacts, { name: '', phone: '' }] }));
  }

  function removeContact(index: number) {
    setForm((prev) => ({ ...prev, trustedContacts: prev.trustedContacts.filter((_, i) => i !== index) }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onNext(form);
  }

  const Toggle = ({
    label, value, onChange,
  }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
        ${value
          ? 'bg-blue-50 border-blue-400 text-blue-700'
          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
        }`}
    >
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
        ${value ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
        {value && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
      </span>
      {label}
    </button>
  );

  if (loadingCatalogs) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Perfil de protección</h3>
        <p className="text-sm text-slate-500 mt-0.5">
          Esta información ayuda a PugGuardian a detectar fraudes dirigidos a tu familiar.
        </p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-red-700 mb-1">Hay campos incompletos:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((e) => <li key={e} className="text-sm text-red-600">{e}</li>)}
          </ul>
        </div>
      )}

      {/* Banks */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Bancos que usa <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {banks.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => toggleBank(bank.id)}
              className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all
                ${form.banks.includes(bank.id)
                  ? 'bg-blue-700 border-blue-700 text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700'
                }`}
            >
              {bank.label}
            </button>
          ))}
        </div>
      </div>

      {/* Carrier */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Compañía de celular <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {carriers.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, carrier: c.id }))}
              className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all
                ${form.carrier === c.id
                  ? 'bg-blue-700 border-blue-700 text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700'
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pension */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">¿Recibe pensión?</p>
        <div className="flex gap-2 mb-3">
          <Toggle label="Sí" value={form.receivesPension} onChange={(v) => setForm((p) => ({ ...p, receivesPension: v, pensionInstitution: v ? p.pensionInstitution : '' }))} />
          <Toggle label="No" value={!form.receivesPension} onChange={(v) => setForm((p) => ({ ...p, receivesPension: !v, pensionInstitution: !v ? '' : p.pensionInstitution }))} />
        </div>
        {form.receivesPension && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ¿De qué institución? <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {pensionInstitutions.map((pi) => (
                <button
                  key={pi.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, pensionInstitution: pi.id }))}
                  className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all
                    ${form.pensionInstitution === pi.id
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700'
                    }`}
                >
                  {pi.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lotteries */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">¿Participa en sorteos?</p>
        <div className="flex gap-2">
          <Toggle label="Sí" value={form.participatesInLotteries} onChange={(v) => setForm((p) => ({ ...p, participatesInLotteries: v }))} />
          <Toggle label="No" value={!form.participatesInLotteries} onChange={(v) => setForm((p) => ({ ...p, participatesInLotteries: !v }))} />
        </div>
      </div>

      {/* Investments */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">¿Tiene inversiones?</p>
        <div className="flex gap-2">
          <Toggle label="Sí" value={form.hasInvestments} onChange={(v) => setForm((p) => ({ ...p, hasInvestments: v }))} />
          <Toggle label="No" value={!form.hasInvestments} onChange={(v) => setForm((p) => ({ ...p, hasInvestments: !v }))} />
        </div>
      </div>

      {/* Trusted contacts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700">Contactos de confianza</label>
          <button
            type="button"
            onClick={addContact}
            className="text-xs text-blue-700 font-semibold hover:text-blue-800 flex items-center gap-1"
          >
            <i className="pi pi-plus-circle" /> Agregar
          </button>
        </div>
        <div className="space-y-3">
          {form.trustedContacts.map((contact, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  value={contact.name}
                  onChange={(e) => updateContact(i, 'name', e.target.value)}
                  placeholder="Nombre"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  value={contact.phone}
                  onChange={(e) => updateContact(i, 'phone', e.target.value)}
                  placeholder="Teléfono"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                type="button"
                onClick={() => removeContact(i)}
                className="mt-1 p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <i className="pi pi-trash text-sm" />
              </button>
            </div>
          ))}
          {form.trustedContacts.length === 0 && (
            <p className="text-sm text-slate-400 italic">Ningún contacto agregado aún.</p>
          )}
        </div>
      </div>

      {/* Family keyword */}
      <div>
        <label htmlFor="keyword" className="block text-sm font-medium text-slate-700 mb-1.5">
          Palabra clave familiar <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-2">
          Una palabra secreta que solo la familia conoce, para verificar la identidad en llamadas.
        </p>
        <input
          id="keyword"
          value={form.familyKeyword}
          onChange={(e) => setForm((prev) => ({ ...prev, familyKeyword: e.target.value }))}
          placeholder="Ej: girasol"
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <i className="pi pi-arrow-left" />
          Atrás
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          {submitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creando cuenta...
            </>
          ) : (
            <>
              <i className="pi pi-check" />
              Crear cuenta
            </>
          )}
        </button>
      </div>
    </form>
  );
}
