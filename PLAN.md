# Plan de Migración: Hexagonal por Capas → Modular Hexagonal

## Contexto Actual

El backend (`apps/backend`) tiene una arquitectura hexagonal por capas:

```
src/
├── application/ports/       # Interfaces (auth, cache, db, object, config)
├── domain/db/schema.ts      # Drizzle schema (SQLite)
├── infrastructure/
│   ├── adapters/            # Implementaciones concretas
│   ├── factories/           # Auto-detección de runtime
│   ├── graphql/schema/      # Pothos resolvers por recurso
│   ├── http/routes/         # Hono routes
│   ├── lib/                 # Errors, utils, cors, context
│   └── runtime/index.ts     # Composición del runtime
└── entries/                 # edge.ts, node.ts
```

**Problema:** Los bounded contexts (media, auth, cache, db, object-storage) están mezclados entre sí en un solo árbol de capas. No hay encapsulamiento por dominio.

## Objetivo

Migrar a una **arquitectura modular** donde cada bounded context es una mini-hexagonal autocontenida:

```
src/
├── bootstrap/               # Punto de composición único
├── core/                    # Utilidades compartidas
├── shared/                  # GraphQL builder, paginación, HTTP routes base
├── modules/
│   ├── auth/                # Infraestructura
│   ├── database/            # Infraestructura
│   ├── cache/               # Infraestructura
│   ├── config/              # Infraestructura
│   ├── object-storage/      # Infraestructura
│   ├── media/               # Negocio
│   ├── article/             # Negocio
│   ├── user/                # Negocio
│   ├── legal-case/          # Negocio
│   ├── court/               # Negocio
│   └── case-type/           # Negocio
├── domain/db/schema.ts      # Se mantiene
└── entries/                 # edge.ts, node.ts
```

## Reglas de Verificación

**En CADA paso de CADA fase, ANTES de avanzar:**

```bash
bun run lint       # Biome check --write
bun run typecheck  # tsgo --noEmit
```

Si alguno falla, se detiene y se corrige antes de continuar.

---

## Fase 0: Crear módulo `core/`

**Objetivo:** Mover utilidades compartidas sin romper nada.

### Archivos a mover

| Origigen | Destino |
|----------|---------|
| `infrastructure/lib/errors/gql.ts` | `core/errors/gql.ts` |
| `infrastructure/lib/errors/db.ts` | `core/errors/db.ts` |
| `infrastructure/lib/errors/rest.ts` | `core/errors/rest.ts` |
| `infrastructure/lib/utils/sanitize.ts` | `core/utils/sanitize.ts` |
| `infrastructure/lib/utils/generate-slug.ts` | `core/utils/generate-slug.ts` |
| `infrastructure/lib/cors.ts` | `core/cors.ts` |
| `infrastructure/lib/context.ts` | `core/context.ts` |

### Pasos

1. Crear directorios `src/core/errors/`, `src/core/utils/`
2. Copiar cada archivo a su destino
3. Crear `src/core/index.ts` con barrel exports
4. Buscar TODOS los imports de `@/infrastructure/lib/` en el proyecto y actualizarlos a `@/core/`
5. Eliminar `infrastructure/lib/` completo
6. **Verificar:** `bun run lint` + `bun run typecheck`

### Criterio de éxito

- `infrastructure/lib/` no existe
- Todos los imports apuntan a `core/`
- `bun run lint` pasa
- `bun run typecheck` pasa

---

## Fase 1a: Módulo `database/`

**Objetivo:** Crear el módulo de base de datos como hexagonal autocontenida.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `application/ports/db.ts` | `modules/database/ports/db.ts` |
| `infrastructure/adapters/db/d1.ts` | `modules/database/adapters/d1.ts` |
| `infrastructure/adapters/db/libsql.ts` | `modules/database/adapters/libsql.ts` |
| `infrastructure/factories/db.ts` | `modules/database/factory.ts` |

### Pasos

1. Crear `src/modules/database/ports/db.ts` (copiar de `application/ports/db.ts`)
2. Crear `src/modules/database/adapters/d1.ts` (copiar de `infrastructure/adapters/db/d1.ts`)
3. Crear `src/modules/database/adapters/libsql.ts` (copiar de `infrastructure/adapters/db/libsql.ts`)
4. Crear `src/modules/database/factory.ts` (copiar de `infrastructure/factories/db.ts`)
5. Crear `src/modules/database/index.ts`:
   ```ts
   export { createDb } from './factory';
   export type { DatabaseClient } from './ports/db';
   ```
