-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imgConfig" JSONB,
ALTER COLUMN "image" SET DEFAULT '/nearpal.png';
