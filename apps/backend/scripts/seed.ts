import { createId } from "@paralleldrive/cuid2";
import { hashPassword } from "better-auth/crypto";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/domain/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. Run with: bun run --env-file=.env.dev scripts/seed.ts",
  );
}

const db = drizzle(DATABASE_URL);

const now = new Date();

const userId1 = createId();
const userId2 = createId();
const userId3 = createId();

const courtId1 = createId();
const courtId2 = createId();
const courtId3 = createId();
const courtId4 = createId();

const caseTypeId1 = createId();
const caseTypeId2 = createId();
const caseTypeId3 = createId();
const caseTypeId4 = createId();

const categoryId1 = createId();
const categoryId2 = createId();
const categoryId3 = createId();

const tagId1 = createId();
const tagId2 = createId();
const tagId3 = createId();
const tagId4 = createId();

const articleId1 = createId();
const articleId2 = createId();
const articleId3 = createId();
const articleId4 = createId();
const articleId5 = createId();

const caseId1 = createId();
const caseId2 = createId();
const caseId3 = createId();

async function main() {
  await db.batch([
    db.insert(schema.users).values([
      {
        id: userId1,
        name: "Admin CROP",
        email: "admin@admin.com",
        role: "ADMIN",
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: userId2,
        name: "Colaborador Uno",
        email: "colab1@crop.cl",
        role: "COLLABORATOR",
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: userId3,
        name: "Usuario Publico",
        email: "publico@crop.cl",
        role: "PUBLIC",
        emailVerified: false,
        createdAt: now,
        updatedAt: now,
      },
    ]),

    db.insert(schema.courts).values([
      {
        id: courtId1,
        name: "Corte Suprema de Justicia",
        type: "SUPREMA",
        jurisdiction: "NACIONAL",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: courtId2,
        name: "Corte de Apelaciones de Santiago",
        type: "SUPERIOR",
        jurisdiction: "REGIONAL",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: courtId3,
        name: "Juzgado de Letras de Valparaíso",
        type: "PRIMERA_INSTANCIA",
        jurisdiction: "LOCAL",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: courtId4,
        name: "Tribunal Constitucional",
        type: "CONSTITUCIONAL",
        jurisdiction: "NACIONAL",
        createdAt: now,
        updatedAt: now,
      },
    ]),

    db.insert(schema.caseTypes).values([
      {
        id: caseTypeId1,
        name: "Recurso de Protección",
        slug: "recurso-de-proteccion",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: caseTypeId2,
        name: "Habeas Corpus",
        slug: "habeas-corpus",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: caseTypeId3,
        name: "Ordinario Civil",
        slug: "ordinario-civil",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: caseTypeId4,
        name: "Laboral",
        slug: "laboral",
        createdAt: now,
        updatedAt: now,
      },
    ]),

    db.insert(schema.categories).values([
      {
        id: categoryId1,
        name: "Derecho Civil",
        slug: "derecho-civil",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: categoryId2,
        name: "Derecho Penal",
        slug: "derecho-penal",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: categoryId3,
        name: "Derecho Laboral",
        slug: "derecho-laboral",
        createdAt: now,
        updatedAt: now,
      },
    ]),

    db.insert(schema.tags).values([
      {
        id: tagId1,
        name: "jurisprudencia",
        slug: "jurisprudencia",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: tagId2,
        name: "doctrina",
        slug: "doctrina",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: tagId3,
        name: "legislación",
        slug: "legislacion",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: tagId4,
        name: "análisis",
        slug: "analisis",
        createdAt: now,
        updatedAt: now,
      },
    ]),

    db.insert(schema.legalCases).values([
      {
        id: caseId1,
        caseNumber: "ROL-2026-001",
        caseName: "Caso García vs. Estado",
        slug: "caso-garcia-vs-estado",
        courtId: courtId1,
        caseTypeId: caseTypeId1,
        jurisdiction: "NACIONAL",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: caseId2,
        caseNumber: "ROL-2026-002",
        caseName: "Habeas Corpus Martínez",
        slug: "habeas-corpus-martinez",
        courtId: courtId2,
        caseTypeId: caseTypeId2,
        jurisdiction: "REGIONAL",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: caseId3,
        caseNumber: "ROL-2026-003",
        caseName: "Juicio Laboral Rivera",
        slug: "juicio-laboral-rivera",
        courtId: courtId3,
        caseTypeId: caseTypeId4,
        jurisdiction: "LOCAL",
        createdAt: now,
        updatedAt: now,
      },
    ]),

    db.insert(schema.articles).values([
      {
        id: articleId1,
        title: "Recurso de Protección: Guía Práctica",
        slug: "recurso-de-proteccion-guia",
        excerpt: "Análisis completo del recurso de protección",
        content: "Contenido del artículo sobre recursos de protección...",
        status: "PUBLISHED",
        authorId: userId1,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: articleId2,
        title: "Habeas Corpus en Chile",
        slug: "habeas-corpus-chile",
        excerpt: "Estudio del Habeas Corpus",
        content: "Contenido del artículo sobre Habeas Corpus...",
        status: "PUBLISHED",
        authorId: userId2,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: articleId3,
        title: "Derecho Laboral: Cambios 2026",
        slug: "derecho-laboral-cambios-2026",
        excerpt: "Novedades en legislación laboral",
        content: "Contenido sobre cambios laborales...",
        status: "DRAFT",
        authorId: userId1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: articleId4,
        title: "Jurisprudencia Constitucional",
        slug: "jurisprudencia-constitucional",
        excerpt: "Revisión de sentencias constitucionales",
        content: "Contenido de jurisprudencia constitucional...",
        status: "PUBLISHED",
        authorId: userId2,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: articleId5,
        title: "Análisis: Caso Rivera vs. Empresa",
        slug: "analisis-caso-rivera",
        excerpt: "Análisis del caso laboral Rivera",
        content: "Contenido del análisis del caso Rivera...",
        status: "ARCHIVED",
        authorId: userId1,
        createdAt: now,
        updatedAt: now,
      },
    ]),

    db.insert(schema.articleToCategories).values([
      { articleId: articleId1, categoryId: categoryId1 },
      { articleId: articleId2, categoryId: categoryId2 },
      { articleId: articleId3, categoryId: categoryId3 },
      { articleId: articleId4, categoryId: categoryId1 },
      { articleId: articleId5, categoryId: categoryId3 },
    ]),

    db.insert(schema.articleToTags).values([
      { articleId: articleId1, tagId: tagId1 },
      { articleId: articleId1, tagId: tagId3 },
      { articleId: articleId2, tagId: tagId1 },
      { articleId: articleId3, tagId: tagId4 },
      { articleId: articleId4, tagId: tagId2 },
      { articleId: articleId5, tagId: tagId4 },
    ]),

    db.insert(schema.articleToLegalCases).values([
      { articleId: articleId1, legalCaseId: caseId1 },
      { articleId: articleId2, legalCaseId: caseId2 },
      { articleId: articleId5, legalCaseId: caseId3 },
    ]),
  ]);

  const hashedPassword = await hashPassword("admin1234");
  await db.insert(schema.accounts).values({
    id: createId(),
    accountId: userId1,
    providerId: "credential",
    userId: userId1,
    password: hashedPassword,
  });
}

main().catch((_err) => {
  process.exit(1);
});
