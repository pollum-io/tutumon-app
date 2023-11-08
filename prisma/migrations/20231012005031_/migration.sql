/*
  Warnings:

  - Added the required column `publicKey` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicKey` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "publicKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "publicKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "publicKey" TEXT NOT NULL;
