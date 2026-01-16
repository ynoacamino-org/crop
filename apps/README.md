# Crop App - Documentación

Aplicación full-stack con sistema de medios (imágenes, videos, audio) usando GraphQL, Prisma y Next.js.

## 🏗️ Arquitectura

### Backend (`apps/backend`)

- **Runtime:** Bun
- **Framework:** Hono + GraphQL Yoga
- **ORM:** Prisma (PostgreSQL)
- **Schema Builder:** Pothos GraphQL
- **Storage:** MinIO (S3-compatible)

### Frontend (`apps/frontend`)

- **Framework:** Next.js 15 (App Router)
- **GraphQL Client:** GraphQL Code Generator
- **State Management:** TanStack Query (React Query)
- **Editor:** Lexical
- **UI:** shadcn/ui + Tailwind CSS

---

## 📦 Sistema de Medios

### Modelo de Base de Datos

```prisma
model Media {
  id        String    @id @default(cuid())
  url       String    // URL del archivo en storage
  alt       String?   // Texto alternativo
  type      MediaType // IMAGE, VIDEO, AUDIO
  mimeType  String    // image/jpeg, video/mp4, etc.
  userId    String    // Propietario del media
  user      User      @relation(fields: [userId])
}

enum MediaType {
  IMAGE
  VIDEO
  AUDIO
}
```

### Endpoints REST

#### **POST** `/media/upload`

Sube un archivo al sistema de almacenamiento (MinIO).

**Body:** `multipart/form-data`

```typescript
{
  file: File; // Archivo a subir
}
```

**Response:**

```json
{
  "id": "cm5x1abc...",
  "url": "http://localhost:9000/crop/media-123.jpg",
  "alt": null,
  "type": "IMAGE",
  "mimeType": "image/jpeg"
}
```

**Proceso interno:**

1. Valida el archivo (tipo MIME, tamaño)
2. Genera nombre único con UUID
3. Sube a MinIO bucket
4. Crea registro en base de datos
5. Retorna información del media

#### **GET** `/media/:id`

Obtiene información de un medio específico.

**Response:**

```json
{
  "id": "cm5x1abc...",
  "url": "http://localhost:9000/crop/media-123.jpg",
  "type": "IMAGE",
  "mimeType": "image/jpeg"
}
```

---

## 🔌 GraphQL API

La API GraphQL está construida con Pothos Schema Builder, permitiendo definir tipos type-safe.

### Estructura del Schema

```
apps/backend/src/schema/
├── index.ts           # Schema principal
├── user/
│   ├── index.ts
│   ├── model.ts       # Tipo User en GraphQL
│   ├── query.ts       # Queries de User
│   └── mutation.ts    # Mutations de User
└── media/
    ├── index.ts
    ├── model.ts       # Tipo Media en GraphQL
    ├── query.ts       # Queries de Media
    └── mutation.ts    # Mutations de Media
```

### Ejemplo de Query

```graphql
query GetMedia {
  media {
    id
    url
    type
    mimeType
    user {
      id
      name
    }
  }
}
```

### Ejemplo de Mutation

```graphql
mutation UpdateMedia($id: String!, $input: UpdateMediaInput!) {
  updateMedia(id: $id, input: $input) {
    id
    alt
  }
}
```

---

## 🎯 Frontend - Services

El frontend utiliza dos estrategias para interactuar con la API según el tipo de componente.

### **1. Server Service** (`service.server.ts`)

Para **Server Components** que se ejecutan en el servidor de Next.js.

```typescript
import { getDataQuery } from "@/service/service.server";

export default async function ServerPage() {
  const data = await getDataQuery();

  return <ClientComponent data={data} />;
}
```

**Características:**

- Usa `fetch` nativo directo al endpoint GraphQL
- Se ejecuta solo en el servidor (SSR/SSG)
- Datos disponibles en primera carga (SEO-friendly)
- No incrementa bundle JavaScript del cliente
- Headers de autenticación automáticos desde cookies

**Cuándo usar:**

- Páginas que necesitan SEO
- Datos iniciales que no cambian frecuentemente
- Información que requiere autenticación del servidor

### **2. Client Service** (`service.client.ts`)

Para **Client Components** con interactividad del usuario.

