FROM node:20-alpine AS builder

WORKDIR /app

# Copy root config and package files
COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/storefront/package.json ./apps/storefront/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/storefront ./apps/storefront
COPY packages/shared ./packages/shared

# Build shared and storefront
RUN npm run build -w packages/shared
RUN npm run build -w apps/storefront

# Final Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/storefront/public ./apps/storefront/public
COPY --from=builder /app/apps/storefront/.next/standalone ./
COPY --from=builder /app/apps/storefront/.next/static ./apps/storefront/.next/static

EXPOSE 3000

ENV PORT=3000

# Next.js standalone server
CMD ["node", "server.js"]
