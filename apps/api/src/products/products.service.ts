import { Injectable, NotFoundException } from '@nestjs/common';
import { default as slugify } from 'slugify';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly CDN_BASE_URL = process.env.CDN_BASE_URL;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Transform product images to include CDN prefix and format sizeStocks
   */
  private transformProductImages(product: any): any {
    const transformed = { ...product };

    // Transform images with CDN prefix
    if (transformed.images && Array.isArray(transformed.images)) {
      transformed.images = transformed.images.map((image: string) => {
        // Skip if already has http/https prefix
        if (
          typeof image === 'string' &&
          (image.startsWith('http://') || image.startsWith('https://'))
        ) {
          return image;
        }
        // Add CDN prefix
        if (typeof image === 'string') {
          return `${this.CDN_BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
        }
        return image;
      });
    }

    // Transform Decimal prices to numbers
    if (transformed.priceCurrent) {
      transformed.priceCurrent = Number(transformed.priceCurrent);
    }
    if (transformed.priceOriginal) {
      transformed.priceOriginal = Number(transformed.priceOriginal);
    }
    if (transformed.priceDiscount) {
      transformed.priceDiscount = Number(transformed.priceDiscount);
    }

    // Transform Decimal ratings to numbers
    if (transformed.ratingValue) {
      transformed.ratingValue = Number(transformed.ratingValue);
    }

    // Transform sizeStocks to simple format {size, stock}
    if (transformed.sizeStocks && Array.isArray(transformed.sizeStocks)) {
      transformed.sizeStocks = transformed.sizeStocks.map((sizeStock: any) => ({
        size: sizeStock.size,
        stock: sizeStock.stock,
      }));
    }

    return transformed;
  }
  /**
   * Get date filter for WHERE clause (used for filtering by date range)
   */
  getDateFilter(sortValue?: string): any {
    if (!sortValue) return undefined;

    const now = new Date();

    // Hôm nay (tính từ 00:00:00)
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Tuần này (tính từ đầu tuần, ví dụ Thứ 2)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(
      now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
    );
    startOfWeek.setHours(0, 0, 0, 0);

    // Tháng này (tính từ ngày 1 đầu tháng)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Năm này (tính từ ngày 1 đầu năm)
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (sortValue) {
      case 'today':
        return { createdAt: { gte: startOfToday } };
      case 'week':
        return { createdAt: { gte: startOfWeek } };
      case 'month':
        return { createdAt: { gte: startOfMonth } };
      case 'year':
        return { createdAt: { gte: startOfYear } };
      default:
        return undefined;
    }
  }

  /**
   * Get orderBy clause for sorting
   */
  sortByFeild: object | any = (
    sortBy: string,
    sortValue: string,
    orderBy: string
  ) => {
    if (!sortBy) return;

    switch (sortBy) {
      case 'latest':
        return {
          createdAt: orderBy === 'asc' ? 'asc' : 'desc',
        };
      case 'appreciated':
        return {
          ratingValue: orderBy === 'asc' ? 'asc' : 'desc',
        };
      case 'trending':
        return {
          ratingCount: orderBy === 'asc' ? 'asc' : 'desc',
        };
      case 'name':
        return {
          name: orderBy === 'asc' ? 'asc' : 'desc',
        };
      case 'priceCurrent':
        return {
          priceCurrent: orderBy === 'asc' ? 'asc' : 'desc',
        };
      case 'date':
        // For date sorting, use createdAt field with the provided orderBy direction
        return {
          createdAt: orderBy === 'asc' ? 'asc' : 'desc',
        };
      default:
        return undefined;
    }
  };

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

    const products = await this.prisma.product.findMany({
      where,
      include: { sizeStocks: true },
    });
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
    sortBy?: string,
    sortValue?: string,
    orderBy?: string,
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

    // Add date filter if sortBy is 'date'
    if (sortBy === 'date') {
      const dateFilter = this.getDateFilter(sortValue);
      if (dateFilter) {
        where.createdAt = dateFilter.createdAt;
      }
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy: this.sortByFeild(sortBy, sortValue, orderBy),
      include: { sizeStocks: true },
    });

    // Transform images with CDN prefix
    const transformedProducts = products.map((product) =>
      this.transformProductImages(product)
    );

    return transformedProducts;
  }

  async findAllForAdmin(gender?: string, isSale?: string) {
    return this.findAll(gender, isSale, undefined, undefined, undefined, true);
  }

  async searchProductsWithRelevance(
    query: string,
    gender?: string,
    isSale?: string,
    sortBy?: string,
    sortValue?: string,
    orderBy?: string
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

    // If no search query, return filtered products (using findAll logic)
    if (!cleanQuery) {
      return this.findAll(gender, isSale, sortBy, sortValue, orderBy);
    }
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

    // Add date filter if sortBy is 'date'
    if (sortBy === 'date') {
      const dateFilter = this.getDateFilter(sortValue);
      if (dateFilter) {
        whereClause.createdAt = dateFilter.createdAt;
      }
    }

    const fullProducts = await this.prisma.product.findMany({
      where: whereClause,
      orderBy: this.sortByFeild(sortBy, sortValue, orderBy),
      include: { sizeStocks: true },
    });

    // Transform images with CDN prefix
    const transformedProducts = fullProducts.map((product) =>
      this.transformProductImages(product)
    );

    return transformedProducts;
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

    const product = await this.prisma.product.findFirst({
      where,
      include: { sizeStocks: true },
    });
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
      include: { sizeStocks: true },
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
      include: { sizeStocks: true },
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
