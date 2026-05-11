# DEWR Workforce Pathways Web

Vue 3 + TypeScript analyst workspace for the DEWR Workforce Pathways Intelligence prototype.

## What it demonstrates

- pnpm workspace architecture across app, UI library, design tokens, services, map and utility packages.
- Vue 3 analyst experience using preserved workspace package boundaries.
- REST DTO mapping in `@dewr/services-workforce`, with MSW mock API handlers.
- MapLibre GL JS regional intelligence map with GeoJSON and heatmap overlays.
- Focused unit tests and Playwright page-object end-to-end coverage.
- Docker and CI evidence for repeatable delivery.

## Architecture

The web repository keeps app, service and UI concerns separated:

- `apps/analyst`: Vue 3 analyst application.
- `packages/services-workforce`: DTOs, mapper, service client and MSW mocks.
- `packages/map-engine`: MapLibre regional intelligence map component.
- `packages/ui-library`: Vue UI primitives and shared CSS.
- `packages/ui-tokens`: preserved design token boundary.
- `packages/utils`: small shared formatting utilities.

## Prerequisites

- Node.js 20.19+
- pnpm 9.15.4, managed via Corepack
- Docker, for container review
- Playwright Chromium dependencies, required only for local end-to-end tests

## Local setup

```bash
pnpm install
NEXT_PUBLIC_USE_API_MOCKS=true pnpm dev
```

The app runs at `http://127.0.0.1:5173`.

Useful local checks:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

## Docker

For mock-free API integration, start `dewr-workforce-intelligence-services` first on port `4000`, then run:

```bash
docker build -t dewr-workforce-pathways-web:local .
docker run --rm -p 8080:80 dewr-workforce-pathways-web:local
```

Container URL: `http://localhost:8080`.

The production image bakes `NEXT_PUBLIC_DEWR_API=http://localhost:4000` and `NEXT_PUBLIC_USE_API_MOCKS=false` by default.

## Configuration

The app reads public build-time environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_DEWR_API` | `http://localhost:4000` in Docker builds | Workforce intelligence API base URL |
| `NEXT_PUBLIC_USE_API_MOCKS` | `false` in Docker builds | Set to `true` for MSW-backed local development |

## CI / GitHub Actions

`.github/workflows/ci.yml` runs on pushes to `main` and pull requests to `main`.

The install-and-verify job uses Node.js 20.19.0 and Corepack-managed `pnpm@9.15.4`, then runs:

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`
- `pnpm build`
- Docker image build as `dewr-workforce-pathways-web:ci`

The Playwright job runs on `ubuntu-22.04`, installs Chromium dependencies, runs `pnpm test:e2e`, and uploads `apps/analyst/playwright-report` as an artifact.

## npm scripts

| Script | Description |
| --- | --- |
| `dev` | Start the analyst Vite dev server |
| `build` | Build workspace packages and the analyst app |
| `lint` | Run workspace lint checks |
| `test` | Run workspace unit and contract tests |
| `test:e2e` | Run Playwright end-to-end tests |
| `typecheck` | Type-check workspace packages and app |

## Troubleshooting

- Rebuild the Docker image after frontend code changes; nginx serves static files from the last build.
- Use `NEXT_PUBLIC_USE_API_MOCKS=true pnpm dev` when the services API is not running.
- Start `dewr-workforce-intelligence-services` on `localhost:4000` before testing the Docker image without mocks.
- If Playwright dependencies are missing locally, run `pnpm exec playwright install --with-deps chromium`.
