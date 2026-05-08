import type { CohortId } from './types';

export interface PathwayScenarioDto {
  scenarioId: string;
  displayName: string;
  summary: string;
  horizonQuarter: string;
}

export interface WorkforceKpisDto {
  scenarioId: string;
  metrics: {
    employmentRatePercent: number;
    vacancies: number;
    skillsGapIndex: number;
    trainingCompletions: number;
    sustainedOutcomeRatePercent: number;
  };
}

export interface RegionInsightDto {
  regionId: string;
  displayName: string;
  state: string;
  primaryIndustry: string;
  employmentRatePercent: number;
  vacancies: number;
  skillsGapIndex: number;
  trainingCompletions: number;
  sustainedOutcomeRatePercent: number;
  participantCount: number;
  cohort: CohortId;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface WorkforcePathwaysDatasetResponseDto {
  scenarios: PathwayScenarioDto[];
  kpis: WorkforceKpisDto[];
  regions: {
    features: RegionInsightDto[];
  };
}
