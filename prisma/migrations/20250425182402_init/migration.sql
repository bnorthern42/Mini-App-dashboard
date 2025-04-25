-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "user" TEXT NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);