```typescript
"use client";

import { useDataQuery, useUpdateMutation } from "@/service/service.client";

export function InteractiveComponent() {
  const { data, isLoading } = useDataQuery();
  const { mutate, isPending } = useUpdateMutation();

  const handleUpdate = () => {
    mutate({ input: { field: "value" } });
  };

  if (isLoading) return <Spinner />;

  return <button onClick={handleUpdate}>Update</button>;
}
```

**Características:**

- Usa TanStack Query (React Query)
- Hooks con estados: `isLoading`, `isError`, `isPending`
- Caché automático y deduplicación de requests
- Revalidación en background
- Optimistic updates
- Retry automático en errores

**Cuándo usar:**

- Formularios y acciones del usuario
- Datos que cambian frecuentemente
- Necesitas estados de loading/error en UI
- Quieres caché del lado del cliente

---

## 🔄 Patrón de Datos: Server → Client

### Queries se pasan como Props

**Server Component** ejecuta la query y pasa datos como props:

```typescript
// app/page.tsx (Server Component)
import { getMediaQuery } from "@/service/service.server";
import { MediaGallery } from "@/components/media-gallery";

export default async function HomePage() {
  const { media } = await getMediaQuery();

  return <MediaGallery items={media} />;
}
```

**Client Component** recibe los datos y renderiza:

```typescript
// components/media-gallery.tsx (Client Component)
"use client";

interface Props {
  items: Media[]; // ← Datos del servidor
}

export function MediaGallery({ items }: Props) {
  const [selected, setSelected] = useState<Media | null>(null);

  return (
    <div>
      {items.map((item) => (
        <img key={item.id} src={item.url} onClick={() => setSelected(item)} />
      ))}
    </div>
  );
}
```

### Mutations usan Hooks

Las mutaciones siempre se ejecutan desde Client Components:

```typescript
"use client";

import { useUpdateMediaMutation } from "@/service/service.client";

export function EditMediaForm({ media }: { media: Media }) {
  const { mutate, isPending } = useUpdateMediaMutation();

  const handleSubmit = (values: FormData) => {
    mutate(
      {
        id: media.id,
        input: {
          alt: values.alt,
        },
      },
      {
        onSuccess: () => {
          toast.success("Media actualizado");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="alt" defaultValue={media.alt || ""} />
      <button disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
```

---

## 🔄 Flujo Completo de Trabajo

### Ejemplo: Subir y Usar un Media

**1. Upload del archivo (REST API)**

```typescript
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/media/upload", {
    method: "POST",
    body: formData,
  });

  const media = await response.json();
  return media; // { id, url, type, mimeType }
};
```

**2. Usar el media en otra operación**

```typescript
const media = await handleFileUpload(file);

// Ahora puedes referenciar el media por su ID
const mediaId = media.id;
```

**3. Consultar media desde GraphQL**

```typescript
// Server Component
import { getMediaByIdQuery } from "@/service/service.server";

const media = await getMediaByIdQuery({ id: mediaId });
```

---

## 🛠️ Desarrollo

### Comandos Principales

```bash
# Instalar dependencias (root del monorepo)
bun install

# Desarrollo backend
cd apps/backend
bun run dev              # Inicia servidor en puerto 4000

# Desarrollo frontend
cd apps/frontend
bun run dev              # Inicia Next.js en puerto 3000

# Base de datos
cd apps/backend
bun prisma migrate dev   # Crear y aplicar migración
bun prisma db seed       # Poblar con datos de prueba
bun prisma studio        # Abrir UI visual de DB

# Generar tipos GraphQL (frontend)
cd apps/frontend
bun run codegen          # Genera tipos desde archivos .graphql
```

### Estructura de Archivos

```
apps/frontend/src/service/
├── gql/
│   ├── queries/
│   │   └── *.graphql         # Queries GraphQL
│   ├── mutations/
│   │   └── *.graphql         # Mutations GraphQL
│   └── generated/            # ⚠️ Auto-generado, no editar
│       ├── graphql.ts        # Tipos TypeScript
│       └── gql.ts            # Hooks y helpers
├── rest/
│   └── media.ts              # Cliente REST para uploads
├── service.client.ts         # Hooks para Client Components
└── service.server.ts         # Funciones para Server Components
```

### Flujo de Codegen

1. Escribes queries/mutations en archivos `.graphql`
2. Ejecutas `bun run codegen`
3. Se generan tipos TypeScript automáticamente
4. Importas hooks/functions type-safe

