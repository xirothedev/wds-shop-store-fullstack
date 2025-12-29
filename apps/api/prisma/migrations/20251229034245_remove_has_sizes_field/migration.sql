/*
  Warnings:

  - You are about to drop the column `hasSizes` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "hasSizes",
DROP COLUMN "stock";
