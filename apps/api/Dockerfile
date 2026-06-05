FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/database/package*.json ./packages/database/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci --workspace=apps/api --workspace=packages/database --workspace=packages/shared
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
RUN npm run generate --workspace=packages/database
RUN npm run build --workspace=apps/api

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database/node_modules/.prisma ./node_modules/.prisma
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/main.js"]
