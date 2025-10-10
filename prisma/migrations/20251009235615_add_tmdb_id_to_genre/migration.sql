/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId]` on the table `genre` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."genre" ADD COLUMN     "tmdbId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "genre_tmdbId_key" ON "public"."genre"("tmdbId");
