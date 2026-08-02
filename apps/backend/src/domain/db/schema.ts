import { createId } from "@paralleldrive/cuid2";
import { defineRelations } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const ROLE_VALUES = ["PUBLIC", "COLLABORATOR", "ADMIN"] as const;
export const MEDIA_TYPE_VALUES = ["IMAGE", "VIDEO", "AUDIO", "FILE"] as const;
export const ARTICLE_STATUS_VALUES = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
] as const;
export const JURISDICTION_VALUES = [
  "NACIONAL",
  "REGIONAL",
  "LOCAL",
  "INTERNACIONAL",
] as const;
export const COURT_TYPE_VALUES = [
  "SUPREMA",
  "SUPERIOR",
  "PRIMERA_INSTANCIA",
  "ESPECIALIZADA",
  "CONSTITUCIONAL",
] as const;

export type RoleValue = (typeof ROLE_VALUES)[number];
export type MediaTypeValue = (typeof MEDIA_TYPE_VALUES)[number];
export type ArticleStatusValue = (typeof ARTICLE_STATUS_VALUES)[number];
export type JurisdictionValue = (typeof JURISDICTION_VALUES)[number];
export type CourtTypeValue = (typeof COURT_TYPE_VALUES)[number];

export const users = sqliteTable(
  "User",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: integer("emailVerified", { mode: "boolean" })
      .notNull()
      .default(false),
    image: text("image"),
    bio: text("bio"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    role: text("role", { enum: ROLE_VALUES }).notNull().default("PUBLIC"),
  },
  (table) => [uniqueIndex("User_email_key").on(table.email)],
);

export const sessions = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("session_userId_idx").on(table.userId),
    uniqueIndex("session_token_key").on(table.token),
  ],
);

export const accounts = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: integer("accessTokenExpiresAt", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verifications = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const media = sqliteTable(
  "Media",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    objectKey: text("objectKey").notNull(),
    url: text("url"),
    alt: text("alt"),
    type: text("type", { enum: MEDIA_TYPE_VALUES }).notNull(),
    size: integer("size").notNull(),
    mimeType: text("mimeType").notNull(),
    filename: text("filename").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    uploadedBy: text("uploadedBy").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    uniqueIndex("Media_objectKey_key").on(table.objectKey),
    index("Media_uploadedBy_idx").on(table.uploadedBy),
    index("Media_type_idx").on(table.type),
  ],
);

export const courts = sqliteTable(
  "Court",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    type: text("type", { enum: COURT_TYPE_VALUES }),
    jurisdiction: text("jurisdiction", { enum: JURISDICTION_VALUES }),
    description: text("description"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("Court_name_key").on(table.name),
    index("Court_type_idx").on(table.type),
    index("Court_jurisdiction_idx").on(table.jurisdiction),
  ],
);

export const caseTypes = sqliteTable(
  "CaseType",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    color: text("color"),
    icon: text("icon"),
    order: integer("order"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("CaseType_name_key").on(table.name),
    uniqueIndex("CaseType_slug_key").on(table.slug),
    index("CaseType_slug_idx").on(table.slug),
    index("CaseType_active_idx").on(table.active),
  ],
);

export const legalCases = sqliteTable(
  "LegalCase",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    caseNumber: text("caseNumber").notNull(),
    caseName: text("caseName").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary"),
    parties: text("parties"),
    plaintiff: text("plaintiff"),
    defendant: text("defendant"),
    judges: text("judges"),
    verdict: text("verdict"),
    legalBasis: text("legalBasis"),
    caseDate: integer("caseDate", { mode: "timestamp_ms" }),
    resolutionDate: integer("resolutionDate", { mode: "timestamp_ms" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    courtId: text("courtId").references(() => courts.id, {
      onDelete: "set null",
    }),
    caseTypeId: text("caseTypeId").references(() => caseTypes.id, {
      onDelete: "set null",
    }),
    jurisdiction: text("jurisdiction", { enum: JURISDICTION_VALUES }),
  },
  (table) => [
    uniqueIndex("LegalCase_caseNumber_key").on(table.caseNumber),
    uniqueIndex("LegalCase_slug_key").on(table.slug),
    index("LegalCase_caseNumber_idx").on(table.caseNumber),
    index("LegalCase_slug_idx").on(table.slug),
    index("LegalCase_courtId_idx").on(table.courtId),
    index("LegalCase_jurisdiction_idx").on(table.jurisdiction),
    index("LegalCase_caseTypeId_idx").on(table.caseTypeId),
  ],
);

export const articles = sqliteTable(
  "Article",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    status: text("status", { enum: ARTICLE_STATUS_VALUES })
      .notNull()
      .default("DRAFT"),
    publishedAt: integer("publishedAt", { mode: "timestamp_ms" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    authorId: text("authorId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    featuredImageId: text("featuredImageId").references(() => media.id, {
      onDelete: "set null",
    }),
    views: integer("views").notNull().default(0),
    readingTimeMin: integer("readingTimeMin"),
  },
  (table) => [
    uniqueIndex("Article_slug_key").on(table.slug),
    index("Article_authorId_idx").on(table.authorId),
    index("Article_status_idx").on(table.status),
    index("Article_publishedAt_idx").on(table.publishedAt),
    index("Article_slug_idx").on(table.slug),
  ],
);

export const categories = sqliteTable(
  "Category",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("Category_name_key").on(table.name),
    uniqueIndex("Category_slug_key").on(table.slug),
    index("Category_slug_idx").on(table.slug),
  ],
);

