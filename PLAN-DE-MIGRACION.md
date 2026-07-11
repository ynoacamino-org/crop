# Plan de Migracion: Next.js -> TanStack Start

## Estado Actual

### Backend (`apps/backend/`)
- **Runtime:** Bun + Cloudflare Workers (dual mode)
- **Framework:** Hono
- **GraphQL:** GraphQL Yoga + Pothos (code-first)
- **DB:** Drizzle ORM + SQLite (D1 en Cloudflare, libSQL local)
- **Auth:** Better Auth (Google OAuth + email/password)
- **Storage:** R2 (Cloudflare) + S3/MinIO (Node)
- **Cache:** KV (Cloudflare) + Upstash Redis + Noop fallback
- **Validacion:** Zod 4.x
- **Esquemas compartidos:** `@repo/schemas`

### Frontend Next.js (`apps/next/`)
- **Framework:** Next.js 16.1.1 + React 19.2.3
- **GraphQL Client:** URQL (hooks generados por graphql-codegen)
- **Rich Text:** Lexical 0.41.0 (editor completo con MediaNode)
- **UI:** shadcn/ui (40+ componentes) + Radix UI
- **Forms:** React Hook Form + Zod resolver
- **Estilos:** Tailwind CSS 4
- **HTTP:** Ky (para REST endpoints)
- **Auth:** better-auth client
- **Otros:** sonner (toasts), recharts, vaul (drawer), date-fns

### Frontend TanStack (`apps/tanstack-frontend/`) - scaffolding existente
- **Framework:** TanStack Start (Vite 8 + Nitro)
- **Router:** TanStack Router (file-based)
- **Query:** TanStack Query
- **Form:** TanStack Form
- **Table:** TanStack Table
- **Store:** TanStack Store
- **UI:** shadcn/ui (7 componentes instalados: button, input, label, select, slider, switch, textarea)
- **Estilos:** Tailwind CSS 4 + tw-animate-css
- **Env:** T3 Env (t3-oss/env-core)
- **Testing:** Vitest + Testing Library
- **Path alias:** `#/*` -> `./src/*`

---

## Herramientas de Migracion

| Paquete | Uso | Instalar |
|---------|-----|----------|
| `@tanstack/react-query` | Reemplaza URQL para data fetching | Ya instalado |
| `@tanstack/react-form` | Reemplaza React Hook Form | Ya instalado |
| `@tanstack/react-table` | Tablas admin | Ya instalado |
| `@tanstack/react-store` | State management global | Ya instalado |
| `@tanstack/react-router` | Routing file-based | Ya instalado |
| `@tanstack/react-start` | SSR + server functions | Ya instalado |
| `graphql-request` | GraphQL client ligero para TanStack Query | Pendiente |
| `@tailwindcss/vite` | Plugin Tailwind para Vite | Ya instalado |
| `@t3-oss/env-core` | Validacion de env vars | Ya instalado |
| `vite` | Bundler | Ya instalado (v8) |
| `vitest` | Testing | Ya instalado |
| `biome` | Linting/formatting | Ya instalado |
| `@repo/schemas` | Schemas Zod compartidos | Ya configurado (workspace) |

### Paquetes pendientes de instalar
```bash
bun add graphql-request          # GraphQL client para TanStack Query
bun add @tanstack/react-router-ssr-query  # Integracion SSR Query (verificar si ya esta)
bun add zustand                   # Si se necesita state mas complejo (opcional)
```

---

## Fases de Migracion

### FASE 0: Preparacion del Entorno
**Objetivo:** Asegurar que el scaffolding de TanStack este listo para recibir codigo.

1. **Configurar `apps/tanstack-frontend/package.json`**
   - Agregar scripts faltantes alineados con el monorepo:
     ```json
     {
       "scripts": {
         "dev": "vite dev --port 3000",
         "build": "vite build",
         "preview": "vite preview",
         "lint": "biome check --write",
         "check-types": "tsc --noEmit",
         "generate-routes": "tsr generate",
         "test": "vitest run"
       }
     }
     ```
   - Verificar que `@repo/schemas` este como dependencia workspace:
     ```json
     "@repo/schemas": "workspace:^"
     ```
   - Verificar que `@repo/biome-config` este como devDependency:
     ```json
     "@repo/biome-config": "workspace:^"
     ```

