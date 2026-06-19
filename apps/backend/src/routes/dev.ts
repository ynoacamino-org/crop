import { createId } from "@paralleldrive/cuid2";
import { Hono } from "hono";
import {
  articleAttachments,
  articles,
  articleToCategories,
  articleToLegalCases,
  articleToTags,
  caseTypes,
  categories,
  courts,
  legalCases,
  media,
  tags,
  users,
} from "@/db/schema";
import { RuntimeFactory } from "@/lib/env";

export function DevRouterFactory(): Hono<{ Bindings: Cloudflare.Env }> {
  const router = new Hono<{ Bindings: Cloudflare.Env }>();

  router.post("/seed", async (c) => {
    const rt = RuntimeFactory.create({ cf: c.env });
    const db = rt.db.client as typeof import("@/lib/db").db;

    const expected = rt.env.get("DEV_SEED_TOKEN");
    if (!expected) {
      return c.json({ error: "DEV_SEED_TOKEN not set" }, 500);
    }

    const provided =
      c.req.header("authorization")?.replace("Bearer ", "") ??
      c.req.header("x-dev-token") ??
      "";

    if (provided !== expected) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const categorySeed = [
      {
        name: "Derecho Civil",
        slug: "derecho-civil",
        description: "Casos y analisis de derecho civil",
      },
      {
        name: "Derecho Penal",
        slug: "derecho-penal",
        description: "Jurisprudencia en materia penal",
      },
      {
        name: "Derecho Constitucional",
        slug: "derecho-constitucional",
        description: "Control de constitucionalidad",
      },
    ];

    const tagSeed = [
      { name: "sentencia", slug: "sentencia" },
      { name: "jurisprudencia", slug: "jurisprudencia" },
      { name: "precedente", slug: "precedente" },
      { name: "amparo", slug: "amparo" },
    ];

    const courtSeed = [
      {
        name: "Corte Suprema de Justicia de la Republica",
        type: "SUPREMA" as const,
        jurisdiction: "NACIONAL" as const,
        description: "Maximo organo jurisdiccional del pais",
      },
      {
        name: "Tribunal Constitucional",
        type: "CONSTITUCIONAL" as const,
        jurisdiction: "NACIONAL" as const,
        description: "Organo supremo de control constitucional",
      },
    ];

    const caseTypeSeed = [
      {
        name: "Constitucional",
        slug: "constitucional",
        color: "#2563eb",
        icon: "scale",
        order: 1,
      },
      {
        name: "Civil",
        slug: "civil",
        color: "#16a34a",
        icon: "file-text",
        order: 2,
      },
      {
        name: "Penal",
        slug: "penal",
        color: "#dc2626",
        icon: "shield-alert",
        order: 3,
      },
    ];

    try {
      const [admin] = await db
        .insert(users)
        .values({
          id: createId(),
          name: "Admin Crop",
          email: "admin@crop.local",
          emailVerified: true,
          role: "ADMIN",
        })
        .returning();

      if (!admin) {
        return c.json({ error: "No se pudo crear el admin" }, 500);
      }

      const insertedCategories = await db
        .insert(categories)
        .values(categorySeed)
        .returning();

      const insertedTags = await db.insert(tags).values(tagSeed).returning();

      const insertedCourts = await db
        .insert(courts)
        .values(courtSeed)
        .returning();

      const insertedCaseTypes = await db
        .insert(caseTypes)
        .values(caseTypeSeed)
        .returning();

      const [createdCase] = await db
        .insert(legalCases)
        .values({
          caseNumber: "EXP-001-2026",
          caseName: "Accion de amparo por tutela efectiva",
          slug: "accion-de-amparo-por-tutela-efectiva-exp-001-2026",
          summary: "Caso semilla para pruebas de relaciones con articulos",
          parties: "Demandante v. Entidad Publica",
          legalBasis: "Constitucion Politica y jurisprudencia constitucional",
          jurisdiction: "NACIONAL",
          courtId: insertedCourts[0]?.id,
          caseTypeId: insertedCaseTypes[0]?.id,
        })
        .returning();

      if (!createdCase) {
        return c.json({ error: "No se pudo crear el caso legal" }, 500);
      }

      const [createdMedia] = await db
        .insert(media)
        .values({
          objectKey: `seed/${createId()}.jpg`,
          url: "https://picsum.photos/seed/crop-seed/1200/800",
          alt: "Imagen destacada de prueba",
          type: "IMAGE",
          size: 125_000,
          mimeType: "image/jpeg",
          filename: "seed-cover.jpg",
          uploadedBy: admin.id,
        })
        .returning();

      const [createdArticle] = await db
        .insert(articles)
        .values({
          title: "Guia practica de jurisprudencia constitucional",
          slug: "guia-practica-jurisprudencia-constitucional",
          excerpt: "Articulo semilla generado para entorno local",
          content: JSON.stringify({
            root: {
              type: "root",
              version: 1,
              format: "",
              indent: 0,
              direction: null,
              children: [
                {
                  type: "paragraph",
                  children: [
                    {
                      type: "text",
                      text: "Contenido inicial de prueba para Drizzle seed.",
                    },
                  ],
                },
              ],
            },
          }),
          status: "PUBLISHED",
          authorId: admin.id,
          featuredImageId: createdMedia?.id,
          readingTimeMin: 6,
        })
        .returning();

      if (!createdArticle) {
        return c.json({ error: "No se pudo crear el articulo" }, 500);
      }

      if (insertedCategories[0]) {
        await db.insert(articleToCategories).values({
          articleId: createdArticle.id,
          categoryId: insertedCategories[0].id,
        });
      }

      if (insertedTags[0]) {
        await db.insert(articleToTags).values({
          articleId: createdArticle.id,
          tagId: insertedTags[0].id,
        });
      }

      await db.insert(articleToLegalCases).values({
        articleId: createdArticle.id,
        legalCaseId: createdCase.id,
      });

      if (createdMedia) {
        await db.insert(articleAttachments).values({
          articleId: createdArticle.id,
          mediaId: createdMedia.id,
        });
      }

      return c.json(
        {
          success: true,
          data: {
            userId: admin.id,
            articleId: createdArticle.id,
            caseId: createdCase.id,
            categories: insertedCategories.length,
            tags: insertedTags.length,
            courts: insertedCourts.length,
            caseTypes: insertedCaseTypes.length,
          },
        },
        201,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return c.json({ success: false, error: message }, 500);
    }
  });

  return router;
}

export const devRouter = DevRouterFactory();
