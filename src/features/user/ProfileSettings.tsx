import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../../api/profile';
import { getCatalogs } from '../../api/admin';
import { deleteAccount } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import type { ProfileData } from '../../api/profile';
import type { CatalogItem, TrustedContact } from '../../types';

export function ProfileSettings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ProfileData | null>(null);
  const [banks, setBanks] = useState<CatalogItem[]>([]);
  const [carriers, setCarriers] = useState<CatalogItem[]>([]);
  const [pensionInstitutions, setPensionInstitutions] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([getProfile(user.id), getCatalogs()])
      .then(([profile, catalogs]) => {
        setData(profile);
        setBanks(catalogs.banks);
        setCarriers(catalogs.carriers);
        setPensionInstitutions(catalogs.pensionInstitutions);
      })
      .finally(() => setLoading(false));
  }, [user]);

  async function handleSave() {
    if (!user || !data) return;
    setSaving(true);
    try {
      await updateProfile(user.id, data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteAccount(user.id);
      signOut();
      navigate('/login', { replace: true });
    } finally {
      setDeleting(false);
    }
  }

  function toggleBank(id: string) {
    if (!data) return;
    const banks = data.profile.banks.includes(id)
      ? data.profile.banks.filter((b) => b !== id)
      : [...data.profile.banks, id];
    setData({ ...data, profile: { ...data.profile, banks } });
  }

  function updateContact(index: number, field: keyof TrustedContact, value: string) {
    if (!data) return;
    const contacts = [...data.profile.trustedContacts];
    contacts[index] = { ...contacts[index], [field]: value };
    setData({ ...data, profile: { ...data.profile, trustedContacts: contacts } });
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex gap-2">
      {[true, false].map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
            ${value === v
              ? 'bg-blue-700 border-blue-700 text-white'
              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
        >
          {v ? 'Sí' : 'No'}
        </button>
      ))}
    </div>
  );

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Perfil de protección</h1>
          <p className="text-slate-500 mt-1 text-sm">Edita los datos de tu familiar y su configuración.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
        >
          {saving ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <i className="pi pi-save" />}
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 mb-5 text-sm">
          <i className="pi pi-check-circle" />
          Cambios guardados correctamente.
        </div>
      )}

      <div className="space-y-5">
        {/* Protected person */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <i className="pi pi-user text-blue-600" /> Persona protegida
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Nombre</label>
              <input
                value={data.protectedPerson.name}
                onChange={(e) => setData({ ...data, protectedPerson: { ...data.protectedPerson, name: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Teléfono</label>
              <input
                value={data.protectedPerson.phone}
                onChange={(e) => setData({ ...data, protectedPerson: { ...data.protectedPerson, phone: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>

        {/* Banks */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <i className="pi pi-credit-card text-blue-600" /> Bancos que usa
          </h2>
          <div className="flex flex-wrap gap-2">
            {banks.map((bank) => (
              <button
                key={bank.id}
                type="button"
                onClick={() => toggleBank(bank.id)}
                className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all
                  ${data.profile.banks.includes(bank.id)
                    ? 'bg-blue-700 border-blue-700 text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400'
                  }`}
              >
                {bank.label}
              </button>
            ))}
          </div>
        </section>

        {/* Carrier */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <i className="pi pi-mobile text-blue-600" /> Compañía de celular
          </h2>
          <div className="flex flex-wrap gap-2">
            {carriers.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setData({ ...data, profile: { ...data.profile, carrier: c.id } })}
                className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all
                  ${data.profile.carrier === c.id
                    ? 'bg-blue-700 border-blue-700 text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400'
                  }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </section>

        {/* Financial context */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <i className="pi pi-wallet text-blue-600" /> Contexto financiero
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-700 mb-2">¿Recibe pensión?</p>
              <Toggle
                value={data.profile.receivesPension}
                onChange={(v) => setData({ ...data, profile: { ...data.profile, receivesPension: v, pensionInstitution: v ? data.profile.pensionInstitution : '' } })}
              />
              {data.profile.receivesPension && (
                <div className="mt-3">
                  <p className="text-sm text-slate-700 mb-2">Institución:</p>
                  <div className="flex flex-wrap gap-2">
                    {pensionInstitutions.map((pi) => (
                      <button
                        key={pi.id}
                        type="button"
                        onClick={() => setData({ ...data, profile: { ...data.profile, pensionInstitution: pi.id } })}
                        className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all
                          ${data.profile.pensionInstitution === pi.id
                            ? 'bg-blue-700 border-blue-700 text-white'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400'
                          }`}
                      >
                        {pi.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-slate-700 mb-2">¿Participa en sorteos?</p>
              <Toggle value={data.profile.participatesInLotteries} onChange={(v) => setData({ ...data, profile: { ...data.profile, participatesInLotteries: v } })} />
            </div>
            <div>
              <p className="text-sm text-slate-700 mb-2">¿Tiene inversiones?</p>
              <Toggle value={data.profile.hasInvestments} onChange={(v) => setData({ ...data, profile: { ...data.profile, hasInvestments: v } })} />
            </div>
          </div>
        </section>

        {/* Trusted contacts */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <i className="pi pi-users text-blue-600" /> Contactos de confianza
            </h2>
            <button
              type="button"
              onClick={() => setData({ ...data, profile: { ...data.profile, trustedContacts: [...data.profile.trustedContacts, { name: '', phone: '' }] } })}
              className="text-xs text-blue-700 font-semibold hover:text-blue-800 flex items-center gap-1"
            >
              <i className="pi pi-plus-circle" /> Agregar
            </button>
          </div>
          <div className="space-y-3">
            {data.profile.trustedContacts.map((c, i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    value={c.name}
                    onChange={(e) => updateContact(i, 'name', e.target.value)}
                    placeholder="Nombre"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    value={c.phone}
                    onChange={(e) => updateContact(i, 'phone', e.target.value)}
                    placeholder="Teléfono"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setData({ ...data, profile: { ...data.profile, trustedContacts: data.profile.trustedContacts.filter((_, idx) => idx !== i) } })}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <i className="pi pi-trash text-sm" />
                </button>
              </div>
            ))}
            {data.profile.trustedContacts.length === 0 && (
              <p className="text-sm text-slate-400 italic">Ningún contacto agregado.</p>
            )}
          </div>
        </section>

        {/* Family keyword */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <i className="pi pi-key text-blue-600" /> Palabra clave familiar
          </h2>
          <input
            value={data.profile.familyKeyword}
            onChange={(e) => setData({ ...data, profile: { ...data.profile, familyKeyword: e.target.value } })}
            placeholder="Ej: girasol"
            className="w-full max-w-xs px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </section>

        {/* Danger zone */}
        <section className="bg-white rounded-xl border border-red-200 p-5">
          <h2 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
            <i className="pi pi-exclamation-triangle" /> Zona de peligro
          </h2>
          <p className="text-sm text-slate-500 mb-4">Eliminar tu cuenta es una acción irreversible. Se borrarán todos tus datos.</p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="border border-red-300 text-red-600 hover:bg-red-50 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Eliminar mi cuenta
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-700 mb-3">¿Confirmas que quieres eliminar tu cuenta?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {deleting && <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Sí, eliminar
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
