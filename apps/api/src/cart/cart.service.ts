import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { ItemDeleteRequestDto, ItemDto, ItemRequestDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCartIdfromUserId(userId: string) {
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

  async getAll(cartId: string): Promise<any[]> {
    console.log(cartId);
    const data = await this.prisma.$queryRaw<any[]>`
      SELECT 
        products.id,
        products.slug,
        products.name,
        products.description,
        products."priceCurrent"::numeric as "priceCurrent",
        products."priceOriginal"::numeric,
        products."priceDiscount"::numeric,
        products.badge,
        products."ratingValue"::numeric,
        products."ratingCount",
        products.gender,
        products."isPublished",
        products."createdAt",
        products."updatedAt",
        cart_items.id as "cartItemId",
        cart_items.quantity,
        cart_items.size,
        product_size_stocks.stock

      FROM cart_items
      join products ON products.id = cart_items."productId"
      LEFT JOIN product_size_stocks ON product_size_stocks.size=cart_items.size AND product_size_stocks."productId"=cart_items."productId";
    `;
    return data;
  }

  async addItem(item: ItemRequestDto): Promise<ItemDto> {
    console.log(item);
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        productId: item.productId,
        cartId: item.cartId,
      },
    });

    console.log(existingItem);

    if (existingItem) {
      throw new ConflictException(`The Cart already have this item`);
    }

    const newItem = await this.prisma.cartItem.create({
      data: {
        ...item,
      },
    });

    return newItem;
  }

  async editItem(item: ItemRequestDto): Promise<ItemDto> {
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
          cartId: item.cartId,
          productId: item.productId,
          size: item.size,
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
          id: item.id,
        },
      });
    } catch (err) {
      throw new Error(err);
    }

    return 'Item deleted';
  }
}
