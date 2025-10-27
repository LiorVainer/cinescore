-- CreateEnum
CREATE TYPE "public"."MovieStatus" AS ENUM ('NOW_PLAYING', 'UPCOMING');

-- AlterTable
ALTER TABLE "public"."movie" ADD COLUMN     "status" "public"."MovieStatus" NOT NULL DEFAULT 'NOW_PLAYING';
