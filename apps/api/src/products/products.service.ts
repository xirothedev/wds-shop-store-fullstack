import { Injectable, NotFoundException } from '@nestjs/common';
import { default as slugify } from 'slugify';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly CDN_BASE_URL =
    process.env.CDN_BASE_URL || 'https://cdn.wss.xirothedev.site';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Transform product images to include CDN prefix
   */
  private transformProductImages(product: any): any {
    if (product.images && Array.isArray(product.images)) {
      return {
        ...product,
        images: product.images.map((image: string) => {
          // Skip if already has http/https prefix
          if (
            typeof image === 'string' &&
            (image.startsWith('http://') || image.startsWith('https://'))
          ) {
            return image;
          }
          // Add CDN prefix
          if (typeof image === 'string') {
            return `${this.CDN_BASE_URL}${
              image.startsWith('/') ? '' : '/'
            }${image}`;
          }
          return image;
        }),
      };
    }
    return product;
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = slugify(name, { lower: true });
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
  async getFeaturedProducts() {
    const where = {
      isPublished: true,
    };

    const products = await this.prisma.product.findMany({ where });
    const featuredProducts = products
      .filter(
        (product) => product.ratingCount >= 100 && product.ratingValue >= 4.0
      )
      .sort((a, b) => b.ratingValue! - a.ratingValue!);

    return featuredProducts.map((product) =>
      this.transformProductImages(product)
    );
  }

  async create(createProductDto: CreateProductDto) {
    const {
      name,
      description,
      priceCurrent,
      priceOriginal,
      priceDiscount,
      badge,
      gender,
      isPublished,
      sizeStocks,
      images,
      category,
    } = createProductDto;

    const slug = await this.generateUniqueSlug(name);

    const data: any = {
      slug,
      name,
      description,
      priceCurrent: priceCurrent != null ? priceCurrent.toString() : undefined,
      priceOriginal:
        priceOriginal != null ? priceOriginal.toString() : undefined,
      priceDiscount:
        priceDiscount != null ? priceDiscount.toString() : undefined,
      badge,
      gender,
      isPublished,
      images,
      category,
    };

    if (sizeStocks && Array.isArray(sizeStocks) && sizeStocks.length > 0) {
      data.sizeStocks = {
        create: sizeStocks.map((s) => ({
          size: s.size,
          stock: s.stock,
        })),
      };
    }

    const product = await this.prisma.product.create({
      data,
      include: { sizeStocks: true },
    });

    // Transform images with CDN prefix
    const transformedProduct = this.transformProductImages(product);

    return {
      success: true,
      message: 'Product created successfully',
      data: transformedProduct,
    };
  }

  async findAll(
    gender?: string,
    isSale?: string,
    includeDraft: boolean = false
  ): Promise<any[]> {
    const where: any = {};
    if (!includeDraft) {
      where.isPublished = true;
    }

    // Strip quotes from query parameter
    const cleanGender = gender
      ? gender.replace(/^['"]|['"]$/g, '').trim()
      : undefined;

    if (
      cleanGender &&
      ['MALE', 'FEMALE', 'UNISEX'].includes(cleanGender.toUpperCase())
    ) {
      where.gender = cleanGender.toUpperCase();
    }

    // Filter by sale status
    // isSale defaults to false, only filter when explicitly true
    const isSaleValue = isSale
      ? isSale
          .replace(/^['"]|['"]$/g, '')
          .trim()
          .toLowerCase()
      : 'false';

    if (isSaleValue === 'true') {
      where.priceDiscount = {
        not: null,
      };
    }

    const products = await this.prisma.product.findMany({
      where,
    });

    // Transform images with CDN prefix
    return products.map((product) => this.transformProductImages(product));
  }

  async findAllForAdmin(gender?: string, isSale?: string): Promise<any[]> {
    return this.findAll(gender, isSale, true);
  }

  async searchProductsWithRelevance(
    query: string,
    gender?: string,
    isSale?: string
  ) {
    // 1. Clean inputs
    const cleanQuery = query ? query.replace(/^['"]|['"]$/g, '').trim() : '';
    const cleanGender = gender
      ? gender.replace(/^['"]|['"]$/g, '').trim()
      : undefined;
    const isSaleValue =
      (isSale
        ? isSale
            .replace(/^['"]|['"]$/g, '')
            .trim()
            .toLowerCase()
        : '') === 'true';

    const genderFilter: 'MALE' | 'FEMALE' | 'UNISEX' | null =
      cleanGender &&
      ['MALE', 'FEMALE', 'UNISEX'].includes(cleanGender.toUpperCase())
        ? (cleanGender.toUpperCase() as 'MALE' | 'FEMALE' | 'UNISEX')
        : null;

    // If no search query, return filtered products
    if (!cleanQuery) {
      const where: any = { isPublished: true };
      if (genderFilter) where.gender = genderFilter;
      if (isSaleValue) where.priceDiscount = { not: null };

      const products = await this.prisma.product.findMany({
        where,
        include: { sizeStocks: true },
      });
      return products.map((p) => this.transformProductImages(p));
    }

    // 2. Build flexible OR search term ("word1 | word2")
    const formattedSearchTerm = cleanQuery
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .join(' | ');

    // 3. Query PostgreSQL full-text search (focus on `name` column)
    const products = await this.prisma.$queryRaw<any[]>`
      SELECT 
        id, 
        ts_rank(
          to_tsvector('simple', name),
          to_tsquery('simple', ${formattedSearchTerm})
        )::numeric as relevance
      FROM products
      WHERE "isPublished" = true
        AND to_tsvector('simple', name) @@ to_tsquery('simple', ${formattedSearchTerm})
      ORDER BY relevance DESC, "createdAt" DESC
      LIMIT 50
    `;

    let productIds = products.map((p) => p.id);

    // 4. Fallback: if exactly one product matched, fetch more from same category
    if (productIds.length === 1) {
      const mainProductId = productIds[0];
      const mainProduct = await this.prisma.product.findUnique({
        where: { id: mainProductId },
        select: { category: true },
      });

      if (mainProduct?.category) {
        const relatedProducts = await this.prisma.product.findMany({
          where: {
            category: mainProduct.category,
            id: { not: mainProductId },
            isPublished: true,
            gender: genderFilter || undefined,
            priceDiscount: isSaleValue ? { not: null } : undefined,
          },
          select: { id: true },
          take: 12,
          orderBy: { createdAt: 'desc' },
        });

        productIds = [...productIds, ...relatedProducts.map((p) => p.id)];
      }
    }

    // 5. Fetch full product data and apply final filters
    const whereClause: any = { id: { in: productIds }, isPublished: true };
    if (genderFilter) whereClause.gender = genderFilter;
    if (isSaleValue) whereClause.priceDiscount = { not: null };

    const fullProducts = await this.prisma.product.findMany({
      where: whereClause,
      include: { sizeStocks: true },
    });

    // Preserve order by productIds (relevance)
    const sortedResults = productIds
      .map((id) => fullProducts.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => !!p);

    return sortedResults.map((product) => this.transformProductImages(product));
  }

  async getSearchSuggestions(
    q: string,
    gender?: string,
    isSale?: string
  ): Promise<string[]> {
    // Strip quotes from query parameters
    const cleanQ = q ? q.replace(/^['"]|['"]$/g, '').trim() : '';
    const cleanGender = gender
      ? gender.replace(/^['"]|['"]$/g, '').trim()
      : undefined;

    if (!cleanQ) return [];

    const where: any = {
      isPublished: true,
      name: {
        contains: cleanQ,
        mode: 'insensitive',
      },
    };

    if (
      cleanGender &&
      ['MALE', 'FEMALE', 'UNISEX'].includes(cleanGender.toUpperCase())
    ) {
      where.gender = cleanGender.toUpperCase();
    }

    // Filter by sale status
    const isSaleValue = isSale
      ? isSale
          .replace(/^['"]|['"]$/g, '')
          .trim()
          .toLowerCase()
      : 'false';

    if (isSaleValue === 'true') {
      where.priceDiscount = {
        not: null,
      };
    }

    const products = await this.prisma.product.findMany({
      where,
      select: {
        name: true,
      },
      take: 10,
    });

    return products.map((product) => product.name);
  }
  async findOne(id: string, includeDraft: boolean = false) {
    const where: any = { id };
    if (!includeDraft) {
      where.isPublished = true;
    }

    const product = await this.prisma.product.findFirst({ where });
    if (!product) {
      throw new NotFoundException('Product not found (VERIFY_UPDATE)');
    }
    // Transform images with CDN prefix
    return this.transformProductImages(product);
  }
  async findOneBySlug(slug: string, includeDraft: boolean = false) {
    const where: any = { slug };
    if (!includeDraft) {
      where.isPublished = true;
    }

    const product = await this.prisma.product.findFirst({
      where,
    });
    if (!product) {
      throw new NotFoundException('Product not found (VERIFY_UPDATE)');
    }
    // Transform images with CDN prefix
    return this.transformProductImages(product);
  }
  async getRelatedProducts(slug: string) {
    const currentProduct = await this.prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        gender: true,
        priceCurrent: true,
        category: true,
      },
    });

    if (!currentProduct) return [];

    const whereClause: any = {
      gender: currentProduct.gender,
      id: { not: currentProduct.id },
      isPublished: true,
    };

    // Only filter by category if it exists
    if (currentProduct.category) {
      whereClause.category = currentProduct.category;
    }

    const related = await this.prisma.product.findMany({
      where: whereClause,
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform images with CDN prefix
    return related.map((product) => this.transformProductImages(product));
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id, true);

    const {
      name,
      description,
      priceCurrent,
      priceOriginal,
      priceDiscount,
      badge,
      gender,
      isPublished,
      sizeStocks,
      images,
      category,
    } = updateProductDto;

    const data: any = {
      description,
      priceCurrent: priceCurrent != null ? priceCurrent.toString() : undefined,
      priceOriginal:
        priceOriginal != null ? priceOriginal.toString() : undefined,
      priceDiscount:
        priceDiscount != null ? priceDiscount.toString() : undefined,
      badge,
      gender,
      isPublished,
      images,
      category,
    };

    if (name && name !== product.name) {
      data.name = name;
      data.slug = await this.generateUniqueSlug(name);
    }

    if (sizeStocks && Array.isArray(sizeStocks)) {
      data.sizeStocks = {
        deleteMany: {},
        create: sizeStocks.map((s) => ({
          size: s.size,
          stock: s.stock,
        })),
      };
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data,
      include: { sizeStocks: true },
    });

    // Transform images with CDN prefix
    const transformedProduct = this.transformProductImages(updatedProduct);

    return {
      success: true,
      message: 'Product updated successfully',
      data: transformedProduct,
    };
  }

  async remove(id: string) {
    await this.findOne(id, true); // Check if exists
    await this.prisma.product.delete({ where: { id } });
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}
