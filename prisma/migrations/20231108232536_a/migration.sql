/*
  Warnings:

  - Added the required column `accountId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "accountId" TEXT NOT NULL;
