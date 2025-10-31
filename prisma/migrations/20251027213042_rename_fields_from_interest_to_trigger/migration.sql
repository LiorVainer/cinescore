/*
  Warnings:

  - You are about to drop the column `interestId` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the `trigger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `interest_condition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."interest" DROP CONSTRAINT "interest_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."interest_condition" DROP CONSTRAINT "interest_condition_interestId_fkey";

-- DropForeignKey
ALTER TABLE "public"."notification" DROP CONSTRAINT "notification_interestId_fkey";

-- DropIndex
DROP INDEX "public"."notification_interestId_idx";

-- AlterTable
ALTER TABLE "public"."notification" DROP COLUMN "interestId",
ADD COLUMN     "triggerId" TEXT;

-- DropTable
DROP TABLE "public"."interest";

-- DropTable
DROP TABLE "public"."interest_condition";

-- CreateTable
CREATE TABLE "public"."trigger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trigger_condition" (
    "id" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "type" "public"."TriggerConditionType" NOT NULL,
    "stringValue" TEXT,
    "numericValue" DOUBLE PRECISION,

    CONSTRAINT "trigger_condition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trigger_userId_idx" ON "public"."trigger"("userId");

-- CreateIndex
CREATE INDEX "trigger_condition_triggerId_idx" ON "public"."trigger_condition"("triggerId");

-- CreateIndex
CREATE INDEX "notification_triggerId_idx" ON "public"."notification"("triggerId");

-- AddForeignKey
ALTER TABLE "public"."trigger" ADD CONSTRAINT "trigger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trigger_condition" ADD CONSTRAINT "trigger_condition_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "public"."trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "public"."trigger"("id") ON DELETE SET NULL ON UPDATE CASCADE;