2. **Configurar `biome.json`** heredando del monorepo:
   ```json
   {
     "$schema": "https://biomejs.dev/schemas/2.3.10/schema.json",
     "root": false,
     "extends": ["@repo/biome-config/base", "@repo/biome-config/next"]
   }
   ```

3. **Configurar `turbo.json`** para incluir el nuevo app:
   - Verificar que las tasks `build`, `dev`, `lint`, `check-types` funcionan con TanStack Start
   - Actualizar outputs de build si es necesario:
     ```json
     {
       "tasks": {
         "build": {
           "dependsOn": ["^build"],
           "outputs": [".output/**", ".nitro/**", ".tanstack/**"]
         }
       }
     }
     ```

4. **Configurar variables de entorno**
   - Crear `.env.example`:
     ```
     VITE_API_URL=http://localhost:8000/api
     SERVER_URL=http://localhost:8000/api
     ```
   - Actualizar `src/env.ts` con las variables reales:
     ```ts
     export const env = createEnv({
       server: {
         SERVER_URL: z.string().url(),
       },
       clientPrefix: 'VITE_',
       client: {
         VITE_API_URL: z.string().url(),
       },
       runtimeEnv: import.meta.env,
       emptyStringAsUndefined: true,
     })
     ```

5. **Instalar dependencias faltantes**
   ```bash
   cd apps/tanstack-frontend
   bun add graphql-request @repo/schemas workspace:^
   bun add -D @repo/biome-config workspace:^
   ```

**Archivos a crear/modificar:**
- `apps/tanstack-frontend/package.json` (scripts + deps)
- `apps/tanstack-frontend/biome.json` (extender del monorepo)
- `apps/tanstack-frontend/src/env.ts` (vars de entorno)
- `apps/tanstack-frontend/.env.example`
- `turbo.json` (outputs actualizados)

---

### FASE 1: Capa de Servicio (GraphQL + REST)
**Objetivo:** Crear la capa de comunicacion con el backend usando TanStack Query + graphql-request.

1. **Crear GraphQL client** (`src/lib/graphql-client.ts`)
   ```ts
   import { GraphQLClient } from 'graphql-request'
   import { env } from '#/env'
   
   export const graphqlClient = new GraphQLClient(env.VITE_API_URL + '/graphql', {
     credentials: 'include',
   })
   ```

2. **Crear REST client** (`src/lib/http-client.ts`)
   - Port de `apps/next/src/service/rest/http.ts` (clase Http con Ky)
   ```ts
   import ky from 'ky'
   import { env } from '#/env'
   
   export const http = ky.create({
     prefixUrl: env.VITE_API_URL,
     credentials: 'include',
   })
   ```

3. **Migrar GraphQL queries/mutations** de `apps/next/src/service/gql/` a archivos `.graphql` en `apps/tanstack-frontend/src/service/gql/`
   - Copiar todos los `.graphql` files sin cambios (son lenguaje neutral)
   - Mantener la misma estructura: `queries/` y `mutations/`

4. **Configurar codegen** para TanStack Query
   - Crear `apps/tanstack-frontend/codegen.ts`:
     ```ts
     import type { CodegenConfig } from '@graphql-codegen/cli'
     
     const config: CodegenConfig = {
       schema: '../backend/schema.graphql',
       documents: ['src/**/*.graphql'],
       generates: {
         'src/service/gql/generated/gql.ts': {
           plugins: [
             'typescript',
             'typescript-operations',
             'typescript-graphql-request',
           ],
           config: {
             scalars: { DateTime: 'Date' },
             rawRequest: false,
           },
         },
       },
     }
     
     export default config
     ```
   - Instalar plugin: `bun add -D @graphql-codegen/typescript-graphql-request`

