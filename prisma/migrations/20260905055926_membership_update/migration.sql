-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'BLOCK');

-- AlterTable
ALTER TABLE "memberships" ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE';
