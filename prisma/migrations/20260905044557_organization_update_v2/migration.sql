/*
  Warnings:

  - A unique constraint covering the columns `[userId,organizationId]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `memberships` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('ORG_ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "memberships" ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "role" "OrganizationRole" NOT NULL DEFAULT 'MEMBER',
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "memberships_userId_idx" ON "memberships"("userId");

-- CreateIndex
CREATE INDEX "memberships_organizationId_idx" ON "memberships"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_userId_organizationId_key" ON "memberships"("userId", "organizationId");

-- CreateIndex
CREATE INDEX "organizations_slug_idx" ON "organizations"("slug");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