5. **Crear hooks de dominio con TanStack Query** (`src/service/hooks/`)
   - Un hook por operacion GraphQL
   - Cada hook usa `useQuery` o `useMutation` de TanStack Query
   - Example:
     ```ts
     // src/service/hooks/articles.ts
     import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
     import { graphqlClient } from '#/lib/graphql-client'
     import { ArticlesDocument, CreateArticleDocument } from '#/service/gql/generated/gql'
     
     export function useArticles(variables: ArticlesQueryVariables) {
       return useQuery({
         queryKey: ['articles', variables],
         queryFn: () => graphqlClient.request(ArticlesDocument, variables),
       })
     }
     
     export function useCreateArticle() {
       const queryClient = useQueryClient()
       return useMutation({
         mutationFn: (variables: CreateArticleMutationVariables) =>
           graphqlClient.request(CreateArticleDocument, variables),
         onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: ['articles'] })
         },
       })
     }
     ```

6. **Migrar REST modules** (`src/service/rest/`)
   - `auth.ts` -> `getSession()` usando http
   - `media.ts` -> `upload()` usando http

**Archivos a crear:**
- `src/lib/graphql-client.ts`
- `src/lib/http-client.ts`
- `src/service/gql/queries/*.graphql` (copiar de apps/next)
- `src/service/gql/mutations/*.graphql` (copiar de apps/next)
- `src/service/gql/generated/gql.ts` (generado por codegen)
- `src/service/hooks/articles.ts`
- `src/service/hooks/users.ts`
- `src/service/hooks/media.ts`
- `src/service/hooks/legal-cases.ts`
- `src/service/hooks/case-types.ts`
- `src/service/hooks/categories-tags.ts`
- `src/service/rest/auth.ts`
- `src/service/rest/media.ts`
- `apps/tanstack-frontend/codegen.ts`
- `apps/tanstack-frontend/package.json` (scripts: codegen)

---

### FASE 2: Layout Root y Providers
**Objetivo:** Configurar el layout raiz con todos los providers necesarios.

1. **Actualizar `src/routes/__root.tsx`**
   - Agregar ThemeProvider (next-themes o custom)
   - Agregar QueryClientProvider (via TanStack Router context)
   - Agregar UserProvider (context de usuario autenticado)
   - Agregar Sonner toaster
   - Configurar meta tags (title, description, viewport)
   - Configurar fonts (Inter + Merriweather)
   - Mantener devtools solo en development

2. **Crear ThemeProvider** (`src/providers/theme-provider.tsx`)
   - Port de `apps/next/src/shared/providers/theme-provider.tsx`
   - Usar `next-themes` o implementar custom con `@tanstack/react-store`

3. **Crear UserProvider** (`src/providers/user-provider.tsx`)
   - Port de `apps/next/src/shared/providers/user-provider.tsx`
   - Fetch `me` query server-side en loader
   - Proveer via context

4. **Configurar SSR Query integration**
   - Ya configurado en `src/router.tsx` con `setupRouterSsrQueryIntegration`
   - Asegurar que el queryClient se serialice correctamente

**Archivos a crear/modificar:**
- `src/routes/__root.tsx` (actualizar)
- `src/providers/theme-provider.tsx`
- `src/providers/user-provider.tsx`
- `src/router.tsx` ( verificar configuracion)

---

### FASE 3: Componentes UI (shadcn/ui)
**Objetivo:** Instalar todos los componentes shadcn/ui faltantes.

