import { createId } from "@paralleldrive/cuid2";
import {
  accounts,
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
  sessions,
  tags,
  users,
  verifications,
} from "@/db/schema";
import { db, pool } from "@/lib/db";

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

async function seed() {
  console.log("[seed] limpiando tablas...");

  await db.transaction(async (tx) => {
    await tx.delete(articleToLegalCases);
    await tx.delete(articleToTags);
    await tx.delete(articleToCategories);
    await tx.delete(articleAttachments);
    await tx.delete(articles);
    await tx.delete(media);
    await tx.delete(legalCases);
    await tx.delete(courts);
    await tx.delete(caseTypes);
    await tx.delete(categories);
    await tx.delete(tags);
    await tx.delete(accounts);
    await tx.delete(sessions);
    await tx.delete(verifications);
    await tx.delete(users);

    console.log("[seed] insertando datos base...");

    const [admin] = await tx
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
      throw new Error("No se pudo crear el usuario administrador");
    }

    const insertedCategories = await tx
      .insert(categories)
      .values(categorySeed)
      .returning();
    const insertedTags = await tx.insert(tags).values(tagSeed).returning();
    const insertedCourts = await tx
      .insert(courts)
      .values(courtSeed)
      .returning();
    const insertedCaseTypes = await tx
      .insert(caseTypes)
      .values(caseTypeSeed)
      .returning();

    const [createdCase] = await tx
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
      throw new Error("No se pudo crear el caso legal de prueba");
    }

    const [createdMedia] = await tx
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

    const [createdArticle] = await tx
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
      throw new Error("No se pudo crear el articulo de prueba");
    }

    if (insertedCategories[0]) {
      await tx.insert(articleToCategories).values({
        articleId: createdArticle.id,
        categoryId: insertedCategories[0].id,
      });
    }

    if (insertedTags[0]) {
      await tx.insert(articleToTags).values({
        articleId: createdArticle.id,
        tagId: insertedTags[0].id,
      });
    }

    await tx.insert(articleToLegalCases).values({
      articleId: createdArticle.id,
      legalCaseId: createdCase.id,
    });

    if (createdMedia) {
      await tx.insert(articleAttachments).values({
        articleId: createdArticle.id,
        mediaId: createdMedia.id,
      });
    }
  });

  console.log("[seed] completado");
}

seed()
  .catch((error) => {
    console.error("[seed] error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
