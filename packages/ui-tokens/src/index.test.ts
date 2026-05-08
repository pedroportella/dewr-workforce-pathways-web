import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { qldThemeTokens, workforceStatusTokens } from "./index";

const sourceRoot = path.dirname(fileURLToPath(import.meta.url));

const readPackageFile = (...segments: string[]) =>
  readFileSync(path.join(sourceRoot, ...segments), "utf-8");

describe("@dewr/ui-tokens", () => {
  it("exports stable frontend token references", () => {
    expect(workforceStatusTokens).toEqual({
      strongOutcome: "var(--dewr-status-strong-outcome)",
      moderateOutcome: "var(--dewr-status-moderate-outcome)",
      skillsPressure: "var(--dewr-status-skills-pressure)",
      highNeed: "var(--dewr-status-high-need)",
      trainingPipeline: "var(--dewr-status-training-pipeline)",
      participantSupport: "var(--dewr-status-participant-support)",
    });

    expect(qldThemeTokens).toEqual({
      focus: "var(--QLD-color-light__focus)",
      heading: "var(--QLD-color-light__heading)",
      actionPrimary: "var(--QLD-color-light__action--primary)",
      background: "var(--QLD-color-light__background)",
    });
  });

  it("ships the CSS variables consumed by the app", () => {
    const styles = readPackageFile("styles.css");

    expect(styles).toContain("--dewr-status-strong-outcome");
    expect(styles).toContain("--dewr-status-participant-support");
    expect(styles).toContain("--QLD-color-light__action--primary");
    expect(styles).toContain("--QLD-color-dark__background");
  });

  it("keeps the QGDS SCSS source entrypoints available", () => {
    expect(existsSync(path.join(sourceRoot, "scss/styles/primitive.scss"))).toBe(true);
    expect(existsSync(path.join(sourceRoot, "scss/styles/qgds.scss"))).toBe(true);
    expect(existsSync(path.join(sourceRoot, "scss/styles/qld-default-palette.scss"))).toBe(true);

    expect(readPackageFile("scss/styles/primitive.scss")).toContain("$dimensionScale");
    expect(readPackageFile("scss/styles/qgds.scss")).toContain("$buttonBorderRadius");
    expect(readPackageFile("scss/styles/qld-default-palette.scss")).toContain(
      "$buttonPaletteBrightPrimaryDefaultBackground",
    );
  });
});
