import type { TimePeriod } from '@tmr/services-tmr';

export interface TemporalPlaybackProps {
  value: TimePeriod;
  onChange: (value: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string }[] = [
  { value: 'AM_PEAK', label: 'AM peak' },
  { value: 'INTER_PEAK', label: 'Inter-peak' },
  { value: 'PM_PEAK', label: 'PM peak' }
];

export function TemporalPlayback({ value, onChange }: TemporalPlaybackProps) {
  return (
    <section className="tmr-panel">
      <h2>Temporal playback</h2>
      <div className="tmr-segmented-control" role="group" aria-label="Time period">
        {periods.map((period) => (
          <button key={period.value} type="button" className={period.value === value ? 'is-active' : ''} onClick={() => onChange(period.value)}>
            {period.label}
          </button>
        ))}
      </div>
    </section>
  );
}
