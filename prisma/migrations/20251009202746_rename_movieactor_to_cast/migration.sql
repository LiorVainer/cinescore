-- CreateTable
CREATE TABLE "public"."actor" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "profileUrl" TEXT,
    "tmdbId" INTEGER,
    "imdbId" TEXT,
    "popularity" DOUBLE PRECISION,
    "biography" TEXT,
    "birthday" TIMESTAMP(3),
    "deathday" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cast" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "actorId" INTEGER NOT NULL,
    "character" TEXT,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "actor_tmdbId_key" ON "public"."actor"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "actor_imdbId_key" ON "public"."actor"("imdbId");

-- CreateIndex
CREATE UNIQUE INDEX "cast_movieId_actorId_key" ON "public"."cast"("movieId", "actorId");

-- AddForeignKey
ALTER TABLE "public"."cast" ADD CONSTRAINT "cast_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cast" ADD CONSTRAINT "cast_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