1. **Instalar componentes faltantes** via CLI:
   ```bash
   cd apps/tanstack-frontend
   
   # Core
   bunx shadcn@latest add card
   bunx shadcn@latest add badge
   bunx shadcn@latest add avatar
   bunx shadcn@latest add separator
   bunx shadcn@latest add skeleton
   bunx shadcn@latest add dialog
   bunx shadcn@latest add alert-dialog
   bunx shadcn@latest add dropdown-menu
   bunx shadcn@latest add popover
   bunx shadcn@latest add tooltip
   bunx shadcn@latest add sheet
   bunx shadcn@latest add tabs
   bunx shadcn@latest add accordion
   bunx shadcn@latest add alert
   bunx shadcn@latest add breadcrumb
   bunx shadcn@latest add table
   bunx shadcn@latest add pagination
   bunx shadcn@latest add form
   bunx shadcn@latest add checkbox
   bunx shadcn@latest add radio-group
   bunx shadcn@latest add textarea
   bunx shadcn@latest add collapsible
   bunx shadcn@latest add context-menu
   bunx shadcn@latest add menubar
   bunx shadcn@latest add navigation-menu
   bunx shadcn@latest add scroll-area
   bunx shadcn@latest add progress
   bunx shadcn@latest add toggle
   bunx shadcn@latest add toggle-group
   bunx shadcn@latest add hover-card
   bunx shadcn@latest add input-otp
   bunx shadcn@latest add aspect-ratio
   
   # Especializados
   bunx shadadcn@latest add calendar
   bunx shadcn@latest add command
   bunx shadcn@latest add chart
   bunx shadcn@latest add sonner
   bunx shadcn@latest add sidebar
   ```

2. **Componentes custom** (portear de apps/next):
   - `src/components/ui/link.tsx` - Link con estilo de boton
   - `src/components/ui/password.tsx` - Password input con toggle
   - `src/components/ui/spinner.tsx` - Loader icon
   - `src/components/ui/item.tsx` - Item compound component
   - `src/components/ui/field.tsx` - Field compound component
   - `src/components/ui/button-group.tsx`
   - `src/components/ui/upload-file.tsx` - File uploader con react-dropzone
   - `src/components/ui/theme-toggle.tsx`

3. **Actualizar `components.json`** si es necesario (ya configurado correctamente)

**Archivos a crear:**
- 30+ componentes shadcn via CLI
- ~10 componentes custom porteados de apps/next

---

### FASE 4: Auth (Login + Registro + Session)
**Objetivo:** Migrar el sistema de autenticacion.

1. **Configurar better-auth client** (`src/modules/auth/lib/auth-client.ts`)
   - Port directo de `apps/next/src/modules/auth/lib/auth-client.ts`
   - Ajustar la URL base (usar env vars de T3 Env)
   - Exportar `signIn`, `signOut`, `useSession`

2. **Crear auth hooks** (`src/service/hooks/auth.ts`)
   ```ts
   import { useQuery } from '@tanstack/react-query'
   import { graphqlClient } from '#/lib/graphql-client'
   import { MeDocument } from '#/service/gql/generated/gql'
   
   export function useMe() {
     return useQuery({
       queryKey: ['me'],
       queryFn: () => graphqlClient.request(MeDocument),
       retry: false,
     })
   }
   ```

3. **Migrar paginas de auth**
   - `src/routes/iniciar-sesion.tsx` (login page)
   - `src/routes/registro.tsx` (register page)
   - Portear componentes: `login-form.tsx`, `register-form.tsx`
   - Portear form structs: `login-struct.ts`, `register-struct.ts`

4. **Auth guard en root loader**
   ```ts
   // En __root.tsx o layout route
   beforeLoad: async ({ location }) => {
     // Si la ruta requiere auth, verificar session
     // Redirect a /iniciar-sesion si no esta autenticado
   }
   ```

5. **Migrar UI components de auth**
   - `account-popover.tsx`
   - `login-button.tsx`
   - `logout-button.tsx`

**Archivos a crear:**
- `src/modules/auth/lib/auth-client.ts`
- `src/modules/auth/lib/form-struct/login-struct.ts`
- `src/modules/auth/lib/form-struct/register-struct.ts`
- `src/modules/auth/components/forms/login-form.tsx`
- `src/modules/auth/components/forms/register-form.tsx`
- `src/modules/auth/components/ui/account-popover.tsx`
- `src/modules/auth/components/ui/login-button.tsx`
- `src/modules/auth/components/ui/logout-button.tsx`
- `src/routes/iniciar-sesion.tsx`
- `src/routes/registro.tsx`

---

### FASE 5: Shared Utilities y Config
**Objetivo:** Portear utilidades compartidas.

