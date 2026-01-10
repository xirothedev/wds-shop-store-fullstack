import {
  type Order,
  type OrderItem,
  OrderStatus,
  PaymentStatus,
  type PaymentTransaction,
  type Product,
  type ProductSizeStock,
} from '@generated/prisma';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../types/express';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';

type OrderWithRelations = Order & {
  items: OrderItem[];
  paymentTransaction?: PaymentTransaction | null;
};
type ProductWithStock = Product & {
  sizeStocks: ProductSizeStock[];
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(user: AuthenticatedUser, dto: CreateOrderDto) {
    if (!dto.items.length) {
      throw new BadRequestException('Order must contain at least 1 item');
    }

    const productIds = [...new Set(dto.items.map((item) => item.productId))];

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        isPublished: true,
      },
      include: {
        sizeStocks: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products are invalid');
    }

    const productMap = new Map<string, ProductWithStock>(
      products.map((product) => [product.id, product])
    );

    const orderItems = dto.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestException('Product not found');
      }

      const sizeStock = product.sizeStocks.find(
        (stock) => stock.size === item.size
      );

      if (!sizeStock) {
        throw new BadRequestException(
          `Size ${item.size} is not available for ${product.name}`
        );
      }

      if (sizeStock.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${product.name} (${item.size})`
        );
      }

      return {
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        size: item.size,
        price: product.priceCurrent,
        quantity: item.quantity,
      };
    });

    const itemsSubtotal = orderItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );

    const shippingFee = dto.shippingFee ?? 0;
    const discountValue = dto.discountValue ?? 0;
    const totalAmount = Math.max(
      itemsSubtotal + shippingFee - discountValue,
      0
    );

    const code = await this.generateOrderCode();

    const order = await this.prisma.order.create({
      data: {
        code,
        userId: user.id,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        totalAmount,
        shippingFee,
        discountValue,
        shippingAddress: dto.shippingAddress,
        shippingCity: dto.shippingCity,
        shippingState: dto.shippingState,
        shippingZip: dto.shippingZip,
        shippingCountry: dto.shippingCountry,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
        paymentTransaction: true,
      },
    });

    return this.mapOrder(order);
  }

  async listOrders(user: AuthenticatedUser, query: OrdersQueryDto) {
    const paymentStatus = query.paymentStatus ?? PaymentStatus.PAID;

    const orders = await this.prisma.order.findMany({
      where: {
        userId: user.id,
        paymentStatus,
      },
      include: {
        items: true,
        paymentTransaction: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => this.mapOrder(order));
  }

  async getOrderById(orderId: string, user: AuthenticatedUser) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        paymentTransaction: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have access to this order');
    }

    return this.mapOrder(order);
  }

  private mapOrder(order: OrderWithRelations) {
    return {
      id: order.id,
      code: order.code,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: Number(order.totalAmount),
      shippingFee: Number(order.shippingFee),
      discountValue: Number(order.discountValue),
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingState: order.shippingState,
      shippingZip: order.shippingZip,
      shippingCountry: order.shippingCountry,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productSlug: item.productSlug,
        productName: item.productName,
        size: item.size,
        price: Number(item.price),
        quantity: item.quantity,
      })),
      paymentTransaction: order.paymentTransaction
        ? {
            id: order.paymentTransaction.id,
            transactionCode: order.paymentTransaction.transactionCode,
            amount: Number(order.paymentTransaction.amount),
            status: order.paymentTransaction.status,
            paymentUrl: order.paymentTransaction.paymentUrl,
            createdAt: order.paymentTransaction.createdAt,
          }
        : null,
    };
  }

  private async generateOrderCode(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const shortId = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
      const code = `#ORD-${shortId}`;

      const existing = await this.prisma.order.findUnique({
        where: { code },
      });

      if (!existing) {
        return code;
      }
    }

    throw new BadRequestException('Failed to generate order code');
  }
}
