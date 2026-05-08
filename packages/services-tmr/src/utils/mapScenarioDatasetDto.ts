import type { WorkforcePathwaysDatasetResponseDto } from '../dto';
import type { WorkforcePathwaysDataset } from '../types';

export function mapWorkforcePathwaysDatasetDto(
  dto: WorkforcePathwaysDatasetResponseDto
): WorkforcePathwaysDataset {
  return {
    scenarios: dto.scenarios.map((scenario) => ({
      id: scenario.scenarioId,
      name: scenario.displayName,
      description: scenario.summary,
      horizonQuarter: scenario.horizonQuarter
    })),
    kpisByScenario: Object.fromEntries(
      dto.kpis.map((item) => [
        item.scenarioId,
        {
          employmentRatePercent: item.metrics.employmentRatePercent,
          vacancies: item.metrics.vacancies,
          skillsGapIndex: item.metrics.skillsGapIndex,
          trainingCompletions: item.metrics.trainingCompletions,
          sustainedOutcomeRatePercent: item.metrics.sustainedOutcomeRatePercent
        }
      ])
    ),
    regions: {
      type: 'FeatureCollection',
      features: dto.regions.features.map((region) => ({
        type: 'Feature',
        geometry: region.geometry,
        properties: {
          id: region.regionId,
          name: region.displayName,
          state: region.state,
          primaryIndustry: region.primaryIndustry,
          employmentRatePercent: region.employmentRatePercent,
          vacancies: region.vacancies,
          skillsGapIndex: region.skillsGapIndex,
          trainingCompletions: region.trainingCompletions,
          sustainedOutcomeRatePercent: region.sustainedOutcomeRatePercent,
          participantCount: region.participantCount,
          cohort: region.cohort
        }
      }))
    }
  };
}
