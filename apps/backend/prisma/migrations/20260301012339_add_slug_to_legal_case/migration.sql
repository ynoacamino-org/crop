/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `LegalCase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `LegalCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LegalCase" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LegalCase_slug_key" ON "LegalCase"("slug");

-- CreateIndex
CREATE INDEX "LegalCase_slug_idx" ON "LegalCase"("slug");
