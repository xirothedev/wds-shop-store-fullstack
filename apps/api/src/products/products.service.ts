import { Injectable, NotFoundException } from '@nestjs/common';
import { default as slugify } from 'slugify';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

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

    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    };
  }

  async findAll(): Promise<any[]> {
    return this.prisma.product.findMany();
  }

  async searchProductsWithRelevance(query: string) {
    const searchTerm = query.trim();
    if (!searchTerm) {
      return this.prisma.product.findMany();
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
    const productIds = products.map((p) => p.id);
    const fullProducts = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        sizeStocks: true,
      },
    });

    // Sort by relevance order
    const sortedProducts = productIds.map((id) =>
      fullProducts.find((p) => p.id === id)
    );

    return sortedProducts.filter(
      (p): p is NonNullable<typeof p> => p !== null && p !== undefined
    );
  }

  async getSearchSuggestions(q: string): Promise<string[]> {
    if (!q) return [];

    const products = await this.prisma.product.findMany({
      where: {
        isPublished: true,
        name: {
          contains: q,
          mode: 'insensitive',
        },
      },
      select: {
        name: true,
      },
      take: 10,
    });

    return products.map((product) => product.name);
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found (VERIFY_UPDATE)');
    }
    return product;
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

    return {
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    };
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists
    await this.prisma.product.delete({ where: { id } });
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}
