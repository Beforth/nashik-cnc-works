-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'site-settings',
    "companyName" TEXT NOT NULL DEFAULT 'Karan Engineers & Fabrication',
    "gstin" TEXT NOT NULL DEFAULT '27AVRPK3981G1Z1',
    "contactName" TEXT NOT NULL DEFAULT 'Mr. Dinesh Khairnar',
    "phone" TEXT NOT NULL DEFAULT '9423928362',
    "phoneFormatted" TEXT NOT NULL DEFAULT '+91 94239 28362',
    "email" TEXT NOT NULL DEFAULT 'mr.dinesheng@gmail.com',
    "address" TEXT NOT NULL DEFAULT 'MIDC Ambad, Nashik, Maharashtra 422010.',
    "indiaMartUrl" TEXT NOT NULL DEFAULT 'https://www.indiamart.com/dinesh-eng/',
    "googleMapsUrl" TEXT NOT NULL DEFAULT 'https://www.google.com/maps/...',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeroImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfrastructureItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specs" TEXT NOT NULL,
    "imageUrl" TEXT,
    "iconKey" TEXT NOT NULL DEFAULT 'Wrench',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InfrastructureItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconKey" TEXT NOT NULL DEFAULT 'Factory',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndustryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "linkUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);
