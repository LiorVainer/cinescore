/*
  Warnings:

  - Made the column `youtubeId` on table `trailer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."movie" ADD COLUMN     "originalLanguage" TEXT,
ADD COLUMN     "originalTitle" TEXT;

-- AlterTable
ALTER TABLE "public"."trailer" ALTER COLUMN "youtubeId" SET NOT NULL;
