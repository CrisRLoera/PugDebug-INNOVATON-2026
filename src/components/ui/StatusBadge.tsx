import type { Verdict, RiskLevel } from '../../types';

interface VerdictBadgeProps {
  verdict: Verdict;
}

export function VerdictBadge({ verdict }: VerdictBadgeProps) {
  const config = {
    seguro: { cls: 'bg-emerald-100 text-emerald-700', label: 'Seguro', icon: 'pi-check-circle' },
    sospechoso: { cls: 'bg-amber-100 text-amber-700', label: 'Sospechoso', icon: 'pi-exclamation-triangle' },
    estafa: { cls: 'bg-red-100 text-red-700', label: 'Estafa', icon: 'pi-times-circle' },
  }[verdict];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.cls}`}>
      <i className={`pi ${config.icon} text-xs`} />
      {config.label}
    </span>
  );
}

interface RiskBadgeProps {
  level: RiskLevel;
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const config = {
    bajo: { cls: 'bg-emerald-50 text-emerald-600 border border-emerald-200', label: 'Riesgo bajo' },
    medio: { cls: 'bg-amber-50 text-amber-600 border border-amber-200', label: 'Riesgo medio' },
    alto: { cls: 'bg-red-50 text-red-600 border border-red-200', label: 'Riesgo alto' },
  }[level];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.cls}`}>
      {config.label}
    </span>
  );
}
