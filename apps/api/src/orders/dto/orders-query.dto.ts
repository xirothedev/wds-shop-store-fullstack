import { PaymentStatus } from '@generated/prisma';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class OrdersQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by payment status',
    enum: PaymentStatus,
  })
  @IsOptional()
  @IsEnum(PaymentStatus, {
    message: 'paymentStatus must be a valid PaymentStatus',
  })
  paymentStatus?: PaymentStatus;
}
