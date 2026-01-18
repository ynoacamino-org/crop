# Crop App - AI Agent Context

This is a **full-stack monorepo application** for managing posts and media (images, video, audio) built with modern technologies.

## Project Architecture

### Monorepo Structure
- **Build System:** Turborepo with Bun workspaces
- **Package Manager:** Bun 1.3.5+
- **Linter/Formatter:** Biome (configured in `packages/biome-config`)

### Applications

#### Backend (`apps/backend`)
- **Runtime:** Bun
- **Web Framework:** Hono (lightweight HTTP framework)
- **GraphQL:** GraphQL Yoga with Pothos Schema Builder (code-first, type-safe)
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** Better Auth with Google OAuth
- **File Storage:** MinIO (S3-compatible)
- **Validation:** Zod schemas (shared from `@repo/schemas`)

**Key Directories:**
- `src/routes/` - HTTP route handlers (auth, graphql, media upload)
- `src/schema/` - GraphQL schema modules (user, post, media)
- `src/lib/` - Core utilities (auth, db, storage, errors)
- `src/config/` - Environment and CORS configuration
- `prisma/` - Database schema and migrations

**GraphQL Schema Pattern:**
```
src/schema/{resource}/
├── model.ts      # GraphQL type definitions
├── query.ts      # Query resolvers
├── mutation.ts   # Mutation resolvers
└── inputs.ts     # Input type definitions
```

**Authorization:**
- Scope-based auth using Pothos plugin
- Roles: `PUBLIC`, `COLLABORATOR`, `ADMIN`
- Context includes authenticated user from session

#### Frontend (`apps/frontend`)
- **Framework:** Next.js 15+ (App Router, React 19)
- **GraphQL Client:** URQL with GraphQL Code Generator
- **Forms:** React Hook Form + Zod validation
- **Rich Text Editor:** Lexical with custom MediaNode
- **UI Components:** Radix UI primitives + custom components (shadcn/ui pattern)
- **Styling:** Tailwind CSS 4
- **HTTP Client:** Ky for REST endpoints

**Key Directories:**
- `src/app/` - Next.js App Router pages and layouts
- `src/modules/` - Feature modules (auth, posts) with components
- `src/service/` - API client layer (GraphQL + REST)
- `src/shared/` - Reusable components, hooks, utilities

**Service Layer Pattern:**
- `service.client.ts` - For Client Components (uses URQL hooks)
- `service.server.ts` - For Server Components (direct fetch with cookies)

**GraphQL Code Generation:**
1. Write queries/mutations in `service/gql/{queries|mutations}/*.graphql`
2. Backend runs codegen to generate types
3. Frontend gets type-safe hooks: `usePostsQuery()`, `useCreatePostMutation()`

#### Shared Packages
- `@repo/schemas` - Zod validation schemas used by both frontend and backend
- `@repo/biome-config` - Shared linting/formatting rules

## Database Schema

**Models:**
- **User** - Authentication, profiles, role-based access
- **Post** - Blog posts with title, description, optional media
- **Media** - Files stored in MinIO (IMAGE, VIDEO, AUDIO types)
- **Session** - Better Auth sessions
- **Account** - OAuth provider accounts
- **Verification** - Email verification tokens

**Relationships:**
- User → Posts (one-to-many)
- User → Media (one-to-many, uploaded files)
- Post → Media (many-to-one, optional featured media)

## Infrastructure

**Docker Compose Services:**
1. **Kong API Gateway** (port 8000)
   - Routes `/` → Frontend (localhost:3000)
   - Routes `/api` → Backend (localhost:7000)
2. **PostgreSQL** (port 5432)
3. **MinIO** (ports 9000 API, 9001 Console)
   - Bucket: `crop`
   - Public read policy for media files

## Development Workflow

### Commands
```bash
# Root
bun install

# Backend
cd apps/backend
bun run dev           # Start server (port 7000)
bun run gen-schema    # Export GraphQL schema
bun run codegen       # Generate types for frontend
bun prisma migrate dev
bun prisma db seed

# Frontend
cd apps/frontend
bun run dev           # Start Next.js (port 3000)
```

### Environment Variables
**Backend:**
- `DATABASE_URL` - PostgreSQL connection
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth
- `BETTER_AUTH_SECRET` - Session encryption
- `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` - MinIO config