1. **Copiar utilidades de `apps/next/src/shared/`**
   - `lib/utils.ts` (ya existe: cn())
   - `lib/format-date.ts` (formatLongDate, formatShortDate, etc.)
   - `lib/pagination.ts` (parsePaginationParams, getPaginationInfo)
   - `lib/lexical-to-html.ts` (lexicalToHtml - ver FASE 8)
   - `hooks/use-mobile.ts`
   - `hooks/useQueryParams.ts`
   - `config/constants.ts` (ROUTE_LABELS, JURISDICTION_LABELS, etc.)
   - `config/env.ts` (reemplazar por src/env.ts con T3 Env)

2. **Portear componentes shared**
   - `components/pagination-controls.tsx`
   - `components/search-input.tsx`
   - `components/empty-state.tsx`
   - `components/layout/dynamic-breadcrumb.tsx`
   - `components/layout/navbar.tsx`

3. **Tipos compartidos**
   - `types/form/field.ts`
   - `types/form/config-field.ts`
   - `types/form/supported-fields.ts`
   - `components/form/infer-field.tsx` (InferItem)

**Archivos a crear:**
- `src/shared/lib/format-date.ts`
- `src/shared/lib/pagination.ts`
- `src/shared/hooks/use-mobile.ts`
- `src/shared/hooks/useQueryParams.ts`
- `src/shared/config/constants.ts`
- `src/shared/components/pagination-controls.tsx`
- `src/shared/components/search-input.tsx`
- `src/shared/components/empty-state.tsx`
- `src/shared/components/layout/dynamic-breadcrumb.tsx`
- `src/shared/components/layout/navbar.tsx`
- `src/shared/types/form/*.ts`
- `src/shared/components/form/infer-field.tsx`

---

### FASE 6: Paginas Publicas (Home, Articulos, Casos)
**Objetivo:** Migrar las paginas publicas del sitio.

1. **Home page** (`src/routes/index.tsx`)
   - Hero section
   - RecentArticlesList (client component con TanStack Query)
   - RecentCasesList (client component con TanStack Query)
   - Portear `recent-articles-list.tsx` y `recent-cases-list.tsx`

2. **Articulos listing** (`src/routes/articulos.tsx` layout + `src/routes/articulos/index.tsx`)
   - Server-side data fetching via loader
   - Search + pagination
   - ArticleCard grid
   - Portear `article-card.tsx`

3. **Articulo detail** (`src/routes/articulos/$slug.tsx`)
   - Loader: fetch article by slug
   - Render HTML content (Lexical -> HTML)
   - Tags + related cases
   - Portear `loading.tsx` como `pendingComponent`

4. **Casos listing** (`src/routes/casos.tsx` layout + `src/routes/casos/index.tsx`)
   - Server-side data fetching via loader
   - Pagination
   - LegalCaseCard grid
   - Portear `legal-case-card.tsx`, `legal-case-item.tsx`, `search-bar.tsx`

5. **Caso detail** (`src/routes/casos/$slug.tsx`)
   - Loader: fetch legal case by slug
   - Court, parties, articles info
   - Portear `related-legal-case-card.tsx`

**Archivos a crear:**
- `src/routes/index.tsx` (actualizar)
- `src/routes/articulos.tsx` (layout route)
- `src/routes/articulos/index.tsx`
- `src/routes/articulos/$slug.tsx`
- `src/routes/casos.tsx` (layout route)
- `src/routes/casos/index.tsx`
- `src/routes/casos/$slug.tsx`
- `src/modules/articles/components/ui/article-card.tsx`
- `src/modules/articles/components/ui/recent-articles-list.tsx`
- `src/modules/legal-cases/components/ui/legal-case-card.tsx`
- `src/modules/legal-cases/components/ui/legal-case-item.tsx`
- `src/modules/legal-cases/components/ui/legal-case-list.tsx`
- `src/modules/legal-cases/components/ui/related-legal-case-card.tsx`
- `src/modules/legal-cases/components/ui/search-bar.tsx`
- `src/modules/legal-cases/components/ui/recent-cases-list.tsx`

---

### FASE 7: Admin Dashboard
**Objetivo:** Migrar las paginas de administracion.

