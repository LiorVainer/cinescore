-- CreateTable
CREATE TABLE "public"."trailer" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trailer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trailer_movieId_url_key" ON "public"."trailer"("movieId", "url");

-- AddForeignKey
ALTER TABLE "public"."trailer" ADD CONSTRAINT "trailer_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
