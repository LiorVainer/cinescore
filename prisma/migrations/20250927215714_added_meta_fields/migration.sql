/*
  Warnings:

  - You are about to drop the column `genresIds` on the `movie` table. All the data in the column will be lost.
  - The `notifyBy` column on the `subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `genre` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."NotifyMethod" AS ENUM ('email', 'sms');

-- AlterTable
ALTER TABLE "public"."genre" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'he-IL',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."movie" DROP COLUMN "genresIds",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "legacyGenreIds" TEXT[],
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."notification" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."subscription" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "notifyBy",
ADD COLUMN     "notifyBy" "public"."NotifyMethod"[];

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "public"."genre"("name");

-- CreateIndex
CREATE INDEX "movie_rating_idx" ON "public"."movie"("rating");

-- CreateIndex
CREATE INDEX "movie_releaseDate_idx" ON "public"."movie"("releaseDate");

-- CreateIndex
CREATE INDEX "notification_sentAt_idx" ON "public"."notification"("sentAt");

-- CreateIndex
CREATE INDEX "subscription_threshold_idx" ON "public"."subscription"("threshold");
