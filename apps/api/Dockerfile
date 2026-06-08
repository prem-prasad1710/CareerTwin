FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci --ignore-scripts --workspace=apps/api --workspace=packages/database --workspace=packages/shared

# Copy source
COPY packages/database ./packages/database
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build (Prisma generate only needs a valid URL format)
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npm run generate --workspace=packages/database
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/api

# ── Runtime ──────────────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Prisma client needs the schema for migrations
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages ./packages

# startup script: migrate then start
RUN printf '#!/bin/sh\nset -e\necho "Running Prisma migrations..."\n./node_modules/.bin/prisma migrate deploy --schema ./packages/database/prisma/schema.prisma\necho "Starting server..."\nexec node dist/server.js\n' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 4000
CMD ["/app/start.sh"]
