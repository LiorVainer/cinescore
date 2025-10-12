/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId]` on the table `movie` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."movie" ADD COLUMN     "tmdbId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "movie_tmdbId_key" ON "public"."movie"("tmdbId");