export const tags = sqliteTable(
  "Tag",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("Tag_name_key").on(table.name),
    uniqueIndex("Tag_slug_key").on(table.slug),
    index("Tag_slug_idx").on(table.slug),
  ],
);

export const articleAttachments = sqliteTable(
  "_ArticleAttachments",
  {
    articleId: text("A")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    mediaId: text("B")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.articleId, table.mediaId],
      name: "_ArticleAttachments_AB_pkey",
    }),
    index("_ArticleAttachments_B_index").on(table.mediaId),
  ],
);

export const articleToCategories = sqliteTable(
  "_ArticleToCategory",
  {
    articleId: text("A")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    categoryId: text("B")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.articleId, table.categoryId],
      name: "_ArticleToCategory_AB_pkey",
    }),
    index("_ArticleToCategory_B_index").on(table.categoryId),
  ],
);

export const articleToTags = sqliteTable(
  "_ArticleToTag",
  {
    articleId: text("A")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    tagId: text("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.articleId, table.tagId],
      name: "_ArticleToTag_AB_pkey",
    }),
    index("_ArticleToTag_B_index").on(table.tagId),
  ],
);

export const articleToLegalCases = sqliteTable(
  "_ArticleToLegalCase",
  {
    articleId: text("A")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    legalCaseId: text("B")
      .notNull()
      .references(() => legalCases.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.articleId, table.legalCaseId],
      name: "_ArticleToLegalCase_AB_pkey",
    }),
    index("_ArticleToLegalCase_B_index").on(table.legalCaseId),
  ],
);

export const AUDIT_ACTION_VALUES = ["CREATE", "UPDATE", "DELETE"] as const;
export const AUDITABLE_ENTITY_VALUES = [
  "Article",
  "LegalCase",
  "User",
  "Media",
  "CaseType",
] as const;

export type AuditActionValue = (typeof AUDIT_ACTION_VALUES)[number];
export type AuditableEntityValue = (typeof AUDITABLE_ENTITY_VALUES)[number];

export const auditLogs = sqliteTable(
  "AuditLog",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    entityType: text("entityType", { enum: AUDITABLE_ENTITY_VALUES }).notNull(),
    entityId: text("entityId").notNull(),
    action: text("action", { enum: AUDIT_ACTION_VALUES }).notNull(),
    userId: text("userId").references(() => users.id, { onDelete: "set null" }),
    userName: text("userName"),
    oldValues: text("oldValues"),
    newValues: text("newValues"),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("AuditLog_entityType_entityId_idx").on(
      table.entityType,
      table.entityId,
    ),
    index("AuditLog_userId_idx").on(table.userId),
    index("AuditLog_createdAt_idx").on(table.createdAt),
    index("AuditLog_action_idx").on(table.action),
  ],
);

export const EXPORT_TYPE_VALUES = [
  "legal-cases-csv",
  "articles-csv",
  "courts-csv",
] as const;
export type ExportTypeValue = (typeof EXPORT_TYPE_VALUES)[number];

export const EXPORT_STATUS_VALUES = [
  "pending",
  "processing",
  "completed",
  "failed",
] as const;
export type ExportStatusValue = (typeof EXPORT_STATUS_VALUES)[number];

