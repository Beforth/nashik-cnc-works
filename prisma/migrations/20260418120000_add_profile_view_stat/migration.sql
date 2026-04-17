-- CreateTable
CREATE TABLE "ProfileViewStat" (
    "id" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileViewStat_pkey" PRIMARY KEY ("id")
);
