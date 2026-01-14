import { PaymentTransactionStatus } from '@generated/prisma';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../types/express';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('orders/:orderId/initiate')
  @ApiOperation({
    summary: 'Create or refresh a payment transaction for an order',
  })
  initiatePayment(
    @Param('orderId') orderId: string,
    @Body() dto: InitiatePaymentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.paymentService.initiatePayment(orderId, user, dto);
  }

  @Get('orders/:orderId')
  @ApiOperation({
    summary: 'Get payment transaction info for an order',
  })
  getPaymentForOrder(
    @Param('orderId') orderId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.paymentService.getPaymentForOrder(orderId, user);
  }

  @Public()
  @Post('webhook')
  @ApiOperation({
    summary:
      'Webhook endpoint to update payment status (mock-friendly, no auth required)',
  })
  handleWebhook(@Body() dto: UpdatePaymentStatusDto) {
    return this.paymentService.handleWebhook(dto);
  }

  @Public()
  @Post('webhook/simulate-paid/:transactionCode')
  @ApiOperation({
    summary: 'Helper endpoint to mark a transaction as PAID in local/dev',
  })
  simulatePaid(
    @Param('transactionCode') transactionCode: string,
    @Body() body: { payload?: Record<string, unknown> }
  ) {
    const payload = body?.payload;
    return this.paymentService.handleWebhook({
      transactionCode,
      status: PaymentTransactionStatus.PAID,
      payload,
    });
  }
}
