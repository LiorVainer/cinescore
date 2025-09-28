/*
  Warnings:

  - You are about to drop the column `legacyGenreIds` on the `movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."movie" DROP COLUMN "legacyGenreIds";
