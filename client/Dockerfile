# Build dependencies
FROM node:20-alpine AS production-dependencies-env
RUN corepack enable pnpm
COPY ./pnpm-workspace.yaml ./package.json ./pnpm-lock.yaml /app/
COPY ./shared/package.json /app/shared/package.json
COPY ./client/package.json /app/client/package.json
WORKDIR /app
RUN pnpm install --filter=heatos-client... --frozen-lockfile --prod

# Install all dependencies including dev
FROM node:20-alpine AS development-dependencies-env
RUN corepack enable pnpm
COPY ./pnpm-workspace.yaml ./package.json ./pnpm-lock.yaml /app/
COPY ./shared/ /app/shared/
COPY ./client/package.json /app/client/package.json
WORKDIR /app
RUN pnpm install --filter=heatos-client... --frozen-lockfile

# Build stage
FROM node:20-alpine AS build-env
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN corepack enable pnpm
COPY ./shared/ /app/shared/
COPY ./client/ /app/client/
COPY ./pnpm-workspace.yaml ./package.json ./pnpm-lock.yaml /app/
COPY --from=development-dependencies-env /app/ /app/
WORKDIR /app/shared
RUN pnpm build
WORKDIR /app
RUN pnpm run --filter=heatos-client build

# Production stage
FROM node:20-alpine
RUN corepack enable pnpm
COPY ./pnpm-workspace.yaml ./package.json ./pnpm-lock.yaml /app/
COPY ./shared/ /app/shared/
COPY ./client/package.json /app/client/package.json
COPY --from=production-dependencies-env /app/ /app/
COPY --from=build-env /app/client/build /app/client/build
WORKDIR /app
CMD ["pnpm", "--filter=heatos-client", "start"]