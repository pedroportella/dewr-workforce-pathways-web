import { test as base, expect } from '@playwright/test';
import { WorkforcePathwaysPO } from './WorkforcePathwaysPO';

type Fixtures = {
  explorer: WorkforcePathwaysPO;
};

export const test = base.extend<Fixtures>({
  explorer: async ({ page }, provide) => {
    page.setDefaultTimeout(12_000);
    await provide(new WorkforcePathwaysPO(page));
  }
});

export { expect };