6. Actualizar imports en:
   - `infrastructure/factories/` (otras factories que referencien db)
   - `infrastructure/runtime/index.ts`
   - `infrastructure/graphql/builder.ts` (si importa db)
   - `infrastructure/lib/context.ts` (si aún existe, o `core/context.ts`)
7. Eliminar:
   - `application/ports/db.ts`
   - `infrastructure/adapters/db/d1.ts`
   - `infrastructure/adapters/db/libsql.ts`
   - `infrastructure/factories/db.ts`
8. **Verificar:** `bun run lint` + `bun run typecheck`

### Criterio de éxito

- `modules/database/` existe y exporta `createDb`
- No existen imports de `application/ports/db` ni `infrastructure/adapters/db/`
- `bun run lint` pasa
- `bun run typecheck` pasa

---

## Fase 1b: Módulo `cache/`

**Objetivo:** Crear el módulo de cache.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `application/ports/cache.ts` | `modules/cache/ports/cache.ts` |
| `infrastructure/adapters/cache/redis.ts` | `modules/cache/adapters/redis.ts` |
| `infrastructure/adapters/cache/cloudflare.ts` | `modules/cache/adapters/cloudflare.ts` |
| `infrastructure/adapters/cache/noop.ts` | `modules/cache/adapters/noop.ts` |
| `infrastructure/factories/cache.ts` | `modules/cache/factory.ts` |

### Pasos

1. Crear `src/modules/cache/ports/cache.ts`
2. Crear `src/modules/cache/adapters/redis.ts`
3. Crear `src/modules/cache/adapters/cloudflare.ts`
4. Crear `src/modules/cache/adapters/noop.ts`
5. Crear `src/modules/cache/factory.ts`
6. Crear `src/modules/cache/index.ts` con barrel exports
7. Actualizar imports en runtime, factories, y donde se use `CachePort`
8. Eliminar archivos originales
9. **Verificar:** `bun run lint` + `bun run typecheck`

---

## Fase 1c: Módulo `config/`

**Objetivo:** Crear el módulo de configuración de entorno.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `application/ports/config.ts` | `modules/config/ports/config.ts` |
| `infrastructure/adapters/config/cloudflare.ts` | `modules/config/adapters/cloudflare.ts` |
| `infrastructure/adapters/config/node.ts` | `modules/config/adapters/node.ts` |
| `infrastructure/adapters/detect.ts` | `modules/config/adapters/detect.ts` |

### Pasos

1. Crear `src/modules/config/ports/config.ts`
2. Crear `src/modules/config/adapters/cloudflare.ts`
3. Crear `src/modules/config/adapters/node.ts`
4. Crear `src/modules/config/adapters/detect.ts`
5. Crear `src/modules/config/index.ts`
6. Actualizar imports
7. Eliminar archivos originales
8. **Verificar:** `bun run lint` + `bun run typecheck`

---

## Fase 1d: Módulo `object-storage/`

**Objetivo:** Crear el módulo de almacenamiento de objetos.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `application/ports/object.ts` | `modules/object-storage/ports/storage.ts` |
| `infrastructure/adapters/object/r2.ts` | `modules/object-storage/adapters/r2.ts` |
| `infrastructure/adapters/object/s3.ts` | `modules/object-storage/adapters/s3.ts` |
| `infrastructure/factories/object.ts` | `modules/object-storage/factory.ts` |

### Pasos

1. Crear `src/modules/object-storage/ports/storage.ts`
2. Crear `src/modules/object-storage/adapters/r2.ts`
3. Crear `src/modules/object-storage/adapters/s3.ts`
4. Crear `src/modules/object-storage/factory.ts`
5. Crear `src/modules/object-storage/index.ts`
6. Actualizar imports (especialmente `application/media/service.ts` que usa `ObjectPort`)
7. Eliminar archivos originales
8. **Verificar:** `bun run lint` + `bun run typecheck`

---

## Fase 1e: Módulo `auth/`

**Objetivo:** Crear el módulo de autenticación.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `application/ports/auth.ts` | `modules/auth/ports/auth.ts` |
| `infrastructure/adapters/auth/better-auth.ts` | `modules/auth/adapters/better-auth.ts` |
| `infrastructure/factories/auth.ts` | `modules/auth/factory.ts` |
| `infrastructure/http/routes/auth.ts` | `modules/auth/http/routes.ts` |

### Pasos

1. Crear `src/modules/auth/ports/auth.ts`
2. Crear `src/modules/auth/adapters/better-auth.ts`
3. Crear `src/modules/auth/factory.ts`
4. Crear `src/modules/auth/http/routes.ts`
5. Crear `src/modules/auth/index.ts`
6. Actualizar imports
7. Eliminar archivos originales
8. **Verificar:** `bun run lint` + `bun run typecheck`

