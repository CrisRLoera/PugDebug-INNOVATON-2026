import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getCatalogs } from '../../../api/admin';
import type { ProtectionProfile, TrustedContact, CatalogItem, Catalogs } from '../../../types';

const RELATIONSHIPS = ['hijo', 'hija', 'hermano', 'hermana', 'nieto', 'nieta', 'sobrino', 'sobrina', 'amigo', 'amiga', 'otro'];
const VERIFICATION_CHANNELS = [
  { id: 'videollamada', label: 'Videollamada' },
  { id: 'llamada', label: 'Llamada telefónica' },
  { id: 'mensaje', label: 'Mensaje de texto' },
];

export const DEFAULT_PROFILE: ProtectionProfile = {
  banking: { banks: [], departmentCards: [], usesMobileBanking: false, hasInvestments: false, hasCrypto: false },
  government: { receivesPension: false, pensionProvider: '', filesTaxesPersonally: false, enrolledInSocialPrograms: [] },
  telecom: { mobileCarrier: '', internetProvider: '', utilityProviders: { electricity: '', water: '' }, shopsOnline: false, onlineStores: [] },
  family: { trustedContacts: [], familyKeyword: '', hasRelativesAbroad: false, emergencyVerificationChannel: 'videollamada' },
  habits: { participatesInRaffles: false, lookingForWork: false, usesDatingApps: false },
  trustedContacts: undefined,
  pensionInstitution: undefined
};

function validate(form: ProtectionProfile): string[] {
  const errors: string[] = [];
  if (form.banking.banks.length === 0) errors.push('Selecciona al menos un banco.');
  if (!form.telecom.mobileCarrier) errors.push('Selecciona una compañía de celular.');
  if (form.government.receivesPension && !form.government.pensionProvider) errors.push('Indica la institución de pensión.');
  if (!form.family.familyKeyword.trim()) errors.push('La palabra clave familiar es obligatoria.');
  return errors;
}

interface Props {
  initial: ProtectionProfile;
  onNext: (data: ProtectionProfile) => void;
  onBack: () => void;
  submitting: boolean;
}

