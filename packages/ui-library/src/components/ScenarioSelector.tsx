import type { ScenarioSummary } from '@tmr/services-tmr';

export interface ScenarioSelectorProps {
  scenarios: ScenarioSummary[];
  selectedScenarioId: string;
  onChange: (scenarioId: string) => void;
}

export function ScenarioSelector({ scenarios, selectedScenarioId, onChange }: ScenarioSelectorProps) {
  return (
    <label className="tmr-field">
      <span className="tmr-field__label">Scenario</span>
      <select className="tmr-select" value={selectedScenarioId} onChange={(event) => onChange(event.target.value)}>
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
        ))}
      </select>
    </label>
  );
}