1. **Admin layout** (`src/routes/admin.tsx`)
   - Auth guard: verificar rol ADMIN
   - Redirect a home si no es admin
   - Portear admin layout de `apps/next/src/app/(main)/admin/layout.tsx`

2. **Admin dashboard** (`src/routes/admin/index.tsx`)
   - Stats cards (useAdminStatsQuery)
   - Quick links
   - Portear `admin-stats.graphql`

3. **Admin articles** (`src/routes/admin/articulos.tsx`)
   - Table con TanStack Table
   - Search + pagination
   - Status badges
   - Dropdown actions (edit, delete, change status)
   - Portear `articles-list.tsx`, `delete-article-dialog.tsx`, `update-article-status-dialog.tsx`

4. **Create article** (`src/routes/admin/articulos/nuevo.tsx`)
   - Form con TanStack Form
   - Auto-slug generation
   - Rich text editor (Lexical - ver FASE 8)
   - Portear `article-form.tsx`, `article-form-struct.ts`

5. **Edit article** (`src/routes/admin/articulos/$id/editar.tsx`)
   - Loader: fetch article by ID
   - Same form as create, pre-filled
   - Portear `editar/page.tsx`

6. **Admin users** (`src/routes/admin/usuarios.tsx`)
   - Table con TanStack Table
   - Search + pagination
   - Role badges
   - Edit/Delete dialogs
   - Portear `users-list.tsx`, `edit-user-dialog.tsx`, `delete-user-dialog.tsx`

**Archivos a crear:**
- `src/routes/admin.tsx` (layout route con auth guard)
- `src/routes/admin/index.tsx`
- `src/routes/admin/articulos.tsx` (layout)
- `src/routes/admin/articulos/index.tsx`
- `src/routes/admin/articulos/nuevo.tsx`
- `src/routes/admin/articulos/$id/editar.tsx`
- `src/routes/admin/usuarios.tsx`
- `src/modules/articles/components/articles-list.tsx`
- `src/modules/articles/components/delete-article-dialog.tsx`
- `src/modules/articles/components/update-article-status-dialog.tsx`
- `src/modules/articles/components/forms/article-form.tsx`
- `src/modules/articles/lib/form-struct/article-form-struct.ts`
- `src/modules/users/components/users-list.tsx`
- `src/modules/users/components/edit-user-dialog.tsx`
- `src/modules/users/components/delete-user-dialog.tsx`

---

### FASE 8: Rich Text Editor (Lexical)
**Objetivo:** Migrar el editor Lexical completo.

1. **Instalar dependencias Lexical**
   ```bash
   cd apps/tanstack-frontend
   bun add lexical @lexical/react @lexical/rich-text @lexical/list @lexical/markdown @lexical/selection @lexical/utils @lexical/headless
   bun add -D @types/lexical
   ```

2. **Portear MediaNode** (client/server split)
   - `src/modules/editor/nodes/media-node.core.ts` (shared logic)
   - `src/modules/editor/nodes/media-node.client.tsx` (client: React component)
   - `src/modules/editor/nodes/media-node.server.ts` (server: HTML placeholder)
   - `src/modules/editor/nodes/media-component.tsx` (LazyImage, VideoPlayer, AudioPlayer)

3. **Portear plugins**
   - `src/modules/editor/plugins/toolbar-plugin.tsx`
   - `src/modules/editor/plugins/media-plugin.tsx`
   - `src/modules/editor/plugins/drag-drop-paste-plugin.tsx`

4. **Portear editor wrapper**
   - `src/modules/editor/rich-text-editor.tsx` (LexicalComposer)

5. **Server-side rendering**
   - `src/shared/lib/lexical-to-html.ts` (happy-dom + @lexical/headless)
   - Nota: En TanStack Start, esto puede ejecutarse en server functions

**Archivos a crear:**
- `src/modules/editor/nodes/media-node.core.ts`
- `src/modules/editor/nodes/media-node.client.tsx`
- `src/modules/editor/nodes/media-node.server.ts`
- `src/modules/editor/nodes/media-component.tsx`
- `src/modules/editor/plugins/toolbar-plugin.tsx`
- `src/modules/editor/plugins/media-plugin.tsx`
- `src/modules/editor/plugins/drag-drop-paste-plugin.tsx`
- `src/modules/editor/rich-text-editor.tsx`
- `src/shared/lib/lexical-to-html.ts`

