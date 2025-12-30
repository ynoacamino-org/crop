FROM docker.io/oven/bun:latest AS builder


WORKDIR /app

COPY package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile

COPY src ./src
COPY prisma ./prisma
RUN bun prisma generate
RUN bun run build

FROM docker.io/oven/bun:slim AS runner
WORKDIR /app


COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["bun", "dist/index.js"]