export const exportJobs = sqliteTable(
  "ExportJob",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type", { enum: EXPORT_TYPE_VALUES }).notNull(),
    status: text("status", { enum: EXPORT_STATUS_VALUES })
      .notNull()
      .default("pending"),
    filters: text("filters"),
    columns: text("columns"),
    progress: integer("progress").notNull().default(0),
    totalRows: integer("totalRows"),
    processedRows: integer("processedRows"),
    fileKey: text("fileKey"),
    downloadUrl: text("downloadUrl"),
    error: text("error"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    startedAt: integer("startedAt", { mode: "timestamp_ms" }),
    completedAt: integer("completedAt", { mode: "timestamp_ms" }),
  },
  (table) => [
    index("ExportJob_userId_idx").on(table.userId),
    index("ExportJob_status_idx").on(table.status),
    index("ExportJob_createdAt_idx").on(table.createdAt),
  ],
);

export const relations = defineRelations(
  {
    users,
    sessions,
    accounts,
    verifications,
    media,
    courts,
    caseTypes,
    legalCases,
    articles,
    categories,
    tags,
    articleAttachments,
    articleToCategories,
    articleToTags,
    articleToLegalCases,
    exportJobs,
    auditLogs,
  },
  (r) => ({
    users: {
      sessions: r.many.sessions({
        from: r.users.id,
        to: r.sessions.userId,
      }),
      accounts: r.many.accounts({
        from: r.users.id,
        to: r.accounts.userId,
      }),
      mediaUploads: r.many.media({
        from: r.users.id,
        to: r.media.uploadedBy,
      }),
      articles: r.many.articles({
        from: r.users.id,
        to: r.articles.authorId,
      }),
      exportJobs: r.many.exportJobs({
        from: r.users.id,
        to: r.exportJobs.userId,
      }),
      auditLogs: r.many.auditLogs({
        from: r.users.id,
        to: r.auditLogs.userId,
      }),
    },
    sessions: {
      user: r.one.users({
        from: r.sessions.userId,
        to: r.users.id,
        optional: false,
      }),
    },
    accounts: {
      user: r.one.users({
        from: r.accounts.userId,
        to: r.users.id,
        optional: false,
      }),
    },
    media: {
      uploader: r.one.users({
        from: r.media.uploadedBy,
        to: r.users.id,
      }),
      featuredInArticles: r.many.articles({
        from: r.media.id,
        to: r.articles.featuredImageId,
      }),
      articleAttachments: r.many.articleAttachments({
        from: r.media.id,
        to: r.articleAttachments.mediaId,
      }),
    },
    courts: {
      cases: r.many.legalCases({
        from: r.courts.id,
        to: r.legalCases.courtId,
      }),
    },
    caseTypes: {
      legalCases: r.many.legalCases({
        from: r.caseTypes.id,
        to: r.legalCases.caseTypeId,
      }),
    },
    legalCases: {
      court: r.one.courts({
        from: r.legalCases.courtId,
        to: r.courts.id,
      }),
      caseType: r.one.caseTypes({
        from: r.legalCases.caseTypeId,
        to: r.caseTypes.id,
      }),
      articleLegalCases: r.many.articleToLegalCases({
        from: r.legalCases.id,
        to: r.articleToLegalCases.legalCaseId,
      }),
      articles: r.many.articles({
        from: r.legalCases.id.through(r.articleToLegalCases.legalCaseId),
        to: r.articles.id.through(r.articleToLegalCases.articleId),
      }),
    },
    articles: {
      author: r.one.users({
        from: r.articles.authorId,
        to: r.users.id,
        optional: false,
      }),
      featuredImage: r.one.media({
        from: r.articles.featuredImageId,
        to: r.media.id,
      }),
      articleAttachments: r.many.articleAttachments({
        from: r.articles.id,
        to: r.articleAttachments.articleId,
      }),
      articleCategories: r.many.articleToCategories({
        from: r.articles.id,
        to: r.articleToCategories.articleId,
      }),
      articleTags: r.many.articleToTags({
        from: r.articles.id,
        to: r.articleToTags.articleId,
      }),
      articleLegalCases: r.many.articleToLegalCases({
        from: r.articles.id,
        to: r.articleToLegalCases.articleId,
      }),
      attachments: r.many.media({
        from: r.articles.id.through(r.articleAttachments.articleId),
        to: r.media.id.through(r.articleAttachments.mediaId),
      }),
      categories: r.many.categories({
        from: r.articles.id.through(r.articleToCategories.articleId),
        to: r.categories.id.through(r.articleToCategories.categoryId),
      }),
      tags: r.many.tags({
        from: r.articles.id.through(r.articleToTags.articleId),
        to: r.tags.id.through(r.articleToTags.tagId),
      }),
      legalCases: r.many.legalCases({
        from: r.articles.id.through(r.articleToLegalCases.articleId),
        to: r.legalCases.id.through(r.articleToLegalCases.legalCaseId),
      }),
    },
    categories: {
      articleCategories: r.many.articleToCategories({
        from: r.categories.id,
        to: r.articleToCategories.categoryId,
      }),
      articles: r.many.articles({
        from: r.categories.id.through(r.articleToCategories.categoryId),
        to: r.articles.id.through(r.articleToCategories.articleId),
      }),
    },
    tags: {
      articleTags: r.many.articleToTags({
        from: r.tags.id,
        to: r.articleToTags.tagId,
      }),
      articles: r.many.articles({
        from: r.tags.id.through(r.articleToTags.tagId),
        to: r.articles.id.through(r.articleToTags.articleId),
      }),
    },
    articleAttachments: {
      article: r.one.articles({
        from: r.articleAttachments.articleId,
        to: r.articles.id,
        optional: false,
      }),
      media: r.one.media({
        from: r.articleAttachments.mediaId,
        to: r.media.id,
        optional: false,
      }),
    },
    articleToCategories: {
      article: r.one.articles({
        from: r.articleToCategories.articleId,
        to: r.articles.id,
        optional: false,
      }),
      category: r.one.categories({
        from: r.articleToCategories.categoryId,
        to: r.categories.id,
        optional: false,
      }),
    },
    articleToTags: {
      article: r.one.articles({
        from: r.articleToTags.articleId,
        to: r.articles.id,
        optional: false,
      }),
      tag: r.one.tags({
        from: r.articleToTags.tagId,
        to: r.tags.id,
        optional: false,
      }),
    },
    articleToLegalCases: {
      article: r.one.articles({
        from: r.articleToLegalCases.articleId,
        to: r.articles.id,
        optional: false,
      }),
      legalCase: r.one.legalCases({
        from: r.articleToLegalCases.legalCaseId,
        to: r.legalCases.id,
        optional: false,
      }),
    },
    exportJobs: {
      user: r.one.users({
        from: r.exportJobs.userId,
        to: r.users.id,
        optional: false,
      }),
    },
    auditLogs: {
      user: r.one.users({
        from: r.auditLogs.userId,
        to: r.users.id,
      }),
    },
  }),
);

