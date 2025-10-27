/*
  Warnings:

  - Changed the type of `type` on the `interest_condition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."TriggerConditionType" AS ENUM ('ACTOR', 'GENRE', 'RATING', 'DURATION_MIN', 'DURATION_MAX');

-- AlterTable
ALTER TABLE "public"."interest_condition" DROP COLUMN "type",
ADD COLUMN     "type" "public"."TriggerConditionType" NOT NULL;

-- DropEnum
DROP TYPE "public"."InterestType";
