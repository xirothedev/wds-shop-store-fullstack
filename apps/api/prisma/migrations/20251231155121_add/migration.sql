-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "productSizeStockId" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "images" TEXT[];

-- CreateIndex
CREATE INDEX "cart_items_productSizeStockId_idx" ON "cart_items"("productSizeStockId");

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productSizeStockId_fkey" FOREIGN KEY ("productSizeStockId") REFERENCES "product_size_stocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
