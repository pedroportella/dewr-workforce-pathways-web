import scenarioDatasetResponse from './mocks/data/scenario-dataset-response.json';
import type { WorkforcePathwaysDatasetResponseDto } from './dto';
import { mapWorkforcePathwaysDatasetDto } from './utils/mapScenarioDatasetDto';

export const mockWorkforcePathwaysDatasetResponse =
  scenarioDatasetResponse as WorkforcePathwaysDatasetResponseDto;

export const mockWorkforcePathwaysDataset =
  mapWorkforcePathwaysDatasetDto(mockWorkforcePathwaysDatasetResponse);
