FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci --ignore-scripts --workspace=apps/api --workspace=packages/database --workspace=packages/shared

COPY packages/database ./packages/database
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Prisma generate only needs a valid URL format, not a live DB
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npm run generate --workspace=packages/database
RUN npm run build --workspace=apps/api

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages ./packages

EXPOSE 4000
CMD ["node", "dist/server.js"]
