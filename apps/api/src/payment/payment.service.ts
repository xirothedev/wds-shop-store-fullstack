import {
  OrderStatus,
  PaymentStatus,
  PaymentTransactionStatus,
} from '@generated/prisma';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../types/express';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

  async initiatePayment(
    orderId: string,
    user: AuthenticatedUser,
    dto: InitiatePaymentDto
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        paymentTransaction: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only order owner or admin can initiate payment
    if (order.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have access to this order');
    }

    // If the order is already paid, do not create another transaction
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new ConflictException('Order has already been paid');
    }

    const transactionCode = this.generateTransactionCode();
    const paymentUrl = this.buildPaymentUrl(transactionCode, dto.returnUrl);

    // There is a unique constraint on orderId in PaymentTransaction,
    // so we either update the existing one or create a new record.
    const paymentTransaction = order.paymentTransaction
      ? await this.prisma.paymentTransaction.update({
          where: { orderId: order.id },
          data: {
            transactionCode,
            amount: order.totalAmount,
            status: PaymentTransactionStatus.PENDING,
            paymentUrl,
            payosData: undefined,
          },
        })
      : await this.prisma.paymentTransaction.create({
          data: {
            orderId: order.id,
            transactionCode,
            amount: order.totalAmount,
            status: PaymentTransactionStatus.PENDING,
            paymentUrl,
          },
        });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: PaymentStatus.PENDING },
    });

    return {
      orderId: order.id,
      paymentStatus: PaymentStatus.PENDING,
      transaction: {
        id: paymentTransaction.id,
        transactionCode: paymentTransaction.transactionCode,
        status: paymentTransaction.status,
        amount: Number(paymentTransaction.amount),
        paymentUrl: paymentTransaction.paymentUrl,
      },
    };
  }

  async getPaymentForOrder(orderId: string, user: AuthenticatedUser) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        paymentTransaction: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have access to this order');
    }

    if (!order.paymentTransaction) {
      throw new NotFoundException(
        'No payment transaction found for this order'
      );
    }

    return {
      orderId: order.id,
      paymentStatus: order.paymentStatus,
      transaction: {
        id: order.paymentTransaction.id,
        transactionCode: order.paymentTransaction.transactionCode,
        status: order.paymentTransaction.status,
        amount: Number(order.paymentTransaction.amount),
        paymentUrl: order.paymentTransaction.paymentUrl,
      },
    };
  }

  async handleWebhook(updateDto: UpdatePaymentStatusDto) {
    const { transactionCode, status, payload } = updateDto;

    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { transactionCode },
      include: { order: true },
    });

    if (!transaction) {
      throw new NotFoundException('Payment transaction not found');
    }

    const nextOrderPaymentStatus =
      this.mapTransactionStatusToOrderPayment(status);

    await this.prisma.$transaction([
      this.prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status,
          payosData: payload ? JSON.parse(JSON.stringify(payload)) : null,
        },
      }),
      this.prisma.order.update({
        where: { id: transaction.orderId },
        data: {
          paymentStatus: nextOrderPaymentStatus,
          ...(status === PaymentTransactionStatus.PAID
            ? { status: OrderStatus.PROCESSING }
            : {}),
        },
      }),
    ]);

    return {
      orderId: transaction.orderId,
      transactionCode,
      status,
      paymentStatus: nextOrderPaymentStatus,
    };
  }

  private generateTransactionCode(): string {
    const shortId = randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase();
    return `PAY-${shortId}`;
  }

  private buildPaymentUrl(transactionCode: string, returnUrl?: string): string {
    const baseUrl =
      returnUrl ||
      this.config.get<string>('FRONTEND_URL') ||
      'http://localhost:3000';

    return `${baseUrl.replace(/\/$/, '')}/mock-payment?transactionCode=${transactionCode}`;
  }

  private mapTransactionStatusToOrderPayment(
    status: PaymentTransactionStatus
  ): PaymentStatus {
    switch (status) {
      case PaymentTransactionStatus.PAID:
        return PaymentStatus.PAID;
      case PaymentTransactionStatus.PENDING:
        return PaymentStatus.PENDING;
      case PaymentTransactionStatus.CANCELLED:
      case PaymentTransactionStatus.EXPIRED:
      case PaymentTransactionStatus.FAILED:
      default:
        return PaymentStatus.FAILED;
    }
  }
}
