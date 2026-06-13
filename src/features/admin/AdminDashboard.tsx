import { useEffect, useState } from 'react';
import { getAdminMetrics, getAdminUsers } from '../../api/admin';
import type { AdminMetrics, AdminUser } from '../../types';

function MetricCard({
  label,
  value,
  icon,
  color,
  sub,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <i className={`pi ${icon} text-lg`} />
        </div>
      </div>

      <p className="text-3xl font-bold text-slate-900">
        {value.toLocaleString('es-MX')}
      </p>

      <p className="text-sm font-medium text-slate-700 mt-0.5">
        {label}
      </p>

      {sub && (
        <p className="text-xs text-slate-400 mt-0.5">
          {sub}
        </p>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminMetrics(), getAdminUsers()])
      .then(([m, u]) => {
        console.log('Metrics:', m);
        console.log('Users response:', u);

        setMetrics(m);

        // Si la API responde { users: [...] }
        setUsers(u.users || []);
      })
      .catch((error) => {
        console.error('Error cargando dashboard:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1 text-sm">
          Métricas globales de PugGuardian.
        </p>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <MetricCard
            label="Usuarios totales"
            value={metrics.totalUsers}
            icon="pi-users"
            color="bg-purple-100 text-purple-600"
          />

          <MetricCard
            label="Análisis realizados"
            value={metrics.totalAnalyses}
            icon="pi-search"
            color="bg-violet-100 text-violet-600"
          />

          <MetricCard
            label="Estafas detectadas"
            value={metrics.fraudsDetected}
            icon="pi-ban"
            color="bg-red-100 text-red-600"
            sub={
              metrics.totalAnalyses > 0
                ? `${(
                    (metrics.fraudsDetected / metrics.totalAnalyses) *
                    100
                  ).toFixed(1)}% del total`
                : '0% del total'
            }
          />

          <MetricCard
            label="Activos este mes"
            value={metrics.activeUsersThisMonth}
            icon="pi-chart-line"
            color="bg-emerald-100 text-emerald-600"
            sub={
              metrics.totalUsers > 0
                ? `${(
                    (metrics.activeUsersThisMonth / metrics.totalUsers) *
                    100
                  ).toFixed(1)}% del total`
                : '0% del total'
            }
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">
            Usuarios registrados
          </h2>

          <p className="text-sm text-slate-500 mt-0.5">
            {users.length} usuarios en total
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Usuario
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Persona protegida
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Registro
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">
                  Análisis
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">
                  Estafas
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {u.fullName}
                      </p>

                      <p className="text-slate-500 text-xs mt-0.5">
                        {u.email}
                      </p>

                      <p className="text-slate-400 text-xs">
                        {u.phone}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-slate-700">
                        {u.protectedPerson?.name}
                      </p>

                      <p className="text-slate-400 text-xs mt-0.5">
                        {u.protectedPerson?.phone}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(u.registeredAt)}
                    </td>

                    <td className="px-5 py-4 text-right font-semibold text-slate-900">
                      {u.totalAnalyses}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span
                        className={`font-semibold ${
                          u.fraudsBlocked > 0
                            ? 'text-red-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {u.fraudsBlocked}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}