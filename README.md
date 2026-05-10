# DEWR Workforce Pathways Web

Vue 3 + TypeScript analyst workspace for the Workforce Pathways Intelligence prototype.

## What it demonstrates

- pnpm workspace architecture with app, UI library, design tokens, services, map and utilities packages.
- Vue 3 app using preserved workspace package boundaries.
- REST DTO mapping in `@dewr/services-workforce`, with MSW mock API handlers.
- Focused unit tests and Playwright page-object coverage.
- Senior Software Engineer alignment: Vue3, source control friendly structure, REST integration, automated testing and enterprise documentation.

## Run

```bash
pnpm install
NEXT_PUBLIC_USE_API_MOCKS=true pnpm dev
```

The app runs at `http://127.0.0.1:5173`.

## Docker

```bash
docker build -t dewr-workforce-pathways-web:local .
docker run --rm -p 8080:80 dewr-workforce-pathways-web:local
```

## CI / GitHub Actions

The repository uses GitHub Actions to validate the workspace on `main` and pull requests.

CI uses Node.js 20.19.0 with Corepack-managed `pnpm@9.15.4`, matching the `packageManager` field in `package.json`. The Playwright end-to-end job is pinned to `ubuntu-22.04` because the current `@playwright/test@1.42.1` Linux dependency installer requests `libasound2`, which is no longer available under that name on Ubuntu 24.04 (`ubuntu-latest` / Noble).

The CI workflow runs:

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`
- `pnpm build`
- Docker image build
- `pnpm exec playwright install --with-deps chromium`
- `pnpm test:e2e`

Playwright HTML output is published as a workflow artifact from `apps/analyst/playwright-report`.

For local handover checks, run:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

## Key packages

- `apps/analyst`: Vue 3 analyst experience.
- `packages/ui-library`: Vue UI primitives and shared CSS.
- `packages/services-workforce`: published as `@dewr/services-workforce`; DTOs, mapper, service client and mocks.
- `packages/map-engine`: Vue regional intelligence map component.
- `packages/ui-tokens`: preserved design token boundary.
