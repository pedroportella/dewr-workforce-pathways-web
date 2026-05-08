export type WorkforceLayerId = 'employment' | 'skills' | 'training' | 'outcomes';
export type CohortId = 'all' | 'youth' | 'matureAge' | 'firstNations' | 'participant';

export interface PathwayScenario {
  id: string;
  name: string;
  description: string;
  horizonQuarter: string;
}

export interface WorkforceKpis {
  employmentRatePercent: number;
  vacancies: number;
  skillsGapIndex: number;
  trainingCompletions: number;
  sustainedOutcomeRatePercent: number;
}

export interface RegionInsightProperties {
  id: string;
  name: string;
  state: string;
  primaryIndustry: string;
  employmentRatePercent: number;
  vacancies: number;
  skillsGapIndex: number;
  trainingCompletions: number;
  sustainedOutcomeRatePercent: number;
  participantCount: number;
  cohort: CohortId;
}

export interface RegionInsightFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: RegionInsightProperties;
}

export interface RegionInsightFeatureCollection {
  type: 'FeatureCollection';
  features: RegionInsightFeature[];
}

export interface WorkforcePathwaysDataset {
  scenarios: PathwayScenario[];
  kpisByScenario: Record<string, WorkforceKpis>;
  regions: RegionInsightFeatureCollection;
}