---

### FASE 9: Media Upload
**Objetivo:** Migrar el sistema de uploads de media.

1. **Portear REST media module** (`src/service/rest/media.ts`)
   - `upload()` function usando http client
   - Tipos: `MediaUploadResponse`, `UploadMediaPayload`

2. **Portear FileUploader component**
   - `src/components/ui/upload-file.tsx` (react-dropzone based)

3. **Media picker para editor**
   - `src/modules/editor/plugins/media-plugin.tsx` (InsertMediaDialog)
   - Integracion con upload endpoint

**Archivos a crear:**
- `src/service/rest/media.ts`
- `src/service/rest/types/media.ts`
- `src/components/ui/upload-file.tsx`
- `src/modules/editor/plugins/media-plugin.tsx`

---

### FASE 10: Testing
**Objetivo:** Agregar tests basicos.

1. **Configurar Vitest** (ya configurado)
   - Verificar `vitest.config.ts` si existe, o crearlo
   - Configurar path aliases

2. **Tests de utilidades**
   - `src/shared/lib/__tests__/format-date.test.ts`
   - `src/shared/lib/__tests__/pagination.test.ts`

3. **Tests de hooks**
   - `src/service/hooks/__tests__/articles.test.ts`

4. **Tests de componentes**
   - `src/components/__tests__/pagination-controls.test.tsx`
   - `src/components/__tests__/search-input.test.tsx`

**Archivos a crear:**
- `apps/tanstack-frontend/vitest.config.ts` (si no existe)
- `src/shared/lib/__tests__/*.test.ts`
- `src/service/hooks/__tests__/*.test.ts`
- `src/components/__tests__/*.test.tsx`

---

### FASE 11: Optimizacion y Deploy
**Objetivo:** Optimizar y preparar para produccion.

1. **Configurar Nitro para deploy**
   - Verificar `nitro.config.ts` o configuracion en `vite.config.ts`
   - Opciones de deploy: Cloudflare Workers, Vercel, Node server

2. **Configurar Docker** (si aplica)
   - Crear `Dockerfile` para TanStack Start
   - Actualizar `docker-compose.yml` para incluir el frontend

3. **Performance**
   - Lazy loading de rutas (ya viene con TanStack Router)
   - Prefetching de datos (defaultPreload: 'intent')
   - Optimistic updates en mutations
   - Cache stale time configuration

4. **SEO**
   - Meta tags por pagina (head function en routes)
   - Structured data
   - Sitemap generation

**Archivos a crear/modificar:**
- `apps/tanstack-frontend/nitro.config.ts` (si necesario)
- `apps/tanstack-frontend/Dockerfile`
- `docker-compose.yml` (actualizar)

---

## Scripts de Package.json - Comparativa

