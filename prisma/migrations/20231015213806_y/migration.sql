/*
  Warnings:

  - A unique constraint covering the columns `[mintId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mintId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_mintId_key" ON "User"("mintId");
