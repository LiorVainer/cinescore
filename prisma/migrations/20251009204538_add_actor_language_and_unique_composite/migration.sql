/*
  Warnings:

  - A unique constraint covering the columns `[imdbId,language]` on the table `actor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `language` to the `actor` table without a default value. This is not possible if the table is not empty.
  - Made the column `imdbId` on table `actor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."actor_imdbId_key";

-- DropIndex
DROP INDEX "public"."actor_tmdbId_key";

-- AlterTable
ALTER TABLE "public"."actor" ADD COLUMN     "language" "public"."Language" NOT NULL,
ALTER COLUMN "imdbId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "actor_imdbId_language_key" ON "public"."actor"("imdbId", "language");
