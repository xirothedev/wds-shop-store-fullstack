import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { default as slugify } from 'slugify';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

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
            sizeStocks
        } = createProductDto as any;

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
            isPublished
        };

        if (sizeStocks && Array.isArray(sizeStocks) && sizeStocks.length > 0) {
            data.sizeStocks = {
                create: sizeStocks.map((s: any) => ({
                    size: s.size,
                    stock: s.stock
                }))
            };
        }

        const product = await this.prisma.product.create({
            data,
            include: { sizeStocks: true }
        });

        return {
            success: true,
            message: 'Product created successfully',
            data: product
        };
    }

    async findAll(): Promise<any[]> {
        return this.prisma.product.findMany();
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundException('Product not found');
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
            sizeStocks
        } = updateProductDto as any;

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
            isPublished
        };

        if (name && name !== product.name) {
            data.name = name;
            data.slug = await this.generateUniqueSlug(name);
        }

        if (sizeStocks && Array.isArray(sizeStocks)) {
            data.sizeStocks = {
                deleteMany: {},
                create: sizeStocks.map((s: any) => ({
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

        return {
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
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