---

## Fase 2: Composición y Runtime

**Objetivo:** Crear el punto de composición único y eliminar el runtime monolítico.

### Archivos nuevos

| Archivo | Contenido |
|---------|-----------|
| `bootstrap/container.ts` | Compone todos los módulos de infraestructura |
| `bootstrap/runtime.ts` | Reemplaza `infrastructure/runtime/index.ts` |

### Pasos

1. Crear `src/bootstrap/container.ts`:
   ```ts
   import { createDb } from '@/modules/database';
   import { createCache } from '@/modules/cache';
   import { createObject } from '@/modules/object-storage';
   import { createAuth } from '@/modules/auth';
   import { createEnv } from '@/modules/config';
   import type { RuntimeEnv } from '@/application/ports/runtime';

   export function createContainer(cf?: Env): RuntimeEnv {
     const env = createEnv(cf);
     const db = createDb(cf);
     const cache = createCache(cf);
     const objects = createObject(cf);
     const auth = createAuth({ db, env });

     return { mode: ..., env, db, cache, objects, auth };
   }
   ```

2. Crear `src/bootstrap/runtime.ts` — lógica de singleton y detección edge/node
3. Actualizar `entries/edge.ts` para importar desde `@/bootstrap/`
4. Actualizar `entries/node.ts` para importar desde `@/bootstrap/`
5. Eliminar `infrastructure/runtime/index.ts`
6. Mover `application/ports/runtime.ts` a `bootstrap/runtime.ts` (o mantenerlo si otros lo usan)
7. Verificar que no queden imports de `infrastructure/runtime/`
8. **Verificar:** `bun run lint` + `bun run typecheck` + `bun run build:edge` + `bun run build:node`

### Criterio de éxito

- `infrastructure/runtime/` eliminado
- `entries/*.ts` usan `bootstrap/`
- `bun run lint` pasa
- `bun run typecheck` pasa

---

## Fase 3a: Módulo `media/` (negocio)

**Objetivo:** Mover el módulo de media completo.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `application/media/service.ts` | `modules/media/application/service.ts` |
| `application/media/validation.ts` | `modules/media/domain/validation.ts` |
| `infrastructure/graphql/schema/media/index.ts` | `modules/media/graphql/index.ts` |
| `infrastructure/graphql/schema/media/model.ts` | `modules/media/graphql/model.ts` |
| `infrastructure/graphql/schema/media/inputs.ts` | `modules/media/graphql/inputs.ts` |
| `infrastructure/graphql/schema/media/query.ts` | `modules/media/graphql/query.ts` |
| `infrastructure/graphql/schema/media/mutation.ts` | `modules/media/graphql/mutation.ts` |
| `infrastructure/http/routes/media.ts` | `modules/media/http/routes.ts` |

### Archivos nuevos

- `modules/media/domain/media.ts` — tipos de dominio
- `modules/media/ports/repository.ts` — interfaz de persistencia
- `modules/media/index.ts` — barrel exports

### Pasos

1. Crear `src/modules/media/domain/media.ts` con tipos del modelo
2. Crear `src/modules/media/domain/validation.ts` (copiar de `application/media/validation.ts`)
3. Crear `src/modules/media/application/service.ts` (copiar de `application/media/service.ts`)
4. Crear `src/modules/media/ports/repository.ts` con interfaz del repositorio
5. Copiar `infrastructure/graphql/schema/media/*` → `modules/media/graphql/*`
6. Copiar `infrastructure/http/routes/media.ts` → `modules/media/http/routes.ts`
7. Crear `modules/media/index.ts`
8. Actualizar imports en:
   - `shared/graphql/schema.ts` (que importa el schema de media)
   - `entries/edge.ts` (route de media)
   - Cualquier otro archivo que importe de `@/application/media/` o `@/infrastructure/graphql/schema/media/`
9. Eliminar:
   - `application/media/service.ts`
   - `application/media/validation.ts`
   - `infrastructure/graphql/schema/media/`
   - `infrastructure/http/routes/media.ts`
10. **Verificar:** `bun run lint` + `bun run typecheck`

### Criterio de éxito

- `modules/media/` completo
- No existen imports de `infrastructure/graphql/schema/media/`
- No existen imports de `application/media/`
- `bun run lint` pasa
- `bun run typecheck` pasa

---

## Fase 3b: Módulo `article/`

**Objetivo:** Mover el módulo de artículos.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `infrastructure/graphql/schema/article/*` | `modules/article/graphql/*` |

### Archivos nuevos

