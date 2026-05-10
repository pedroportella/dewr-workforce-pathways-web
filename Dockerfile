FROM node:20.19-alpine AS build

WORKDIR /app

ARG NEXT_PUBLIC_DEWR_API=http://localhost:4000
ARG NEXT_PUBLIC_USE_API_MOCKS=false

ENV NEXT_PUBLIC_DEWR_API=$NEXT_PUBLIC_DEWR_API
ENV NEXT_PUBLIC_USE_API_MOCKS=$NEXT_PUBLIC_USE_API_MOCKS

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages

RUN corepack enable \
  && corepack prepare pnpm@9.15.4 --activate \
  && pnpm install --frozen-lockfile \
  && pnpm build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/analyst/dist /usr/share/nginx/html

EXPOSE 80
