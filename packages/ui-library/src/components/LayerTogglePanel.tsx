import type { TransportLayerId } from '@tmr/services-tmr';

export interface LayerTogglePanelProps {
  activeLayers: TransportLayerId[];
  onToggle: (layerId: TransportLayerId) => void;
}

const layerLabels: Record<TransportLayerId, string> = {
  congestion: 'Congestion',
  publicTransport: 'Public transport',
  freight: 'Freight',
  accessibility: 'Accessibility'
};

export function LayerTogglePanel({ activeLayers, onToggle }: LayerTogglePanelProps) {
  return (
    <section className="tmr-panel">
      <h2>Map layers</h2>
      <div className="tmr-layer-list">
        {(Object.keys(layerLabels) as TransportLayerId[]).map((layerId) => (
          <label className="tmr-check" key={layerId}>
            <input type="checkbox" checked={activeLayers.includes(layerId)} onChange={() => onToggle(layerId)} />
            <span>{layerLabels[layerId]}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
