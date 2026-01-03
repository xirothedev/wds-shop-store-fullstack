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
                        (image.startsWith('http://') ||
                            image.startsWith('https://'))
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
                })
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
            category
        } = createProductDto;

        const slug = await this.generateUniqueSlug(name);

        const data: any = {
            slug,
            name,
            description,
            priceCurrent:
                priceCurrent != null ? priceCurrent.toString() : undefined,
            priceOriginal:
                priceOriginal != null ? priceOriginal.toString() : undefined,
            priceDiscount:
                priceDiscount != null ? priceDiscount.toString() : undefined,
            badge,
            gender,
            isPublished,
            images,
            category
        };

        if (sizeStocks && Array.isArray(sizeStocks) && sizeStocks.length > 0) {
            data.sizeStocks = {
                create: sizeStocks.map(s => ({
                    size: s.size,
                    stock: s.stock
                }))
            };
        }

        const product = await this.prisma.product.create({
            data,
            include: { sizeStocks: true }
        });

        // Transform images with CDN prefix
        const transformedProduct = this.transformProductImages(product);

        return {
            success: true,
            message: 'Product created successfully',
            data: transformedProduct
        };
    }

    async findAll(gender?: string, isSale?: string): Promise<any[]> {
        const where: any = {};

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
                not: null
            };
        }

        const products = await this.prisma.product.findMany({
            where
        });

        // Transform images with CDN prefix
        return products.map(product => this.transformProductImages(product));
    }

    async searchProductsWithRelevance(
        query: string,
        gender?: string,
        isSale?: string
    ) {
        // Strip quotes from query parameters
        const cleanQuery = query
            ? query.replace(/^['"]|['"]$/g, '').trim()
            : '';
        const cleanGender = gender
            ? gender.replace(/^['"]|['"]$/g, '').trim()
            : undefined;

        const searchTerm = cleanQuery;
        const genderFilter =
            cleanGender &&
            ['MALE', 'FEMALE', 'UNISEX'].includes(cleanGender.toUpperCase())
                ? cleanGender.toUpperCase()
                : null;

        // Filter by sale status
        const isSaleValue = isSale
            ? isSale
                  .replace(/^['"]|['"]$/g, '')
                  .trim()
                  .toLowerCase()
            : 'false';

        if (!searchTerm) {
            const where: any = {};
            if (genderFilter) {
                where.gender = genderFilter;
            }
            if (isSaleValue === 'true') {
                where.priceDiscount = {
                    not: null
                };
            }
            return this.prisma.product.findMany({ where });
        }

        // Using raw SQL for PostgreSQL full-text search with ranking
        // Using 'simple' config for Vietnamese (works without dictionary)
        const products = await this.prisma.$queryRaw<
            Array<{
                id: string;
                slug: string;
                name: string;
                description: string;
                priceCurrent: number;
                images: string[];
                relevance: number;
            }>
        >`
      SELECT 
        id,
        slug,
        name,
        description,
        "priceCurrent"::numeric,
        images,
        ts_rank(
          to_tsvector('simple', name || ' ' || description),
          plainto_tsquery('simple', ${searchTerm})
        )::numeric as relevance
      FROM products
      WHERE 
        "isPublished" = true
        AND (
          to_tsvector('simple', name || ' ' || description) @@ plainto_tsquery('simple', ${searchTerm})
        )
      ORDER BY relevance DESC, "createdAt" DESC
      LIMIT 50
    `;

        // Fetch full product data with relations
        // Apply gender and isSale filter in Prisma query for safety
        const productIds = products.map(p => p.id);
        const whereClause: any = {
            id: {
                in: productIds
            }
        };

        if (genderFilter) {
            whereClause.gender = genderFilter;
        }

        if (isSaleValue === 'true') {
            whereClause.priceDiscount = {
                not: null
            };
        }

        const fullProducts = await this.prisma.product.findMany({
            where: whereClause,
            include: {
                sizeStocks: true
            }
        });

        // Sort by relevance order
        const sortedProducts = productIds.map(id =>
            fullProducts.find(p => p.id === id)
        );

        const filteredProducts = sortedProducts.filter(
            (p): p is NonNullable<typeof p> => p !== null && p !== undefined
        );

        // Transform images with CDN prefix
        return filteredProducts.map(product =>
            this.transformProductImages(product)
        );
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
                mode: 'insensitive'
            }
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
                not: null
            };
        }

        const products = await this.prisma.product.findMany({
            where,
            select: {
                name: true
            },
            take: 10
        });

        return products.map(product => product.name);
    }
    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundException('Product not found (VERIFY_UPDATE)');
        }
        // Transform images with CDN prefix
        return this.transformProductImages(product);
    }
    async findOneBySlug(slug: string) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: { sizeStocks: true }
        });
        if (!product) {
            throw new NotFoundException('Product not found (VERIFY_UPDATE)');
        }
        // Transform images with CDN prefix
        return this.transformProductImages(product);
    }
    async getRelatedProducts(slug: string) {
        const currentProduct = await this.prisma.product.findUnique({
            where: { slug: slug },
            select: {
                id: true,
                gender: true,
                priceCurrent: true,
                category: true
            }
        });

        if (!currentProduct) return [];

        const whereClause: any = {
            gender: currentProduct.gender,
            id: { not: currentProduct.id },
            isPublished: true
        };

        // Only filter by category if it exists
        if (currentProduct.category) {
            whereClause.category = currentProduct.category;
        }

        const related = await this.prisma.product.findMany({
            where: whereClause,
            take: 4,
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform images with CDN prefix
        return related.map(product => this.transformProductImages(product));
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const product = await this.findOne(id);

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
            category
        } = updateProductDto;

        const data: any = {
            description,
            priceCurrent:
                priceCurrent != null ? priceCurrent.toString() : undefined,
            priceOriginal:
                priceOriginal != null ? priceOriginal.toString() : undefined,
            priceDiscount:
                priceDiscount != null ? priceDiscount.toString() : undefined,
            badge,
            gender,
            isPublished,
            images,
            category
        };

        if (name && name !== product.name) {
            data.name = name;
            data.slug = await this.generateUniqueSlug(name);
        }

        if (sizeStocks && Array.isArray(sizeStocks)) {
            data.sizeStocks = {
                deleteMany: {},
                create: sizeStocks.map(s => ({
                    size: s.size,
                    stock: s.stock
                }))
            };
        }

        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data,
            include: { sizeStocks: true }
        });

        // Transform images with CDN prefix
        const transformedProduct = this.transformProductImages(updatedProduct);

        return {
            success: true,
            message: 'Product updated successfully',
            data: transformedProduct
        };
    }

    async remove(id: string) {
        await this.findOne(id); // Check if exists
        await this.prisma.product.delete({ where: { id } });
        return {
            success: true,
            message: 'Product deleted successfully'
        };
    }
}
