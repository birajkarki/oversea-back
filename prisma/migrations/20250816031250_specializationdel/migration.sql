-- DropForeignKey
ALTER TABLE "Specialization" DROP CONSTRAINT "Specialization_serviceId_fkey";

-- AddForeignKey
ALTER TABLE "Specialization" ADD CONSTRAINT "Specialization_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