export function Step3Profile({ initial, onNext, onBack, submitting }: Props) {
  const [form, setForm] = useState<ProtectionProfile>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [catalogs, setCatalogs] = useState<Catalogs | null>(null);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  useEffect(() => {
    getCatalogs().then(setCatalogs).finally(() => setLoadingCatalogs(false));
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  function toggleMulti(section: keyof ProtectionProfile, field: string, id: string) {
    setForm((prev) => {
      const s = prev[section] as Record<string, unknown>;
      const arr = (s[field] as string[]) ?? [];
      return {
        ...prev,
        [section]: { ...s, [field]: arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id] },
      };
    });
  }

  function setField(section: keyof ProtectionProfile, field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [section]: { ...(prev[section] as object), [field]: value } }));
  }

  function updateContact(i: number, f: keyof TrustedContact, v: string) {
    const contacts = [...form.family.trustedContacts];
    contacts[i] = { ...contacts[i], [f]: v };
    setField('family', 'trustedContacts', contacts);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onNext(form);
  }
  // ── Sub-components ───────────────────────────────────────────────────────

  const Chips = ({ items, selected, onToggle }: { items: CatalogItem[]; selected: string[]; onToggle: (id: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onToggle(item.id)}
          className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all
            ${selected.includes(item.id)
              ? 'bg-blue-700 border-blue-700 text-white'
              : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700'
            }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  const SingleChips = ({ items, value, onChange }: { items: CatalogItem[]; value: string; onChange: (id: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all
            ${value === item.id
              ? 'bg-blue-700 border-blue-700 text-white'
              : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700'
            }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  const YesNo = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex gap-2">
      {([true, false] as const).map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all
            ${value === v
              ? 'bg-blue-700 border-blue-700 text-white'
              : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400'
            }`}
        >
          {v ? 'Sí' : 'No'}
        </button>
      ))}
    </div>
  );

  const SectionTitle = ({ icon, title }: { icon: string; title: string }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
        <i className={`pi ${icon} text-blue-600 text-sm`} />
      </div>
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
    </div>
  );

  const FieldRow = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-2">
      <p className="text-sm text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      {children}
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────

  if (loadingCatalogs || !catalogs) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Perfil de protección</h3>
        <p className="text-sm text-slate-500 mt-0.5">Esta información ayuda a detectar fraudes dirigidos a tu familiar.</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-red-700 mb-1">Campos obligatorios incompletos:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((e) => <li key={e} className="text-sm text-red-600">{e}</li>)}
          </ul>
        </div>
      )}

      {/* ── BANCARIA ── */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
        <SectionTitle icon="pi-credit-card" title="Información bancaria" />

        <FieldRow label="Bancos que usa" required>
          <Chips items={catalogs.banks} selected={form.banking.banks} onToggle={(id) => toggleMulti('banking', 'banks', id)} />
        </FieldRow>

        <FieldRow label="Tarjetas departamentales">
          <Chips items={catalogs.departmentCards} selected={form.banking.departmentCards} onToggle={(id) => toggleMulti('banking', 'departmentCards', id)} />
        </FieldRow>

        <div className="grid sm:grid-cols-3 gap-4">
          <FieldRow label="¿Usa banca móvil?">
            <YesNo value={form.banking.usesMobileBanking} onChange={(v) => setField('banking', 'usesMobileBanking', v)} />
          </FieldRow>
          <FieldRow label="¿Tiene inversiones?">
            <YesNo value={form.banking.hasInvestments} onChange={(v) => setField('banking', 'hasInvestments', v)} />
          </FieldRow>
          <FieldRow label="¿Tiene criptomonedas?">
            <YesNo value={form.banking.hasCrypto} onChange={(v) => setField('banking', 'hasCrypto', v)} />
          </FieldRow>
        </div>
      </div>

      {/* ── GOBIERNO ── */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
        <SectionTitle icon="pi-building" title="Gobierno y programas sociales" />

        <div className="grid sm:grid-cols-2 gap-4">
          <FieldRow label="¿Recibe pensión?">
            <YesNo
              value={form.government.receivesPension}
              onChange={(v) => setField('government', 'receivesPension', v)}
            />
          </FieldRow>
          <FieldRow label="¿Declara impuestos personalmente?">
            <YesNo value={form.government.filesTaxesPersonally} onChange={(v) => setField('government', 'filesTaxesPersonally', v)} />
          </FieldRow>
        </div>

        {form.government.receivesPension && (
          <FieldRow label="Institución de pensión" required>
            <SingleChips
              items={catalogs.pensionInstitutions}
              value={form.government.pensionProvider}
              onChange={(id) => setField('government', 'pensionProvider', id)}
            />
          </FieldRow>
        )}

        <FieldRow label="Programas sociales en los que participa">
          <Chips items={catalogs.socialPrograms} selected={form.government.enrolledInSocialPrograms} onToggle={(id) => toggleMulti('government', 'enrolledInSocialPrograms', id)} />
        </FieldRow>
      </div>

      {/* ── TELECOMUNICACIONES ── */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
        <SectionTitle icon="pi-mobile" title="Telecomunicaciones y servicios" />

        <FieldRow label="Compañía de celular" required>
          <SingleChips items={catalogs.carriers} value={form.telecom.mobileCarrier} onChange={(id) => setField('telecom', 'mobileCarrier', id)} />
        </FieldRow>

        <FieldRow label="Proveedor de internet">
          <SingleChips items={catalogs.internetProviders} value={form.telecom.internetProvider} onChange={(id) => setField('telecom', 'internetProvider', id)} />
        </FieldRow>

        <div className="grid sm:grid-cols-2 gap-4">
          <FieldRow label="Compañía de luz">
            <SingleChips
              items={catalogs.electricityProviders}
              value={form.telecom.utilityProviders.electricity}
              onChange={(id) => setField('telecom', 'utilityProviders', { ...form.telecom.utilityProviders, electricity: id })}
            />
          </FieldRow>
          <FieldRow label="Compañía de agua">
            <SingleChips
              items={catalogs.waterProviders}
              value={form.telecom.utilityProviders.water}
              onChange={(id) => setField('telecom', 'utilityProviders', { ...form.telecom.utilityProviders, water: id })}
            />
          </FieldRow>
        </div>

        <FieldRow label="¿Compra en línea?">
          <YesNo value={form.telecom.shopsOnline} onChange={(v) => setField('telecom', 'shopsOnline', v)} />
        </FieldRow>

        {form.telecom.shopsOnline && (
          <FieldRow label="Tiendas en línea que usa">
            <Chips items={catalogs.onlineStores} selected={form.telecom.onlineStores} onToggle={(id) => toggleMulti('telecom', 'onlineStores', id)} />
          </FieldRow>
        )}
      </div>

      {/* ── FAMILIA ── */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
        <SectionTitle icon="pi-users" title="Familia y contactos" />

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-700">Contactos de confianza</p>
            <button
              type="button"
              onClick={() => setField('family', 'trustedContacts', [...form.family.trustedContacts, { name: '', relationship: 'hijo', phone: '' }])}
              className="text-xs text-blue-700 font-semibold hover:text-blue-800 flex items-center gap-1"
            >
              <i className="pi pi-plus-circle" /> Agregar
            </button>
          </div>
          <div className="space-y-2">
            {form.family.trustedContacts.map((c, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input
                    value={c.name}
                    onChange={(e) => updateContact(i, 'name', e.target.value)}
                    placeholder="Nombre"
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                  />
                  <select
                    value={c.relationship}
                    onChange={(e) => updateContact(i, 'relationship', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <input
                    value={c.phone}
                    onChange={(e) => updateContact(i, 'phone', e.target.value)}
                    placeholder="Teléfono"
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setField('family', 'trustedContacts', form.family.trustedContacts.filter((_, idx) => idx !== i))}
                  className="mt-1.5 p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <i className="pi pi-trash text-sm" />
                </button>
              </div>
            ))}
            {form.family.trustedContacts.length === 0 && (
              <p className="text-sm text-slate-400 italic">Ningún contacto agregado aún.</p>
            )}
          </div>
        </div>

        <FieldRow label="Palabra clave familiar" required>
          <input
            value={form.family.familyKeyword}
            onChange={(e) => setField('family', 'familyKeyword', e.target.value)}
            placeholder="Ej: aguacate"
            className="w-full max-w-xs px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
          />
          <p className="text-xs text-slate-400">Palabra secreta para verificar identidad en llamadas.</p>
        </FieldRow>

        <div className="grid sm:grid-cols-2 gap-4">
          <FieldRow label="¿Tiene familiares en el extranjero?">
            <YesNo value={form.family.hasRelativesAbroad} onChange={(v) => setField('family', 'hasRelativesAbroad', v)} />
          </FieldRow>
          <FieldRow label="Canal de verificación de emergencias">
            <SingleChips items={VERIFICATION_CHANNELS} value={form.family.emergencyVerificationChannel} onChange={(id) => setField('family', 'emergencyVerificationChannel', id)} />
          </FieldRow>
        </div>
      </div>

      {/* ── HÁBITOS ── */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
        <SectionTitle icon="pi-calendar" title="Hábitos" />
        <div className="grid sm:grid-cols-3 gap-4">
          <FieldRow label="¿Participa en sorteos?">
            <YesNo value={form.habits.participatesInRaffles} onChange={(v) => setField('habits', 'participatesInRaffles', v)} />
          </FieldRow>
          <FieldRow label="¿Busca trabajo actualmente?">
            <YesNo value={form.habits.lookingForWork} onChange={(v) => setField('habits', 'lookingForWork', v)} />
          </FieldRow>
          <FieldRow label="¿Usa apps de citas?">
            <YesNo value={form.habits.usesDatingApps} onChange={(v) => setField('habits', 'usesDatingApps', v)} />
          </FieldRow>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <i className="pi pi-arrow-left" /> Atrás
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          {submitting ? (
            <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creando cuenta...</>
          ) : (
            <><i className="pi pi-check" /> Crear cuenta</>
          )}
        </button>
      </div>
    </form>
  );
}
