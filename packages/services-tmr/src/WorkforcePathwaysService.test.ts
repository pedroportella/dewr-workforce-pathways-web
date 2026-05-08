import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createMockWorkforcePathwaysService,
  createWorkforcePathwaysService
} from './WorkforcePathwaysService';
import {
  mockWorkforcePathwaysDataset,
  mockWorkforcePathwaysDatasetResponse
} from './mockScenarioData';
import { DEWR_WORKFORCE_DATASET_PATH } from './env';
import { mapWorkforcePathwaysDatasetDto } from './utils/mapScenarioDatasetDto';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('createMockWorkforcePathwaysService', () => {
  it('returns pathway scenarios and regional intelligence features', async () => {
    const dataset = await createMockWorkforcePathwaysService().getPathwaysDataset();
    expect(dataset.scenarios.length).toBeGreaterThan(1);
    expect(dataset.regions.features.length).toBeGreaterThan(0);
  });
});

describe('createWorkforcePathwaysService', () => {
  it('fetches the DEWR API-shaped dataset endpoint and maps it for the frontend', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(mockWorkforcePathwaysDatasetResponse), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      })
    );

    vi.stubGlobal('fetch', fetchMock);

    const dataset = await createWorkforcePathwaysService().getPathwaysDataset();

    expect(dataset).toEqual(mockWorkforcePathwaysDataset);
    expect(dataset.regions.features[1].properties).toEqual(
      expect.objectContaining({
        id: 'sa4-logan-beaudesert',
        primaryIndustry: 'Construction',
        skillsGapIndex: 66,
        cohort: 'participant'
      })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `https://no-fallback-for-dewr-api${DEWR_WORKFORCE_DATASET_PATH}`,
      expect.objectContaining({
        method: 'GET',
        credentials: 'include'
      })
    );
  });
});

describe('mapWorkforcePathwaysDatasetDto', () => {
  it('maps API DTO fields into scenario summaries, KPI lookup and GeoJSON point features', () => {
    const dataset = mapWorkforcePathwaysDatasetDto(mockWorkforcePathwaysDatasetResponse);

    expect(dataset.scenarios[0]).toEqual({
      id: 'baseline-support',
      name: 'Baseline employment services',
      description: 'Current caseload, provider coverage and training pipeline settings.',
      horizonQuarter: '2026 Q2'
    });
    expect(dataset.kpisByScenario['regional-skills-accelerator'].trainingCompletions).toBe(12880);
    expect(dataset.regions.type).toBe('FeatureCollection');
    expect(dataset.regions.features[2].properties.cohort).toBe('youth');
  });
});
