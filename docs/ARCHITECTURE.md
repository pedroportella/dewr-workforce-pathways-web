# Architecture

The prototype mirrors the RBDM monorepo style while changing the domain from registry forms to transport analytics.

## Boundaries

- `apps/analyst` coordinates application state, service calls and map workflows.
- `packages/services-tmr` contains API contracts and mock data services.
- `packages/ui-library` contains dumb UI components.
- `packages/map-engine` isolates MapLibre usage and future deck.gl adapters.
- `packages/ui-tokens` provides reusable design tokens.
- `packages/utils` contains pure formatting and comparison helpers.

## Backend integration

The mock service can be replaced with FastAPI endpoints such as:

- `GET /api/scenarios`
- `GET /api/scenarios/{scenarioId}/kpis`
- `GET /api/scenarios/{scenarioId}/network?timePeriod=AM_PEAK`
- `GET /api/corridors/{corridorId}/links/{linkId}`

## Geospatial performance direction

Initial GeoJSON is acceptable for the prototype. Production-ready extensions should consider vector tiles, server-side simplification, request windowing, layer-level memoisation, binary transport formats, and deck.gl overlays for high-volume animated or point-based layers.
