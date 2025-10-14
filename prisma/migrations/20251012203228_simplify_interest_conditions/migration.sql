/*
  Warnings:

  - You are about to drop the column `durationMax` on the `interest` table. All the data in the column will be lost.
  - You are about to drop the column `durationMin` on the `interest` table. All the data in the column will be lost.
  - You are about to drop the column `threshold` on the `interest` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `interest_condition` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."InterestType" ADD VALUE 'DURATION_MIN';
ALTER TYPE "public"."InterestType" ADD VALUE 'DURATION_MAX';

-- DropIndex
DROP INDEX "public"."interest_threshold_idx";

-- AlterTable
ALTER TABLE "public"."interest" DROP COLUMN "durationMax",
DROP COLUMN "durationMin",
DROP COLUMN "threshold";

-- AlterTable
ALTER TABLE "public"."interest_condition" DROP COLUMN "value",
ADD COLUMN     "numericValue" DOUBLE PRECISION,
ADD COLUMN     "stringValue" TEXT;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "public"."interest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
