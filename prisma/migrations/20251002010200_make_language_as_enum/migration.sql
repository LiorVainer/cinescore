/*
  Warnings:

  - The `language` column on the `genre` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `publishedAt` on the `trailer` table. All the data in the column will be lost.
  - Changed the type of `language` on the `trailer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Language" AS ENUM ('en_US', 'he_IL');

-- AlterTable
ALTER TABLE "public"."genre" DROP COLUMN "language",
ADD COLUMN     "language" "public"."Language" NOT NULL DEFAULT 'he_IL';

-- AlterTable
ALTER TABLE "public"."trailer" DROP COLUMN "publishedAt",
DROP COLUMN "language",
ADD COLUMN     "language" "public"."Language" NOT NULL;