### Backend (`apps/backend/package.json`) - SIN CAMBIOS
```json
{
  "scripts": {
    "lint": "biome check --write",
    "dev": "wrangler dev",
    "dev:node": "bun run src/entries/node.ts",
    "deploy": "wrangler deploy",
    "start": "wrangler dev",
    "gen-schema": "bun run scripts/gen-schema.ts",
    "codegen": "bun run gen-schema && graphql-codegen --config codegen.ts && bun scripts/post-codegen.ts",
    "seed": "bun run scripts/seed.ts",
    "check-types": "tsc --noEmit",
    "check-edge": "wrangler deploy --dry-run",
    "db:generate": "drizzle-kit generate",
    "db:migrate:local": "wrangler d1 migrations apply mi-db --local",
    "db:migrate:remote": "wrangler d1 migrations apply mi-db --remote",
    "db:migrate:node": "bun run scripts/migrate-node.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

### TanStack Frontend (`apps/tanstack-frontend/package.json`) - OBJETIVO
```json
{
  "scripts": {
    "dev": "vite dev --port 3000",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "biome check --write",
    "check-types": "tsc --noEmit",
    "generate-routes": "tsr generate",
    "codegen": "graphql-codegen --config codegen.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Root (`package.json`) - ACTUALIZAR turbo.json
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", ".output/**", ".nitro/**", "!.next/cache/**"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## Orden de Ejecucion Recomendado

```
FASE 0  ──>  FASE 1  ──>  FASE 2  ──>  FASE 3
  │            │            │            │
  ▼            ▼            ▼            ▼
Preparar    GraphQL +    Layout +     shadcn/ui
entorno     Query hooks  Providers    (30+ comps)
                                   
FASE 4  ──>  FASE 5  ──>  FASE 6  ──>  FASE 7
  │            │            │            │
  ▼            ▼            ▼            ▼
Auth         Shared       Paginas      Admin
(Login,      Utils +      Publicas     Dashboard
Registro)    Types        (Home,       (CRUD)
                        Articulos,
                        Casos)
                        
FASE 8  ──>  FASE 9  ──>  FASE 10 ──>  FASE 11
  │            │            │            │
  ▼            ▼            ▼            ▼
Lexical      Media        Testing      Deploy +
Editor       Upload       (Vitest)     Optimizacion
```

**Tiempo estimado por fase:**
- FASE 0: 30 min
- FASE 1: 2-3 horas
- FASE 2: 1-2 horas
- FASE 3: 1-2 horas
- FASE 4: 2-3 horas
- FASE 5: 1-2 horas
- FASE 6: 3-4 horas
- FASE 7: 3-4 horas
- FASE 8: 4-6 horas (complejo)
- FASE 9: 1-2 horas
- FASE 10: 2-3 horas
- FASE 11: 1-2 horas

**Total estimado: 22-33 horas de desarrollo**

---

## Notas Importantes

### Que NO migrar
- **Backend:** No se toca. Sigue siendo Hono + GraphQL Yoga + Pothos + Drizzle.
- **`@repo/schemas`:** Se reutiliza tal cual. Es shared workspace package.
- **Docker Compose:** Se mantiene, solo se agrega el nuevo frontend.

### Diferencias clave Next.js -> TanStack Start
| Concepto | Next.js | TanStack Start |
|----------|---------|----------------|
| Routing | `app/` directory convention | `src/routes/` file-based |
| Data fetching | Server Components + fetch | Loaders + TanStack Query |
| Mutations | Server Actions o client | TanStack Query mutations |
| Forms | React Hook Form | TanStack Form |
| GraphQL | URQL hooks | graphql-request + TanStack Query |
| Layouts | `layout.tsx` in directory | Layout routes (`_layout.tsx`) |
| Loading | `loading.tsx` | `pendingComponent` |
| Error | `error.tsx` | `errorComponent` |
| SEO | `generateMetadata` | `head()` in route config |
| Image | `next/image` | `<img>` o libreria externa |
| Font | `next/font` | `@fontsource` o Google Fonts CSS |

### Comandos de desarrollo
```bash
# Root
bun install
bun run lint              # Biome en todo el monorepo

# Backend (sin cambios)
cd apps/backend
bun run dev               # Wrangler dev (port 7000)
bun run codegen           # Generar tipos GraphQL
bun prisma migrate dev    # (NO aplica - usa Drizzle)
bun run db:migrate:local  # Drizzle migrations

# TanStack Frontend
cd apps/tanstack-frontend
bun run dev               # Vite dev (port 3000)
bun run generate-routes   # Regenerar route tree
bun run codegen           # Generar tipos GraphQL
bun run build             # Production build
bun run test              # Vitest
bun run lint              # Biome
bun run check-types       # TypeScript check
```

### Codegen Flow
```
1. Backend: bun run gen-schema     -> schema.graphql
2. Backend: graphql-codegen        -> Frontend types
3. Frontend: bun run codegen       -> gql.ts (typed hooks)
```

El codegen del backend genera para apps/next. Para apps/tanstack-frontend,
se necesita un codegen.ts separado o ajustar el existente para generar
tambien para el nuevo frontend (usando `typescript-graphql-request` plugin
en vez de `typescript-urql`).
