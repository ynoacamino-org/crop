/*
  Warnings:

  - You are about to drop the column `caseType` on the `LegalCase` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LegalCase_caseType_idx";

-- AlterTable
ALTER TABLE "LegalCase" DROP COLUMN "caseType",
ADD COLUMN     "caseTypeId" TEXT;

-- DropEnum
DROP TYPE "CaseType";

-- CreateTable
CREATE TABLE "CaseType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "order" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaseType_name_key" ON "CaseType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CaseType_slug_key" ON "CaseType"("slug");

-- CreateIndex
CREATE INDEX "CaseType_slug_idx" ON "CaseType"("slug");

-- CreateIndex
CREATE INDEX "CaseType_active_idx" ON "CaseType"("active");

-- CreateIndex
CREATE INDEX "LegalCase_caseTypeId_idx" ON "LegalCase"("caseTypeId");

-- AddForeignKey
ALTER TABLE "LegalCase" ADD CONSTRAINT "LegalCase_caseTypeId_fkey" FOREIGN KEY ("caseTypeId") REFERENCES "CaseType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
