import type { CorridorLinkProperties } from '@tmr/services-tmr';

export interface LinkDetailPanelProps {
  link?: CorridorLinkProperties;
}

export function LinkDetailPanel({ link }: LinkDetailPanelProps) {
  if (!link) {
    return (
      <section className="tmr-panel">
        <h2>Link detail</h2>
        <p>Select a corridor link on the map to inspect speed, volume, delay and reliability.</p>
      </section>
    );
  }

  return (
    <section className="tmr-panel">
      <h2>{link.name}</h2>
      <dl className="tmr-detail-list">
        <div><dt>Corridor</dt><dd>{link.corridor}</dd></div>
        <div><dt>Mode</dt><dd>{link.mode}</dd></div>
        <div><dt>Base speed</dt><dd>{link.baseSpeedKph} km/h</dd></div>
        <div><dt>Scenario speed</dt><dd>{link.scenarioSpeedKph} km/h</dd></div>
        <div><dt>Volume</dt><dd>{link.volume} vehicles/passengers</dd></div>
        <div><dt>Delay</dt><dd>{link.delayMinutes} min</dd></div>
        <div><dt>Reliability</dt><dd>{link.reliabilityPercent}%</dd></div>
      </dl>
    </section>
  );
}
