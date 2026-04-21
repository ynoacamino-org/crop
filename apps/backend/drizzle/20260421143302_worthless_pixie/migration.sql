CREATE TYPE "ArticleStatus" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "CourtType" AS ENUM('SUPREMA', 'SUPERIOR', 'PRIMERA_INSTANCIA', 'ESPECIALIZADA', 'CONSTITUCIONAL');--> statement-breakpoint
CREATE TYPE "Jurisdiction" AS ENUM('NACIONAL', 'REGIONAL', 'LOCAL', 'INTERNACIONAL');--> statement-breakpoint
CREATE TYPE "MediaType" AS ENUM('IMAGE', 'VIDEO', 'AUDIO', 'FILE');--> statement-breakpoint
CREATE TYPE "Role" AS ENUM('PUBLIC', 'COLLABORATOR', 'ADMIN');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp(3),
	"refreshTokenExpiresAt" timestamp(3),
	"scope" text,
	"password" text,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_ArticleAttachments" (
	"A" text,
	"B" text,
	CONSTRAINT "_ArticleAttachments_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_ArticleToCategory" (
	"A" text,
	"B" text,
	CONSTRAINT "_ArticleToCategory_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_ArticleToLegalCase" (
	"A" text,
	"B" text,
	CONSTRAINT "_ArticleToLegalCase_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_ArticleToTag" (
	"A" text,
	"B" text,
	CONSTRAINT "_ArticleToTag_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "Article" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"status" "ArticleStatus" DEFAULT 'DRAFT'::"ArticleStatus" NOT NULL,
	"publishedAt" timestamp(3),
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"authorId" text NOT NULL,
	"featuredImageId" text,
	"views" integer DEFAULT 0 NOT NULL,
	"readingTimeMin" integer
);
--> statement-breakpoint
CREATE TABLE "CaseType" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"color" text,
	"icon" text,
	"order" integer,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Court" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"type" "CourtType",
	"jurisdiction" "Jurisdiction",
	"description" text,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "LegalCase" (
	"id" text PRIMARY KEY,
	"caseNumber" text NOT NULL,
	"caseName" text NOT NULL,
	"slug" text NOT NULL,
	"summary" text,
	"parties" text,
	"plaintiff" text,
	"defendant" text,
	"judges" text,
	"verdict" text,
	"legalBasis" text,
	"caseDate" timestamp(3),
	"resolutionDate" timestamp(3),
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"courtId" text,
	"caseTypeId" text,
	"jurisdiction" "Jurisdiction"
);
--> statement-breakpoint
CREATE TABLE "Media" (
	"id" text PRIMARY KEY,
	"objectKey" text NOT NULL,
	"url" text,
	"alt" text,
	"type" "MediaType" NOT NULL,
	"size" integer NOT NULL,
	"mimeType" text NOT NULL,
	"filename" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"uploadedBy" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expiresAt" timestamp(3) NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Tag" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"bio" text,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"role" "Role" DEFAULT 'PUBLIC'::"Role" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("userId");--> statement-breakpoint
CREATE INDEX "_ArticleAttachments_B_index" ON "_ArticleAttachments" ("B");--> statement-breakpoint
CREATE INDEX "_ArticleToCategory_B_index" ON "_ArticleToCategory" ("B");--> statement-breakpoint
CREATE INDEX "_ArticleToLegalCase_B_index" ON "_ArticleToLegalCase" ("B");--> statement-breakpoint
CREATE INDEX "_ArticleToTag_B_index" ON "_ArticleToTag" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX "Article_slug_key" ON "Article" ("slug");--> statement-breakpoint
CREATE INDEX "Article_authorId_idx" ON "Article" ("authorId");--> statement-breakpoint
CREATE INDEX "Article_status_idx" ON "Article" ("status");--> statement-breakpoint
CREATE INDEX "Article_publishedAt_idx" ON "Article" ("publishedAt");--> statement-breakpoint
CREATE INDEX "Article_slug_idx" ON "Article" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "CaseType_name_key" ON "CaseType" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "CaseType_slug_key" ON "CaseType" ("slug");--> statement-breakpoint
CREATE INDEX "CaseType_slug_idx" ON "CaseType" ("slug");--> statement-breakpoint
CREATE INDEX "CaseType_active_idx" ON "CaseType" ("active");--> statement-breakpoint
CREATE UNIQUE INDEX "Category_name_key" ON "Category" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "Category_slug_key" ON "Category" ("slug");--> statement-breakpoint
CREATE INDEX "Category_slug_idx" ON "Category" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "Court_name_key" ON "Court" ("name");--> statement-breakpoint
CREATE INDEX "Court_type_idx" ON "Court" ("type");--> statement-breakpoint
CREATE INDEX "Court_jurisdiction_idx" ON "Court" ("jurisdiction");--> statement-breakpoint
CREATE UNIQUE INDEX "LegalCase_caseNumber_key" ON "LegalCase" ("caseNumber");--> statement-breakpoint
CREATE UNIQUE INDEX "LegalCase_slug_key" ON "LegalCase" ("slug");--> statement-breakpoint
CREATE INDEX "LegalCase_caseNumber_idx" ON "LegalCase" ("caseNumber");--> statement-breakpoint
CREATE INDEX "LegalCase_slug_idx" ON "LegalCase" ("slug");--> statement-breakpoint
CREATE INDEX "LegalCase_courtId_idx" ON "LegalCase" ("courtId");--> statement-breakpoint
CREATE INDEX "LegalCase_jurisdiction_idx" ON "LegalCase" ("jurisdiction");--> statement-breakpoint
CREATE INDEX "LegalCase_caseTypeId_idx" ON "LegalCase" ("caseTypeId");--> statement-breakpoint
CREATE UNIQUE INDEX "Media_objectKey_key" ON "Media" ("objectKey");--> statement-breakpoint
CREATE INDEX "Media_uploadedBy_idx" ON "Media" ("uploadedBy");--> statement-breakpoint
CREATE INDEX "Media_type_idx" ON "Media" ("type");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_key" ON "session" ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag" ("slug");--> statement-breakpoint
CREATE INDEX "Tag_slug_idx" ON "Tag" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "_ArticleAttachments" ADD CONSTRAINT "_ArticleAttachments_A_Article_id_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "_ArticleAttachments" ADD CONSTRAINT "_ArticleAttachments_B_Media_id_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "_ArticleToCategory" ADD CONSTRAINT "_ArticleToCategory_A_Article_id_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "_ArticleToCategory" ADD CONSTRAINT "_ArticleToCategory_B_Category_id_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "_ArticleToLegalCase" ADD CONSTRAINT "_ArticleToLegalCase_A_Article_id_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "_ArticleToLegalCase" ADD CONSTRAINT "_ArticleToLegalCase_B_LegalCase_id_fkey" FOREIGN KEY ("B") REFERENCES "LegalCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "_ArticleToTag" ADD CONSTRAINT "_ArticleToTag_A_Article_id_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "_ArticleToTag" ADD CONSTRAINT "_ArticleToTag_B_Tag_id_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_User_id_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "Article" ADD CONSTRAINT "Article_featuredImageId_Media_id_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "LegalCase" ADD CONSTRAINT "LegalCase_courtId_Court_id_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE SET NULL ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "LegalCase" ADD CONSTRAINT "LegalCase_caseTypeId_CaseType_id_fkey" FOREIGN KEY ("caseTypeId") REFERENCES "CaseType"("id") ON DELETE SET NULL ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "Media" ADD CONSTRAINT "Media_uploadedBy_User_id_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;