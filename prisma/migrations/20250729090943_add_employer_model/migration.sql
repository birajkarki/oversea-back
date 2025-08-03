/*
  Warnings:

  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Client";

-- CreateTable
CREATE TABLE "Employer" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "industry" TEXT,
    "jobTitle" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "requirements" TEXT,
    "urgency" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id")
);