- `modules/article/domain/article.ts`
- `modules/article/ports/repository.ts`
- `modules/article/index.ts`

### Pasos

1. Crear `src/modules/article/domain/article.ts`
2. Crear `src/modules/article/ports/repository.ts`
3. Copiar `infrastructure/graphql/schema/article/*` → `modules/article/graphql/*`
4. Crear `modules/article/index.ts`
5. Actualizar imports en `shared/graphql/schema.ts` y donde se use
6. Eliminar `infrastructure/graphql/schema/article/`
7. **Verificar:** `bun run lint` + `bun run typecheck`

---

## Fase 3c: Módulo `user/`

**Objetivo:** Mover el módulo de usuarios.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `infrastructure/graphql/schema/user/*` | `modules/user/graphql/*` |

### Archivos nuevos

- `modules/user/domain/user.ts`
- `modules/user/ports/repository.ts`
- `modules/user/index.ts`

### Pasos

1. Crear `src/modules/user/domain/user.ts`
2. Crear `src/modules/user/ports/repository.ts`
3. Copiar `infrastructure/graphql/schema/user/*` → `modules/user/graphql/*`
4. Crear `modules/user/index.ts`
5. Actualizar imports
6. Eliminar `infrastructure/graphql/schema/user/`
7. **Verificar:** `bun run lint` + `bun run typecheck`

---

## Fase 3d: Módulo `legal-case/`

**Objetivo:** Mover el módulo de casos legales.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `infrastructure/graphql/schema/legal-case/*` | `modules/legal-case/graphql/*` |

### Archivos nuevos

- `modules/legal-case/domain/legal-case.ts`
- `modules/legal-case/ports/repository.ts`
- `modules/legal-case/index.ts`

### Pasos

1. Crear `src/modules/legal-case/domain/legal-case.ts`
2. Crear `src/modules/legal-case/ports/repository.ts`
3. Copiar `infrastructure/graphql/schema/legal-case/*` → `modules/legal-case/graphql/*`
4. Crear `modules/legal-case/index.ts`
5. Actualizar imports
6. Eliminar `infrastructure/graphql/schema/legal-case/`
7. **Verificar:** `bun run lint` + `bun run typecheck`

---

## Fase 3e: Módulo `court/`

**Objetivo:** Mover el módulo de tribunales.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `infrastructure/graphql/schema/court/*` | `modules/court/graphql/*` |

### Archivos nuevos

- `modules/court/domain/court.ts`
- `modules/court/ports/repository.ts`
- `modules/court/index.ts`

### Pasos

1. Crear `src/modules/court/domain/court.ts`
2. Crear `src/modules/court/ports/repository.ts`
3. Copiar `infrastructure/graphql/schema/court/*` → `modules/court/graphql/*`
4. Crear `modules/court/index.ts`
5. Actualizar imports
6. Eliminar `infrastructure/graphql/schema/court/`
7. **Verificar:** `bun run lint` + `bun run typecheck`

---

## Fase 3f: Módulo `case-type/`

**Objetivo:** Mover el módulo de tipos de caso.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `infrastructure/graphql/schema/case-type/*` | `modules/case-type/graphql/*` |

### Archivos nuevos

- `modules/case-type/domain/case-type.ts`
- `modules/case-type/ports/repository.ts`
- `modules/case-type/index.ts`

### Pasos

1. Crear `src/modules/case-type/domain/case-type.ts`
2. Crear `src/modules/case-type/ports/repository.ts`
3. Copiar `infrastructure/graphql/schema/case-type/*` → `modules/case-type/graphql/*`
4. Crear `modules/case-type/index.ts`
5. Actualizar imports
6. Eliminar `infrastructure/graphql/schema/case-type/`
7. **Verificar:** `bun run lint` + `bun run typecheck`

---

## Fase 4: Shared GraphQL y limpieza final

**Objetivo:** Crear la capa shared y eliminar `infrastructure/` y `application/` por completo.

### Archivos a mover

| Origen | Destino |
|--------|---------|
| `infrastructure/graphql/builder.ts` | `shared/graphql/builder.ts` |
| `infrastructure/graphql/yoga.ts` | `shared/graphql/yoga.ts` |
| `infrastructure/graphql/schema/pagination/*` | `shared/pagination/` |
| `infrastructure/graphql/schema/index.ts` | `shared/graphql/schema.ts` |
| `infrastructure/http/routes/graphql.ts` | `shared/http/routes/graphql.ts` |
| `infrastructure/http/routes/dev.ts` | `shared/http/routes/dev.ts` |

### Pasos

