-- CreateEnum
CREATE TYPE "ProductGender" AS ENUM ('MALE', 'FEMALE', 'UNISEX');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "gender" "ProductGender" NOT NULL DEFAULT 'UNISEX';

-- CreateIndex
CREATE INDEX "products_gender_idx" ON "products"("gender");

-- CreateIndex
CREATE INDEX "products_isPublished_idx" ON "products"("isPublished");
