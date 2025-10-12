/*
  Warnings:

  - The primary key for the `actor` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."cast" DROP CONSTRAINT "cast_actorId_fkey";

-- AlterTable
ALTER TABLE "public"."actor" DROP CONSTRAINT "actor_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "actor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."cast" ALTER COLUMN "actorId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."cast" ADD CONSTRAINT "cast_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
