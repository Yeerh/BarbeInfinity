-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDENTE', 'CONFIRMADO', 'FINALIZADO');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDENTE';