```typescript
// queries/media.graphql
query Media {
  media {
    id
    url
    type
  }
}

// Después del codegen, tienes:
import { useMediaQuery } from "@/service/service.client";
const { data } = useMediaQuery(); // ← Tipos automáticos
```

---

## 📝 Convenciones

### Naming Conventions

**Queries:**

- Server: `getResourceQuery`, `getResourceByIdQuery`
- Client: `useResourceQuery`, `useResourceByIdQuery`

**Mutations:**

- Siempre en client: `useCreateResourceMutation`, `useUpdateResourceMutation`

**Tipos:**

- Auto-generados desde GraphQL schema
- Sufijo `Input` para inputs de mutations
- Sufijo `Payload` para responses

### Validación

**Backend:**

- Zod schemas en `packages/schemas`
- Validación en inputs de GraphQL
- Ejemplo: `CreateMediaInput`, `UpdateMediaInput`

**Frontend:**

- React Hook Form con Zod resolver
- Mismos schemas compartidos desde `packages/schemas`

### Estado y Caché

**Server Components:**

- Sin estado local
- Datos pasados como props
- Revalidación con `revalidatePath()` o `revalidateTag()`

**Client Components:**

- TanStack Query maneja caché automáticamente
- Revalidación en background cada 5 minutos (configurable)
- Invalidación manual con `queryClient.invalidateQueries()`

---

## 🎨 Editor Lexical

### MediaNode

Nodo customizado para renderizar medios inline dentro del editor de texto.

**Características:**

- **Inline:** No rompe el flujo de texto (como una imagen en Word)
- **Margin:** 2px horizontal para separación
- **Seleccionable:** Click para seleccionar el nodo
- **Tipos:** IMAGE, VIDEO, AUDIO

**Implementación:**

```typescript
import { DecoratorNode } from "lexical";

export class MediaNode extends DecoratorNode<JSX.Element> {
  // Retorna true para comportamiento inline
  isInline(): boolean {
    return true;
  }

  // Crea el elemento DOM con estilos
  createDOM(): HTMLElement {
    const span = document.createElement("span");
    span.style.marginLeft = "2px";
    span.style.marginRight = "2px";
    return span;
  }

  // Renderiza el componente React
  decorate(): JSX.Element {
    return <MediaComponent {...this.__props} />;
  }
}
```

**Uso:**

```typescript
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createMediaNode } from "./nodes/media-node";

export function InsertMediaButton({ media }: { media: Media }) {
  const [editor] = useLexicalComposerContext();

  const handleInsert = () => {
    editor.update(() => {
      const node = $createMediaNode({
        src: media.url,
        alt: media.alt || "",
        type: media.type,
      });

      $insertNodes([node]);
    });
  };

  return <button onClick={handleInsert}>Insertar Media</button>;
}
```

---

## 🔐 Autenticación

Sistema basado en **Better Auth** con Prisma adapter.

### Modelos de Auth

```prisma
model User {
  id       String    @id @default(cuid())
  email    String    @unique
  name     String?
  image    String?
  sessions Session[]
  accounts Account[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId])
  expiresAt DateTime
}

model Account {
  id       String @id @default(cuid())
  userId   String
  user     User   @relation(fields: [userId])
  provider String // "google", "github", etc.
}
```

### Protección de Rutas

```typescript
// Server Component
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <Dashboard user={session.user} />;
}
```

### Uso en API GraphQL

```typescript
// Backend resolver con autenticación
export const protectedQuery = builder.queryField("protectedData", (t) =>
  t.field({
    type: "String",
    resolve: async (_, __, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      return "Data privada para: " + context.user.name;
    },
  })
);
```

---

## 📚 Recursos

### URLs de Desarrollo

- **Frontend:** `http://localhost:3000`
- **Backend GraphQL:** `http://localhost:4000/graphql`
- **GraphQL Playground:** `http://localhost:4000/graphql` (interfaz)
- **Prisma Studio:** `bun prisma studio` → `http://localhost:5555`
- **MinIO Console:** `http://localhost:9001` (usuario: minioadmin)

### Documentación Externa

- [Next.js App Router](https://nextjs.org/docs)
- [Pothos GraphQL](https://pothos-graphql.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Prisma](https://www.prisma.io/docs)
- [Lexical](https://lexical.dev/)
- [Better Auth](https://better-auth.com/)
