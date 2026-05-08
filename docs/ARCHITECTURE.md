# Architecture

The frontend is a Vue 3 and TypeScript pnpm workspace for DEWR workforce pathway analysis.

## Workspace Shape

- `apps/analyst` contains the analyst-facing Vue app.
- `packages/services-workforce` contains REST DTOs, mapper utilities, service client code and MSW handlers.
- `packages/ui-library` contains Vue UI primitives and shared CSS.
- `packages/ui-tokens` preserves the design token boundary.
- `packages/map-engine` renders regional workforce intelligence features.
- `packages/utils` holds shared formatting helpers.

## Integration

The app calls the service package, which maps API DTOs into frontend view models. During local
development, MSW intercepts the same REST-shaped URL and serves workforce mock JSON.
