import { useEffect, useState } from 'react';
import { getActivity } from '../../api/activity';
import { useAuth } from '../../context/AuthContext';
import { VerdictBadge, RiskBadge } from '../../components/ui/StatusBadge';
import type { ActivityItem, ActivitySummary } from '../../types';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

function SummaryCard({ label, value, icon, color }: {
  label: string; value: number; icon: string; color: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <i className={`pi ${icon} text-lg`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors"
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
          ${item.type === 'audio' ? 'bg-violet-100 text-violet-600' : 'bg-purple-100 text-purple-600'}`}>
          <i className={`pi ${item.type === 'audio' ? 'pi-volume-up' : 'pi-envelope'} text-sm`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <VerdictBadge verdict={item.verdict} />
            <RiskBadge level={item.riskLevel} />
            <span className="text-xs text-slate-400 ml-auto">{formatDate(item.date)}</span>
          </div>
          <p className="text-sm text-slate-700 truncate">{item.preview}</p>
        </div>
        <i className={`pi pi-chevron-${expanded ? 'up' : 'down'} text-slate-400 text-xs mt-1 flex-shrink-0`} />
      </button>
      {expanded && item.details && (
        <div className={`border-t px-5 py-4 text-sm
          ${item.verdict === 'estafa' ? 'bg-red-50 border-red-100 text-red-700' :
            item.verdict === 'sospechoso' ? 'bg-amber-50 border-amber-100 text-amber-700' :
            'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
          <i className="pi pi-info-circle mr-2" />
          {item.details}
        </div>
      )}
    </div>
  );
}

export function UserDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getActivity(user.id)
      .then(({ items: i, summary: s }) => { setItems(i); setSummary(s); })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Hola, {user?.fullName.split(' ')[0]}</h1>
        <p className="text-slate-500 mt-1">Aquí está la actividad reciente de tu familiar.</p>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <SummaryCard label="Mensajes analizados" value={summary.total} icon="pi-search" color="bg-purple-100 text-purple-600" />
          <SummaryCard label="Seguros" value={summary.safe} icon="pi-check-circle" color="bg-emerald-100 text-emerald-600" />
          <SummaryCard label="Sospechosos" value={summary.suspicious} icon="pi-exclamation-triangle" color="bg-amber-100 text-amber-600" />
          <SummaryCard label="Estafas bloqueadas" value={summary.fraudsBlocked} icon="pi-ban" color="bg-red-100 text-red-600" />
        </div>
      )}

      {/* Activity list */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-3">Actividad reciente</h2>
        {items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <i className="pi pi-inbox text-4xl mb-3 block" />
            <p className="text-sm">Sin actividad registrada aún.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item) => <ActivityRow key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
