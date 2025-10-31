/*
  Warnings:

  - Made the column `tmdbId` on table `movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."movie" ADD COLUMN     "runtime" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "tmdbId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."movie_translation" ADD COLUMN     "backdropUrl" TEXT;
