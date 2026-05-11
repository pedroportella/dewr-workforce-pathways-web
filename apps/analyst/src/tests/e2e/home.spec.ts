import { test } from './helpers/testHarness';

test.describe('DEWR workforce pathways intelligence', () => {
  test('loads the mocked API dataset into the Vue shell', async ({ explorer }) => {
    await explorer.goto();
    await explorer.expectShell();
    await explorer.expectPathwayControls();
    await explorer.expectAcceleratorKpis();
    await explorer.expectRegionalMap();
  });

  test('updates KPI cards when a different workforce scenario is selected', async ({ explorer }) => {
    await explorer.goto();
    await explorer.chooseYouthScenario();
    await explorer.expectYouthScenarioKpis();
  });

  test('updates map evidence encoding when layer toggles change', async ({ explorer }) => {
    await explorer.goto();
    await explorer.expectRegionalMap();
    await explorer.chooseParticipantOutcomesLayer();
    await explorer.expectOutcomesMapEncoding();
  });
});
