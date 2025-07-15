-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "benefit" JSONB DEFAULT '[]',
ADD COLUMN     "feature" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "heading" TEXT,
ADD COLUMN     "image2" TEXT,
ADD COLUMN     "specialization" JSONB DEFAULT '[]',
ADD COLUMN     "subheading" TEXT,
ALTER COLUMN "image" DROP NOT NULL;