**Frontend:**
- `NEXT_PUBLIC_API_URL` - Public API endpoint
- `INTERNAL_API_URL` - SSR API endpoint (localhost)

## Media Upload Flow

1. **Upload:** Frontend calls REST endpoint `POST /api/media/upload` (multipart/form-data)
2. **Validation:** Backend validates MIME type, size (max 100MB)
3. **Storage:** File uploaded to MinIO with unique CUID key
4. **Database:** Media record created in PostgreSQL
5. **Usage:** Reference media by ID in Post mutations via GraphQL

## Key Patterns & Conventions

### Backend
- **Code-First GraphQL:** Pothos schema builder with TypeScript
- **Error Handling:** Custom error classes (`NotFoundError`, `UnauthorizedError`, etc.)
- **Input Sanitization:** Null to undefined conversion utility
- **Dependency Injection:** Context-based (db, auth, storage)

### Frontend
- **Server Components First:** Fetch data in Server Components, pass as props
- **Client Components for Interactivity:** Forms, mutations, user actions
- **Component Organization:** Feature modules (`modules/`) + shared components (`shared/`)
- **Lexical Editor:** Custom MediaNode for inline images/video/audio
- **Form Validation:** React Hook Form + Zod resolver (shared schemas)

### Naming Conventions
**GraphQL Operations:**
- Queries (server): `getPostsQuery`, `getPostByIdQuery`
- Queries (client): `usePostsQuery`, `usePostByIdQuery`
- Mutations (client): `useCreatePostMutation`, `useUpdatePostMutation`

**Files:**
- GraphQL files: `*.graphql` in `service/gql/{queries|mutations}/`
- Components: PascalCase (e.g., `PostCard.tsx`)
- Utilities: kebab-case (e.g., `use-mobile.ts`)

## Security Features

- **Authentication:** Session-based with HTTP-only cookies
- **Authorization:** Role-based access control via GraphQL scopes
- **Input Validation:** Zod schemas on all mutations
- **SQL Injection Protection:** Prisma ORM with parameterized queries
- **File Upload Validation:** MIME type and size limits
- **CORS:** Configured for allowed origins only
- **Error Sanitization:** No stack traces exposed to client

## Technologies Summary

**Backend Stack:**
- Bun, Hono, GraphQL Yoga, Pothos, Prisma, PostgreSQL, Better Auth, MinIO, Zod

**Frontend Stack:**
- Next.js 15, React 19, URQL, Lexical, React Hook Form, Radix UI, Tailwind CSS 4, Ky

**DevOps:**
- Docker Compose, Kong API Gateway, Turborepo, Biome

## Notes for AI Agents

1. **Always use shared schemas** from `@repo/schemas` for validation
2. **Follow the service layer pattern** - client vs server services
3. **GraphQL changes require codegen** - run `bun run codegen` after schema changes
4. **Prisma changes require migration** - `bun prisma migrate dev` after schema.prisma edits
5. **Keep Server Components where possible** - only use Client Components when needed
6. **Media uploads use REST** - GraphQL is for queries/mutations, not file uploads
7. **Authorization scopes** - Use `public`, `collaborator`, or `admin` in Pothos resolvers
8. **Lexical nodes are immutable** - Always create new nodes, never mutate existing
9. **Code style enforced by Biome** - Run `bun run lint` before committing

## Common Tasks

### Add a new GraphQL query
1. Define query in `apps/backend/src/schema/{resource}/query.ts`
2. Run `bun run gen-schema` in backend
3. Create `.graphql` file in `apps/frontend/src/service/gql/queries/`
4. Run `bun run codegen` in backend
5. Use generated hook in frontend

### Add a new database model
1. Update `apps/backend/prisma/schema.prisma`
2. Run `bun prisma migrate dev --name description`
3. Create GraphQL schema module in `src/schema/`
4. Update Pothos builder with new type
5. Run codegen to update frontend types

### Add a new UI component
1. Place in `apps/frontend/src/shared/components/ui/` if generic
2. Place in `apps/frontend/src/modules/{feature}/components/` if feature-specific
3. Use Radix UI primitives where possible
4. Style with Tailwind CSS
5. Export from parent component index if needed

This context should help AI agents understand the project structure, patterns, and conventions when assisting with development tasks.
