# Crop App - AI Agent Context

Legal/court management system (articles, legal cases, courts) with GraphQL API.

## Monorepo Structure

- **Package manager:** Bun 1.3.5+
- **Build system:** Turborepo + Bun workspaces
- **Linter/Formatter:** Biome — run `bun run lint` at root before committing
- **Workspaces:** `apps/*`, `packages/*`

### Apps

| App | Path | Framework | Dev command |
|-----|------|-----------|-------------|
| Backend | `apps/backend` | Hono + GraphQL Yoga + Pothos | `bun run dev` (wrangler, port 7000) |
| Next.js | `apps/next` | Next.js 16 + React 19 | `bun run dev` (port 3000) |
| TanStack | `apps/frontend` | TanStack Start (Vite 8 + Nitro) | `bun run dev` (port 3000) |

### Shared packages
- `@repo/schemas` — Zod validation schemas (`packages/schemas/`)
- `@repo/biome-config` — Shared Biome configs (`packages/biome-config/`)

## Backend (`apps/backend`)

**Runtime:** Bun + Cloudflare Workers (dual mode: `src/entries/edge.ts` for Workers, `src/entries/node.ts` for local Bun)

**Stack:** Hono, GraphQL Yoga, Pothos (code-first), Drizzle ORM, Better Auth, Zod 4.x

**Architecture:** Hexagonal — `src/domain/`, `src/application/`, `src/infrastructure/`

**Database:** SQLite via Drizzle (D1 on Cloudflare, libSQL locally)
- Schema: `src/domain/db/schema.ts`
- Migrations: `drizzle/` directory
- Generate: `bun run db:generate`, Migrate local: `bun run db:migrate:local`

**GraphQL schema pattern:**
```
src/infrastructure/graphql/schema/{resource}/
├── model.ts      # Pothos type definitions
├── query.ts      # Query resolvers
├── mutation.ts   # Mutation resolvers
└── inputs.ts     # Input types
```

**Key scripts:**
```bash
bun run dev:edge                # Wrangler dev (port 7000)
bun run dev:node                # Bun local mode (--watch)
bun run build                   # Build both edge + node
bun run build:edge              # Wrangler dry-run build
bun run build:node              # Bun bundle build
bun run start:node              # Run node build
bun run codegen                 # gen-schema + graphql-codegen + post-codegen
bun run edgecheck               # Wrangler deploy --dry-run
bun run db:seed                 # Seed database
bun run db:generate             # Drizzle-kit generate
bun run db:migrate:local        # Wrangler d1 migrations apply --local
bun run db:migrate:remote       # Wrangler d1 migrations apply --remote
bun run db:migrate:node         # Node-mode migration script
```

**Auth scopes:** `public`, `authenticated`, `collaborator`, `admin` (Pothos ScopeAuthPlugin)

## Frontend Apps

### Next.js (`apps/next`)
- App Router, URQL for GraphQL, React Hook Form, Lexical editor
- Service layer: `src/service/service.client.ts` (URQL hooks) / `src/service.service.server.ts` (direct fetch)
- GraphQL queries: `src/service/gql/queries/`, mutations: `src/service/gql/mutations/`

### TanStack Frontend (`apps/frontend`)
- TanStack Router (file-based routes in `src/routes/`), TanStack Query, TanStack Form
- GraphQL client: `graphql-request` + generated SDK (`src/lib/graphql-client.ts`)
- REST client: Ky (`src/lib/http-client.ts`)
- Env validation: T3 Env (`src/env.ts`)
- Route generation: `bun run generate-routes` (tsr generate)
- Codegen: `bun run codegen` (uses `codegen.ts`, generates `src/service/gql/generated/gql.ts`)

**Codegen flow:**
1. Backend: `bun run gen-schema` → `schema.graphql`
2. TanStack: `bun run codegen` → typed SDK from `schema.graphql`
3. Next.js: backend `bun run codegen` → URQL typed documents

## Infrastructure (Docker Compose)

**Main (`docker-compose.yml`):** libSQL (port 8080), Garage S3 (ports 3900/3901), Redis (6379), Backend (7000)

**Dev (`docker-compose.dev.yml`):** Kong gateway (8000) → frontend(:3000) / api(:7000) / storage(:9000), PostgreSQL, Garage

Kong routes: `/` → frontend, `/api` → backend, `/crop-media` → storage

## Critical Gotchas

1. **NOT Prisma/PostgreSQL** — The old AGENTS.md is wrong. ORM is **Drizzle**, DB is **SQLite/libSQL**
2. **Two frontends exist** — `apps/next` (legacy) and `apps/frontend` (active migration target). See `PLAN-DE-MIGRACION.md`
3. **Storage is Garage** (S3-compatible), not MinIO
4. **Backend has two runtimes** — `wrangler dev` (edge/Workers) for production, `bun run dev:node` for local Node
5. **GraphQL schema is code-first** — Pothos builder in `src/infrastructure/graphql/builder.ts`, not schema-first
6. **Auth tables** (User, Session, Account, Verification) use Better Auth's naming convention (lowercase table names for sessions/accounts/verification, uppercase `User`/`Media`/`Article` for app tables)

## Code Style

- **Biome:** 120 char line width, 2-space indent, space-based
- **TypeScript:** Strict mode, prefer interfaces for object shapes
- **Imports:** External → `@repo/*` → relative (enforced by Biome)
- **Null → undefined:** Convert null to undefined for consistency
- **Files:** kebab-case utils, PascalCase components
- **Run `bun run lint`** before committing (Biome check --write)

## Commands Quick Reference

```bash
# Root
bun install
bun run lint                    # Biome across all packages
bun run typecheck               # tsgo --noEmit across all packages
bun run build                   # Build all apps (wrangler + next + vite/nitro)

# Backend
cd apps/backend
bun run dev:edge                # Wrangler dev (port 7000)
bun run dev:node                # Bun local mode
bun run build:edge              # Wrangler dry-run build
bun run build:node              # Bun bundle build
bun run codegen                 # Schema export + codegen
bun run db:migrate:local        # Drizzle migrations (local)

# Next.js
cd apps/next
bun run dev                     # Next.js dev

# TanStack
cd apps/frontend
bun run dev                     # Vite dev
bun run generate-routes         # Regenerate route tree
bun run codegen                 # GraphQL codegen
bun run test                    # Vitest
```
