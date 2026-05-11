import { expect, type Page } from '@playwright/test';

export class WorkforcePathwaysPO {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
    await expect(
      this.page.getByRole('heading', {
        name: 'Regional pathways intelligence for employment, skills and outcomes'
      })
    ).toBeVisible();
  }

  async expectShell() {
    await expect(this.page.getByText('DEWR Workforce Pathways Intelligence')).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Regional insights' })).toBeVisible();
  }

  async expectPathwayControls() {
    await expect(this.page.getByText('Pathway controls')).toBeVisible();
    await expect(this.page.getByLabel('Scenario')).toHaveValue('regional-skills-accelerator');
    await expect(this.page.getByText('Prioritises short-cycle training places')).toBeVisible();
  }

  async expectAcceleratorKpis() {
    await expect(this.page.getByText('Employment rate')).toBeVisible();
    await expect(this.page.getByText('66.8%')).toBeVisible();
    await expect(this.page.getByText('15,110')).toBeVisible();
    await expect(this.page.getByText('12,880')).toBeVisible();
  }

  async chooseYouthScenario() {
    await this.page.getByLabel('Scenario').selectOption('youth-pathways-boost');
  }

  async expectYouthScenarioKpis() {
    await expect(this.page.getByText('Targets youth cohorts with work experience')).toBeVisible();
    await expect(this.page.getByText('64.1%')).toBeVisible();
    await expect(this.page.getByText('16,240')).toBeVisible();
    await expect(this.page.getByText('11,320')).toBeVisible();
  }

  async expectRegionalMap() {
    await expect(this.page.getByRole('region', { name: 'Regional workforce intelligence map' })).toBeVisible();
    await expect(this.page.getByText('Employment + Skills + Training')).toBeVisible();
    await expect(this.page.getByText('Lower completions')).toBeVisible();
    await expect(this.page.getByText('Selected region')).toBeVisible();
    await expect(this.page.getByText('Brisbane Inner City')).toBeVisible();
  }

  async chooseParticipantOutcomesLayer() {
    await this.page.getByLabel('Participant outcomes').check();
  }

  async expectOutcomesMapEncoding() {
    await expect(this.page.getByText('Employment + Skills + Training + Participant outcomes')).toBeVisible();
    await expect(this.page.getByText('Lower sustained outcomes')).toBeVisible();
    await expect(this.page.getByText('57.8% sustained')).toBeVisible();
  }
}
