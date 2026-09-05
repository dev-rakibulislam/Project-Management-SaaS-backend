-- AlterTable
ALTER TABLE "memberships" ADD COLUMN     "deleteAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
