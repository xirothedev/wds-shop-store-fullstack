import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '@/prisma/prisma.service';

import {
  ItemDeleteRequestDto,
  ItemDto,
  ItemRequestDto,
  QueryResponseDto,
} from './dto/cart.dto';

export interface userData {
  sub: string;
}

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async getUserIdFromToken(token: string) {
    let userData: userData;
    try {
      userData = this.jwt.verify(token, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or outdated access token!');
    }
    const userId: string = userData.sub;
    return userId;
  }

  async getCartIdFromToken(token: string) {
    const userId = await this.getUserIdFromToken(token);
    let data = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!data) {
      data = await this.prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    return data.id;
  }

  async getAll(cartId: string): Promise<QueryResponseDto[]> {
    const data = await this.prisma.cartItem.findMany({
      where: {
        cartId,
      },
      include: {
        product: {
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            priceCurrent: true,
            priceOriginal: true,
            priceDiscount: true,
            badge: true,
            ratingValue: true,
            ratingCount: true,
            gender: true,
            isPublished: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        productSizeStock: {
          select: {
            stock: true,
          },
        },
      },

      orderBy: {
        product: {
          name: 'asc',
        },
      },
    });

    return data.map((item) => ({
      id: item.product.id,
      cartId: item.cartId,
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
      stock: item.productSizeStock?.stock ?? 1,
      slug: item.product.slug,
      name: item.product.name,
      description: item.product.description,
      priceCurrent: item.product.priceCurrent,
      priceOriginal: item.product.priceOriginal,
      priceDiscount: item.product.priceDiscount,
      badge: item.product.badge ?? undefined,
      ratingValue: item.product.ratingValue,
      ratingCount: item.product.ratingCount,
      gender: item.product.gender,
      isPublished: item.product.isPublished,
      createdAt: new Date(item.product.updatedAt).toDateString(),
      updatedAt: new Date(item.product.updatedAt).toDateString(),
      cartItemId: item.id,
    }));
  }

  async addItem(item: ItemRequestDto): Promise<ItemDto> {
    if (!item.cartId) {
      throw new Error('No cart provided');
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        productId: item.productId,
        size: item.size,
        cartId: item.cartId,
      },
    });

    const inStock = await this.prisma.productSizeStock.findFirst({
      where: {
        productId: item.productId,
        size: item.size,
      },
    });

    if (!inStock) {
      throw new ConflictException(`There is no product in stock`);
    }

    if (existingItem) {
      throw new ConflictException(`The Cart already have this item`);
    }

    const newItem = await this.prisma.cartItem.create({
      data: {
        productId: item.productId,
        size: item.size,
        cartId: item.cartId,
        quantity: item.quantity,
        productSizeStockId: inStock.id,
      },
    });

    return newItem;
  }

  async editItem(item: ItemRequestDto): Promise<ItemDto> {
    if (!item.cartId) {
      throw new Error('No cart provided');
    }
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
      },
    });

    if (!existingItem) {
      throw new ConflictException('Cart Item does not exists!');
    }

    const newItem = await this.prisma.cartItem.update({
      where: {
        cartId_productId_size: {
          cartId: existingItem.cartId,
          productId: existingItem.productId,
          size: existingItem.size,
        },
      },

      data: {
        quantity: item.quantity,
      },
    });

    return newItem;
  }

  async deleteItem(item: ItemDeleteRequestDto): Promise<string> {
    try {
      await this.prisma.cartItem.delete({
        where: {
          cartId: item.cartId,
          id: item.id,
        },
      });
    } catch (err) {
      throw new Error(err);
    }

    return 'Item deleted';
  }
}
