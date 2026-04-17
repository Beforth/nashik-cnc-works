-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
