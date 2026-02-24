FROM node:20-alpine AS builder

WORKDIR /app

# Copy root config and package files
COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm install
RUN npm install --os=linux --cpu=x64 --libc=musl lightningcss-linux-x64-musl @tailwindcss/oxide-linux-x64-musl
COPY apps/admin ./apps/admin
COPY packages/shared ./packages/shared

# Build shared and admin
RUN npm run build -w packages/shared
RUN npm run build -w apps/admin

# Final Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/admin/public ./apps/admin/public
COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static

EXPOSE 3001

ENV PORT=3001

# Next.js standalone server
CMD ["node", "server.js"]
