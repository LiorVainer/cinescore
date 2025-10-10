/*
  Warnings:

  - You are about to drop the column `biography` on the `actor` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `actor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `actor` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `genre` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `originalTitle` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `movie` table. All the data in the column will be lost.
  - The `originalLanguage` column on the `movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[imdbId]` on the table `actor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imdbId]` on the table `movie` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."actor_imdbId_language_key";

-- AlterTable
ALTER TABLE "public"."actor" DROP COLUMN "biography",
DROP COLUMN "language",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "public"."genre" DROP COLUMN "language";

-- AlterTable
ALTER TABLE "public"."movie" DROP COLUMN "description",
DROP COLUMN "originalTitle",
DROP COLUMN "title",
ADD COLUMN     "imdbId" TEXT,
DROP COLUMN "originalLanguage",
ADD COLUMN     "originalLanguage" "public"."Language";

-- CreateTable
CREATE TABLE "public"."movie_translation" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "language" "public"."Language" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "originalTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movie_translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."actor_translation" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "language" "public"."Language" NOT NULL,
    "name" TEXT NOT NULL,
    "biography" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actor_translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movie_translation_language_idx" ON "public"."movie_translation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "movie_translation_movieId_language_key" ON "public"."movie_translation"("movieId", "language");

-- CreateIndex
CREATE INDEX "actor_translation_language_idx" ON "public"."actor_translation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "actor_translation_actorId_language_key" ON "public"."actor_translation"("actorId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "actor_imdbId_key" ON "public"."actor"("imdbId");

-- CreateIndex
CREATE UNIQUE INDEX "movie_imdbId_key" ON "public"."movie"("imdbId");

-- AddForeignKey
ALTER TABLE "public"."movie_translation" ADD CONSTRAINT "movie_translation_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."actor_translation" ADD CONSTRAINT "actor_translation_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
