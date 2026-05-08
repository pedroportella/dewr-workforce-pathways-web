export interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  tone?: 'neutral' | 'good' | 'warning';
}

export function KpiCard({ label, value, delta, tone = 'neutral' }: KpiCardProps) {
  return (
    <article className={`tmr-kpi-card tmr-kpi-card--${tone}`}>
      <span className="tmr-kpi-card__label">{label}</span>
      <strong className="tmr-kpi-card__value">{value}</strong>
      {delta ? <span className="tmr-kpi-card__delta">{delta}</span> : null}
    </article>
  );
}
