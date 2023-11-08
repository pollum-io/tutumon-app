/*
  Warnings:

  - A unique constraint covering the columns `[publicKey]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "publicKey" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "publicKey" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Nft" (
    "publicKey" TEXT NOT NULL,
    "name" TEXT,
    "index" INTEGER,
    "image" TEXT,
    "animation" TEXT,
    "externalURL" TEXT,
    "metadataCategory" TEXT,
    "description" TEXT,
    "symbol" TEXT,
    "uri" TEXT,
    "url" TEXT,
    "attributes" TEXT,
    "updateAuthority" TEXT,
    "status" TEXT,
    "primarySaleHappened" BOOLEAN,
    "sellerFeeBasisPoints" INTEGER,
    "isMutable" BOOLEAN,
    "lastParsed" TIMESTAMP(3),
    "createdDate" TIMESTAMP(3),
    "updatedDate" TIMESTAMP(3),
    "isSearchSynced" BOOLEAN,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Nft_pkey" PRIMARY KEY ("publicKey")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_publicKey_key" ON "Session"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicKey_key" ON "User"("publicKey");

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