export const apikeys = sqliteTable(
  "apikey",
  {
    id: text("id").primaryKey(),
    configId: text("configId").notNull().default("default"),
    name: text("name"),
    start: text("start"),
    referenceId: text("referenceId").notNull(),
    prefix: text("prefix"),
    key: text("key").notNull(),
    refillInterval: integer("refillInterval"),
    refillAmount: integer("refillAmount"),
    lastRefillAt: integer("lastRefillAt", { mode: "timestamp_ms" }),
    enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
    rateLimitEnabled: integer("rateLimitEnabled", { mode: "boolean" }),
    rateLimitTimeWindow: integer("rateLimitTimeWindow"),
    rateLimitMax: integer("rateLimitMax"),
    requestCount: integer("requestCount").notNull().default(0),
    remaining: integer("remaining"),
    lastRequest: integer("lastRequest", { mode: "timestamp_ms" }),
    expiresAt: integer("expiresAt", { mode: "timestamp_ms" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    permissions: text("permissions"),
    metadata: text("metadata"),
  },
  (table) => [
    index("apikey_configId_idx").on(table.configId),
    index("apikey_referenceId_idx").on(table.referenceId),
    index("apikey_key_idx").on(table.key),
  ],
);

export type UserModel = typeof users.$inferSelect;
export type MediaModel = typeof media.$inferSelect;
export type ArticleModel = typeof articles.$inferSelect;
export type CategoryModel = typeof categories.$inferSelect;
export type TagModel = typeof tags.$inferSelect;
export type LegalCaseModel = typeof legalCases.$inferSelect;
export type CourtModel = typeof courts.$inferSelect;
export type CaseTypeModel = typeof caseTypes.$inferSelect;
export type ExportJobModel = typeof exportJobs.$inferSelect;
export type AuditLogModel = typeof auditLogs.$inferSelect;
export type ApiKeyModel = typeof apikeys.$inferSelect;

export const authSchema = {
  user: users,
  User: users,
  session: sessions,
  account: accounts,
  verification: verifications,
  apikey: apikeys,
  ApiKey: apikeys,
};
