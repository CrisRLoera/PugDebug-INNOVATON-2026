import { useEffect, useState } from 'react';
import { getAdminUsers } from '../../api/admin';
import { VerdictBadge } from '../../components/ui/StatusBadge';
import type { AdminUser } from '../../types';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
}

export function UserList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAdminUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.protectedPerson.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-slate-500 mt-1 text-sm">{users.length} usuarios registrados.</p>
        </div>
        <div className="relative flex-shrink-0 w-64">
          <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuario..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <i className="pi pi-users text-4xl mb-3 block" />
          <p className="text-sm">No se encontraron usuarios.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((u) => (
            <div key={u.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {u.fullName.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{u.fullName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{u.email} · {u.phone}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 text-right">
                  <div className="hidden sm:block">
                    <p className="text-lg font-bold text-slate-900">{u.totalAnalyses}</p>
                    <p className="text-xs text-slate-500">análisis</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-lg font-bold ${u.fraudsBlocked > 0 ? 'text-red-600' : 'text-slate-400'}`}>{u.fraudsBlocked}</p>
                    <p className="text-xs text-slate-500">estafas</p>
                  </div>
                  <i className={`pi pi-chevron-${expandedId === u.id ? 'up' : 'down'} text-slate-400 text-xs`} />
                </div>
              </button>

              {expandedId === u.id && (
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50 grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Persona protegida</p>
                    <p className="font-medium text-slate-900">{u.protectedPerson.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{u.protectedPerson.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Registrado</p>
                    <p className="text-slate-700">{formatDate(u.registeredAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Actividad</p>
                    <p className="text-slate-700">{u.totalAnalyses} análisis · {u.fraudsBlocked} estafas bloqueadas</p>
                    {u.fraudsBlocked > 0 && (
                      <div className="mt-1.5">
                        <VerdictBadge verdict="estafa" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
