FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN corepack enable && pnpm install --frozen-lockfile=false
RUN pnpm build

FROM nginx:1.27-alpine
COPY --from=build /app/apps/analyst/dist /usr/share/nginx/html
EXPOSE 80
