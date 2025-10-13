/*
  Warnings:

  - You are about to drop the `subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."FollowType" AS ENUM ('ACTOR', 'GENRE');

-- CreateEnum
CREATE TYPE "public"."InterestType" AS ENUM ('ACTOR', 'GENRE', 'RATING');

-- DropForeignKey
ALTER TABLE "public"."subscription" DROP CONSTRAINT "subscription_userId_fkey";

-- AlterTable
ALTER TABLE "public"."notification" ADD COLUMN     "interestId" TEXT;

-- AlterTable
ALTER TABLE "public"."session" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."subscription";

-- CreateTable
CREATE TABLE "public"."user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notifyBy" "public"."NotifyMethod"[] DEFAULT ARRAY['EMAIL']::"public"."NotifyMethod"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."follow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."FollowType" NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."interest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL DEFAULT 7.5,
    "durationMin" INTEGER,
    "durationMax" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."interest_condition" (
    "id" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,
    "type" "public"."InterestType" NOT NULL,
    "value" TEXT,

    CONSTRAINT "interest_condition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "public"."user_preferences"("userId");

-- CreateIndex
CREATE INDEX "follow_type_idx" ON "public"."follow"("type");

-- CreateIndex
CREATE INDEX "follow_userId_idx" ON "public"."follow"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "follow_userId_type_value_key" ON "public"."follow"("userId", "type", "value");

-- CreateIndex
CREATE INDEX "interest_userId_idx" ON "public"."interest"("userId");

-- CreateIndex
CREATE INDEX "interest_threshold_idx" ON "public"."interest"("threshold");

-- CreateIndex
CREATE INDEX "interest_condition_interestId_idx" ON "public"."interest_condition"("interestId");

-- CreateIndex
CREATE INDEX "notification_interestId_idx" ON "public"."notification"("interestId");

-- AddForeignKey
ALTER TABLE "public"."user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follow" ADD CONSTRAINT "follow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interest" ADD CONSTRAINT "interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interest_condition" ADD CONSTRAINT "interest_condition_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "public"."interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
