<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RegionalInsightMap } from '@dewr/map-engine';
import {
  createWorkforcePathwaysService,
  type RegionInsightProperties,
  type WorkforceLayerId,
  type WorkforcePathwaysDataset
} from '@dewr/services-workforce';
import { DewrButton, DewrKpiCard, DewrPanel, DewrShell } from '@dewr/ui-library';
import { formatNumber } from '@dewr/utils';

const service = createWorkforcePathwaysService();

const dataset = ref<WorkforcePathwaysDataset | null>(null);
const selectedScenarioId = ref('regional-skills-accelerator');
const activeLayers = ref<WorkforceLayerId[]>(['employment', 'skills', 'training']);
const selectedRegion = ref<RegionInsightProperties | null>(null);
const loadError = ref<string | null>(null);

onMounted(async () => {
  try {
    dataset.value = await service.getPathwaysDataset();
    selectedRegion.value = dataset.value.regions.features[0]?.properties ?? null;
  } catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : 'Unable to load workforce pathways dataset.';
  }
});

const selectedScenario = computed(() =>
  dataset.value?.scenarios.find((scenario) => scenario.id === selectedScenarioId.value)
);

const selectedKpis = computed(() =>
  dataset.value ? dataset.value.kpisByScenario[selectedScenarioId.value] : undefined
);

const scenarioOptions = computed(() =>
  dataset.value?.scenarios.map((scenario) => ({
    label: `${scenario.name} (${scenario.horizonQuarter})`,
    value: scenario.id
  })) ?? []
);

const layerOptions: { label: string; value: WorkforceLayerId }[] = [
  { label: 'Employment', value: 'employment' },
  { label: 'Skills', value: 'skills' },
  { label: 'Training', value: 'training' },
  { label: 'Participant outcomes', value: 'outcomes' }
];

function toggleLayer(layer: WorkforceLayerId) {
  activeLayers.value = activeLayers.value.includes(layer)
    ? activeLayers.value.filter((item) => item !== layer)
    : [...activeLayers.value, layer];
}
</script>

<template>
  <DewrShell title="DEWR Workforce Pathways Intelligence">
    <section class="dewr-hero">
      <div>
        <p class="dewr-eyebrow">Senior Software Engineer prototype</p>
        <h1>Regional pathways intelligence for employment, skills and outcomes</h1>
        <p>
          A Vue 3 and TypeScript analyst workspace wired to REST-shaped DTOs, mock API handlers,
          reusable UI boundaries and delivery evidence for enterprise workforce decisions.
        </p>
      </div>
      <DewrButton href="#regional-insights" variant="secondary">Open intelligence view</DewrButton>
    </section>

    <main v-if="loadError" class="dewr-loading">{{ loadError }}</main>
    <main v-else-if="!dataset || !selectedKpis || !selectedScenario" class="dewr-loading">
      Loading workforce pathways dataset...
    </main>
    <template v-else>
      <section class="dewr-kpi-grid" aria-label="Workforce pathway KPIs">
        <DewrKpiCard label="Employment rate" :value="`${selectedKpis.employmentRatePercent.toFixed(1)}%`" trend="+4.4 pts against baseline" />
        <DewrKpiCard label="Open vacancies" :value="formatNumber(selectedKpis.vacancies)" trend="Demand pressure by SA4" />
        <DewrKpiCard label="Skills gap index" :value="String(selectedKpis.skillsGapIndex)" trend="Lower is stronger" />
        <DewrKpiCard label="Training completions" :value="formatNumber(selectedKpis.trainingCompletions)" trend="Quarterly pipeline" />
        <DewrKpiCard label="Sustained outcomes" :value="`${selectedKpis.sustainedOutcomeRatePercent.toFixed(1)}%`" trend="26 week outcome rate" />
      </section>

      <section id="regional-insights" class="dewr-workspace">
        <DewrPanel title="Pathway controls">
          <div id="pathway-controls" class="dewr-control-stack">
            <label class="dewr-field">
              <span>Scenario</span>
              <select v-model="selectedScenarioId">
                <option v-for="scenario in scenarioOptions" :key="scenario.value" :value="scenario.value">
                  {{ scenario.label }}
                </option>
              </select>
            </label>
            <p class="dewr-scenario-summary">{{ selectedScenario.description }}</p>
            <fieldset class="dewr-layer-list">
              <legend>Evidence layers</legend>
              <label v-for="layer in layerOptions" :key="layer.value">
                <input
                  type="checkbox"
                  :checked="activeLayers.includes(layer.value)"
                  @change="toggleLayer(layer.value)"
                />
                <span>{{ layer.label }}</span>
              </label>
            </fieldset>
          </div>
        </DewrPanel>

        <RegionalInsightMap
          :regions="dataset.regions"
          :active-layers="activeLayers"
          @region-selected="selectedRegion = $event"
        />

        <DewrPanel title="Selected region">
          <dl v-if="selectedRegion" class="dewr-region-detail">
            <div><dt>Region</dt><dd>{{ selectedRegion.name }}</dd></div>
            <div><dt>Industry</dt><dd>{{ selectedRegion.primaryIndustry }}</dd></div>
            <div><dt>Participants</dt><dd>{{ formatNumber(selectedRegion.participantCount) }}</dd></div>
            <div><dt>Training completions</dt><dd>{{ formatNumber(selectedRegion.trainingCompletions) }}</dd></div>
            <div><dt>Sustained outcomes</dt><dd>{{ selectedRegion.sustainedOutcomeRatePercent.toFixed(1) }}%</dd></div>
          </dl>
        </DewrPanel>
      </section>

      <section id="delivery-evidence" class="dewr-delivery">
        <h2>Delivery evidence</h2>
        <p>
          The prototype keeps REST integration, DTO mapping, mock APIs, source-controlled package
          boundaries, unit tests and Playwright coverage visible so Agile delivery decisions can be
          reviewed by engineering and business stakeholders together.
        </p>
      </section>
    </template>
  </DewrShell>
</template>
