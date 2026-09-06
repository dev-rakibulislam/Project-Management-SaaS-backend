/*
  Warnings:

  - A unique constraint covering the columns `[name,organizationId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_name_organizationId_key" ON "Team"("name", "organizationId");
