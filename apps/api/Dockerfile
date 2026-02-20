FROM node:20-alpine AS builder

WORKDIR /app

# Copy root config and package files
COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Build shared and api
RUN npm run build -w packages/shared
RUN npm run build -w apps/api

# Final Stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/shared ./packages/shared

# Production dependencies only
RUN npm install --omit=dev

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "run", "start", "-w", "apps/api"]
