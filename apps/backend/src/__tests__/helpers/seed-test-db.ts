import { defaultKeyHasher } from "@better-auth/api-key";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import {
  ARTICLE_STATUS_VALUES,
  apikeys,
  articles,
  COURT_TYPE_VALUES,
  caseTypes,
  categories,
  courts,
  JURISDICTION_VALUES,
  legalCases,
  MEDIA_TYPE_VALUES,
  media,
  ROLE_VALUES,
  sessions,
  tags,
  users,
} from "@/domain/db/schema";
import type { DatabaseClient } from "@/modules/database/ports/db";

const now = () => new Date();

export const SeedUserSchema = z.object({
  id: z.string().default(() => createId()),
  name: z.string().default("Test User"),
  email: z.string().default(() => `test-${createId()}@example.com`),
  emailVerified: z.boolean().default(false),
  image: z.string().nullable().default(null),
  bio: z.string().nullable().default(null),
  createdAt: z.date().default(now),
  updatedAt: z.date().default(now),
  role: z.enum(ROLE_VALUES).default("PUBLIC"),
});

export type SeedUserInput = z.input<typeof SeedUserSchema>;

export async function seedUser(
  db: DatabaseClient,
  opts: SeedUserInput = {},
): Promise<z.output<typeof SeedUserSchema>> {
  const user = SeedUserSchema.parse(opts);
  await db.insert(users).values(user);
  return user;
}

export const SeedArticleSchema = z.object({
  id: z.string().default(() => createId()),
  title: z.string().default("Test Article"),
  slug: z.string().default(() => `test-article-${createId()}`),
  content: z.string().default("Test content"),
  excerpt: z.string().nullable().default(null),
  status: z.enum(ARTICLE_STATUS_VALUES).default("DRAFT"),
  authorId: z.string(),
  publishedAt: z.date().nullable().default(null),
  views: z.number().default(0),
  readingTimeMin: z.number().nullable().default(null),
  featuredImageId: z.string().nullable().default(null),
  createdAt: z.date().default(now),
  updatedAt: z.date().default(now),
});

export type SeedArticleInput = z.input<typeof SeedArticleSchema>;

export async function seedArticle(
  db: DatabaseClient,
  opts: SeedArticleInput,
): Promise<z.output<typeof SeedArticleSchema>> {
  const article = SeedArticleSchema.parse(opts);
  await db.insert(articles).values(article);
  return article;
}

export const SeedCourtSchema = z.object({
  id: z.string().default(() => createId()),
  name: z.string().default(() => `Test Court ${createId()}`),
  type: z.enum(COURT_TYPE_VALUES).nullable().default(null),
  jurisdiction: z.enum(JURISDICTION_VALUES).nullable().default(null),
  description: z.string().nullable().default(null),
  createdAt: z.date().default(now),
  updatedAt: z.date().default(now),
});

export type SeedCourtInput = z.input<typeof SeedCourtSchema>;

export async function seedCourt(
  db: DatabaseClient,
  opts: SeedCourtInput = {},
): Promise<z.output<typeof SeedCourtSchema>> {
  const court = SeedCourtSchema.parse(opts);
  await db.insert(courts).values(court);
  return court;
}

export const SeedCaseTypeSchema = z.object({
  id: z.string().default(() => createId()),
  name: z.string().default(() => `Test CaseType ${createId()}`),
  slug: z.string().default(() => `test-casetype-${createId()}`),
  description: z.string().nullable().default(null),
  color: z.string().nullable().default(null),
  icon: z.string().nullable().default(null),
  order: z.number().nullable().default(null),
  active: z.boolean().default(true),
  createdAt: z.date().default(now),
  updatedAt: z.date().default(now),
});

export type SeedCaseTypeInput = z.input<typeof SeedCaseTypeSchema>;

export async function seedCaseType(
  db: DatabaseClient,
  opts: SeedCaseTypeInput = {},
): Promise<z.output<typeof SeedCaseTypeSchema>> {
  const caseType = SeedCaseTypeSchema.parse(opts);
  await db.insert(caseTypes).values(caseType);
  return caseType;
}

export const SeedLegalCaseSchema = z.object({
  id: z.string().default(() => createId()),
  caseNumber: z.string().default(() => `CASE-${createId()}`),
  caseName: z.string().default(() => `Test Legal Case ${createId()}`),
  slug: z.string().default(() => `test-legal-case-${createId()}`),
  summary: z.string().nullable().default(null),
  parties: z.string().nullable().default(null),
  plaintiff: z.string().nullable().default(null),
  defendant: z.string().nullable().default(null),
  judges: z.string().nullable().default(null),
  verdict: z.string().nullable().default(null),
  legalBasis: z.string().nullable().default(null),
  caseDate: z.date().nullable().default(null),
  resolutionDate: z.date().nullable().default(null),
  courtId: z.string().nullable().default(null),
  caseTypeId: z.string().nullable().default(null),
  jurisdiction: z.enum(JURISDICTION_VALUES).nullable().default(null),
  createdAt: z.date().default(now),
  updatedAt: z.date().default(now),
});

