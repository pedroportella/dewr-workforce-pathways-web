import { http, HttpResponse } from 'msw';
import { DEWR_WORKFORCE_DATASET_PATH } from '../env';
import { mockWorkforcePathwaysDatasetResponse } from '../mockScenarioData';

export const workforceHandlers = [
  http.get(`*${DEWR_WORKFORCE_DATASET_PATH}`, () =>
    HttpResponse.json(mockWorkforcePathwaysDatasetResponse, { status: 200 })
  )
];