1. Crear `src/shared/graphql/builder.ts` (copiar de `infrastructure/graphql/builder.ts`)
2. Crear `src/shared/graphql/schema.ts` — importa y registra schemas de cada módulo:
   ```ts
   import '@/modules/article/graphql';
   import '@/modules/user/graphql';
   import '@/modules/media/graphql';
   import '@/modules/legal-case/graphql';
   import '@/modules/court/graphql';
   import '@/modules/case-type/graphql';
   // ... pagination
   export const schema = builder.toSchema();
   ```
3. Crear `src/shared/graphql/yoga.ts` (copiar de `infrastructure/graphql/yoga.ts`)
4. Crear `src/shared/pagination/model.ts` (copiar de `infrastructure/graphql/schema/pagination/`)
5. Crear `src/shared/http/routes/graphql.ts`
6. Crear `src/shared/http/routes/dev.ts`
7. Actualizar `entries/edge.ts`:
   ```ts
   import { authRouter } from '@/modules/auth';
   import { mediaRouter } from '@/modules/media';
   import { graphqlRouter } from '@/shared/http/routes/graphql';
   import { devRouter } from '@/shared/http/routes/dev';
   ```
8. Actualizar `entries/node.ts`
9. **Eliminar todo `infrastructure/`**
10. **Eliminar todo `application/`** (debe estar vacío)
11. **Verificar:** `bun run lint` + `bun run typecheck` + `bun run build:edge` + `bun run build:node`

### Criterio de éxito

- `infrastructure/` no existe
- `application/` no existe
- `shared/graphql/` compila el schema correctamente
- `bun run lint` pasa
- `bun run typecheck` pasa
- `bun run build:edge` compila
- `bun run build:node` compila

---

## Fase 5: Verificación y limpieza

**Objetivo:** Asegurar que todo funciona y documentar la nueva estructura.

### Pasos

1. Ejecutar `bun run dev:edge` — verificar que arranca sin errores
2. Ejecutar `bun run dev:node` — verificar que arranca sin errores
3. Probar endpoint de auth: `curl -X POST http://localhost:7000/api/auth/*`
4. Probar endpoint GraphQL: `curl -X POST http://localhost:7000/api/graphql`
5. Probar upload de media (si hay datos de prueba)
6. Verificar que los frontends (`apps/next`, `apps/tanstack-frontend`) compilan contra el nuevo backend
7. Ejecutar `bun run lint` una vez más en todo el monorepo
8. Actualizar `AGENTS.md` con la nueva estructura de directorios
9. Eliminar archivos huérfanos o temporales

---

## Orden de Ejecución (Resumen)

```
Fase 0:  core/
  ↓
Fase 1a: modules/database/
Fase 1b: modules/cache/
Fase 1c: modules/config/
Fase 1d: modules/object-storage/
Fase 1e: modules/auth/
  ↓
Fase 2:  bootstrap/ (container + runtime)
  ↓
Fase 3a: modules/media/
Fase 3b: modules/article/
Fase 3c: modules/user/
Fase 3d: modules/legal-case/
Fase 3e: modules/court/
Fase 3f: modules/case-type/
  ↓
Fase 4:  shared/ + limpieza infrastructure/
  ↓
Fase 5:  Verificación final
```

**Regla de oro:** En cada fase, después de cada movimiento de archivo:
```bash
bun run lint && bun run typecheck
```
Si falla, se corrige antes de continuar.

---

## Reglas de Dependencia

```
bootstrap  →  modules/*, core, shared
modules/business  →  modules/infrastructure (via puertos)
modules/infrastructure  →  nada (son hojas)
core  →  nada
shared  →  core (opcional)
domain/db/schema  →  nada
```

**Prohibido:**
- Un módulo de infraestructura importa otro módulo de infraestructura
- Un módulo de negocio importa un adapter concreto
- Algo fuera de `bootstrap/` conoce la implementación (D1, Redis, S3, etc.)
- Imports cruzados entre módulos de negocio

---

## Archivos que NO se mueven

| Archivo | Razón |
|---------|-------|
| `domain/db/schema.ts` | Drizzle schema global, todos los módulos lo usan |
| `entries/edge.ts` | Punto de entrada, solo cambian sus imports |
| `entries/node.ts` | Punto de entrada, solo cambian sus imports |
| `scripts/*` | Scripts de build, no parte de la arquitectura |
| `wrangler.jsonc` | Config de Cloudflare, no cambia |
| `tsconfig.json` | Puede necesitar agregar paths de módulos |
| `codegen.ts` | Config de codegen, no cambia |
| `drizzle.config.ts` | Config de Drizzle, no cambia |
