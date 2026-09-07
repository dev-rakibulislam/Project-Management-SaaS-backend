-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityAction" ADD VALUE 'ORGANIZATION_CREATED';
ALTER TYPE "ActivityAction" ADD VALUE 'ORGANIZATION_UPDATED';
ALTER TYPE "ActivityAction" ADD VALUE 'ORGANIZATION_DELETED';
ALTER TYPE "ActivityAction" ADD VALUE 'MEMBER_STATUS_CHANGED';
ALTER TYPE "ActivityAction" ADD VALUE 'ATTACHMENT_ADD';
ALTER TYPE "ActivityAction" ADD VALUE 'TEAM_CREATE';
ALTER TYPE "ActivityAction" ADD VALUE 'TEAM_UPDATE';
ALTER TYPE "ActivityAction" ADD VALUE 'TEAM_DELETE';
ALTER TYPE "ActivityAction" ADD VALUE 'TEAM_MEMBER_ADD';
ALTER TYPE "ActivityAction" ADD VALUE 'TEAM_MEMBER_DELETE';
ALTER TYPE "ActivityAction" ADD VALUE 'PAYMENT_INIT';
ALTER TYPE "ActivityAction" ADD VALUE 'PAYMENT_VERIFY';
ALTER TYPE "ActivityAction" ADD VALUE 'PAYMENT_FAIL';
ALTER TYPE "ActivityAction" ADD VALUE 'USER_LOGIN';
ALTER TYPE "ActivityAction" ADD VALUE 'USER_REGISTER';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityEntityType" ADD VALUE 'TEAM';
ALTER TYPE "ActivityEntityType" ADD VALUE 'PAYMENT';
ALTER TYPE "ActivityEntityType" ADD VALUE 'ATTACHMENT';
ALTER TYPE "ActivityEntityType" ADD VALUE 'USER';
