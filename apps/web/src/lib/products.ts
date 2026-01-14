import type { Product, ProductImage } from '@/types/product';

import {
  createProduct as createProductApi,
  deleteProduct as deleteProductApi,
  getFeaturedProducts as getFeaturedProductsApi,
  getProductById as getProductByIdApi,
  getProductBySlug as getProductBySlugApi,
  getProducts,
  getProductsForAdmin as getProductsForAdminApi,
  getRelatedProducts as getRelatedProductsApi,
  type ProductPayload,
  updateProduct as updateProductApi,
} from './api/products.api';

/**
 * Transform API product to frontend Product format
 * - Convert images from string[] to ProductImage[]
 * - Ensure all required fields are present
 */
function transformProductFromApi(apiProduct: any): Product {
  const images: ProductImage[] =
    apiProduct.images && Array.isArray(apiProduct.images)
      ? apiProduct.images.map((url: string, index: number) => ({
          id: `img-${index}`,
          src: url,
          alt: apiProduct.name || 'Product image',
        }))
      : [];

  // Transform sizeStocks from Prisma format to frontend format
  const sizeStocks =
    apiProduct.sizeStocks && Array.isArray(apiProduct.sizeStocks)
      ? apiProduct.sizeStocks.map((stock: any) => ({
          id: stock.id || `size-${stock.size}`,
          size: stock.size,
          stock: stock.stock || 0,
        }))
      : undefined;

  return {
    ...apiProduct,
    images,
    sizeStocks,
    ratingValue: apiProduct.ratingValue ? Number(apiProduct.ratingValue) : 0,
    ratingCount: apiProduct.ratingCount ? Number(apiProduct.ratingCount) : 0,
    priceCurrent: Number(apiProduct.priceCurrent) || 0,
    priceOriginal: apiProduct.priceOriginal
      ? Number(apiProduct.priceOriginal)
      : undefined,
    priceDiscount: apiProduct.priceDiscount
      ? Number(apiProduct.priceDiscount)
      : undefined,
  };
}

const toProductPayload = (
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): ProductPayload => {
  const images =
    productData.images?.map((image) => image.src).filter(Boolean) ?? [];
  const priceOriginal = productData.priceOriginal ?? undefined;
  const priceDiscount =
    priceOriginal && priceOriginal > productData.priceCurrent
      ? priceOriginal - productData.priceCurrent
      : undefined;

  return {
    name: productData.name,
    description: productData.description,
    priceCurrent: productData.priceCurrent,
    priceOriginal,
    priceDiscount,
    badge: productData.badge || undefined,
    isPublished: productData.isPublished ?? true,
    gender: productData.gender,
    images,
    sizeStocks: productData.sizeStocks?.map((item) => ({
      size: item.size,
      stock: item.stock,
    })),
    category: productData.category,
  };
};

export async function getAllProducts(
  page: number = 1,
  limit: number = 12,
  filters?: {
    gender?: 'MALE' | 'FEMALE' | 'UNISEX';
    sale?: boolean;
    search?: string;
    sortBy?: string;
    sortValue?: string;
    orderBy?: string;
  }
): Promise<{ products: Product[]; hasMore: boolean }> {
  try {
    const apiProducts = await getProducts(
      filters?.gender,
      filters?.sale ? 'true' : 'false',
      filters?.search,
      filters?.sortBy,
      filters?.sortValue,
      filters?.orderBy
    );

    // Ensure we have an array
    if (!Array.isArray(apiProducts)) {
      console.error('getProducts did not return an array:', apiProducts);
      return { products: [], hasMore: false };
    }

    const filteredProducts = apiProducts.filter(
      (product) => product.isPublished !== false
    );
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = filteredProducts.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredProducts.length;

    return { products, hasMore };
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return { products: [], hasMore: false };
  }
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  try {
    const apiProduct = await getProductBySlugApi(slug);
    if (!apiProduct) {
      return undefined;
    }
    return transformProductFromApi(apiProduct);
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return undefined;
  }
}
export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const apiProduct = await getProductByIdApi(id);
    if (!apiProduct) {
      return undefined;
    }
    return transformProductFromApi(apiProduct);
  } catch (error) {
    console.error('Error in getProductById:', error);
    return undefined;
  }
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  try {
    const related = await getRelatedProductsApi(slug);
    if (!related || !Array.isArray(related)) {
      return [];
    }
    return related.map(transformProductFromApi);
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return [];
  }
}
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const featured = await getFeaturedProductsApi();
    if (!featured || !Array.isArray(featured)) {
      return [];
    }
    return featured.map(transformProductFromApi);
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

// CRUD Functions for Admin Panel

export async function createProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> {
  const payload = toProductPayload(productData);
  const apiProduct = await createProductApi(payload);
  return transformProductFromApi(apiProduct);
}

export async function updateProduct(
  id: string,
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> {
  const payload = toProductPayload(productData);
  const apiProduct = await updateProductApi(id, payload);
  return transformProductFromApi(apiProduct);
}

export async function deleteProduct(id: string): Promise<boolean> {
  await deleteProductApi(id);
  return true;
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  try {
    const adminProducts = await getProductsForAdminApi();
    if (Array.isArray(adminProducts) && adminProducts.length > 0) {
      return adminProducts.map(transformProductFromApi);
    }
  } catch (error) {
    console.error('Error loading admin products:', error);
  }

  try {
    const publicProducts = await getProducts();
    if (Array.isArray(publicProducts) && publicProducts.length > 0) {
      return publicProducts.map(transformProductFromApi);
    }
  } catch (error) {
    console.error('Error loading public products:', error);
  }

  return [];
}
