import { mockWorkforcePathwaysDatasetResponse } from './mockScenarioData';
import type { WorkforcePathwaysDatasetResponseDto } from './dto';
import type { WorkforcePathwaysDataset } from './types';
import { DEWR_WORKFORCE_DATASET_PATH, withDewrApi } from './env';
import { ApiError } from './api/errors';
import { mapWorkforcePathwaysDatasetDto } from './utils/mapScenarioDatasetDto';

export interface WorkforcePathwaysService {
  getPathwaysDataset(): Promise<WorkforcePathwaysDataset>;
}

export function createWorkforcePathwaysService(): WorkforcePathwaysService {
  return {
    async getPathwaysDataset() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        const res = await fetch(withDewrApi(DEWR_WORKFORCE_DATASET_PATH), {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal
        });

        clearTimeout(timeout);

        const contentType = res.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');

        if (!res.ok) {
          let details: unknown = undefined;
          try {
            details = isJson ? await res.json() : await res.text();
          } catch {
            /* ignore parse errors */
          }

          throw new ApiError(`Request failed with status ${res.status}`, {
            code: 'HTTP',
            status: res.status,
            details
          });
        }

        if (!isJson) {
          throw new ApiError('Unexpected content type from DEWR API.', { code: 'UNKNOWN' });
        }

        const raw = (await res.json()) as WorkforcePathwaysDatasetResponseDto;
        return mapWorkforcePathwaysDatasetDto(raw);
      } catch (err: unknown) {
        clearTimeout(timeout);

        if (typeof err === 'object' && err !== null && (err as { name?: unknown }).name === 'AbortError') {
          throw new ApiError('The request timed out. Please try again.', { code: 'TIMEOUT', cause: err });
        }

        if (err instanceof ApiError) throw err;

        throw new ApiError('Cannot reach the DEWR workforce intelligence API.', {
          code: 'NETWORK',
          cause: err
        });
      }
    }
  };
}

export function createMockWorkforcePathwaysService(): WorkforcePathwaysService {
  return {
    async getPathwaysDataset() {
      await new Promise((resolve) => setTimeout(resolve, 80));
      return mapWorkforcePathwaysDatasetDto(mockWorkforcePathwaysDatasetResponse);
    }
  };
}
