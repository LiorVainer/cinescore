/*
  Warnings:

  - The values [email,sms] on the enum `NotifyMethod` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `_GenreToMovie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `genre` table. All the data in the column will be lost.
  - You are about to drop the column `posterUrl` on the `movie` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."NotifyMethod_new" AS ENUM ('EMAIL');
ALTER TABLE "public"."subscription" ALTER COLUMN "notifyBy" TYPE "public"."NotifyMethod_new"[] USING ("notifyBy"::text::"public"."NotifyMethod_new"[]);
ALTER TYPE "public"."NotifyMethod" RENAME TO "NotifyMethod_old";
ALTER TYPE "public"."NotifyMethod_new" RENAME TO "NotifyMethod";
DROP TYPE "public"."NotifyMethod_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."_GenreToMovie" DROP CONSTRAINT "_GenreToMovie_A_fkey";

-- DropIndex
DROP INDEX "public"."genre_name_key";

-- AlterTable
ALTER TABLE "public"."_GenreToMovie" DROP CONSTRAINT "_GenreToMovie_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_GenreToMovie_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "public"."genre" DROP CONSTRAINT "genre_pkey",
DROP COLUMN "name",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "genre_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."movie" DROP COLUMN "posterUrl";

-- AlterTable
ALTER TABLE "public"."movie_translation" ADD COLUMN     "posterUrl" TEXT;

-- CreateTable
CREATE TABLE "public"."genre_translation" (
    "id" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "language" "public"."Language" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "genre_translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "genre_translation_language_idx" ON "public"."genre_translation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "genre_translation_genreId_language_key" ON "public"."genre_translation"("genreId", "language");

-- AddForeignKey
ALTER TABLE "public"."genre_translation" ADD CONSTRAINT "genre_translation_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "public"."genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GenreToMovie" ADD CONSTRAINT "_GenreToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
