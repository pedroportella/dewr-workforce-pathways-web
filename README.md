# DEWR Workforce Pathways Web

Vue 3 + TypeScript analyst workspace for the Workforce Pathways Intelligence prototype.

## What it demonstrates

- pnpm workspace architecture with app, UI library, design tokens, services, map and utilities packages.
- Vue 3 app rewritten from the React transport base while preserving package boundaries.
- REST DTO mapping in `@dewr/services-workforce`, with MSW mock API handlers.
- Focused unit tests and Playwright page-object coverage.
- Senior Software Engineer alignment: Vue3, source control friendly structure, REST integration, automated testing and enterprise documentation.

## Run

```bash
pnpm install
NEXT_PUBLIC_USE_API_MOCKS=true pnpm dev
```

The app runs at `http://127.0.0.1:5173`.

## Key packages

- `apps/analyst`: Vue 3 analyst experience.
- `packages/ui-library`: Vue UI primitives and shared CSS.
- `packages/services-tmr`: published as `@dewr/services-workforce`; DTOs, mapper, service client and mocks.
- `packages/map-engine`: Vue regional intelligence map component.
- `packages/ui-tokens`: preserved design token boundary.
