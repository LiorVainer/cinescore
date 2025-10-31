/*
  Warnings:

  - Made the column `imdbId` on table `movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."movie" ALTER COLUMN "imdbId" SET NOT NULL;