export type SeedLegalCaseInput = z.input<typeof SeedLegalCaseSchema>;

export async function seedLegalCase(
  db: DatabaseClient,
  opts: SeedLegalCaseInput = {},
): Promise<z.output<typeof SeedLegalCaseSchema>> {
  const legalCase = SeedLegalCaseSchema.parse(opts);
  await db.insert(legalCases).values(legalCase);
  return legalCase;
}

export const SeedCategorySchema = z.object({
  id: z.string().default(() => createId()),
  name: z.string().default(() => `Test Category ${createId()}`),
  slug: z.string().default(() => `test-category-${createId()}`),
  description: z.string().nullable().default(null),
  createdAt: z.date().default(now),
  updatedAt: z.date().default(now),
});

export type SeedCategoryInput = z.input<typeof SeedCategorySchema>;

export async function seedCategory(
  db: DatabaseClient,
  opts: SeedCategoryInput = {},
): Promise<z.output<typeof SeedCategorySchema>> {
  const category = SeedCategorySchema.parse(opts);
  await db.insert(categories).values(category);
  return category;
}

export const SeedTagSchema = z.object({
  id: z.string().default(() => createId()),
  name: z.string().default(() => `Test Tag ${createId()}`),
  slug: z.string().default(() => `test-tag-${createId()}`),
  createdAt: z.date().default(now),
  updatedAt: z.date().default(now),
});

export type SeedTagInput = z.input<typeof SeedTagSchema>;

export async function seedTag(
  db: DatabaseClient,
  opts: SeedTagInput = {},
): Promise<z.output<typeof SeedTagSchema>> {
  const tag = SeedTagSchema.parse(opts);
  await db.insert(tags).values(tag);
  return tag;
}

export const SeedMediaSchema = z.object({
  id: z.string().default(() => createId()),
  objectKey: z.string().default(() => `test/${createId()}.jpg`),
  url: z.string().default(() => `https://example.com/test/${createId()}.jpg`),
  alt: z.string().nullable().default(null),
  type: z.enum(MEDIA_TYPE_VALUES).default("IMAGE"),
  size: z.number().default(1024),
  mimeType: z.string().default("image/jpeg"),
  filename: z.string().default(() => `test-${createId()}.jpg`),
  uploadedBy: z.string().nullable().default(null),
  createdAt: z.date().default(now),
  updatedAt: z.date().default(now),
});

export type SeedMediaInput = z.input<typeof SeedMediaSchema>;

export async function seedMedia(
  db: DatabaseClient,
  opts: SeedMediaInput = {},
): Promise<z.output<typeof SeedMediaSchema>> {
  const mediaRecord = SeedMediaSchema.parse(opts);
  await db.insert(media).values(mediaRecord);
  return mediaRecord;
}

export const SeedSessionSchema = z.object({
  id: z.string().default(() => createId()),
  token: z.string().default(() => createId()),
  userId: z.string(),
  expiresAt: z.date().default(() => new Date(Date.now() + 86400000)),
  createdAt: z.date().default(now),
  updatedAt: z.date().default(now),
  ipAddress: z.string().nullable().default(null),
  userAgent: z.string().nullable().default(null),
});

export type SeedSessionInput = z.input<typeof SeedSessionSchema>;

export async function seedSession(
  db: DatabaseClient,
  opts: SeedSessionInput,
): Promise<z.output<typeof SeedSessionSchema>> {
  const sessionRecord = SeedSessionSchema.parse(opts);
  await db.insert(sessions).values(sessionRecord);
  return sessionRecord;
}

export async function seedApiKey(
  db: DatabaseClient,
  opts: {
    userId: string;
    name?: string;
    key?: string;
    prefix?: string;
    expiresAt?: Date | null;
  },
) {
  const plainKey = opts.key ?? `crop_testkey_${createId()}${createId()}`;
  const hashedKey = await defaultKeyHasher(plainKey);
  const prefix = opts.prefix ?? "crop_";
  const start = plainKey.slice(0, 8);
  const id = createId();

  await db.insert(apikeys).values({
    id,
    configId: "default",
    name: opts.name ?? "Test API Key",
    start,
    prefix,
    key: hashedKey,
    referenceId: opts.userId,
    enabled: true,
    expiresAt: opts.expiresAt ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id,
    key: plainKey,
    hashedKey,
    name: opts.name ?? "Test API Key",
  };
}
